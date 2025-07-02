import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  searchAllSources,
  getGuardianSections,
} from "../middleware/aggregatedNewsService";
import ArticleCard from "../components/ArticleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SearchFiltersComponent from "../components/SearchFilters";
import {
  getAllAvailableSources,
  STALE_TIME,
  REFRESH_INTERVAL,
} from "../shared/constants";
import type { SearchFilters } from "../middleware/interfaces/newsApiInterfaces";
import { isValidValue } from "../shared/utils";

const DEFAULT_FILTERS: SearchFilters = { sortBy: "publishedAt" };

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Get hardcoded available sources
  const availableSources = getAllAvailableSources();

  // Fetch Guardian sections for categories
  const { data: categoriesData } = useQuery({
    queryKey: ["guardian-sections"],
    queryFn: getGuardianSections,
  });

  // Search articles with current filters
  const {
    data: searchResults,
    isPending: isSearching,
    error: searchError,
    refetch: refetchSearch,
    isFetching,
  } = useQuery({
    queryKey: ["search-all-sources", JSON.stringify(filters)],
    queryFn: () => searchAllSources(filters),
    enabled: hasSearched,
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
  });

  // Helper function to check if there are search criteria
  const checkHasSearchCriteria = useCallback(
    (query: string, currentFilters: SearchFilters) => {
      return (
        query.trim() ||
        currentFilters.category ||
        currentFilters.sources ||
        currentFilters.from
      );
    },
    []
  );

  // Memoized values
  const hasSearchCriteria = useMemo(
    () => checkHasSearchCriteria(searchQuery, filters),
    [searchQuery, filters, checkHasSearchCriteria]
  );

  const isActuallySearching = useMemo(
    () =>
      isSearching &&
      hasSearched &&
      (!!filters.query ||
        !!filters.category ||
        !!filters.sources ||
        !!filters.from),
    [
      isSearching,
      hasSearched,
      filters.query,
      filters.category,
      filters.sources,
      filters.from,
    ]
  );

  const searchData = useMemo(
    () => ({
      articles: searchResults?.articles || [],
      totalResults: searchResults?.totalResults || 0,
      availableCategories: categoriesData || [],
      searchSources: searchResults?.sources || [],
    }),
    [searchResults, categoriesData]
  );

  // Effect to handle filter changes and trigger refetch
  useEffect(() => {
    if (hasSearched) {
      refetchSearch();
    }
  }, [filters, hasSearched, refetchSearch]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (checkHasSearchCriteria(searchQuery, filters)) {
        setFilters((prev) => ({ ...prev, query: searchQuery.trim() }));
        setHasSearched(true);
      }
    },
    [searchQuery, filters, checkHasSearchCriteria]
  );

  const handleFiltersChange = useCallback(
    (newFilters: SearchFilters) => {
      // Start with default filters
      const cleanedFilters: SearchFilters = { ...DEFAULT_FILTERS };

      // Helper function to add valid values to cleanedFilters
      const addValidFilter = (key: keyof SearchFilters, value: any) => {
        if (isValidValue(value)) {
          cleanedFilters[key] = value;
        }
      };

      const queryToUse = searchQuery.trim() || newFilters.query;
      addValidFilter("query", queryToUse);
      addValidFilter("category", newFilters.category);
      addValidFilter("sources", newFilters.sources);
      addValidFilter("from", newFilters.from);
      addValidFilter("to", newFilters.to);

      // Handle sortBy separately since it has different validation
      if (newFilters.sortBy !== undefined && newFilters.sortBy !== null) {
        cleanedFilters.sortBy = newFilters.sortBy;
      }

      setFilters(cleanedFilters);

      if (checkHasSearchCriteria(searchQuery, cleanedFilters)) {
        setHasSearched(true);
      }
    },
    [searchQuery, checkHasSearchCriteria]
  );

  const clearAllFilters = useCallback(() => {
    setSearchQuery("");
    setFilters(DEFAULT_FILTERS);
    setHasSearched(false);
  }, []);

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  // Render helper for search results summary
  const renderSearchSummary = () => {
    if (searchData.totalResults === 0) return "No articles found";

    return (
      <>
        Found{" "}
        <span className="font-semibold">
          {searchData.totalResults.toLocaleString()}
        </span>{" "}
        articles
        {filters.query && (
          <>
            {" "}
            for "<span className="font-semibold">{filters.query}</span>"
          </>
        )}
        {searchData.searchSources.length > 0 && (
          <>
            {" "}
            from{" "}
            <span className="font-semibold">
              {searchData.searchSources.join(", ")}
            </span>
          </>
        )}
      </>
    );
  };

  // Common condition for showing results
  const showResults = hasSearched && !isActuallySearching && !searchError;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Search News
        </h1>

        <SearchFiltersComponent
          isVisible={showFilters}
          onFiltersChange={handleFiltersChange}
          onClearAll={clearAllFilters}
          availableSources={availableSources}
          availableCategories={searchData.availableCategories}
          currentFilters={filters}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          isSearching={isActuallySearching}
          hasSearchCriteria={!!hasSearchCriteria}
          hasSearched={hasSearched}
          onToggleFilters={toggleFilters}
        />

        <div className="max-w-7xl mx-auto">
          {hasSearched && isActuallySearching && <LoadingSpinner />}

          {hasSearched && searchError && (
            <ErrorMessage
              message="Failed to search articles. Please try again with different search terms."
              onRetry={refetchSearch}
            />
          )}

          {showResults && searchData.articles.length > 0 && (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">{renderSearchSummary()}</p>
                  {isFetching && (
                    <div className="text-sm text-gray-500">
                      Updating results...
                    </div>
                  )}
                </div>
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchData.articles.map((article, index) => (
                  <ArticleCard
                    key={`${article.url}-${index}`}
                    article={article}
                  />
                ))}
              </div>
            </>
          )}

          {showResults && searchData.articles.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find more results.
              </p>
              <button
                onClick={clearAllFilters}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
