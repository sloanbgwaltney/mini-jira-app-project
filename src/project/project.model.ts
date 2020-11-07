import {Schema, model, Document, Model} from 'mongoose'
import { IProjectUser, ProjectUserSchema } from './schemas/project-user.schema'

export interface IProject extends Document {
    name: string,
    description: string,
    users: Map<string, IProjectUser>
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

export const PROJECT_COLLECTION_NAME = 'Project'

export const Project = model<IProject, IProjectModel>(PROJECT_COLLECTION_NAME, ProjectSchema)