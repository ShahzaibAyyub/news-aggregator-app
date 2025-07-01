import { formatDate } from "../shared/utils";
import type { NewsArticle } from "../services/newsApi";

interface SidebarArticleCardProps {
  article: NewsArticle;
}

const SidebarArticleCard = ({ article }: SidebarArticleCardProps) => {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-b-0">
      <div className="flex gap-3">
        {article.urlToImage && (
          <div className="flex-shrink-0">
            <img
              src={article.urlToImage}
              alt={article.title}
              className="w-16 h-16 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 hover:text-red-600 cursor-pointer transition-colors"
            onClick={() => window.open(article.url, "_blank")}
          >
            {article.title}
          </h3>

          {article.author && (
            <p className="text-xs text-gray-600 mb-1">By {article.author}</p>
          )}

          <p className="text-xs text-gray-500">
            {formatDate(article.publishedAt)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SidebarArticleCard;
