import { useQuery } from "@tanstack/react-query";
import { fetchAllTopStories } from "../middleware/aggregatedNewsService";
import ArticleCard from "../components/ArticleCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import SidebarArticleCard from "../components/SidebarArticleCard";
import { STALE_TIME, REFRESH_INTERVAL } from "../shared/constants";
function Home() {
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
  });

  if (isPending) return <LoadingSpinner />;

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load news articles. Please check your connection and try again."
        onRetry={() => refetch()}
      />
    );
  }

  console.log(newsData);
  const articles = newsData?.articles || [];
  const featuredArticle = articles[0];
  const regularArticles = articles.slice(1);
  const availableSources = newsData?.sources || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              No articles available
            </h2>
            <p className="text-gray-600">
              Check back later for the latest news updates.
            </p>
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
    </div>
  );
}

export default Home;
