import express = require('express')
import {connect} from 'mongoose'
import { routes } from './routes'
import passport from 'passport'
import { configPassport } from './config/passport'

connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => {
        const app = express()
        app.use(passport.initialize())
        configPassport(passport)
        routes(app)
        app.listen(process.env.PORT, () => console.log('Project microservice running'))
    }).catch(e => console.log(e))