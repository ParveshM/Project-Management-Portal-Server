import mongoose from "mongoose";
import User, { IUser } from "../schema/users";
import { USER_ROLES } from "../types";
import { buildQueryOptions } from "../utils";

export const UserDB = {
  createUser: (data: Partial<IUser>) => User.create(data),

  getAllUsers: async (req: Record<string, any>) => {
    const { query, limit, skip, sort } = buildQueryOptions({
      searchFields: ["name", "username"],
      ...(req?.query.role && { filters: { role: req.query.role } }),
      ...req.query,
    });
    const data = await User.find(query)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .populate("createdBy", "name username _id");
    const count = await User.countDocuments(query);
    return { data, count };
  },

  getUserById: (id: string) => User.findById(id),
  getUserByUsername: (username: string) => User.findOne({ username }),
  updateUser: (id: string, data: Partial<IUser>) =>
    User.findByIdAndUpdate(id, data, { new: true }),

  deleteUser: (id: string) => User.findByIdAndDelete(id),

  getDailyUserStats: async (adminId: string) => {
    return await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date("2025-01-01"), $lte: new Date() },
          _id: { $ne: new mongoose.Types.ObjectId(adminId) },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: "$_id", count: 1 } },
    ]);
  },
};
