import { InvalidIdException } from "../exceptions/idException.js";
import GlobalCourse from "../models/globalCourse.js";

GlobalCourse.createGlobalCourse = async (globalCourse) => {
    const course = new GlobalCourse(globalCourse)

    await course.save()
}

GlobalCourse.readGlobalCourse = async (courseId) => {
    const course = await GlobalCourse.findOne({ globalCourseId: courseId })

    if (course == null) {
        throw new InvalidIdException("course")
    }

    return course
}

GlobalCourse.updateGlobalCourse = async (courseId, update) => {
    const course = await GlobalCourse.findOne({ globalCourseId: courseId })

    if (course == null) {
        throw new InvalidIdException("course")
    }

    Object.assign(course, update)

    await course.save()

    return course
}

GlobalCourse.deleteGlobalCourse = async (courseId) => {
    const course = await GlobalCourse.findOne({ globalCourseId: courseId })

    const result = await course.deleteOne()

    if (result.deletedCount == 0) {
        throw new InvalidIdException("course")
    }

    return result
}

export default GlobalCourse
