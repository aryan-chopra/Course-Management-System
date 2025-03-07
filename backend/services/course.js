import { InvalidIdException } from "../exceptions/idException.js";
import Course from "../models/course.js";
import Group from "./group.js";

Course.createCourse = async (courseDoc) => {
    const course = new Course(courseDoc)

    await course.save()
}

Course.readCourse = async (semester, name) => {
    const course = await Course.findOne({ semester: semester, courseName: name })

    if (course == null) {
        throw new InvalidIdException("course")
    }

    return course
}

Course.checkExistance = async (semester, courseName) => {
    const exists = await Course.exists(
        {
            semester: semester,
            courseName: courseName
        }
    )

    if (exists === null) {
        console.log("Does not exist")
        throw new InvalidIdException("course")
    }
    console.log(exists)
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
    for (const groupTeacherInfo of removeGroupsFromCourse) {
        await Group.removeCourse(semester, groupTeacherInfo.groupNumber,
            {
                courseName: courseName,
                teacherEmail: groupTeacherInfo.teacherEmail
            }
        )
    }

    //Delete course from group
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

    const result = await course.deleteOne()

    if (result.deletedCount == 0) {
        throw new InvalidIdException("course")
    }

    return result
}

export default Course
