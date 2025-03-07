import Teacher from "../models/teacher.js";

Teacher.createTeacher = async (teacherDoc) => {
    const teacher = new Teacher(teacherDoc)

    await teacher.save()
}

Teacher.assignCourse = async (teacherEmail, courseInfo) => {
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

Teacher.addMentorForGroup = async (teacherEmail, groupInfo) => {
    await Teacher.updateOne(
        {
            teacherEmail: teacherEmail
        },
        {
            $push: { mentorOf: groupInfo }
        },
        {
            runValidators: true
        }
    )
}

Teacher.removeMentorForGroup = async (teacherEmail, groupInfo) => {
    await Teacher.updateOne(
        {
            teacherEmail: teacherEmail
        },
        {
            $pull: { mentorOf: groupInfo }
        },
        {
            runValidators: true
        }
    )
}

Teacher.addCoordinatorForCourse = async (teacherEmail, courseInfo) => {
    await Teacher.updateOne(
        {
            teacherEmail: teacherEmail
        },
        {
            $push: { coordinatorOf: courseInfo }
        },
        {
            runValidators: true
        }
    )
}

Teacher.removeCoordinatorForCourse = async (teacherEmail, courseInfo) => {
    await Teacher.updateOne(
        {
            teacherEmail: teacherEmail
        },
        {
            $pull: { coordinatorOf: courseInfo }
        },
        {
            runValidators: true
        }
    )
}

export default Teacher
