import { StatusCodes } from "http-status-codes"

export class UnauthorisedException extends Error {
    constructor() {
        super()
        this.name = "Unauthorised"
        this.status = StatusCodes.UNAUTHORIZED
    }
}
