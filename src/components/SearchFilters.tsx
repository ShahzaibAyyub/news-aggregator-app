import { useForm, Controller } from "react-hook-form";
import { HiFilter, HiSearch, HiCalendar } from "react-icons/hi";
import type { SearchFilters } from "../middleware/interfaces/newsApiInterfaces";
import type { EnhancedSource } from "../middleware/interfaces/aggregatorInterfaces";
import MultiSelectField from "./MultiSelectField";

interface SearchFiltersProps {
  isVisible: boolean;
  onFiltersChange: (filters: SearchFilters) => void;
  onClearAll: () => void;
  availableSources: EnhancedSource[];
  availableCategories: Array<{ id: string; webTitle: string }>;
  currentFilters: SearchFilters;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isSearching: boolean;
  hasSearchCriteria: boolean;
  hasSearched: boolean;
  onToggleFilters: () => void;
}

interface FormData {
  date?: string;
  categories?: Array<{ value: string; label: string }>;
  sources?: Array<{ value: string; label: string }>;
}

export default function SearchFilters({
  isVisible,
  onFiltersChange,
  onClearAll,
  availableSources,
  availableCategories,
  currentFilters,
  searchQuery,
  onSearchQueryChange,
  onSearch,
  isSearching,
  hasSearchCriteria,
  hasSearched,
  onToggleFilters,
}: SearchFiltersProps) {
  // Convert Guardian sections to category options
  const categories = availableCategories.map((section) => ({
    value: section.id,
    label: section.webTitle,
  }));

  const { control, reset, getValues } = useForm<FormData>({
    defaultValues: {
      date: currentFilters.from || "",
      categories: currentFilters.category
        ? currentFilters.category.split(",").map((categoryId) => {
            const category = categories.find(
              (c) => c.value === categoryId.trim()
            );
            return {
              value: categoryId.trim(),
              label: category?.label || categoryId.trim(),
            };
          })
        : [],
      sources: currentFilters.sources
        ? currentFilters.sources.split(",").map((sourceId) => {
            const source = availableSources.find((s) => s.id === sourceId);
            return { value: sourceId, label: source?.name || sourceId };
          })
        : [],
    },
  });

  const handleApplyFilters = () => {
    const data = getValues();
    const filters: SearchFilters = {
      sortBy: "publishedAt", // Default sort
      from: data.date || undefined,
      to: data.date || undefined, // Same date for both from and to
      category:
        data.categories && data.categories.length > 0
          ? data.categories.map((c) => c.value).join(",")
          : undefined,
      sources:
        data.sources && data.sources.length > 0
          ? data.sources.map((s) => s.value).join(",")
          : undefined,
    };

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof SearchFilters] === undefined) {
        delete filters[key as keyof SearchFilters];
      }
    });

    onFiltersChange(filters);
  };

  const handleClearAll = () => {
    reset({
      date: "",
      categories: [],
      sources: [],
    });
    onClearAll();
  };

  const sourceOptions = availableSources.slice(0, 50).map((source) => ({
    value: source.id,
    label: source.name,
  }));

  return (
    <div className="max-w-4xl mx-auto mb-8">
      {/* Search Form */}
      <form onSubmit={onSearch} className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Search for news articles..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !hasSearchCriteria}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? "Searching..." : "Search"}
          </button>
          <button
            type="button"
            onClick={onToggleFilters}
            className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            <HiFilter className="h-5 w-5" />
          </button>
        </div>
      </form>

      {/* Initial Help Section */}
      {!hasSearched && !isVisible && (
        <div className="text-center text-gray-500 mb-6">
          <p className="text-lg mb-6">
            Search for news articles by entering keywords, or use the filters to
            browse by category, source, and date
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <HiSearch className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 mb-2">Search</h3>
              <p className="text-sm text-gray-600">
                Find articles by keywords, topics, or specific terms
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <HiFilter className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 mb-2">Filter</h3>
              <p className="text-sm text-gray-600">
                Narrow results by category and source
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <HiCalendar className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-700 mb-2">Date</h3>
              <p className="text-sm text-gray-600">
                Find articles published on a specific date
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {isVisible && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Advanced Filters
            </h3>
            <button
              onClick={handleClearAll}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Category Filter - Now Multi-Select */}
              <MultiSelectField
                name="categories"
                control={control}
                options={categories}
                label="Categories"
                placeholder="Select categories..."
              />

              {/* Sources Filter */}
              <MultiSelectField
                name="sources"
                control={control}
                options={sourceOptions}
                label="News Sources"
                placeholder="Select sources..."
              />

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  )}
                />
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="flex justify-center">
              <button
                onClick={handleApplyFilters}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
