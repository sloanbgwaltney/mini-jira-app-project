import {Schema} from 'mongoose'
import { IProjectUserPermmsion, ProjectUserPermissionSchema } from './project-user-permissions.schema'

export interface IProjectUser {
    userId: string,
    permissions: IProjectUserPermmsion
}

export const ProjectUserSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    permissions: ProjectUserPermissionSchema
})