import type { NewsArticle } from "../interfaces/newsApiInterfaces";
import type {
  UnifiedArticle,
  SourceInfo,
} from "../interfaces/aggregatorInterfaces";
import { SourceType } from "../../shared/enums";

/**
 * Convert multiple NewsAPI articles to unified format
 */
export const convertNewsApiArticlesToUnified = (
  articles: NewsArticle[]
): UnifiedArticle[] => {
  return articles.map(convertNewsApiToUnified);
};

export const convertNewsApiToUnified = (
  newsArticle: NewsArticle
): UnifiedArticle => {
  return {
    ...newsArticle,
    source: {
      id: SourceType.NEWSAPI,
      name: "NewsAPI",
    },
    sourceInfo: {
      type: SourceType.NEWSAPI,
      originalData: newsArticle,
    } as SourceInfo,
  };
};
