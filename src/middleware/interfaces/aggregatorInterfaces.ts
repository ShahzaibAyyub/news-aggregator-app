import type { NewsArticle } from "./newsApiInterfaces";
import type { GuardianArticle } from "./gaurdianInterfaces";
import type {
  NyTimesArticle,
  NyTimesMostPopularArticle,
} from "./nyTimesInterfaces";
import type { SourceType } from "../../shared/enums";

// Source information for articles
export interface SourceInfo {
  type: SourceType.NEWSAPI | SourceType.GUARDIAN | SourceType.NYTIMES;
  originalData:
    | NewsArticle
    | GuardianArticle
    | NyTimesArticle
    | NyTimesMostPopularArticle;
}

// Unified article interface that extends NewsArticle with source tracking
export interface UnifiedArticle extends NewsArticle {
  sourceInfo: SourceInfo;
}

// Unified response interface
export interface UnifiedNewsResponse {
  status: string;
  totalResults: number;
  articles: UnifiedArticle[];
  sources: string[];
}

// Enhanced source interface with type information
export interface EnhancedSource {
  id: string;
  name: string;
  type: SourceType.NEWSAPI | SourceType.GUARDIAN | SourceType.NYTIMES;
  category?: string;
  country?: string;
}
