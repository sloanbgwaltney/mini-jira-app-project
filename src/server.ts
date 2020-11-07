import express = require('express')
import {connect} from 'mongoose'
import { routes } from './routes'

connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => {
        const app = express()
        routes(app)
        app.listen(process.env.PORT, () => console.log('Project microservice running'))
    }).catch(e => console.log(e))