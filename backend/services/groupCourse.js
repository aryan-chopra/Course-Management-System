import GroupCourse from "../models/groupCourse.js"

GroupCourse.createCourse = async (course) => {
    console.log("Attempting to create:")
    console.log(course)

    const groupCourse = new GroupCourse(course)

    await groupCourse.save()
}

GroupCourse.readCourse = async (semester, groupNumber, parentCourseId) => {
    const groupCourse = await GroupCourse.findOne({
        semester: semester,
        groupNumber: groupNumber,
        parentCourseId: parentCourseId
    })

    return groupCourse
}

GroupCourse.deleteCourse = async (semester, groupNumber, parentCourseId) => {
    await GroupCourse.deleteOne({
        semester: semester,
        groupNumber: groupNumber,
        parentCourseId: parentCourseId
    })
}

export default GroupCourse
