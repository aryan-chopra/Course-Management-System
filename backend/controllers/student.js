import Student from "../services/student.js"
import { StatusCodes } from "http-status-codes"

export const readStudent = async (req, res, next) => {
    try {
        const rollnumber = req.params.rollnumber

        const studentDoc = await Student.readStudent(rollnumber)
        res.status(StatusCodes.OK).json({ student: studentDoc })
    } catch (error) {
        next(error)
    }
}

export const readStudentResources = async (req, res, next) => {
    try {
        const user = req.user

        const resources = await Student.readResources(user)
        res.status(StatusCodes.OK).json({ resources: resources })
    } catch(error) {
        next(error)
    }
}
