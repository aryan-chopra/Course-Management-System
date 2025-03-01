import GlobalCourse from "../models/globalCourse.js";

GlobalCourse.createGlobalCourse = async (globalCourse) => {
    const course = new GlobalCourse(globalCourse)

    await course.save()
}

GlobalCourse.readGlobalCourse = async (courseId) => {
    const course = await GlobalCourse.findOne({globalCourseID: courseId})

    return course
}

GlobalCourse.updateGlobalCourse = async (courseId, update) => {
    const doc = await GlobalCourse.findOneAndUpdate(courseId, update, {
        runValidators: true,
        returnDocument: "after"
    })

    return doc
}

GlobalCourse.deleteGlobalCourse = async (courseId) => {
    const result = await GlobalCourse.deleteOne({globalCourseID: courseId})

    return result
}

export default GlobalCourse
