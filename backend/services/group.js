import { InvalidIdException } from "../exceptions/idException.js";
import Group from "../models/group.js";
import Resource from "./resource.js";
import Teacher from "./teacher.js";

/**
 * POST
 */

Group.createGroup = async (groupDoc) => {
    const teacherId = await Teacher.getId(groupDoc.mentor)
    groupDoc.mentor = teacherId

    const group = new Group(groupDoc)

    await group.save()
}


/**
 * GET 
 */

Group.readGroup = async (semester, groupNumber) => {
    const groupDoc = await Group.findOne({ semester: semester, groupNumber: groupNumber })

    if (groupDoc == null) {
        throw new InvalidIdException("group")
    }

    return groupDoc
}

Group.readResources = async (semester, groupNumber) => {
    const coursesInfo = await Group.findOne(
        {
            semester: semester,
            groupNumber: groupNumber
        },
        "courses"
    )

    const allResources = []

    for (const courseInfo of coursesInfo.courses) {
        const courseId = courseInfo.course
        const resources = await Resource.readResourcesOfGroupForCourse(semester, groupNumber, courseId);
        allResources.push(...resources)
    }

    return allResources
}

Group.getGroupsWithCourse = async (semester, courseId) => {
    const groupNumbers = await Group.aggregate([
        {
            $match: {
                semester: semester
            }
        },
        {
            $unwind: "$courses"
        },
        {
            $match: {
                "courses.course": courseId
            }
        },
        {
            $project: {
                groupNumber: "$groupNumber"
            }
        }
    ])

    return groupNumbers
}

Group.checkExistance = async (semester, groupNumber) => {
    const exists = await Group.exists(
        {
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

Group.updateGroup = async (semester, groupNumber, update) => {
    await Group.checkExistance(semester, groupNumber)

    const groupDoc = await Group.findOneAndUpdate(
        {
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

Group.addCourse = async (semester, groupNumber, courseTeacherInfo) => {
    await Group.checkExistance(semester, groupNumber)

    await Group.updateOne(
        {
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

Group.removeCourse = async (semester, groupNumber, courseName) => {
    await Group.checkExistance(semester, groupNumber)

    await Group.updateOne(
        {
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

Group.changeTeacherOfCourse = async (semester, groupNumber, courseTeacherInfo) => {
    await Group.checkExistance(semester, groupNumber)

    await Group.updateOne(
        {
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

Group.deleteGroup = async (semester, groupNumber) => {
    const group = await Group.findOne({ semester: semester, groupNumber: groupNumber })

    if (group == null) {
        throw new InvalidIdException("group")
    }

    await group.deleteOne()
}


export default Group
