import mongoose, { Document, Schema, Model } from "mongoose";
import { ROLES, USER_ROLES } from "../types";
import { hashPassword } from "../utils/hashPass";
import { Query } from "mongoose";
export interface IUser extends Document {
  name: string;
  username: string;
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
    username: {
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

userSchema.pre<Query<IUser, IUser>>("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();

  if (!update) return next();

  if ("password" in update) {
    const password = update.password;
    update.password = await hashPassword(password);
    this.setUpdate(update);
  }

  next();
});
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
