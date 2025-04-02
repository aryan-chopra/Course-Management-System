import Teacher from "../services/teacher.js"
import { StatusCodes } from "http-status-codes"

export const readTeacher = async (req, res, next) => {

    try {
        const email = req.body.email
        const user = req.user

        const teacher = await Teacher.readTeacher(user, email)

        res.status(StatusCodes.OK).json({ teacher: teacher })
    } catch (error) {
        next(error)
    }
}
