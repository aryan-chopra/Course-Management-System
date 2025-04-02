import { StatusCodes } from "http-status-codes"

export class InvalidCredentialsException extends Error {
    constructor() {
        super("Invalid E-Mail or password")
        this.name = "Invalid Credentials"
        this.status = StatusCodes.UNAUTHORIZED
    }
}
