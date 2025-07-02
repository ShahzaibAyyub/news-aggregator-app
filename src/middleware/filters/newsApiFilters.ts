import type { SearchFilters } from "../interfaces/newsApiInterfaces";

/**
 * Convert extended search filters to NewsAPI-specific filters
 */
export const convertToNewsApiFilters = (
  filters: SearchFilters
): SearchFilters => {
  const newsApiFilters: SearchFilters = {};

  if (filters.query) {
    newsApiFilters.query = filters.query;
  }
  if (filters.from) {
    newsApiFilters.from = filters.from;
  }
  if (filters.to) {
    newsApiFilters.to = filters.to;
  }
  if (filters.sortBy) {
    newsApiFilters.sortBy = filters.sortBy;
  }
  return newsApiFilters;
};
