import { InvalidIdException } from "../exceptions/idException.js";
import GlobalCourse from "../models/globalCourse.js";

GlobalCourse.createGlobalCourse = async (globalCourse) => {
    const course = new GlobalCourse(globalCourse)

    await course.save()
}

GlobalCourse.readGlobalCourse = async (courseId) => {
    const course = await GlobalCourse.findOne({ globalCourseID: courseId })

    if (course == null) {
        throw new InvalidIdException("course")
    }

    return course
}

GlobalCourse.updateGlobalCourse = async (courseId, update) => {
    const course = await GlobalCourse.findOneAndUpdate(courseId, update, {
        runValidators: true,
        returnDocument: "after"
    })

    if (course == null) {
        throw new InvalidIdException("course")
    }

    return course
}

GlobalCourse.deleteGlobalCourse = async (courseId) => {
    const result = await GlobalCourse.deleteOne({ globalCourseID: courseId })

    if (result.deletedCount == 0) {
        throw new InvalidIdException("course")
    }

    return result
}

export default GlobalCourse
