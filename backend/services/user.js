import User from "../models/user.js";
import * as bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import Student from "../services/student.js";
import Teacher from "../services/teacher.js";
import { InvalidCredentialsException } from "../exceptions/invalidCredentialsException.js";
import { UnauthorisedException } from "../exceptions/unauthorisedException.js";
import { InvalidIdException } from "../exceptions/idException.js";
import { BadRequestException } from "../exceptions/badRequest.js";

User.createUser = async function (userInfo) {
    const hashedPassword = await bcrypt.hash(userInfo.password, 10)

    const userDoc = {
        email: userInfo.email,
        password: hashedPassword,
        role: userInfo.role
    }

    const user = new User(userDoc)
    await user.save()

    try {
        if (userInfo.role === 'student') {
            const studentDoc = {
                userId: user._id,
                rollnumber: userInfo.rollnumber,
                name: userInfo.name,
                semester: userInfo.semester,
                groupNumber: userInfo.groupNumber
            }

            const student = new Student(studentDoc)
            await student.save()
        } else if (userInfo.role === 'teacher') {
            const teacherDoc = {
                userId: user._id,
                name: userInfo.name
            }

            const teacher = new Teacher(teacherDoc)
            await teacher.save()
        }
    } catch (error) {
        await user.deleteOne()
        throw error
    }

    const token = await User.login(userInfo)
    return token
}

User.login = async function (userInfo) {
    const user = await User.findOne({ email: userInfo.email })
    if (!user) {
        throw new InvalidCredentialsException()
    }

    const validatePassword = await bcrypt.compare(userInfo.password, user.password)
    if (!validatePassword) {
        throw new InvalidCredentialsException()
    }

    const secret = process.env.JWT_SECRET
    const token = jwt.sign(
        { email: user.email, role: user.role },
        secret,
        {
            expiresIn: "1d"
        }
    )

    return token
}

User.getId = async function (email) {
    const userDoc = await User.findOne(
        {
            email: email
        },
        "_id"
    )

    if (!userDoc) {
        throw new BadRequestException("user")
    }

    return userDoc._id.toHexString()
}

User.getUserDoc = async function (email) {
    const doc = await User.findOne({ email: email })

    return doc
}

User.deleteUser = async function (user, email) {
    if (user.role !== 'admin') {
        console.log(user)
        throw new UnauthorisedException()
    }

    const userToDelete = await User.findOne({ email: email })

    if (!userToDelete) {
        throw new InvalidIdException("user")
    }

    await userToDelete.deleteOne()
}

export default User
