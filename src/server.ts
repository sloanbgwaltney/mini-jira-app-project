import express = require('express')
import {connect} from 'mongoose'

connect(process.env.MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => {
        const app = express()
        app.listen(process.env.PORT, () => console.log('Project microservice running'))
    }).catch(e => console.log(e))