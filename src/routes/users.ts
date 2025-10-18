import express from "express";
import { loginValidation, registerValidation } from "../utils/validation";
import { handleValidationErrors } from "../middleware/validator.middleware";
import { UserController } from "../controller/user";
import authenticateUser, { requireRoles } from "../middleware/auth.middleware";
import { USER_ROLES } from "../types";
const router = express.Router();

/********* Auth routes *********/
router.post(
  "/login",
  loginValidation,
  handleValidationErrors,
  UserController.loginUser
);
router.post(
  "/register",
  authenticateUser,
  requireRoles([USER_ROLES.MANAGER, USER_ROLES.ADMIN]),
  registerValidation,
  handleValidationErrors,
  UserController.registerUser
);

router.patch(
  "/:id",
  authenticateUser,
  requireRoles([USER_ROLES.MANAGER, USER_ROLES.ADMIN]),
  UserController.updateUser
);
router.delete(
  "/:id",
  authenticateUser,
  requireRoles([USER_ROLES.ADMIN]),
  UserController.deleteUser
);
router.get(
  "/",
  authenticateUser,
  requireRoles([USER_ROLES.MANAGER, USER_ROLES.ADMIN]),
  UserController.getAllUsers
);
router.get(
  "/statistics",
  authenticateUser,
  requireRoles([USER_ROLES.ADMIN]),
  UserController.getUserStats
);

export default router;
