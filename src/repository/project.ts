import { IProject, Project } from "../schema/projects";
import { buildQueryOptions } from "../utils";

export const ProjectDB = {
  createProject: (data: Partial<IProject>) => Project.create(data),

  getAllProjects: async (queryParams: any) => {
    const { query, sort, skip, limit } = buildQueryOptions({
      filters: queryParams.status ? { status: queryParams.status } : {},
      searchFields: ["name", "description"],
      ...queryParams,
    });

    const data = await Project.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("managerId", "name username _id");
    const count = await Project.countDocuments(query);
    return { data, count };
  },

  getProjectById: (id: string) => Project.findById(id),
  getProjectByName: (name: string) => Project.findOne({ name }),
  updateProject: (id: string, data: Partial<IProject>) =>
    Project.findByIdAndUpdate(id, data, { new: true }),

  deleteProject: (id: string) => Project.findByIdAndDelete(id),

  getProjectStatistics: async () => {
    const result = await Project.aggregate([
      {
        $facet: {
          totalProject: [
            {
              $group: {
                _id: null,
                count: { $sum: 1 },
              },
            },

            {
              $project: {
                _id: 0,
                count: 1,
              },
            },
          ],
          projectByStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                status: "$_id",
                count: 1,
              },
            },
          ],
        },
      },
    ]);
    return result[0];
  },
};
