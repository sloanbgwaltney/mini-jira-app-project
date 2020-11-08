import {Router} from 'express'
import { createOrUpdateProjectController, createProjectController, deleteProjectController, updateExistingProjectController } from './project.controller'
import { Project } from './project.model'
import { createOrUpdateProjectService, createProjectService, deleteProjectService, updateExistingProjectService } from './project.service'

export const ProjectRouter = Router()
.post('/', createProjectController(createProjectService(Project)))
// TODO: see if we can make this line a little neater without the cost of performance
.put('/', createOrUpdateProjectController(createOrUpdateProjectService(updateExistingProjectService(Project), createProjectService(Project))))
.patch('/', updateExistingProjectController(updateExistingProjectService(Project)))
.delete('/', deleteProjectController(deleteProjectService(Project)))