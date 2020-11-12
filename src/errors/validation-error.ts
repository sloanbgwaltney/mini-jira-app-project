import {ApiError} from './api-error'

export class ValidationError extends ApiError {
    constructor(message?: string) {
        super(422, message)
    }
}