import type {
  GuardianArticle,
  ContentParams,
} from "../interfaces/gaurdianInterfaces";
import type {
  UnifiedArticle,
  SourceInfo,
} from "../interfaces/aggregatorInterfaces";
import { SourceType } from "../../shared/enums";
import { PAGE_SIZE } from "../../shared/constants";

/**
 * Convert Guardian article to NewsAPI format
 */
export const convertGuardianToNewsApi = (
  guardianArticle: GuardianArticle
): UnifiedArticle => {
  const author =
    guardianArticle.tags?.find((tag) => tag.type === "contributor")?.webTitle ||
    guardianArticle.fields?.byline ||
    null;

  return {
    source: {
      id: "the-guardian",
      name: "The Guardian",
    },
    author,
    title: guardianArticle.fields?.headline || guardianArticle.webTitle,
    description: guardianArticle.fields?.trailText || null,
    url: guardianArticle.webUrl,
    urlToImage: guardianArticle.fields?.thumbnail || null,
    publishedAt: guardianArticle.webPublicationDate,
    content: guardianArticle.fields?.body || null,
    sourceInfo: {
      type: SourceType.GUARDIAN,
      originalData: guardianArticle,
    } as SourceInfo,
  };
};

/**
 * Convert multiple Guardian articles to unified format
 */
export const convertGuardianArticlesToUnified = (
  articles: GuardianArticle[]
): UnifiedArticle[] => {
  return articles.map(convertGuardianToNewsApi);
};

// Utility function to parse parameters for Guardian API
export const parseToGuardianParams = (params: ContentParams): string => {
  const searchParams = new URLSearchParams();

  if (params.query) searchParams.append("q", params.query);
  if (params.section) searchParams.append("section", params.section);
  if (params.fromDate) searchParams.append("from-date", params.fromDate);
  if (params.toDate) searchParams.append("to-date", params.toDate);
  if (params.orderBy) searchParams.append("order-by", params.orderBy);
  if (params.pageSize)
    searchParams.append("page-size", params.pageSize.toString());
  if (params.page) searchParams.append("page", params.page.toString());
  if (params.showFields) searchParams.append("show-fields", params.showFields);
  if (params.showTags) searchParams.append("show-tags", params.showTags);

  return searchParams.toString();
};

// Utility function for top stories parameters
export const parseToTopStoriesGuardianParams = (): string => {
  const searchParams = new URLSearchParams();
  searchParams.append("order-by", "newest");
  searchParams.append("page-size", PAGE_SIZE.toString());
  searchParams.append("show-fields", "headline,trailText,byline,thumbnail");
  searchParams.append("show-tags", "contributor");

  return searchParams.toString();
};
