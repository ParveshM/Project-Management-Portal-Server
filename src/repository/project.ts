import { IProject, Project } from "../schema/projects";
import { buildQueryOptions } from "../utils";

export const projectsDb = {
  createProject: (data: Partial<IProject>) => Project.create(data),

  getAllProjects: async (queryParams: any) => {
    const { query, sort, skip, limit } = buildQueryOptions({
      filters: queryParams.status ? { status: queryParams.status } : {},
      searchFields: ["name", "description"],
      ...queryParams,
    });

    return Project.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("managerId");
  },

  getProjectById: (id: string) => Project.findById(id),

  updateProject: (id: string, data: Partial<IProject>) =>
    Project.findByIdAndUpdate(id, data, { new: true, runValidators: true }),

  deleteProject: (id: string) => Project.findByIdAndDelete(id),
};
