import { StatusCodes } from "http-status-codes";
import GlobalCourse from "../services/globalCourse.js";

export const createGlobalCourse = async (req, res, next) => {
    try {
        const globalCourseObject = req.body
        console.log(req.body.groups)

        await GlobalCourse.createGlobalCourse(globalCourseObject)
        res.status(StatusCodes.OK).json({ status: "OK" })
    } catch (error) {
        next(error)
    }
}

export const readGlobalCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id

        const course = await GlobalCourse.readGlobalCourse(courseId)

        res.status(StatusCodes.OK).json({ course: course })
    } catch (error) {
        next(error)
    }
}

export const updateGlobalCourse = async (req, res, next) => {
    try {
        const courseID = { globalCourseID: req.params.id }
        const update = req.body

        const doc = await GlobalCourse.updateGlobalCourse(courseID, update)

        res.status(StatusCodes.OK).json({course: doc})
    } catch (error) {
        next(error)
    }
}

export const deleteGlobalCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id

        const result = await GlobalCourse.deleteGlobalCourse(courseId)

        res.status(StatusCodes.OK).send()
    } catch(error) {
        next(error)
    }
}
