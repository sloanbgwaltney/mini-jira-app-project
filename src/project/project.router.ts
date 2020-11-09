import {Router} from 'express'
import passport = require('passport')
import { createOrUpdateProjectController, createProjectController, deleteProjectController, updateExistingProjectController } from './project.controller'
import { Project } from './project.model'
import { createOrUpdateProjectService, createProjectService, deleteProjectService, updateExistingProjectService } from './project.service'

export const ProjectRouter = Router()
.post('/', passport.authenticate('jwt', {session: false}), createProjectController(createProjectService(Project)))
// TODO: see if we can make this line a little neater without the cost of performance
.put('/', passport.authenticate('jwt', {session: false}), createOrUpdateProjectController(createOrUpdateProjectService(updateExistingProjectService(Project), createProjectService(Project))))
.patch('/', passport.authenticate('jwt', {session: false}), updateExistingProjectController(updateExistingProjectService(Project)))
.delete('/', passport.authenticate('jwt', {session: false}), deleteProjectController(deleteProjectService(Project)))