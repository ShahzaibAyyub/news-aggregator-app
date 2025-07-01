import type { NewsArticle, SearchFilters } from "./newsApiInterfaces";
import type { GuardianArticle } from "./gaurdianInterfaces";
import type { SourceType } from "../../shared/enums";

export interface ExtendedSearchFilters extends SearchFilters {
  sourceType?: SourceType;
}

// Source information for articles
export interface SourceInfo {
  type: SourceType.NEWSAPI | SourceType.GUARDIAN;
  originalData: NewsArticle | GuardianArticle;
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
  type: SourceType.NEWSAPI | SourceType.GUARDIAN;
  category?: string;
  country?: string;
}
