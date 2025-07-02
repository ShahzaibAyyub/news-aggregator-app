import { useState, useEffect } from "react";
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

function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: "publishedAt",
  });
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

  // Effect to handle filter changes and trigger refetch
  useEffect(() => {
    if (hasSearched) {
      refetchSearch();
    }
  }, [filters, hasSearched, refetchSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const hasSearchCriteria =
      searchQuery.trim() || filters.category || filters.sources || filters.from;

    if (hasSearchCriteria) {
      setFilters((prev) => ({ ...prev, query: searchQuery.trim() }));
      setHasSearched(true);
    }
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    // Start with default filters
    const cleanedFilters: SearchFilters = { sortBy: "publishedAt" };

    const queryToUse = searchQuery.trim() || newFilters.query;
    if (isValidValue(queryToUse)) {
      cleanedFilters.query = queryToUse;
    }
    if (isValidValue(newFilters.category)) {
      cleanedFilters.category = newFilters.category;
    }
    if (isValidValue(newFilters.sources)) {
      cleanedFilters.sources = newFilters.sources;
    }
    if (isValidValue(newFilters.from)) {
      cleanedFilters.from = newFilters.from;
    }
    if (isValidValue(newFilters.to)) {
      cleanedFilters.to = newFilters.to;
    }

    // Handle sortBy separately since it has different validation (no empty string check needed)
    if (newFilters.sortBy !== undefined && newFilters.sortBy !== null) {
      cleanedFilters.sortBy = newFilters.sortBy;
    }

    setFilters(cleanedFilters);

    const hasNewSearchCriteria =
      searchQuery.trim() ||
      cleanedFilters.category ||
      cleanedFilters.sources ||
      cleanedFilters.from;

    if (hasNewSearchCriteria) {
      setHasSearched(true);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilters({ sortBy: "publishedAt" });
    setHasSearched(false);
  };

  const articles = searchResults?.articles || [];
  const totalResults = searchResults?.totalResults || 0;
  const availableCategories = categoriesData || [];
  const searchSources = searchResults?.sources || [];

  const hasSearchCriteria =
    searchQuery.trim() || filters.category || filters.sources || filters.from;

  // Only show searching state when query is enabled and actually running
  const isActuallySearching =
    isSearching &&
    hasSearched &&
    (!!filters.query ||
      !!filters.category ||
      !!filters.sources ||
      !!filters.from);

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
          availableCategories={availableCategories}
          currentFilters={filters}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          onSearch={handleSearch}
          isSearching={isActuallySearching}
          hasSearchCriteria={!!hasSearchCriteria}
          hasSearched={hasSearched}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        <div className="max-w-7xl mx-auto">
          {hasSearched && isActuallySearching && <LoadingSpinner />}

          {hasSearched && searchError && (
            <ErrorMessage
              message="Failed to search articles. Please try again with different search terms."
              onRetry={() => refetchSearch()}
            />
          )}

          {hasSearched &&
            !isActuallySearching &&
            !searchError &&
            articles.length > 0 && (
              <>
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-600">
                      {totalResults > 0 ? (
                        <>
                          Found{" "}
                          <span className="font-semibold">
                            {totalResults.toLocaleString()}
                          </span>{" "}
                          articles
                          {filters.query && (
                            <>
                              {" "}
                              for "
                              <span className="font-semibold">
                                {filters.query}
                              </span>
                              "
                            </>
                          )}
                          {searchSources.length > 0 && (
                            <>
                              {" "}
                              from{" "}
                              <span className="font-semibold">
                                {searchSources.join(", ")}
                              </span>
                            </>
                          )}
                        </>
                      ) : (
                        "No articles found"
                      )}
                    </p>
                    {isFetching && (
                      <div className="text-sm text-gray-500">
                        Updating results...
                      </div>
                    )}
                  </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {articles.map((article, index) => (
                    <ArticleCard
                      key={`${article.url}-${index}`}
                      article={article}
                    />
                  ))}
                </div>
              </>
            )}

          {hasSearched &&
            !isActuallySearching &&
            !searchError &&
            articles.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find more
                  results.
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
