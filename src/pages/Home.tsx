import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import {
  fetchAllTopStories,
  searchAllSources,
} from "../middleware/aggregatedNewsService";
import ArticleCard from "../components/ArticleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SidebarArticleCard from "../components/SidebarArticleCard";
import PersonalizedFeedSettings from "../components/PersonalizedFeedSettings";
import { STALE_TIME, REFRESH_INTERVAL } from "../shared/constants";
import {
  hasPersonalizedFeedPreferences,
  getPersonalizedFeedPreferences,
} from "../shared/utils";
import { HiCog, HiUser } from "react-icons/hi";
import type { SearchFilters } from "../middleware/interfaces/newsApiInterfaces";

function Home() {
  const [showPersonalized, setShowPersonalized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [personalizedFilters, setPersonalizedFilters] =
    useState<SearchFilters | null>(null);

  // Check if user has personalized preferences
  const hasPreferences = hasPersonalizedFeedPreferences();

  // Load personalized preferences on mount
  useEffect(() => {
    if (hasPreferences) {
      const preferences = getPersonalizedFeedPreferences();
      if (preferences) {
        const filters: SearchFilters = {
          sortBy: "publishedAt",
        };
        if (preferences.categories) {
          filters.category = preferences.categories;
        }
        if (preferences.sources) {
          filters.sources = preferences.sources;
        }
        setPersonalizedFilters(filters);
      }
    }
  }, [hasPreferences]);

  // Fetch regular top stories
  const {
    data: newsData,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["all-top-stories"],
    queryFn: fetchAllTopStories,
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled: !showPersonalized,
  });

  // Fetch personalized feed
  const {
    data: personalizedData,
    isPending: isPersonalizedPending,
    error: personalizedError,
    refetch: refetchPersonalized,
  } = useQuery({
    queryKey: ["personalized-feed", JSON.stringify(personalizedFilters)],
    queryFn: () =>
      personalizedFilters
        ? searchAllSources(personalizedFilters)
        : Promise.resolve(null),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled: showPersonalized && !!personalizedFilters,
  });

  // Determine which data to use
  const currentData = showPersonalized ? personalizedData : newsData;
  const currentIsPending = showPersonalized ? isPersonalizedPending : isPending;
  const currentError = showPersonalized ? personalizedError : error;
  const currentRefetch = showPersonalized ? refetchPersonalized : refetch;

  const handleToggleFeed = () => {
    if (hasPreferences) {
      setShowPersonalized(!showPersonalized);
    } else {
      setShowSettings(true);
    }
  };

  const handleSettingsSave = () => {
    // Reload preferences
    const preferences = getPersonalizedFeedPreferences();
    if (preferences) {
      const filters: SearchFilters = {
        sortBy: "publishedAt",
      };

      if (preferences.categories) {
        filters.category = preferences.categories;
      }

      if (preferences.sources) {
        filters.sources = preferences.sources;
      }

      setPersonalizedFilters(filters);
      setShowPersonalized(true);
    }
  };

  const handleSettingsClear = () => {
    // Clear personalized filters and switch to normal feed
    setPersonalizedFilters(null);
    setShowPersonalized(false);
  };

  if (currentIsPending) return <LoadingSpinner />;

  if (currentError) {
    return (
      <ErrorMessage
        message="Failed to load news articles. Please check your connection and try again."
        onRetry={() => currentRefetch()}
      />
    );
  }

  const articles = currentData?.articles || [];
  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);
  const availableSources = currentData?.sources || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {/* Header with Personalized Feed Toggle */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {showPersonalized ? "Your Personalized Feed" : "Featured News"}
            </h1>
            {showPersonalized && (
              <p className="text-gray-600 mt-2">
                Showing articles based on your preferences
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            {hasPreferences && (
              <button
                onClick={handleToggleFeed}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showPersonalized
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                <HiUser className="h-5 w-5" />
                <span>
                  {showPersonalized ? "Show All News" : "Personalized Feed"}
                </span>
              </button>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <HiCog className="h-5 w-5" />
              <span>
                {hasPreferences ? "Edit Preferences" : "Set Preferences"}
              </span>
            </button>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No articles available
            </h2>
            <p className="text-gray-600 mb-4">
              {showPersonalized
                ? "No articles found matching your preferences. Try adjusting your settings or switch to the general feed."
                : "Check back later for the latest news updates."}
            </p>
            {showPersonalized && (
              <button
                onClick={() => setShowSettings(true)}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Adjust Preferences
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-red-600 pb-2">
                  Featured Story
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <ArticleCard article={featuredArticle} featured={true} />
                  </div>
                  <div className="space-y-6">
                    {regularArticles.slice(0, 3).map((article) => (
                      <SidebarArticleCard key={article.url} article={article} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Articles Grid */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-red-600 pb-2">
                Latest News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {regularArticles.slice(3).map((article) => (
                  <ArticleCard key={article.url} article={article} />
                ))}
              </div>
            </section>

            {/* Stats */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Showing {articles.length} articles from{" "}
                {availableSources.join(", ")}
              </p>
            </div>
          </>
        )}
      </main>

      {/* Personalized Feed Settings Modal */}
      <PersonalizedFeedSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSettingsSave}
        onClear={handleSettingsClear}
      />
    </div>
  );
}

export default Home;
