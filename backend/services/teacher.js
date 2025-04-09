import { BadRequestException } from "../exceptions/badRequest.js";
import { InvalidIdException } from "../exceptions/idException.js";
import { UnauthorisedException } from "../exceptions/unauthorisedException.js";
import Teacher from "../models/teacher.js";
import User from "../models/user.js";

Teacher.createTeacher = async (teacherDoc) => {
    const teacher = new Teacher(teacherDoc)

    await teacher.save()
}

Teacher.readTeacher = async (user, email) => {
    if (user.role !== 'admin' && user.role !== 'teacher') {
        throw new UnauthorisedException()
    }

    const userDoc = await User.getUserDoc(email)

    if (!userDoc) {
        throw InvalidIdException("teacher")
    }

    const teacherDoc = await Teacher.findOne(
        {
            userId: userDoc._id
        },
        {
            __v: 0,
            _id: 0
        }
    )
        .populate('info')

    const teacherJSON = teacherDoc.toJSON()

    delete teacherJSON.userId
    delete teacherJSON.id

    return teacherJSON
}

Teacher.getId = async (institute, teacherEmail) => {
    const user = await User.getUserDoc(teacherEmail)

    if (!user) {
        throw new BadRequestException("teacher")
    }
    if (user.role !== 'teacher') {
        throw new BadRequestException("teacher")
    }

    const teacher = await Teacher.findOne(
        {
            _institute: institute,
            userId: user._id
        }
    )

    if (!teacher) {
        throw new BadRequestException("teacher")
    }

    return teacher._id.toHexString()
}

Teacher.deleteTeacher = async (id) => {
    await Teacher.deleteOne({ userId: id })
}

export default Teacher
