import { StatusCodes } from "http-status-codes";
import Group from "../services/group.js";

export const createGroup = async (req, res, next) => {
    try {
        const groupDoc = req.body
        const user = req.user

        await Group.createGroup(user, groupDoc)
        res.status(StatusCodes.OK).json({ status: "ok" })
    } catch (error) {
        next(error)
    }
}

export const createGroupResource = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const groupNumber = req.params.number
        const user = req.user
        const resourceDoc = req.body.resource

        const resource = await Group.createResource(user, semester, groupNumber, resourceDoc)

        res.status(StatusCodes.OK).json({ resource: resource })
    } catch (error) {
        next(error)
    }
}

export const readGroup = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const number = req.params.number
        const user = req.user

        const groupDoc = await Group.readGroup(user, semester, number)

        res.status(StatusCodes.OK).json({ group: groupDoc })
    } catch (error) {
        next(error)
    }
}

export const updateGroup = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const number = req.params.number
        const user = req.user

        const update = req.body

        const groupDoc = await Group.updateGroup(user, semester, number, update)

        res.status(StatusCodes.OK).json({ group: groupDoc })
    } catch (error) {
        next(error)
    }
}

export const deleteGroup = async (req, res, next) => {
    try {
        const semester = req.params.semester
        const number = req.params.number
        const user = req.user

        await Group.deleteGroup(user, semester, number)

        res.status(StatusCodes.OK).send()
    } catch (error) {
        next(error)
    }
}
