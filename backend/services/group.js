import { InvalidIdException } from "../exceptions/idException.js";
import Group from "../models/group.js";
import Resource from "./resource.js";

/**
 * POST
 */

Group.createGroup = async (groupDoc) => {
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

Group.readCourses = async (semester, groupNumber) => {
    const group = await Group.readGroup(semester, groupNumber)

    console.log(group)

    const allResources = []

    for (const courseInfo of group.courses) {
        const couseName = courseInfo.courseName
        const resources = await Resource.readResourcesOfGroupForCourse(semester, groupNumber, courseName);
        allResources.push(...resources)
    }

    return allResources
}

Group.getGroupsWithCourse = async (semester, courseName) => {
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
                "courses.courseName": courseName
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

    if (exists === null) {
        throw new InvalidIdException("group")
    }
}

/**
 * PUT 
 */

Group.updateGroup = async (semester, number, update) => {
    const groupDoc = await Group.findOneAndUpdate(
        {
            semester: semester,
            groupNumber: number
        },
        { update },
        {
            runValidators: true,
            returnDocument: "after"
        })

    if (groupDoc == null) {
        throw new InvalidIdException("group")
    }

    return groupDoc
}

Group.addCourse = async (semester, groupNumber, courseTeacherInfo) => {
    Group.checkExistance(semester, groupNumber)

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
    Group.checkExistance(semester, groupNumber)

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
    Group.checkExistance(semester, groupNumber)

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

Group.deleteGroup = async (semester, number) => {
    const group = await Group.findOne({ semester: semester, groupNumber: number })

    if (group == null) {
        throw new InvalidIdException("group")
    }

    await group.deleteOne()
}


export default Group
