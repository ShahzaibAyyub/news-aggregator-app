import type { SearchFilters } from "../interfaces/newsApiInterfaces";
import type { ExtendedSearchFilters } from "../interfaces/aggregatorInterfaces";
import { SourceType } from "../../shared/enums";

/**
 * Convert extended search filters to NewsAPI-specific filters
 */
export const convertToNewsApiFilters = (
  filters: ExtendedSearchFilters
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

/**
 * Check if NewsAPI should be included based on filters
 */
export const shouldIncludeNewsApi = (
  filters: ExtendedSearchFilters
): boolean => {
  const sourceType = filters.sourceType;

  if (sourceType === SourceType.GUARDIAN) {
    return false;
  }

  if (
    sourceType === SourceType.NEWSAPI ||
    sourceType === SourceType.BOTH ||
    !sourceType
  ) {
    return true;
  }

  // Check if specific sources are selected
  if (filters.sources) {
    const selectedSources = filters.sources.split(",");
    return selectedSources.some((source) => source !== "the-guardian");
  }

  return true;
};

/**
 * Check if category filtering should exclude NewsAPI results
 * NewsAPI doesn't support categories in the everything endpoint
 */
export const shouldExcludeNewsApiForCategory = (
  filters: ExtendedSearchFilters
): boolean => {
  return !!(filters.category && filters.query);
};
