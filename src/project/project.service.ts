import { IProject, IProjectModel } from "./project.model";
import { IProjectUserPermissionEnum } from "./schemas/project-user-permissions.schema";

export const createProjectService = (Project: IProjectModel) => (userId: string, body: Partial<IProject>) => {
    const project = new Project(body)
    project.users = undefined
    const projectWithUser = project.assignUserPermission(userId, IProjectUserPermissionEnum.PROJECT_OWNER)
    return projectWithUser.save()
}