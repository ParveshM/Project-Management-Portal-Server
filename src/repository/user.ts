import User, { IUser } from "../schema/users";
import { USER_ROLES } from "../types";
import { buildQueryOptions } from "../utils";

export const UserDB = {
  createUser: (data: Partial<IUser>) => User.create(data),

  getAllUsers: async (req: Record<string, any>) => {
    const { query, limit, skip, sort } = buildQueryOptions({
      filters: { role: USER_ROLES.USER },
      searchFields: ["name", "userName"],
      ...req.query,
    });
    return await User.find(query)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .populate("createdBy");
  },

  getUserById: (id: string) => User.findById(id),

  updateUser: (id: string, data: Partial<IUser>) =>
    User.findByIdAndUpdate(id, data, { new: true }),

  deleteUser: (id: string) => User.findByIdAndDelete(id),
};
