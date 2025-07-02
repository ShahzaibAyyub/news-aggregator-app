import { SourceType, SourceName } from "../shared/enums";
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
import type { NyTimesSearchResponse } from "../middleware/interfaces/nyTimesInterfaces";
import {
  fetchNyTimesTopStories,
  searchNyTimesWithFilters,
} from "../services/nyTimesApi";
import { convertNewsApiArticlesToUnified } from "./mappers/newsApiMapper";
import { convertGuardianArticlesToUnified } from "./mappers/guardianMapper";
import {
  convertNyTimesArticlesToUnified,
  convertNyTimesMostPopularToUnified,
} from "./mappers/nyTimesMapper";
import { convertToNewsApiFilters } from "./filters/newsApiFilters";
import { convertToGuardianParams } from "./filters/guardianFilters";
import { convertToNyTimesParams } from "./filters/nyTimesFilters";
import type {
  UnifiedNewsResponse,
  UnifiedArticle,
} from "./interfaces/aggregatorInterfaces";
import type { SearchFilters } from "./interfaces/newsApiInterfaces";
import { isMostPopularResponse } from "../shared/utils";

// Fetch articles from all sources for home page
export const fetchAllTopStories = async (): Promise<UnifiedNewsResponse> => {
  try {
    const [newsApiResponse, guardianResponse, nyTimesResponse] =
      await Promise.allSettled([
        fetchTopStories(),
        fetchGuardianTopStories(),
        fetchNyTimesTopStories(),
      ]);

    const articles: UnifiedArticle[] = [];
    const sources: string[] = [];

    // Process NewsAPI results
    if (newsApiResponse.status === "fulfilled") {
      const unifiedNewsApiArticles = convertNewsApiArticlesToUnified(
        newsApiResponse.value.articles
      );
      articles.push(...unifiedNewsApiArticles);
      sources.push(SourceName.NEWSAPI);
    }

    // Process Guardian results
    if (guardianResponse.status === "fulfilled") {
      const unifiedGuardianArticles = convertGuardianArticlesToUnified(
        guardianResponse.value.results
      );
      articles.push(...unifiedGuardianArticles);
      sources.push(SourceName.GUARDIAN);
    }

    // Process NY Times results
    if (nyTimesResponse.status === "fulfilled") {
      const response = nyTimesResponse.value;
      let unifiedNyTimesArticles: UnifiedArticle[];

      if (isMostPopularResponse(response)) {
        // Most Popular API response
        unifiedNyTimesArticles = convertNyTimesMostPopularToUnified(
          response.results
        );
      } else {
        // Search API response
        const searchResponse = response as NyTimesSearchResponse;
        unifiedNyTimesArticles = convertNyTimesArticlesToUnified(
          searchResponse.response.docs
        );
      }

      articles.push(...unifiedNyTimesArticles);
      sources.push(SourceName.NYTIMES);
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

// Search articles from all sources
export const searchAllSources = async (
  filters: SearchFilters
): Promise<UnifiedNewsResponse> => {
  try {
    const promises: Promise<any>[] = [];

    // Determine which sources to search
    let shouldSearchNewsApi = true;
    let shouldSearchGuardian = true;
    let shouldSearchNyTimes = true;

    // If specific sources are selected, only search those
    if (filters.sources) {
      const selectedSources = filters.sources.split(",");
      shouldSearchNewsApi = selectedSources.includes(SourceType.NEWSAPI);
      shouldSearchGuardian = selectedSources.includes(SourceType.GUARDIAN);
      shouldSearchNyTimes = selectedSources.includes(SourceType.NYTIMES);
    }

    // If categories are set, don't call NewsAPI as it doesn't have a category param
    if (filters.category) {
      shouldSearchNewsApi = false;
    }

    if (shouldSearchNewsApi) {
      const newsApiFilters = convertToNewsApiFilters(filters);
      promises.push(searchArticlesWithFilters(newsApiFilters));
    }

    if (shouldSearchGuardian) {
      const guardianParams = convertToGuardianParams(filters);
      promises.push(fetchGuardianContent(guardianParams));
    }

    if (shouldSearchNyTimes) {
      const nyTimesParams = convertToNyTimesParams(filters);
      promises.push(searchNyTimesWithFilters(nyTimesParams));
    }

    const results = await Promise.allSettled(promises);
    const articles: UnifiedArticle[] = [];
    const sources: string[] = [];
    let totalResults = 0;

    let resultIndex = 0;

    // Process NewsAPI results
    if (
      shouldSearchNewsApi &&
      results[resultIndex] &&
      results[resultIndex].status === "fulfilled"
    ) {
      const newsApiResponse = (
        results[resultIndex] as PromiseFulfilledResult<NewsResponse>
      ).value;
      const unifiedNewsApiArticles = convertNewsApiArticlesToUnified(
        newsApiResponse.articles
      );
      articles.push(...unifiedNewsApiArticles);
      totalResults += newsApiResponse.totalResults;
      sources.push(SourceName.NEWSAPI);
      resultIndex++;
    } else if (shouldSearchNewsApi) {
      resultIndex++;
    }

    // Process Guardian results
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
      sources.push(SourceName.GUARDIAN);
      resultIndex++;
    } else if (shouldSearchGuardian) {
      resultIndex++;
    }

    // Process NY Times results
    if (
      shouldSearchNyTimes &&
      results[resultIndex] &&
      results[resultIndex].status === "fulfilled"
    ) {
      const nyTimesResponse = (
        results[resultIndex] as PromiseFulfilledResult<NyTimesSearchResponse>
      ).value;
      const unifiedNyTimesArticles = convertNyTimesArticlesToUnified(
        nyTimesResponse.response.docs
      );
      articles.push(...unifiedNyTimesArticles);
      totalResults += nyTimesResponse.response.metadata.hits;
      sources.push(SourceName.NYTIMES);
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
