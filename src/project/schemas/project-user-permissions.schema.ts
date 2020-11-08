import {Schema} from 'mongoose'

export interface IProjectUserPermission {
    projectOwner: boolean,
    updateProject: boolean
}

export enum IProjectUserPermissionEnum {
    PROJECT_OWNER = 'projectOwner',
    UPDATE_PROJECT = 'updateProject'
}

export const ProjectUserPermissionSchema = new Schema({
    projectOwner: {
        type: Boolean,
        default: false
    },
    updateProject: {
        type: Boolean,
        default: false
    }
})