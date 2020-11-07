import express = require('express')
import { ProjectRouter } from './project/project.router'

export function routes(app: ReturnType<typeof express>) {
    const BASE_URI = 'api/v1'
    app.use(`${BASE_URI}/projects`, ProjectRouter)
}