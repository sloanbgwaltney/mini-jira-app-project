import { PassportStatic } from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import { API_ENDPOINTS } from '../lib/api-endpoints'
import { publicKeyGetter } from '../lib/public-key-getter'

export function configPassport(passport: PassportStatic) {
    const opts = {
        secretOrKeyProvider: async function (request, rawJwtToken, done) {
            const publicKey = await publicKeyGetter(API_ENDPOINTS.AUTH.PUBLICK_KEY)
            done(null, publicKey)
        },
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE
    }
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        done(null, jwt_payload)
    }))
}