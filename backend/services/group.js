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

Group.readGroup = async (semester, number) => {
    const groupDoc = await Group.findOne({ semester: semester, groupNumber: number })

    if (groupDoc == null) {
        throw new InvalidIdException("group")
    }

    return groupDoc
}

Group.readCourses = async (semester, number) => {
    const group = await Group.readGroup(semester, number)

    console.log(group)

    const allResources = []

    for (const course of group.courses) {
        const resources = await Resource.readResourcesOfGroupForCourse(semester, number, course);
        allResources.push(...resources)
    }

    return allResources
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

Group.removeCourse = async (semester, groupNumber, courseTeacherInfo) => {
    Group.checkExistance(semester, groupNumber)

    await Group.updateOne(
        {
            semester: semester,
            groupNumber: groupNumber
        },
        {
            $pull: { courses: courseTeacherInfo }
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
