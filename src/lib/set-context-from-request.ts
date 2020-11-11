export function setContextFromRequest(reqKey: string, reqProp: string, contextKey: string) {
    return function(req, res, next) {
        const addToContext = req[reqKey][reqProp]
        req.ctx[contextKey] = addToContext
        next()
    }
}