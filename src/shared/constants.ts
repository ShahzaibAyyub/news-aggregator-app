import type { EnhancedSource } from "../middleware/interfaces/aggregatorInterfaces";
import { SourceType } from "./enums";
import type { NavTabProps } from "./interfaces";

// Get available sources (hardcoded to NewsAPI and Guardian only)
export const getAllAvailableSources = (): EnhancedSource[] => {
  return [
    {
      id: SourceType.NEWSAPI,
      name: "NewsAPI",
      type: SourceType.NEWSAPI,
    },
    {
      id: "the-guardian",
      name: "The Guardian",
      type: SourceType.GUARDIAN,
    },
  ];
};

export const navTabs: NavTabProps[] = [
  { path: "/", label: "Featured News" },
  { path: "/search", label: "Search Articles" },
];

export const NEWSAPI_BASE_URL = "https://newsapi.org/v2";
export const GUARDIAN_BASE_URL = "https://content.guardianapis.com";

export const STALE_TIME = 5 * 60 * 1000; // 5 minutes
export const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes
export const PAGE_SIZE = 20;
