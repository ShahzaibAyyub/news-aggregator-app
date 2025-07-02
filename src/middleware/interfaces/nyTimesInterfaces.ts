// NY Times API Types
export interface NyTimesMultimedia {
  caption: string;
  credit: string;
  default: {
    url: string;
    height: number;
    width: number;
  };
  thumbnail: {
    url: string;
    height: number;
    width: number;
  };
}

// Most Popular API Media structure
export interface NyTimesMostPopularMedia {
  type: string;
  subtype: string;
  caption: string;
  copyright: string;
  approved_for_syndication: number;
  "media-metadata": Array<{
    url: string;
    format: string;
    height: number;
    width: number;
  }>;
}

// Most Popular API Article structure
export interface NyTimesMostPopularArticle {
  uri: string;
  url: string;
  id: number;
  asset_id: number;
  source: string;
  published_date: string;
  updated: string;
  section: string;
  subsection: string;
  nytdsection: string;
  adx_keywords: string;
  column: string | null;
  byline: string;
  type: string;
  title: string;
  abstract: string;
  des_facet: string[];
  org_facet: string[];
  per_facet: string[];
  geo_facet: string[];
  media: NyTimesMostPopularMedia[];
  eta_id: number;
}

// Most Popular API Response structure
export interface NyTimesMostPopularResponse {
  status: string;
  copyright: string;
  num_results: number;
  results: NyTimesMostPopularArticle[];
}

export interface NyTimesKeyword {
  name: string;
  value: string;
  rank: number;
}

export interface NyTimesByline {
  original: string;
  person?: Array<{
    firstname: string;
    middlename: string;
    lastname: string;
    qualifier: string | null;
    title: string | null;
    role: string;
    organization: string;
    rank: number;
  }>;
  organization?: string | null;
}

export interface NyTimesHeadline {
  main: string;
  kicker: string | null;
  content_kicker?: string | null;
  print_headline: string | null;
  name?: string | null;
  seo?: string | null;
  sub?: string | null;
}

// Search API Article structure
export interface NyTimesArticle {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph?: string;
  source: string;
  multimedia: NyTimesMultimedia;
  headline: NyTimesHeadline;
  keywords: NyTimesKeyword[];
  pub_date: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  subsection_name?: string;
  byline: NyTimesByline;
  type_of_material: string;
  _id: string;
  word_count: number;
  uri: string;
  print_page?: string;
  print_section?: string;
}

// Search API Response structure
export interface NyTimesSearchResponse {
  status: string;
  copyright: string;
  response: {
    docs: NyTimesArticle[] | null;
    metadata: {
      hits: number;
      offset: number;
      time: number;
    };
  };
}

// Union type for both response types
export type NyTimesResponse =
  | NyTimesSearchResponse
  | NyTimesMostPopularResponse;

export interface ContentParams {
  query?: string;
  category?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: "newest" | "oldest" | "relevance";
  pageSize?: number;
  page?: number;
}
