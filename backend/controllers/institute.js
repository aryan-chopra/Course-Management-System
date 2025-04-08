import { StatusCodes } from "http-status-codes"
import Institute from "../services/institute.js"

export const createInstitute = async (req, res, next) => {
    try {
        const name = req.info.name
        const adminInfo = req.info.adminInfo

        const token = await Institute.createInstitute(name, adminInfo)

        res.status(StatusCodes.OK).json({ token: token, expiresIn: "1d" })
    } catch (error) {
        next(error)
    }
}
