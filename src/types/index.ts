import { JwtPayload } from "jsonwebtoken";

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  MANAGER: "manager",
} as const;

export type ROLES = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export type JwtUserPayload = JwtPayload & {
  id: string;
  username: string;
  role: ROLES;
};
