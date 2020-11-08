import { ForbiddenError } from "../errors/forbidden.error";
import { ItemNotFoundError } from "../errors/item-not-found.error";
import { createOrUpdateProjectService, createProjectService, deleteProjectService, updateExistingProjectService } from "./project.service";

export const createProjectController = (projectService: ReturnType<typeof createProjectService>) => async (req, res, next) => {
    try {
        const project = await projectService(req.user.sub, req.body)
        res.status(201).json(project)
    } catch (e) {
        next(e)
    }
}

export const deleteProjectController = (projectService: ReturnType<typeof deleteProjectService>) => async (req, res, next) => {
    try {
        await projectService(req.user.sub, req.query.id)
        res.status(200).send()
    } catch (e) {
        if (e instanceof ItemNotFoundError) {
            res.errorCode = 404
            return next(e)
        } else if (e instanceof ForbiddenError) {
            res.errorCode = 401
            return next(e)
        }
        next(e)
    }
}

export const createOrUpdateProjectController = (projectService: ReturnType<typeof createOrUpdateProjectService>) => async (req, res, next) => {
    try {
        const project = await projectService(req.user.sub, req.body)
        // TODO: make status bassed on rather it was created or updated
        res.status(200).json(project)
    } catch (e) {
        if (e instanceof ItemNotFoundError) {
            res.errorCode = 404
            return next(e)
        } else if (e instanceof ForbiddenError) {
            res.errorCode = 401
            return next(e)
        }
        next(e)
    }
}

export const updateExistingProjectController = (projectService: ReturnType<typeof updateExistingProjectService>) => async (req, res, next) => {
    try {
        const project = await projectService(req.user.sub, req.body)
        res.status(200).json(project)
    } catch (e) {
        if (e instanceof ItemNotFoundError) {
            res.errorCode = 404
            return next(e)
        } else if (e instanceof ForbiddenError) {
            res.errorCode = 401
            return next(e)
        }
    }
}