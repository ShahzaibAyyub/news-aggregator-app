import axios from "axios";
import { NEWSAPI_BASE_URL } from "../shared/constants";

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

export interface SearchFilters {
  query?: string;
  category?: string;
  sources?: string;
  domains?: string;
  from?: string;
  to?: string;
  language?: string;
  sortBy?: "relevancy" | "popularity" | "publishedAt";
  country?: string;
}

const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY;

const newsApi = axios.create({
  baseURL: NEWSAPI_BASE_URL,
  params: {
    apiKey: NEWSAPI_KEY,
  },
});

export const fetchWSJArticles = async (): Promise<NewsResponse> => {
  const response = await newsApi.get("/everything", {
    params: {
      domains: "wsj.com",
    },
  });
  return response.data;
};

export const fetchArticlesByCategory = async (
  category: string
): Promise<NewsResponse> => {
  const response = await newsApi.get("/top-headlines", {
    params: {
      category,
      country: "us",
    },
  });
  return response.data;
};

export const searchArticles = async (query: string): Promise<NewsResponse> => {
  const response = await newsApi.get("/everything", {
    params: {
      q: query,
      sortBy: "publishedAt",
    },
  });
  return response.data;
};

// Enhanced search function with filtering support
export const searchArticlesWithFilters = async (
  filters: SearchFilters
): Promise<NewsResponse> => {
  const params: Record<string, any> = {};

  if (filters.query) {
    params.q = filters.query;
  }
  if (filters.sources) {
    params.sources = filters.sources;
  }
  if (filters.from) {
    params.from = filters.from;
  }
  if (filters.to) {
    params.to = filters.to;
  }
  params.sortBy = filters.sortBy || "publishedAt";

  let endpoint = "/everything";

  // If category is specified and no other filters, use top-headlines endpoint
  if (
    filters.category &&
    !filters.query &&
    !filters.sources &&
    !filters.domains
  ) {
    endpoint = "/top-headlines";
    params.category = filters.category;
    params.country = filters.country || "us";
  }

  const response = await newsApi.get(endpoint, { params });
  return response.data;
};

// Get available news sources
export const fetchNewsSources = async (): Promise<{
  status: string;
  sources: Array<{
    id: string;
    name: string;
    category: string;
    country: string;
  }>;
}> => {
  const response = await newsApi.get("/sources", {
    params: {
      language: "en",
    },
  });
  return response.data;
};
