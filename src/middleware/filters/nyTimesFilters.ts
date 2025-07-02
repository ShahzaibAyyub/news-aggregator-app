import type { ContentParams } from "../interfaces/nyTimesInterfaces";
import type { SearchFilters } from "../interfaces/newsApiInterfaces";
import { formatNyTimesDate, formatDateToNyTimes } from "../../shared/utils";

/**
 * Convert extended search filters to NY Times-specific parameters
 */
export const convertToNyTimesParams = (
  filters: SearchFilters
): ContentParams => {
  const nyTimesParams: ContentParams = {};

  if (filters.query) {
    nyTimesParams.query = filters.query;
  }
  if (filters.category) {
    nyTimesParams.category = filters.category;
  }
  if (filters.from) {
    nyTimesParams.fromDate = filters.from;
  }
  if (filters.to) {
    nyTimesParams.toDate = filters.to;
  }
  return nyTimesParams;
};

/**
 * Parse ContentParams to NY Times API query string
 */
export const parseToNyTimesParams = (params: ContentParams): string => {
  const queryParams = new URLSearchParams();

  if (params.query) {
    queryParams.append("q", params.query);
  }

  // Handle date filtering - begin_date is 1 day before, end_date is the same
  if (params.fromDate) {
    const date = new Date(params.fromDate);
    // Create begin_date (1 day before as end date can not be the same as begin date for NY Times API)
    const beginDate = new Date(date);
    beginDate.setDate(date.getDate() - 1);

    queryParams.append("begin_date", formatDateToNyTimes(beginDate));
    queryParams.append("end_date", formatNyTimesDate(params.fromDate));
  }

  // Handle multiple categories with OR logic
  if (params.category) {
    const categories = params.category.split(",").map((cat) => cat.trim());
    if (categories.length === 1) {
      queryParams.append("fq", `section.name:"${categories[0]}"`);
    } else {
      // Multiple categories: section.name:("Category1" OR "Category2" OR "Category3")
      const categoryQuery = categories.map((cat) => `"${cat}"`).join(" OR ");
      queryParams.append("fq", `section.name:(${categoryQuery})`);
    }
  }

  if (params.sortBy) {
    queryParams.append("sort", params.sortBy);
  }

  if (params.page) {
    queryParams.append("page", params.page.toString());
  }

  if (params.pageSize) {
    queryParams.append("page_size", params.pageSize.toString());
  }

  return queryParams.toString();
};
