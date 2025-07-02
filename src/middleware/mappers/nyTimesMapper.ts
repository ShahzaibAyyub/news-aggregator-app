import type {
  NyTimesArticle,
  NyTimesMostPopularArticle,
} from "../interfaces/nyTimesInterfaces";
import type {
  UnifiedArticle,
  SourceInfo,
} from "../interfaces/aggregatorInterfaces";
import { SourceType, SourceName } from "../../shared/enums";

export const convertNyTimesArticlesToUnified = (
  articles: NyTimesArticle[] | null
): UnifiedArticle[] => {
  if (articles === null) {
    return [];
  }
  return articles.map(convertNyTimesToUnified);
};

export const convertNyTimesToUnified = (
  nyTimesArticle: NyTimesArticle
): UnifiedArticle => {
  // Get the best available image
  const imageUrl = getBestImage(nyTimesArticle.multimedia);
  // Get author from byline
  const author = getAuthorFromByline(nyTimesArticle.byline);

  return {
    source: {
      id: SourceType.NYTIMES,
      name: SourceName.NYTIMES,
    },
    author,
    title: nyTimesArticle.headline.main,
    description: nyTimesArticle.abstract || nyTimesArticle.snippet,
    url: nyTimesArticle.web_url,
    urlToImage: imageUrl,
    publishedAt: nyTimesArticle.pub_date,
    content: nyTimesArticle.lead_paragraph || nyTimesArticle.abstract || null,
    sourceInfo: {
      type: SourceType.NYTIMES,
      originalData: nyTimesArticle,
    } as SourceInfo,
  };
};

export const convertNyTimesMostPopularToUnified = (
  articles: NyTimesMostPopularArticle[]
): UnifiedArticle[] => {
  return articles.map(convertNyTimesMostPopularArticleToUnified);
};

/**
 * Convert NY Times Most Popular article to unified format
 */
export const convertNyTimesMostPopularArticleToUnified = (
  article: NyTimesMostPopularArticle
): UnifiedArticle => {
  // Get the best available image from media array
  const imageUrl = getBestImageFromMedia(article.media);
  // Parse author from byline string
  const author = parseAuthorFromBylineString(article.byline);

  return {
    source: {
      id: SourceType.NYTIMES,
      name: SourceName.NYTIMES,
    },
    author,
    title: article.title,
    description: article.abstract,
    url: article.url,
    urlToImage: imageUrl,
    publishedAt: article.published_date,
    content: article.abstract, // Most Popular API doesn't have lead_paragraph
    sourceInfo: {
      type: SourceType.NYTIMES,
      originalData: article,
    } as SourceInfo,
  };
};

/**
 * Extract the best available image from multimedia object (Search API)
 */
const getBestImage = (multimedia: any): string | null => {
  if (!multimedia) {
    return null;
  }
  // Try to get the default image first
  if (multimedia.default && multimedia.default.url) {
    return multimedia.default.url;
  }
  // Fall back to thumbnail if default is not available
  if (multimedia.thumbnail && multimedia.thumbnail.url) {
    return multimedia.thumbnail.url;
  }
  return null;
};

/**
 * Extract the best available image from media array (Most Popular API)
 */
const getBestImageFromMedia = (media: any[]): string | null => {
  if (!media || media.length === 0) {
    return null;
  }

  // Find the first image media item
  const imageMedia = media.find((item) => item.type === "image");
  if (!imageMedia || !imageMedia["media-metadata"]) {
    return null;
  }
  // Prefer larger images - look for specific formats in order of preference
  const preferredFormats = [
    "mediumThreeByTwo440",
    "mediumThreeByTwo210",
    "Standard Thumbnail",
  ];
  for (const format of preferredFormats) {
    const metadata = imageMedia["media-metadata"].find(
      (meta: any) => meta.format === format
    );
    if (metadata) {
      return metadata.url;
    }
  }
  // If no preferred format found, use the first available
  if (imageMedia["media-metadata"].length > 0) {
    return imageMedia["media-metadata"][0].url;
  }

  return null;
};

/**
 * Extract author information from byline (Search API)
 */
const getAuthorFromByline = (byline: any): string | null => {
  if (!byline) {
    return null;
  }

  if (typeof byline === "string") {
    return byline;
  }

  if (byline.original) {
    return byline.original;
  }

  if (byline.person && byline.person.length > 0) {
    const person = byline.person[0];
    return `${person.firstname || ""} ${person.lastname || ""}`.trim();
  }

  return null;
};

/**
 * Parse author from byline string (Most Popular API)
 */
const parseAuthorFromBylineString = (byline: string): string | null => {
  if (!byline) {
    return null;
  }

  // Remove "By " prefix if present
  return byline.replace(/^By\s+/i, "").trim() || null;
};
