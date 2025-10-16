import { body } from "express-validator";
import { USER_ROLES } from "../types";

export const loginValidation = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];

export const registerValidation = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
  body("role")
    .isString()
    .notEmpty()
    .withMessage("Role is required")
    .isIn([USER_ROLES.MANAGER, USER_ROLES.USER]),
];

export const projectValidation = [
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("Description is required"),
  body("startDate").isDate().withMessage("Start date is required"),
  body("endDate").isDate().withMessage("End date is required"),
];
