interface QueryParams {
  page: number | string;
  limit: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  q?: string;
  filters?: Record<string, any>;
  searchFields?: string[];
}

export const buildQueryOptions = (params: QueryParams) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    sortOrder = "desc",
    q,
    filters = {},
    searchFields = [],
  } = params;

  const pageNum = Math.max(Number(page) || 1, 1);
  const limitNum = Math.max(Number(limit) || 10, 1);
  const skip = (pageNum - 1) * limitNum;

  const query: Record<string, any> = { ...filters };

  if (q) {
    query["$or"] = searchFields.map((field) => ({
      [field]: { $regex: q, $options: "i" },
    }));
  }

  const sortOption: Record<string, 1 | -1> = {};

  if (sortBy) {
    sortOption[sortBy] = sortOrder === "asc" ? 1 : -1;
  }

  return {
    query,
    sort: sortOption,
    skip,
    limit: limitNum,
  };
};
