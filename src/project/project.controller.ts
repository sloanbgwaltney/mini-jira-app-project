import { createProjectService } from "./project.service";

export const createProjectController = (projectService: ReturnType<typeof createProjectService>) => async (req, res, next) => {
    try {
        const project = await projectService(req.user.sub, req.body)
        res.status(201).json(project)
    } catch (e) {
        next(e)
    }
}