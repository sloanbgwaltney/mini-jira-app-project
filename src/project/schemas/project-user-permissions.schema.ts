import {Schema} from 'mongoose'

export interface IProjectUserPermmsion {
    name: string,
    description: string
}

export const ProjectUserPermissionSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
})