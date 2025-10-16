import mongoose, { Document, Schema, Model } from "mongoose";
import { ROLES, USER_ROLES } from "../types";

export interface IUser extends Document {
  name: string;
  userName: string;
  password: string;
  role: ROLES;
  createdBy?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: USER_ROLES.USER,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// 3. Export the model with type
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
