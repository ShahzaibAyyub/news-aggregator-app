import type { NewsArticle } from "../middleware/interfaces/newsApiInterfaces";
import { formatDate, truncateText } from "../shared/utils";

interface ArticleCardProps {
  article: NewsArticle;
  featured?: boolean;
}

const ArticleCard = ({ article, featured = false }: ArticleCardProps) => {
  return (
    <article
      className={`
        bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer
        ${featured ? "md:col-span-2 lg:col-span-2" : ""}
      `}
      onClick={() => window.open(article.url, "_blank")}
    >
      {article.urlToImage && (
        <div
          className={`relative ${featured ? "h-64" : "h-48"} overflow-hidden`}
        >
          <img
            src={article.urlToImage}
            alt={article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
            {article.source.name}
          </div>
        </div>
      )}

      <div className={`p-4 ${featured ? "p-6" : ""}`}>
        <h2
          className={`font-bold text-gray-900 mb-2 line-clamp-2 hover:text-red-600 transition-colors ${
            featured ? "text-xl md:text-2xl" : "text-lg"
          }`}
        >
          {article.title}
        </h2>

        {article.description && (
          <p
            className={`text-gray-600 mb-3 line-clamp-3 ${
              featured ? "text-base" : "text-sm"
            }`}
          >
            {featured
              ? truncateText(article.description, 200)
              : truncateText(article.description, 120)}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span className="font-medium">
            {article.author || "Unknown Author"}
          </span>
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
