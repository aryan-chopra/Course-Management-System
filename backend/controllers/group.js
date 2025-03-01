import { StatusCodes } from "http-status-codes";
import Group from "../services/group.js";

export const createGroup = async (req, res, next) => {
    try {
        const groupDoc = req.body

        await Group.createGroup(groupDoc)
        res.status(StatusCodes.OK).json({ status: "ok" })
    } catch (error) {
        next(error)
    }
}

export const readGroup = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const number = req.params.number

        const groupDoc = await Group.readGroup(semester, number)

        res.status(StatusCodes.OK).json({ group: groupDoc })
    } catch (error) {
        next(error)
    }
}

export const updateGroup = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const number = req.params.number

        const update = req.body

        const groupDoc = await Group.updateGroup(semester, number, update)

        res.status(StatusCodes.OK).json({ group: groupDoc })
    } catch (error) {
        next(error)
    }
}

export const deleteGroup = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const number = req.params.number

        await Group.deleteGroup(semester, number)

        res.status(StatusCodes.OK).send()
    } catch (error) {
        next(error)
    }
}
