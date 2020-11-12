import { ApiError } from "./api-error";

export class ForbiddenError extends ApiError {
    constructor(message?: string) {
        super(403, message)
    }
}