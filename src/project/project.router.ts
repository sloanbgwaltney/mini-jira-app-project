import {Router} from 'express'
import passport = require('passport')
import { responseSender } from '../lib/response-sender'
import { setContextFromRequest } from '../lib/set-context-from-request'
import { Project } from './project.model'
import { IProjectUserPermissionEnum } from './schemas/project-user-permissions.schema'

export const ProjectRouter = Router()
.post(
    '/', 
    passport.authenticate('jwt', {session: false}), 
    Project.modelFromBody('project'),
    setContextFromRequest('user', 'sub', 'userId'),
    Project.assignUserPermission('project', 'userId', IProjectUserPermissionEnum.PROJECT_OWNER),
    Project.saveEntity('project', 'project'),
    responseSender(201, 'project')
)
.get(
    '/',
    passport.authenticate('jwt', {session: false}),
    setContextFromRequest('user', 'sub', 'userId'),
    Project.findCurrentUsersProjects('projects'),
    responseSender(200, 'projects')
)
.get(
    '/:projectId',
    passport.authenticate('jwt', {session: false}),
    setContextFromRequest('params', 'projectId', 'projectId'),
    setContextFromRequest('user', 'sub', 'userId'),
    Project.findEntityById('projectId', 'project'),
    Project.userHasPermission('userId', 'project'),
    responseSender(200, 'project')
)
.patch(
    '/:projectId', 
    passport.authenticate('jwt', {session: false}), 
    setContextFromRequest('params', 'projectId', 'projectId'),
    setContextFromRequest('user', 'sub', 'userId'),
    Project.findEntityById('projectId', 'project'),
    Project.userHasPermission('userId', 'project', [IProjectUserPermissionEnum.PROJECT_OWNER, IProjectUserPermissionEnum.UPDATE_PROJECT]),
    Project.updateEntityById('projectId', 'project'),
    responseSender(200)
)
.delete(
    '/:projectId',
    passport.authenticate('jwt', {session: false}),
    setContextFromRequest('params', 'projectId', 'projectId'),
    setContextFromRequest('user', 'sub', 'userId'),
    Project.findEntityById('projectId', 'project'),
    Project.userHasPermission('userId', 'project', [IProjectUserPermissionEnum.PROJECT_OWNER]),
    Project.deleteEntityById('project'),
    responseSender(200)
)