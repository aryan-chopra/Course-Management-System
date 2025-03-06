import Student from "../services/student.js"
import { StatusCodes } from "http-status-codes"

export const createStudent = async (req, res, next) => {
    try {
        const studentDoc = req.body

        await Student.createStudent(studentDoc)
        res.status(StatusCodes.OK).send()
    } catch (error) {
        next(error)
    }
}

export const readStudent = async (req, res, next) => {
    try {
        const rollnumber = req.params.rollnumber

        const studentDoc = await Student.readStudent(rollnumber)
        res.status(StatusCodes.OK).json({ student: studentDoc })
    } catch (error) {
        next(error)
    }
}

export const readStudentCourses = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const group = req.params.group

        const resources = await Student.readCourses(semester, group)
        res.status(StatusCodes.OK).json({ resources: resources })
    } catch(error) {
        next(error)
    }
}
