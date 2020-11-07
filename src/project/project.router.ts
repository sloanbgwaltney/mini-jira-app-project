import {Router} from 'express'
import { createProjectController } from './project.controller'
import { Project } from './project.model'
import { createProjectService } from './project.service'

export const ProjectRouter = Router()
.post('/', createProjectController(createProjectService(Project)))