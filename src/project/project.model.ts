import {Schema, model, Document, Model} from 'mongoose'
import { IProjectUserPermissionEnum } from './schemas/project-user-permissions.schema'
import { IProjectUser, ProjectUserSchema } from './schemas/project-user.schema'

export interface IProject extends Document {
    name: string,
    description: string,
    users: Map<string, IProjectUser>,
    assignUserPermission: (this: IProject, userId: string, permission: IProjectUserPermissionEnum) => IProject,
    validateUserPermission: (this: IProject, userId: string, permission: IProjectUserPermissionEnum) => boolean,
    userIsAProjectOwner: (this: IProject, userId: string) => boolean
}

export interface IProjectModel extends Model<IProject> {}

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
        of: ProjectUserSchema
    }
})


ProjectSchema.methods.assignUserPermission = function(this: IProject, userId: string, permission: IProjectUserPermissionEnum): IProject {
    const newProject = this
    const projectUser = newProject.users.get(userId)
    if (!projectUser) {
        const newProjectUser: IProjectUser = {userId, permissions: {[permission]: true}}
        newProject.set(userId, newProjectUser)
    } else {
        projectUser.permissions[permission] == true
        newProject.users.set(userId, projectUser)
    }
    return newProject
}

ProjectSchema.methods.validateUserPermission = function(this: IProject, userId: string, permission: IProjectUserPermissionEnum): boolean {
    const user = this.users.get(userId)
    if (!user) return false
    return user.permissions[permission]
}

ProjectSchema.methods.userIsAProjectOwner = function(this: IProject, userId: string): boolean {
    return this.validateUserPermission(userId, IProjectUserPermissionEnum.PROJECT_OWNER)
}

export const PROJECT_COLLECTION_NAME = 'Project'

export const Project = model<IProject, IProjectModel>(PROJECT_COLLECTION_NAME, ProjectSchema)