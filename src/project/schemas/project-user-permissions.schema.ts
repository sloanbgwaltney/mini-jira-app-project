import {Schema} from 'mongoose'

export interface IProjectUserPermmsion {
    projectOwner: boolean
}

export enum IProjectUserPermissionEnum {
    PROJECT_OWNER = 'projectOwner'
}

export const ProjectUserPermissionSchema = new Schema({
    projectOwner: {
        type: Boolean,
        default: false
    }
})