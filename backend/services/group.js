import mongoose, { Mongoose } from "mongoose";
import { InvalidIdException } from "../exceptions/idException.js";
import { UnauthorisedException } from "../exceptions/unauthorisedException.js";
import Group from "../models/group.js";
import Resource from "./resource.js";
import Teacher from "./teacher.js";
import Course from "./course.js";
import Institute from "../models/institute.js";

/**
 * POST
 */

Group.createGroup = async (user, groupDoc) => {
    if (user.role !== 'admin') {
        console.log("Not admin")
        throw new UnauthorisedException()
    }

    const teacherId = await Teacher.getId(groupDoc.mentor)
    groupDoc.mentor = teacherId
    groupDoc._institute = await Institute.getId(user.institute)

    const group = new Group(groupDoc)

    await group.save()
}

Group.createResource = async (user, semester, groupNumber, resourceDoc) => {
    if (user.role !== 'admin' && user.role !== 'teacher') {
        throw new UnauthorisedException()
    }

    const institute = await Institute.getId(user.institute)

    if (user.role === 'teacher') {
        const mentor = await Group.getMentorEmail(institute, semester, groupNumber)
        if (mentor !== user.email) {
            const teacherId = await Teacher.getId(user.email)
            const courseId = await Course.getId(institute, semester, resourceDoc.course)
            const isValidTeacherOfGroup = await Group.verifyTeacher(courseId, teacherId, institute, semester, groupNumber)

            if (isValidTeacherOfGroup == false) {
                throw new UnauthorisedException()
            }
        }
    }

    resourceDoc.author = user.email
    resourceDoc.group = groupNumber
    resourceDoc.semester = semester
    resourceDoc._institute = institute

    const resource = await Resource.createResource(resourceDoc)

    return resource
}


/**
 * GET 
 */

Group.verifyTeacher = async (courseId, teacherId, institute, semester, groupNumber) => {
    const teacherCourses = await Group.aggregate(
        [
            {
                '$match': {
                    '_institute': institute,
                    'semester': parseInt(semester),
                    'groupNumber': parseInt(groupNumber)
                }
            },
            {
                '$unwind': '$courses'
            },
            {
                '$match': {
                    'courses.course': mongoose.Types.ObjectId.createFromHexString(courseId),
                    'courses.teacher': mongoose.Types.ObjectId.createFromHexString(teacherId)
                }
            },
            {
                '$project': {
                    course: '$courses.course'
                }
            }
        ]
    )

    if (teacherCourses.length > 0) {
        return true
    } else {
        return false
    }
}

Group.getMentorEmail = async (institute, semester, groupNumber) => {
    const group = await Group.findOne(
        {
            _institute: institute,
            semester: semester,
            groupNumber: groupNumber
        },
        {
            mentor: 1
        }
    )
        .populate({
            path: 'mentor',
            populate: {
                path: 'info'
            }
        })

    return group.mentor.info.email
}

Group.readGroup = async (user, semester, groupNumber) => {
    if (user.role !== 'admin' && user.role !== 'teacher') {
        throw new UnauthorisedException()
    }

    if (user.role === 'teacher') {
        const mentor = await Group.getMentorEmail(semester, groupNumber)
        if (user.email !== mentor) {
            throw new UnauthorisedException()
        }
    }

    const institute = await Institute.getId(user.institute)

    const groupDoc = await Group.findOne(
        {
            _institute: institute,
            semester: semester,
            groupNumber: groupNumber
        },
        {
            _id: 0,
            __v: 0
        }
    )
        .populate('students')
        .populate({
            path: 'mentor',
            populate: {
                path: 'info'
            }
        })
        .populate({
            path: 'courses',
            populate: {
                path: 'course',
                select: 'courseName'
            }
        })
        .populate({
            path: 'courses',
            populate: {
                path: 'teacher',
                populate: {
                    path: 'info'
                }
            }
        })

    if (groupDoc == null) {
        throw new InvalidIdException("group")
    }

    return groupDoc
}

