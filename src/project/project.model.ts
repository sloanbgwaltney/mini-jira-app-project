import {Schema, model, Document, Model} from 'mongoose'
import { IProjectUserPermission, IProjectUserPermissionEnum } from './schemas/project-user-permissions.schema'
import { IProjectUser, ProjectUserSchema } from './schemas/project-user.schema'
import {Error} from 'mongoose'
import { ValidationError } from '../errors/validation-error'
import {ItemNotFoundError} from '../errors/item-not-found.error'
import { ForbiddenError } from '../errors/forbidden.error'
export interface IProject extends Document {
    name: string,
    description: string,
    users: Map<string, IProjectUser>,
    assignUserPermission: (this: IProject, userId: string, permission: IProjectUserPermissionEnum) => IProject,
    userHasPermission: (this: IProject, userId: string, permission?: IProjectUserPermissionEnum) => boolean,
    userIsAProjectOwner: (this: IProject, userId: string) => boolean,
    userCanUpdateProject: (this: IProject, userId: string) => boolean
}

export interface IProjectModel extends Model<IProject> {
    modelFromBody: (this: IProjectModel, contextKey: string) => (req, res, next) => void,
    assignUserPermission: (this: IProjectModel, documentContextKey: string, userIdContextKey: string, permission: IProjectUserPermissionEnum) => (req, res, next) => void,
    findUsersProjects: (this: IProjectModel, userId: string, pageNumber: number, numberPerPage: number) => Promise<IProject[]>,
    findCurrentUsersProjects: (this: IProjectModel, contextKeyToSave: string) => (req, res, next) => Promise<void>,
    saveEntity: (this: IProjectModel, documentContextKey: string, contextSaveKey: string) => (req, res, next) => Promise<void>,
    userHasPermission: (this: IProjectModel, userIdContextKey: string, projectContextKey: string, permissions?: IProjectUserPermissionEnum[]) => (req, res, next) => void,
    findEntityById: (this: IProjectModel, idContextKey: string, storageContextKey: string, errorIfNotFound?: boolean) => (req, res, next) => Promise<void>,
    updateEntityById: (this: IProjectModel, idContextKey: string, storageContectKey: string, requestUpdateBodyKey?: string) => (req, res, next) => Promise<void>,
    deleteEntityById: (this: IProjectModel, entityContextKey: string) => (req, res, next) => Promise<void>
}

export const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    users: {
        type: Map,
        of: ProjectUserSchema,
        default: new Map()
    }
})


ProjectSchema.statics.modelFromBody = function(this: IProjectModel, contextKey: string) {
    const self = this
    return function(req, res, next) {
        req.ctx[contextKey] = new self(req.body)
        next()
    }
}

ProjectSchema.statics.findUsersProjects = async function(this: IProjectModel, userId: string, pageNumber: number, numberPerPage: number) {
    const results = await this.find({[`users.${userId}`]: {$exists: true}}).limit(numberPerPage).skip((pageNumber - 1) * numberPerPage)
    return results
}

ProjectSchema.statics.assignUserPermission = function(this: IProjectModel, documentContextKey: string, userIdContextKey: string, permission: IProjectUserPermissionEnum) {
    return function(req, res, next) {
        const doc = req.ctx[documentContextKey] as IProject
        doc.assignUserPermission(req.ctx[userIdContextKey], permission)
        next()
    }
}

ProjectSchema.statics.findCurrentUsersProjects = function(this: IProjectModel, contextKeyToSave: string) {
    const self = this
    return async function(req, res, next) {
        req.ctx[contextKeyToSave] = await self.findUsersProjects(req.ctx.userId, 1, 20)
        next()
    }
}

ProjectSchema.statics.saveEntity = function(this: IProjectModel, documentContextKey: string, contextSaveKey: string) {
    return async function (req, res, next) {
        try {
            const doc = req.ctx[documentContextKey] as IProject
            const result = await doc.save()
            req.ctx[contextSaveKey] = result
            next()
        } catch(e) {
            if (e instanceof Error.ValidationError) {
                return next(new ValidationError(e.message))
            }
            next(e)
        }
    }
}

ProjectSchema.statics.userHasPermission = function(this: IProjectModel, userIdContextKey: string, projectContextKey: string, permissions?: IProjectUserPermissionEnum[]) {
    return function (req, res, next) {
        const userId = req.ctx[userIdContextKey] as string
        const project = req.ctx[projectContextKey] as IProject
        let isAuthorized = false
        if (!permissions) {
            if (!project.userHasPermission(userId)) return next(new ForbiddenError())
            return next()
        }
        for (const permission of permissions) {
            if (project.userHasPermission(userId, permission)) {
                isAuthorized = true
                break
            }
        }
        if (!isAuthorized) return next(new ForbiddenError())
        next()
    }
}

ProjectSchema.statics.findEntityById = function(this: IProjectModel, idContextKey: string, storageContextKey: string, errorIfNotFound = true) {
    const self = this
    return async function(req, res, next) {
        const projectId = req.ctx[idContextKey] as string
        req.ctx[storageContextKey] = await self.findById(projectId)
        if (!req.ctx[storageContextKey] && errorIfNotFound) return next(new ItemNotFoundError(`No project found with the id ${projectId}`))
        next()
    }
}

ProjectSchema.statics.updateEntityById = function(this: IProjectModel, idContextKey: string, storageContectKey: string, requestUpdateBodyKey = 'body') {
    const self = this
    return async function(req, res, next) {
        const entityId = req.ctx[idContextKey] as string
        req.ctx[storageContectKey] = await self.findByIdAndUpdate(entityId, req[requestUpdateBodyKey])
        next()
    }
}

ProjectSchema.statics.deleteEntityById = function(this: IProjectModel, entityContextKey: string) {
    return async function(req, res, next) {
        const entity = req.ctx[entityContextKey] as IProject
        await entity.deleteOne()
        next()
    }
}

ProjectSchema.methods.assignUserPermission = function(this: IProject, userId: string, permission: IProjectUserPermissionEnum): IProject {
    const newProject = this
    const projectUser = newProject.users.get(userId)
    if (!projectUser) {
        let newProjectUserPermissions: IProjectUserPermission = {projectOwner: false, updateProject: false}
        const newProjectUser = {userId, permissions: newProjectUserPermissions}
        newProjectUser.permissions[permission] = true
        newProject.users.set(userId, newProjectUser)
    } else {
        projectUser.permissions[permission] == true
        newProject.users.set(userId, projectUser)
    }
    return newProject
}

ProjectSchema.methods.userHasPermission = function(this: IProject, userId: string, permission?: IProjectUserPermissionEnum): boolean {
    const user = this.users.get(userId)
    if (!user) return false
    if (!permission) return true
    return user.permissions[permission]
}

ProjectSchema.methods.userIsAProjectOwner = function(this: IProject, userId: string): boolean {
    return this.userHasPermission(userId, IProjectUserPermissionEnum.PROJECT_OWNER)
}

ProjectSchema.methods.userCanUpdateProject = function(this: IProject, userId: string): boolean {
    return this.userHasPermission(userId, IProjectUserPermissionEnum.UPDATE_PROJECT)
}

export const PROJECT_COLLECTION_NAME = 'Project'

export const Project = model<IProject, IProjectModel>(PROJECT_COLLECTION_NAME, ProjectSchema)