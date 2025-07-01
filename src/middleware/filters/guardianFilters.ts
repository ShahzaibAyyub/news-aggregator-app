import type { ExtendedSearchFilters } from "../interfaces/aggregatorInterfaces";
import { SourceType } from "../../shared/enums";
import type { ContentParams } from "../interfaces/gaurdianInterfaces";
import { PAGE_SIZE } from "../../shared/constants";

/**
 * Convert extended search filters to Guardian-specific parameters
 */
export const convertToGuardianParams = (
  filters: ExtendedSearchFilters
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

/**
 * Check if Guardian should be included based on filters
 */
export const shouldIncludeGuardian = (
  filters: ExtendedSearchFilters
): boolean => {
  const sourceType = filters.sourceType;

  if (sourceType === SourceType.NEWSAPI) {
    return false;
  }

  if (
    sourceType === SourceType.GUARDIAN ||
    sourceType === SourceType.BOTH ||
    !sourceType
  ) {
    return true;
  }

  // Check if Guardian is specifically selected
  if (filters.sources) {
    const selectedSources = filters.sources.split(",");
    return selectedSources.includes("the-guardian");
  }

  return true;
};

/**
 * Helper function to determine source type based on selected sources
 */
export const determineSourceType = (selectedSources: string[]): SourceType => {
  if (!selectedSources || selectedSources.length === 0) {
    return SourceType.BOTH;
  }

  const hasNewsApi = selectedSources.some(
    (sourceId) => sourceId !== "the-guardian"
  );
  const hasGuardian = selectedSources.includes("the-guardian");

  if (hasNewsApi && hasGuardian) {
    return SourceType.BOTH;
  } else if (hasGuardian) {
    return SourceType.GUARDIAN;
  } else {
    return SourceType.NEWSAPI;
  }
};
