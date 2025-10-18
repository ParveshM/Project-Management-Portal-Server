import { Response } from "express";
import { HttpStatus } from "../types/HttpsStatus";

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
  const limitNum = Number(limit) || 10;
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

interface SendResponseParams<T> {
  res: Response;
  status?: number;
  message: string;
  data?: T;
  success?: boolean;
  [key: string]: any;
}

export function sendResponse<T>({
  res,
  status = HttpStatus.OK,
  message,
  data,
  success = true,
  ...rest
}: SendResponseParams<T>): void {
  res.status(status).json({
    success,
    message,
    data,
    ...rest,
  });
}
