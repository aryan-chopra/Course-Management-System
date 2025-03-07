import Teacher from "../models/teacher.js";

Teacher.createTeacher = async (teacherDoc) => {
    const teacher = new Teacher(teacherDoc)

    await teacher.save()
}

Teacher.assignCourse = async (teacherEmail, courseInfo) => {
    console.log("Updating teacher info")
    console.log("Email: " + teacherEmail)
    console.log("Info: " + courseInfo)

    await Teacher.updateOne(
        {
            teacherEmail: teacherEmail
        },
        {
            $push: { assignedCourses: courseInfo }
        },
        {
            runValidators: true
        }
    )
}

Teacher.removeCourse = async (teacherEmail, courseInfo) => {
    await Teacher.updateOne(
        {
            teacherEmail: teacherEmail
        },
        {
            $pull: { assignedCourses: courseInfo }
        },
        {
            runValidators: true
        }
    )
}

export default Teacher
