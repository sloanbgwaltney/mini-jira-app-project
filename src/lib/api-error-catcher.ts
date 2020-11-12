import { ApiError } from "../errors/api-error"

export function apiErrorCatcher() {
    return function(err, req, res, next) {
        if (err instanceof ApiError) {
            if (err.message) {
                res.status(err.status).json({error: err.message})
                return next()
            }
            res.status(err.status).send()
            next()
        } else {
            res.status(500).send()
            next()
        }
    }
}