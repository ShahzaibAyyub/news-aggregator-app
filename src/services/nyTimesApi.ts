import axios from "axios";
import { NYTIMES_BASE_URL } from "../shared/constants";
import type {
  NyTimesSearchResponse,
  NyTimesMostPopularResponse,
  ContentParams,
} from "../middleware/interfaces/nyTimesInterfaces";
import { parseToNyTimesParams } from "../middleware/filters/nyTimesFilters";

const NYTIMES_API_KEY = import.meta.env.VITE_NYTIMES_KEY;

const nyTimesApi = axios.create({
  baseURL: NYTIMES_BASE_URL,
  params: {
    "api-key": NYTIMES_API_KEY,
  },
});

// Enhanced search function with filtering support
export const searchNyTimesWithFilters = async (
  filters: ContentParams
): Promise<NyTimesSearchResponse> => {
  return await fetchNyTimesSearchContent(filters);
};

// list via search
export const fetchNyTimesSearchContent = async (
  params: ContentParams
): Promise<NyTimesSearchResponse> => {
  const queryString = parseToNyTimesParams(params);
  const url = `/svc/search/v2/articlesearch.json?${queryString}`;
  const response = await nyTimesApi.get<NyTimesSearchResponse>(url);
  return response.data;
};

// top stories - uses most popular API endpoint
export const fetchNyTimesTopStories =
  async (): Promise<NyTimesMostPopularResponse> => {
    const url = `/svc/mostpopular/v2/viewed/1.json`;
    const response = await nyTimesApi.get<NyTimesMostPopularResponse>(url);
    return response.data;
  };
