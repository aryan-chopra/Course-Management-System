export class InvalidEntityException extends Error {
    constructor(entity) {
        super(entity + " does not exist")
        this.name = "Invalid Entity"
        this.status = 500
    }
}
