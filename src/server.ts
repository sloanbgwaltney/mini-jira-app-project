import express = require('express')
import {connect} from 'mongoose'
import { routes } from './routes'
import passport = require('passport')
import { configPassport } from './config/passport'
import { requestContextInitializer } from './lib/request-context-initializer'

connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => {
        const app = express()
        app.use(express.json())
        app.use(passport.initialize())
        app.use(requestContextInitializer())
        configPassport(passport)
        routes(app)
        app.listen(process.env.PORT, () => console.log('Project microservice running'))
    }).catch(e => console.log(e))