Group.readResources = async (institute, semester, groupNumber) => {
    const coursesInfo = await Group.findOne(
        {
            _institute: institute,
            semester: semester,
            groupNumber: groupNumber
        },
        "courses"
    )

    const allResources = []

    if (!coursesInfo) {
        return []
    }
    for (const courseInfo of coursesInfo.courses) {
        const courseId = courseInfo.course
        const resources = await Resource.readResourcesOfGroupForCourse(institute, semester, groupNumber, courseId);
        allResources.push(...resources)
    }

    return allResources
}

Group.getGroupsWithCourse = async (institute, semester, courseId) => {
    console.log("Course id: " + courseId)

    const groupInfo = await Group.aggregate([
        {
            $match: {
                _institute: institute,
                semester: parseInt(semester)
            }
        },
        {
            $unwind: "$courses"
        },
        {
            $match: {
                "courses.course": mongoose.Types.ObjectId.createFromHexString(courseId)
            }
        },
        {
            $project: {
                groupNumber: "$groupNumber",
                mentor: "$mentor"
            }
        }
    ])

    for (const group of groupInfo) {
        await Group.populate(group, {
            path: 'mentor',
            populate: {
                path: 'info'
            }
        })

        delete group._id
    }

    return groupInfo
}

Group.checkExistance = async (institute, semester, groupNumber) => {
    const exists = await Group.exists(
        {
            _institute: institute,
            semester: semester,
            groupNumber: groupNumber
        }
    )

    if (!exists) {
        throw new InvalidIdException("group")
    }
}

/**
 * PUT 
 */

Group.updateGroup = async (user, semester, groupNumber, update) => {
    if (user.role !== 'admin') {
        throw new UnauthorisedException()
    }

    const institute = await Institute.getId(user.institute)

    await Group.checkExistance(institute, semester, groupNumber)

    const groupDoc = await Group.findOneAndUpdate(
        {
            _institute: institute,
            semester: semester,
            groupNumber: groupNumber
        },
        { update },
        {
            runValidators: true,
            returnDocument: "after"
        })

    return groupDoc
}

Group.addCourse = async (institute, semester, groupNumber, courseTeacherInfo) => {
    await Group.checkExistance(institute, semester, groupNumber)

    await Group.updateOne(
        {
            _institute: institute,
            semester: semester,
            groupNumber: groupNumber
        },
        {
            $push: { courses: courseTeacherInfo }
        },
        {
            runValidators: true
        }
    )
}

Group.removeCourse = async (institute, semester, groupNumber, courseName) => {
    await Group.checkExistance(institute, semester, groupNumber)

    await Group.updateOne(
        {
            _institute: institute,
            semester: semester,
            groupNumber: groupNumber
        },
        {
            $pull: {
                courses: {
                    courseName: courseName
                }
            }
        },
        {
            runValidators: true
        }
    )
}

Group.changeTeacherOfCourse = async (institute, semester, groupNumber, courseTeacherInfo) => {
    await Group.checkExistance(institute, semester, groupNumber)

    await Group.updateOne(
        {
            _institute: institute,
            semester: semester,
            groupNumber: groupNumber,
            "courses.courseName": courseTeacherInfo.courseName
        },
        {
            $set: {
                "courses.$.teacherEmail": courseTeacherInfo.teacherEmail
            }
        },
        {
            runValidators: true
        }
    )
}


/**
 * DELETE 
 */

Group.deleteGroup = async (user, semester, groupNumber) => {
    if (user.role !== 'admin') {
        throw new UnauthorisedException()
    }

    const institute = await Institute.getId(user.institute)

    const group = await Group.findOne({ _institute: institute, semester: semester, groupNumber: groupNumber })

    if (group == null) {
        throw new InvalidIdException("group")
    }

    await group.deleteOne()
}


export default Group
