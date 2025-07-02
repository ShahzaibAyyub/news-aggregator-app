import type { SearchFilters } from "../interfaces/newsApiInterfaces";
import type { ContentParams } from "../interfaces/gaurdianInterfaces";
import { PAGE_SIZE } from "../../shared/constants";

/**
 * Convert extended search filters to Guardian-specific parameters
 */
export const convertToGuardianParams = (
  filters: SearchFilters
): ContentParams => {
  const guardianParams: ContentParams = {
    pageSize: PAGE_SIZE,
    showFields: "headline,trailText,byline,thumbnail",
    showTags: "contributor",
  };

  if (filters.query) {
    guardianParams.query = filters.query;
  }
  if (filters.category) {
    guardianParams.section = filters.category;
  }
  if (filters.from) {
    guardianParams.fromDate = filters.from;
  }
  if (filters.to) {
    guardianParams.toDate = filters.to;
  }
  guardianParams.orderBy = "newest";

  return guardianParams;
};

/**
 * Get Guardian parameters for top stories
 */
export const getGuardianTopStoriesParams = (): ContentParams => {
  return {
    orderBy: "newest",
    pageSize: PAGE_SIZE,
    showFields: "headline,trailText,byline,thumbnail",
    showTags: "contributor",
  };
};
