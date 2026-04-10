/**
 * common/pagination.ts
 *
 * Parses ?page=1&limit=10 from query strings and returns:
 *   - skip / limit for Mongoose queries
 *   - a buildMeta() helper to construct the meta block for the response
 *
 * Usage in a controller:
 *   const { skip, limit, buildMeta } = parsePagination(req.query);
 *   const items = await Model.find().skip(skip).limit(limit);
 *   const total = await Model.countDocuments();
 *   respond.ok(res, items, "Fetched", buildMeta(total));
 */

import { ParsedQs } from "qs";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationParams {
  skip: number;
  limit: number;
  page: number;
  buildMeta: (total: number) => PaginationMeta;
}

export function parsePagination(query: ParsedQs): PaginationParams {
  const page = Math.max(1, parseInt(String(query.page ?? "1"), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? "10"), 10)));
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    buildMeta: (total: number): PaginationMeta => ({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }),
  };
}
