import { Request, Response, NextFunction } from "express";
import CustomError from "../utils/customError";

const errorHandlingMidleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 400;
  if (err.statusCode === 404) {
    res.status(err.statusCode).json({ success: false, message: err.message });
  } else {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err,
    });
  }
};

export default errorHandlingMidleware;
