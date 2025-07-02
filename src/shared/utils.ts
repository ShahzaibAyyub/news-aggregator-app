import type { NyTimesMostPopularResponse } from "../middleware/interfaces/nyTimesInterfaces";

import type { NyTimesResponse } from "../middleware/interfaces/nyTimesInterfaces";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const formatNyTimesDate = (dateString: string): string => {
  // Remove dashes and ensure proper format
  return dateString.replace(/-/g, "");
};

export const formatDateToNyTimes = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
};

// Helper function to check if response is Most Popular API response
export const isMostPopularResponse = (
  response: NyTimesResponse
): response is NyTimesMostPopularResponse => {
  return "results" in response && "num_results" in response;
};

export const isValidValue = (value: any): boolean => {
  return value !== undefined && value !== null && value !== "";
};

// Personalized Feed Preferences
export interface PersonalizedFeedPreferences {
  categories?: string;
  sources?: string;
}

const PERSONALIZED_FEED_KEY = "personalizedFeedPreferences";

export const getPersonalizedFeedPreferences =
  (): PersonalizedFeedPreferences | null => {
    try {
      const stored = localStorage.getItem(PERSONALIZED_FEED_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error("Error reading personalized feed preferences:", error);
      return null;
    }
  };

export const setPersonalizedFeedPreferences = (
  preferences: PersonalizedFeedPreferences
): void => {
  try {
    localStorage.setItem(PERSONALIZED_FEED_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error("Error saving personalized feed preferences:", error);
  }
};

export const clearPersonalizedFeedPreferences = (): void => {
  try {
    localStorage.removeItem(PERSONALIZED_FEED_KEY);
  } catch (error) {
    console.error("Error clearing personalized feed preferences:", error);
  }
};

export const hasPersonalizedFeedPreferences = (): boolean => {
  const preferences = getPersonalizedFeedPreferences();
  return !!(preferences?.categories || preferences?.sources);
};
