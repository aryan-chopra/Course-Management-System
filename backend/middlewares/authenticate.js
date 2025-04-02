import jwt from "jsonwebtoken"
import { UnauthorisedException } from "../exceptions/unauthorisedException.js"

export function authenticate(req, res, next) {
    const header = req.headers.authorization
    const token = header && header.split(" ")[1]

    if (!token) {
        console.log("No token found")
        throw new UnauthorisedException()
    }

    const secret = process.env.JWT_SECRET
    jwt.verify(token, secret, (error, user) => {
        if (error) {
            console.log("Token not verified")
            console.log(error)
            throw new UnauthorisedException()
        }
        console.log("Valid User:")
        console.log(user)
        req.user = user
        next()
    })
}
