import Teacher from "../services/teacher.js"
import { StatusCodes } from "http-status-codes"

export const createTeacher = async (req, res, next) => {
    try {
        const teacherDoc = req.body

        await Teacher.createTeacher(teacherDoc)
    
        res.status(StatusCodes.OK).send()
    } catch (error) {
        next(error)
    }
}
