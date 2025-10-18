import mongoose from "mongoose";
import User, { IUser } from "../schema/users";
import { buildQueryOptions } from "../utils";

export const UserDB = {
  createUser: (data: Partial<IUser>) => User.create(data),

  getAllUsers: async ({ queryParam }: { queryParam: Record<string, any> }) => {
    const { query, limit, skip, sort } = buildQueryOptions({
      searchFields: ["name"],
      ...(queryParam?.role && { filters: { role: queryParam.role } }),
      ...queryParam,
    });
    const data = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name username _id");
    const count = await User.countDocuments(query);
    return { data, count };
  },

  getUserById: (id: string) => User.findById(id),
  getUserByUsername: (username: string, role: string) =>
    User.findOne({ username, role }),

  updateUser: (id: string, data: Partial<IUser>) =>
    User.findByIdAndUpdate(id, data, { new: true }),

  deleteUser: (id: string) => User.findByIdAndDelete(id),

  getDailyUserStats: async (adminId: string) => {
    const result = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date("2025-01-01"), $lte: new Date() },
          _id: { $ne: new mongoose.Types.ObjectId(adminId) },
        },
      },
      {
        $facet: {
          dailyCounts: [
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
          ],
          totalCount: [{ $count: "total" }],
        },
      },
    ]);
    const { totalCount = [], dailyCounts = [] } = result[0] || {};
    return {
      totalCount: totalCount[0]?.total || 0,
      dailyCounts,
    };
  },
};
