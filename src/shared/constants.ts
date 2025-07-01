import type { NavTabProps } from "./interfaces";

export const navTabs: NavTabProps[] = [
  { path: "/", label: "Featured News" },
  { path: "/search", label: "Search Articles" },
];

export const NEWSAPI_BASE_URL = "https://newsapi.org/v2";
