import { IProject, IProjectModel } from "./project.model";
import { IProjectUserPermissionEnum } from "./schemas/project-user-permissions.schema";
import { IProjectUser } from "./schemas/project-user.schema";

export const createProjectService = (Project: IProjectModel) => (userId: string, body: Partial<IProject>) => {
    const project = new Project(body)
    project.users = undefined
    const projectWithUser = assugnUserPermission(project, userId, IProjectUserPermissionEnum.PROJECT_OWNER)
    return projectWithUser.save()
}

const assugnUserPermission = (project: IProject, userId: string, permission: IProjectUserPermissionEnum): IProject => {
    const newProject = project
    const projectUser = project.users.get(userId)
    if (!projectUser) {
        const newProjectUser: IProjectUser = {userId, permissions: {[permission]: true}}
        newProject.set(userId, newProjectUser)
    } else {
        projectUser.permissions[permission] == true
        newProject.users.set(userId, projectUser)
    }
    return newProject
}