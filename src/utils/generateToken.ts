import jwt from "jsonwebtoken";
import { ROLES } from "../types";
import ENV from "../config/ENV";
type JWTPayload = {
  username: string;
  id: string;
  role: ROLES;
};

export const generateToken = (payload: JWTPayload, exp: any = "7d") => {
  return jwt.sign(payload, ENV.JWT_SECRET as string, {
    expiresIn: exp,
  });
};
