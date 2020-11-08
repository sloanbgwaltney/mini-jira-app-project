import {Schema} from 'mongoose'
import { IProjectUserPermission, ProjectUserPermissionSchema } from './project-user-permissions.schema'

export interface IProjectUser {
    userId: string,
    permissions: IProjectUserPermission
}

export const ProjectUserSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    permissions: ProjectUserPermissionSchema
})