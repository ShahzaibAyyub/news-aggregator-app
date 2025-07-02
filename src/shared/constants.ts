import type { EnhancedSource } from "../middleware/interfaces/aggregatorInterfaces";
import { SourceName, SourceType } from "./enums";
import type { NavTabProps } from "./interfaces";

// Get available sources (hardcoded to NewsAPI, Guardian, and NY Times)
export const getAllAvailableSources = (): EnhancedSource[] => {
  return [
    {
      id: SourceType.NEWSAPI,
      name: SourceName.NEWSAPI,
      type: SourceType.NEWSAPI,
    },
    {
      id: SourceType.GUARDIAN,
      name: SourceName.GUARDIAN,
      type: SourceType.GUARDIAN,
    },
    {
      id: SourceType.NYTIMES,
      name: SourceName.NYTIMES,
      type: SourceType.NYTIMES,
    },
  ];
};

export const navTabs: NavTabProps[] = [
  { path: "/", label: "Featured News" },
  { path: "/search", label: "Search Articles" },
];

export const NEWSAPI_BASE_URL = "https://newsapi.org/v2";
export const GUARDIAN_BASE_URL = "https://content.guardianapis.com";
export const NYTIMES_BASE_URL = "https://api.nytimes.com";

export const STALE_TIME = 5 * 60 * 1000; // 5 minutes
export const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const PAGE_SIZE = 20;
