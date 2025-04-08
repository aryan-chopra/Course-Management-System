import { StatusCodes } from "http-status-codes"
import User from "../services/user.js"

export const createUser = async (req, res, next) => {
    try {
        const userDoc = req.body
        const user = req.user

        const token = await User.createUser(user, userDoc)
    
        res.status(StatusCodes.OK).json({token: token, expiresIn: "1d"})
    } catch (error) {
        next(error)
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const loginInfo = req.body

        const token = await User.login(loginInfo)

        res.status(StatusCodes.OK).json({token: token, expiresIn: "1d"})
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const email = req.body.email
        const user = req.user

        await User.deleteUser(user, email)

        res.status(StatusCodes.OK).send()
    } catch (error) {
        next(error)
    }
}
