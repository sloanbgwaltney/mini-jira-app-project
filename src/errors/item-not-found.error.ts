import { ApiError } from "./api-error";

export class ItemNotFoundError extends ApiError {
    constructor(message: string) {
        super(404, message)
    }
}