import { IProject, IProjectModel, Project } from "./project.model";
import { IProjectUserPermissionEnum } from "./schemas/project-user-permissions.schema";
import {ItemNotFoundError} from '../errors/item-not-found.error'
import {ForbiddenError} from '../errors/forbidden.error'

export const createProjectService = (Project: IProjectModel) => (userId: string, body: Partial<IProject>) => {
    const project = new Project(body)
    project.users = undefined
    const projectWithUser = project.assignUserPermission(userId, IProjectUserPermissionEnum.PROJECT_OWNER)
    return projectWithUser.save()
}

export const updateExistingProjectService = (Project: IProjectModel) => async (userId: string, body: Partial<IProject>) => {
    const project = await Project.findById(body.id)
    if (!project) throw new ItemNotFoundError()
    if (!project.userIsAProjectOwner(userId) && !project.userCanUpdateProject(userId)) throw new ForbiddenError()
    body.users = undefined
    const updatedProject = new Project(body)
    return updatedProject.save()
}

export const createOrUpdateProjectService = (
    updateProjectService: ReturnType<typeof updateExistingProjectService>, createProjectServ: ReturnType<typeof createProjectService>) => async (userId: string, body: Partial<IProject>) => {
    if (body.id) return updateProjectService(userId, body)
    return createProjectServ(userId, body)
}

export const deleteProjectService = (Project: IProjectModel) => async (userId: string, projectId: string) => {
    const project = await Project.findById(projectId)
    if (!project) throw new ItemNotFoundError()
    if (!project.userIsAProjectOwner(userId)) throw new ForbiddenError()
    return project.deleteOne()
}