export class InvalidIdException extends Error {
    constructor(entity) {
        super("Invalid " + entity + " ID")
        this.name = "Invalid ID"
        this.status = 404
    }
}
