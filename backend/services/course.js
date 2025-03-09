import { InvalidIdException } from "../exceptions/idException.js";
import { UnauthorisedException } from "../exceptions/unauthorisedException.js";
import Course from "../models/course.js";
import Group from "./group.js";
import Resource from "./resource.js";
import Teacher from "./teacher.js";

Course.createCourse = async (courseDoc) => {
    course.coordinator = await Teacher.getId(course.coordinator)

    const course = new Course(courseDoc)

    await course.save()
}

Course.createResource = async (semester, courseName, authorEmail, resourceDoc) => {
    const authorId = await Teacher.getId(authorEmail)

    const courseDoc = await Course.findOne(
        {
            semester: semester,
            courseName: courseName
        },
        "coordinator"
    )

    if (!courseDoc) {
        throw new InvalidIdException("course")
    }

    if (!courseDoc.coordinator.equals(authorId)) {
        throw new UnauthorisedException()
    }

    await Resource.createResource(resourceDoc)
}

Course.readCourse = async (semester, courseName) => {
    const course = await Course.findOne({ semester: semester, courseName: courseName })

    if (course == null) {
        throw new InvalidIdException("course")
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

    return courseId._id
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

Course.updateCourse = async (semester, courseName, update) => {
    await Course.checkExistance(semester, courseName)

    await Course.updateOne(
        {
            semester: semester,
            courseName: courseName
        },
        {
            update
        },
        {
            runValidators: true
        }
    )

    return course
}

Course.updateGroupInfo = async (semester, courseName, updates) => {
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

Course.deleteCourse = async (semester, name) => {
    const course = await Course.findOne({ semester: semester, courseName: name })

    if (!course) {
        throw new InvalidIdException("course")
    }

    const result = await course.deleteOne()
    return result
}

export default Course
