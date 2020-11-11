export function responseSender(status: number, contextKey?: string) {
    return function(req, res, next) {
        if (contextKey) {
            res.status(status).json(req.ctx[contextKey])
            next()
        } else {
            res.status(status).send()
            next()
        }
    }
}