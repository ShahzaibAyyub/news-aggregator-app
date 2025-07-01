// Guardian API Types
export interface GuardianSection {
  id: string;
  webTitle: string;
  apiUrl: string;
  editions: Array<{
    id: string;
    webTitle: string;
    apiUrl: string;
  }>;
}

export interface GuardianSectionResponse {
  status: string;
  userTier: string;
  total: number;
  results: GuardianSection[];
}

export interface GuardianArticle {
  id: string;
  type: string;
  sectionId: string;
  sectionName: string;
  webPublicationDate: string;
  webTitle: string;
  webUrl: string;
  apiUrl: string;
  fields?: {
    headline?: string;
    trailText?: string;
    byline?: string;
    thumbnail?: string;
    body?: string;
  };
  tags?: Array<{
    id: string;
    type: string;
    webTitle: string;
    firstName?: string;
    lastName?: string;
  }>;
}

export interface GuardianContentResponse {
  status: string;
  userTier: string;
  total: number;
  startIndex: number;
  pageSize: number;
  currentPage: number;
  pages: number;
  orderBy: string;
  results: GuardianArticle[];
}

export interface ContentParams {
  query?: string;
  section?: string;
  fromDate?: string;
  toDate?: string;
  orderBy?: "newest" | "oldest" | "relevance";
  pageSize?: number;
  page?: number;
  showFields?: string;
  showTags?: string;
}
