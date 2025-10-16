import jwt from "jsonwebtoken";
import ENV from "../config/ENV.js";
import { ROLES } from "../types/index.js";
type JWTPayload = {
  userName: string;
  id: string;
  role: ROLES;
};

export const generateToken = (payload: JWTPayload, exp: any = "7d") => {
  return jwt.sign(payload, ENV.JWT_SECRET as string, {
    expiresIn: exp,
  });
};
