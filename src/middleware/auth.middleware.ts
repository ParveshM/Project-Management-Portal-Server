import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError";
import { HttpStatus } from "../types/HttpsStatus";
import { JwtUserPayload, ROLES } from "../types";

// extending the request interface to include the user object in the req
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
// verify the token and validate user
export default async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(
      new CustomError("Your are not authenticated", HttpStatus.FORBIDDEN)
    );
  }
  const access_token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(
      access_token,
      process.env.JWT_SECRET as string
    ) as JwtUserPayload;
    req.user = user;
    next();
  } catch (error) {
    next(new CustomError("Token is not valid", HttpStatus.FORBIDDEN));
  }
}

export const autherizeRole = (role: ROLES) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== role) {
      return next(
        new CustomError(
          "Permission denied, you are not authorized to access this route",
          HttpStatus.FORBIDDEN
        )
      );
    }
    next();
  };
};
