import { Router } from "express";
import authenticateUser, { requireRoles } from "../middleware/auth.middleware";
import { USER_ROLES } from "../types";
import { ProjectController } from "../controller/project";
import { projectValidation } from "../utils/validation";
import { handleValidationErrors } from "../middleware/validator.middleware";

const router = Router();

/********* Project routes *********/
router.get(
  "/statistics",
  authenticateUser,
  requireRoles([USER_ROLES.ADMIN]),
  ProjectController.getProjectStats
);
router.get(
  "/",
  authenticateUser,
  requireRoles([USER_ROLES.MANAGER, USER_ROLES.ADMIN]),
  ProjectController.getAllProjects
);

router.post(
  "/",
  authenticateUser,
  requireRoles([USER_ROLES.MANAGER, USER_ROLES.ADMIN]),
  projectValidation,
  handleValidationErrors,

  ProjectController.createProject
);

router.get(
  "/:id",
  authenticateUser,
  requireRoles([USER_ROLES.MANAGER, USER_ROLES.ADMIN]),
  ProjectController.getProjectById
);

router.patch(
  "/:id",
  authenticateUser,
  requireRoles([USER_ROLES.MANAGER, USER_ROLES.ADMIN]),
  ProjectController.updateProject
);

router.delete(
  "/:id",
  authenticateUser,
  requireRoles([USER_ROLES.ADMIN]),
  ProjectController.deleteProject
);

export const projectRouter = router;
