import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/customError";
import { HttpStatus } from "../types/HttpsStatus";
import { sendResponse } from "../utils";
import { ProjectDB } from "../repository/project";

export const ProjectController = {
  /**
   * * METHOD: POST
   * * ACTION: Create new Project
   */
  createProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;

      const existingProject = await ProjectDB.getProjectByName(name);
      if (existingProject) {
        throw new CustomError(
          `Project with name "${name}" already exists`,
          HttpStatus.BAD_REQUEST
        );
      }

      const data = await ProjectDB.createProject({
        managerId: req.user.id,
        ...req.body,
      });

      sendResponse({
        res,
        status: HttpStatus.CREATED,
        message: "Project created successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * * METHOD: GET
   * * ACTION: Get all projects
   */
  getAllProjects: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, count } = await ProjectDB.getAllProjects(req.query);

      sendResponse({
        res,
        message: "Projects fetched successfully",
        data,
        count,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * * METHOD: GET
   * * ACTION: Get single project by ID
   */
  getProjectById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const project = await ProjectDB.getProjectById(id);

      if (!project) {
        throw new CustomError("Project not found", HttpStatus.NOT_FOUND);
      }

      sendResponse({
        res,
        message: "Project fetched successfully",
        data: project,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * * METHOD: PATCH
   * * ACTION: Update Project by ID
   */
  updateProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const project = await ProjectDB.updateProject(id, req.body);

      if (!project) {
        throw new CustomError("Project not found", HttpStatus.NOT_FOUND);
      }

      sendResponse({
        res,
        message: "Project updated successfully",
        data: project,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * * METHOD: DELETE
   * * ACTION: Delete Project by ID
   */
  deleteProject: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const project = await ProjectDB.deleteProject(id);

      if (!project) {
        throw new CustomError("Project not found", HttpStatus.NOT_FOUND);
      }

      sendResponse({
        res,
        message: "Project deleted successfully",
        data: project,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * * METHOD: GET
   * * ACTION: Get project statistics
   */
  getProjectStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await ProjectDB.getProjectStatistics();
      sendResponse({
        res,
        message: "Project statistics fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
