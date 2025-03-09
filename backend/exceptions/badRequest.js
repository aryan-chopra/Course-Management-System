export class BadRequestException extends Error {
    constructor(entity) {
        super("Invalid " + entity)
        this.name = "Bad Request"
        this.status = 400
    }
}
