import { Request, Response, NextFunction } from "express";
import { UserDB } from "../repository/user";
import CustomError from "../utils/customError";
import { HttpStatus } from "../types/HttpsStatus";
import { comparePassword } from "../utils/hashPass";
import { generateToken } from "../utils/generateToken";
import { sendResponse } from "../utils";
import mongoose from "mongoose";

export const UserController = {
  /**
   * * METHOD: POST
   * * ACTION: Login existing user based on roles
   */
  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, role } = req.body;
      const existingUser = await UserDB.getUserByUsername(username, role);
      if (!existingUser) {
        throw new CustomError("User not found", HttpStatus.BAD_REQUEST);
      }

      const isPasswordValid = await comparePassword(
        password,
        existingUser.password
      );
      if (!isPasswordValid) {
        throw new CustomError("Invalid credentials", HttpStatus.UNAUTHORIZED);
      }
      const token = generateToken({
        id: existingUser._id as unknown as string,
        username: existingUser.username,
        role: existingUser.role,
      });
      sendResponse({
        res,
        message: "Login successful",
        data: {
          token,
          user: {
            _id: existingUser._id as unknown as string,
            name: existingUser.name,
            username: existingUser.username,
            role: existingUser.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * * METHOD: POST
   * * ACTION: Register new user
   */
  registerUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, username, password, role } = req.body;
      const existingUser = await UserDB.getUserByUsername(username, role);
      if (existingUser) {
        throw new CustomError("User already exists", HttpStatus.BAD_REQUEST);
      }
      const createdBy = new mongoose.Types.ObjectId(req.user.id);
      const user = await UserDB.createUser({
        name,
        username,
        password,
        role,
        createdBy,
      });
      sendResponse({ res, message: "User created successfully", data: user });
    } catch (error) {
      next(error);
    }
  },

  /**
   * * METHOD: GET
   * * ACTION: Get all users
   */
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data, count } = await UserDB.getAllUsers({
        queryParam: req.query,
      });
      sendResponse({
        res,
        message: "Users fetched successfully",
        data: data,
        count,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * * METHOD: PATCH
   * * ACTION: Updata User with Id
   */
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await UserDB.updateUser(id, req.body);
      sendResponse({ res, message: "User updated successfully", data: user });
    } catch (error) {
      next(error);
    }
  },

  /**
   * * METHOD: DELETE
   * * ACTION: Delete user by id
   */
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await UserDB.deleteUser(id);
      sendResponse({ res, message: "User deleted successfully", data: user });
    } catch (error) {
      next(error);
    }
  },
  /**
   * * METHOD: GET
   * * ACTION: Get user statistics
   */
  getUserStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await UserDB.getDailyUserStats(req.user.id);
      sendResponse({
        res,
        message: "User statistics fetched successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
