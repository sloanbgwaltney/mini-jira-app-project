export function requestContextInitializer() {
    return function(req, res, next) {
        req.ctx = {}
        next()
    }
}