import { StatusCodes } from "http-status-codes";
import Group from "../services/group.js";
import { InvalidIdException } from "../exceptions/idException.js";

export const createGroup = async (req, res, next) => {
    try {
        const groupDoc = {
            groupNumber: req.body.number,
            semester: req.body.semester,
            mentor: req.body.mentor,
            students: req.body.students,
        }

        await Group.createGroup(groupDoc)
        res.status(StatusCodes.OK).json({ status: "ok" })
    } catch (error) {
        next(error)
    }
}
