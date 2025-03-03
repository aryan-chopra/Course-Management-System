import { StatusCodes } from "http-status-codes"
import Resource from "../services/resource.js"

export const createResource = async (req, res, next) => {
    try {
        const resourceDoc = req.body

        await Resource.createResource(resourceDoc)
        res.status(StatusCodes.OK).json({ status: "ok" })
    } catch (error) {
        next(error)
    }
}

export const readResource = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const groupNumber = req.params.groupNumber
        const course = req.params.course

        const resources = await Resource.readResourcesOfGroupForCourse(semester, groupNumber, course)

        res.status(StatusCodes.OK).json({ resources: resources })
    } catch (error) {
        next(error)
    }
}
