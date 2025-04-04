import { InvalidIdException } from "../exceptions/idException.js";
import { UnauthorisedException } from "../exceptions/unauthorisedException.js";
import Course from "../models/course.js";
import User from "./user.js";
import Group from "./group.js";
import Resource from "./resource.js";
import Teacher from "./teacher.js";


/**
 * POST requests
 */

Course.createCourse = async (user, courseDoc) => {
    if (user.role !== 'admin') {
        throw new UnauthorisedException()
    }

    courseDoc.coordinator = await Teacher.getId(courseDoc.coordinator)

    console.log(courseDoc.coordinator)

    const course = new Course(courseDoc)

    await course.save()
}

Course.createResource = async (user, semester, courseName, resourceDoc) => {
    if (user.role !== 'admin' && user.role !== 'teacher') {
        throw new UnauthorisedException()
    }

    let authorId

    if (user.role === 'admin') {
        authorId = await User.getId(user.email)
    } else if (user.role === 'teacher') {
        const coordinator = await Course.getCoordinatorEmail(semester, courseName)

        if (user.email !== coordinator) {
            throw new UnauthorisedException()
        }

        authorId = await Teacher.getId(user.email)
    }

    resourceDoc.author = authorId
    resourceDoc.semester = semester

    await Resource.createResource(resourceDoc)
}


/**
 * GET requests
 */

Course.getCoordinatorEmail = async (semester, courseName) => {
    const course = await Course.findOne(
        {
            semester: semester,
            courseName: courseName
        },
        "_id"
    )
        .populate({
            path: 'coordinator',
            populate: {
                path: 'info'
            }
        })

    if (!course) {
        throw new InvalidIdException("course")
    }

    return course.coordinator.info.email
}

Course.readCourse = async (user, semester, courseName) => {
    if (user.role !== 'admin' && user.role !== 'teacher') {
        console.log("Expected: admin or user | Got: " + user.role)

        throw new UnauthorisedException()
    }

    const course = await Course.findOne(
        {
            semester: semester,
            courseName: courseName
        },
        '-_id -__v'
    )
        .populate({
            path: 'coordinator',
            populate: {
                path: 'info'
            }
        })

    if (!course) {
        throw new InvalidIdException("course")
    }

    if (user.role === 'teacher') {
        if (course.coordinator.info.email !== user.email) {
            console.log("Teacher not authorized")
            throw new UnauthorisedException()
        }
    }

    return course
}

Course.getId = async (semester, courseName) => {
    const courseId = await Course.findOne(
        {
            semester: semester,
            courseName: courseName
        },
        {
            _id: 1
        }
    )

    return courseId._id.toHexString()
}

Course.getGroups = async (user, semester, courseName) => {
    if (user.role !== 'admin') {
        throw new UnauthorisedException()
    }

    const courseId = await Course.getId(semester, courseName)

    const groups = await Group.getGroupsWithCourse(semester, courseId)

    return groups
}

Course.checkExistance = async (semester, courseName) => {
    const exists = await Course.exists(
        {
            semester: semester,
            courseName: courseName
        }
    )

    if (!exists) {
        throw new InvalidIdException("course")
    }
}


/**
 * PUT requests
 */

Course.updateCourse = async (user, semester, courseName, update) => {
    if (user.role !== 'admin' && user.role !== 'teacher') {
        console.log("Role: " + user.role)
        throw new UnauthorisedException()
    }

    if (user.role === 'teacher') {
        const coordinator = await Course.getCoordinatorEmail(semester, courseName)

        if (coordinator !== user.email) {
            throw new UnauthorisedException()
        }
    }

    const res = await Course.updateOne(
        {
            semester: semester,
            courseName: courseName
        },
        {
            ...update
        }
    )

    console.log(res)

    // return course
}

Course.updateGroupInfo = async (user, semester, courseName, updates) => {
    if (user.role !== 'admin') {
        throw new UnauthorisedException()
    }

    await Course.checkExistance(semester, courseName)

    const addGroupsToCourse = updates.addGroupsToCourse
    const removeGroupsFromCourse = updates.removeGroupsFromCourse
    const changeTeacherOfGroupsInCourse = updates.changeTeacherOfGroupsInCourse

    //Add course to group
    for (const groupTeacherInfo of addGroupsToCourse) {
        await Group.addCourse(semester, groupTeacherInfo.groupNumber,
            {
                courseName: courseName,
                teacherEmail: groupTeacherInfo.teacherEmail
            }
        )
    }

    //Remove course from group
    for (const groupNumber of removeGroupsFromCourse) {
        await Group.removeCourse(semester, groupNumber, courseName
        )
    }

    //Change teacher of course in group
    for (const groupTeacherInfo of changeTeacherOfGroupsInCourse) {
        await Group.changeTeacherOfCourse(semester, groupTeacherInfo.groupNumber,
            {
                courseName: courseName,
                teacherEmail: groupTeacherInfo.teacherEmail
            }
        )
    }
}


/**
 * DELETE requests
 */

Course.deleteCourse = async (user, semester, name) => {
    if (user.role !== 'admin') {
        throw new UnauthorisedException()
    }

    const course = await Course.findOne({ semester: semester, courseName: name })

    if (!course) {
        throw new InvalidIdException("course")
    }

    const result = await course.deleteOne()
    return result
}

export default Course
