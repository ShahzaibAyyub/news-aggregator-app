import { SourceType } from "../shared/enums";
import type { NewsResponse } from "../middleware/interfaces/newsApiInterfaces";
import {
  searchArticlesWithFilters,
  fetchTopStories,
} from "../services/newsApi";
import type { GuardianContentResponse } from "../middleware/interfaces/gaurdianInterfaces";
import {
  fetchGuardianContent,
  fetchGuardianTopStories,
  fetchGuardianSections,
} from "../services/guardianApi";
import { convertNewsApiArticlesToUnified } from "./mappers/newsApiMapper";
import { convertGuardianArticlesToUnified } from "./mappers/guardianMapper";
import {
  convertToNewsApiFilters,
  shouldIncludeNewsApi,
  shouldExcludeNewsApiForCategory,
} from "./filters/newsApiFilters";
import {
  convertToGuardianParams,
  shouldIncludeGuardian,
  determineSourceType,
} from "./filters/guardianFilters";
import type {
  UnifiedNewsResponse,
  UnifiedArticle,
  ExtendedSearchFilters,
} from "./interfaces/aggregatorInterfaces";

// Fetch articles from both sources for home page
export const fetchAllTopStories = async (): Promise<UnifiedNewsResponse> => {
  try {
    const [newsApiResponse, guardianResponse] = await Promise.allSettled([
      fetchTopStories(),
      fetchGuardianTopStories(),
    ]);

    const articles: UnifiedArticle[] = [];
    const sources: string[] = [];

    // Process NewsAPI results
    if (newsApiResponse.status === "fulfilled") {
      const unifiedNewsApiArticles = convertNewsApiArticlesToUnified(
        newsApiResponse.value.articles
      );
      articles.push(...unifiedNewsApiArticles);
      sources.push("NewsAPI");
    }

    // Process Guardian results
    if (guardianResponse.status === "fulfilled") {
      const unifiedGuardianArticles = convertGuardianArticlesToUnified(
        guardianResponse.value.results
      );
      articles.push(...unifiedGuardianArticles);
      sources.push("The Guardian");
    }

    // Sort by publication date (newest first)
    articles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return {
      status: "ok",
      totalResults: articles.length,
      articles,
      sources,
    };
  } catch (error) {
    console.error("Error fetching top stories:", error);
    throw error;
  }
};

// Search articles from both sources
export const searchAllSources = async (
  filters: ExtendedSearchFilters
): Promise<UnifiedNewsResponse> => {
  try {
    const promises: Promise<any>[] = [];

    // Determine which sources to search based on selected sources
    let effectiveSourceType = filters.sourceType || SourceType.BOTH;

    // If specific sources are selected, determine the source type from them
    if (filters.sources) {
      const selectedSourceIds = filters.sources.split(",");
      effectiveSourceType = determineSourceType(selectedSourceIds);
    }

    // Check which sources should be included
    const shouldSearchNewsApi = shouldIncludeNewsApi({
      ...filters,
      sourceType: effectiveSourceType,
    });
    const shouldSearchGuardian = shouldIncludeGuardian({
      ...filters,
      sourceType: effectiveSourceType,
    });

    if (shouldSearchNewsApi) {
      const newsApiFilters = convertToNewsApiFilters(filters);
      promises.push(searchArticlesWithFilters(newsApiFilters));
    }

    if (shouldSearchGuardian) {
      const guardianParams = convertToGuardianParams(filters);
      promises.push(fetchGuardianContent(guardianParams));
    }

    const results = await Promise.allSettled(promises);
    const articles: UnifiedArticle[] = [];
    const sources: string[] = [];
    let totalResults = 0;

    let resultIndex = 0;

    // Process NewsAPI results - but exclude them if category is selected because NewsAPI doesn't support categories
    if (
      shouldSearchNewsApi &&
      results[resultIndex] &&
      results[resultIndex].status === "fulfilled"
    ) {
      const newsApiResponse = (
        results[resultIndex] as PromiseFulfilledResult<NewsResponse>
      ).value;

      // Only include NewsAPI results if no category is selected (NewsAPI doesn't support categories)
      if (!shouldExcludeNewsApiForCategory(filters)) {
        const unifiedNewsApiArticles = convertNewsApiArticlesToUnified(
          newsApiResponse.articles
        );
        articles.push(...unifiedNewsApiArticles);
        totalResults += newsApiResponse.totalResults;
        sources.push("NewsAPI");
      }
      resultIndex++;
    } else if (shouldSearchNewsApi) {
      resultIndex++;
    }

    if (
      shouldSearchGuardian &&
      results[resultIndex] &&
      results[resultIndex].status === "fulfilled"
    ) {
      const guardianResponse = (
        results[resultIndex] as PromiseFulfilledResult<GuardianContentResponse>
      ).value;
      const unifiedGuardianArticles = convertGuardianArticlesToUnified(
        guardianResponse.results
      );
      articles.push(...unifiedGuardianArticles);
      totalResults += guardianResponse.total;
      sources.push("The Guardian");
    }

    // Sort by publication date (newest first)
    articles.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // Remove duplicates based on title similarity
    const uniqueArticles = articles.filter(
      (article, index, self) =>
        index ===
        self.findIndex(
          (a) =>
            a.title.toLowerCase().trim() === article.title.toLowerCase().trim()
        )
    );

    return {
      status: "ok",
      totalResults,
      articles: uniqueArticles,
      sources,
    };
  } catch (error) {
    console.error("Error searching all sources:", error);
    throw error;
  }
};

// Get Guardian sections for categories
export const getGuardianSections = async () => {
  try {
    const sectionsResponse = await fetchGuardianSections();
    return sectionsResponse.results;
  } catch (error) {
    console.error("Error fetching Guardian sections:", error);
    return [];
  }
};
