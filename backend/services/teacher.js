import { BadRequestException } from "../exceptions/badRequest.js";
import Teacher from "../models/teacher.js";
import User from "../models/user.js";

Teacher.createTeacher = async (teacherDoc) => {
    const teacher = new Teacher(teacherDoc)

    await teacher.save()
}

Teacher.getId = async (teacherEmail) => {
    const user = await User.getUserDoc(teacherEmail)

    if (!user) {
        throw new BadRequestException("teacher")
    }
    if (user.role !== 'teacher') {
        throw new BadRequestException("teacher")
    }

    const teacher = await Teacher.findOne(
        {
            userId: user._id
        }
    )

    return teacher._id.toHexString()
}

Teacher.deleteTeacher = async (id) => {
    await Teacher.deleteOne({ userId: id })
}

export default Teacher
