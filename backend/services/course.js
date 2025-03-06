import { InvalidIdException } from "../exceptions/idException.js";
import Course from "../models/course.js";

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

Course.updateCourse = async (semester, name, update) => {
    const course = await Course.findOne({ semester: semester, courseName: name })

    if (course == null) {
        throw new InvalidIdException("course")
    }

    Object.assign(course, update)

    await course.save()

    return course
}

Course.updateGroupInfo = async (semester, name, updates) => {
    //TODO: IMPLEMENT IT
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
