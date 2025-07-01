import axios from "axios";
import { GUARDIAN_BASE_URL } from "../shared/constants";
import {
  parseToGuardianParams,
  parseToTopStoriesGuardianParams,
} from "../middleware/mappers/guardianMapper";
import type {
  GuardianContentResponse,
  ContentParams,
  GuardianSectionResponse,
} from "../middleware/interfaces/gaurdianInterfaces";
const GUARDIAN_API_KEY = import.meta.env.VITE_GAURDIAN_KEY;

// Create axios instance for Guardian API
const guardianApi = axios.create({
  baseURL: GUARDIAN_BASE_URL,
  params: {
    "api-key": GUARDIAN_API_KEY,
  },
});

// sections (categories)
export const fetchGuardianSections =
  async (): Promise<GuardianSectionResponse> => {
    const response = await guardianApi.get<{
      response: GuardianSectionResponse;
    }>("/sections");
    return response.data.response;
  };

// list via search
export const fetchGuardianContent = async (
  params: ContentParams
): Promise<GuardianContentResponse> => {
  const queryString = parseToGuardianParams(params);
  const url = queryString ? `/search?${queryString}` : "/search";
  const response = await guardianApi.get<{ response: GuardianContentResponse }>(
    url
  );
  return response.data.response;
};

// top stories via search
export const fetchGuardianTopStories =
  async (): Promise<GuardianContentResponse> => {
    const queryString = parseToTopStoriesGuardianParams();
    const url = `/search?${queryString}`;
    const response = await guardianApi.get<{
      response: GuardianContentResponse;
    }>(url);
    return response.data.response;
  };
