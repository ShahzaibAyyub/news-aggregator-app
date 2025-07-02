import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { HiCog, HiX } from "react-icons/hi";
import { getGuardianSections } from "../middleware/aggregatedNewsService";
import { getAllAvailableSources } from "../shared/constants";
import {
  getPersonalizedFeedPreferences,
  setPersonalizedFeedPreferences,
  clearPersonalizedFeedPreferences,
} from "../shared/utils";
import type { PersonalizedFeedPreferences } from "../shared/utils";
import MultiSelectField from "./MultiSelectField";

interface PersonalizedFeedSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  onClear?: () => void;
}

interface FormData {
  categories?: Array<{ value: string; label: string }>;
  sources?: Array<{ value: string; label: string }>;
}

export default function PersonalizedFeedSettings({
  isOpen,
  onClose,
  onSave,
  onClear,
}: PersonalizedFeedSettingsProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Get available sources - memoize to prevent recreating on every render
  const availableSources = useMemo(() => getAllAvailableSources(), []);

  // Fetch Guardian sections for categories
  const { data: categoriesData } = useQuery({
    queryKey: ["guardian-sections"],
    queryFn: getGuardianSections,
  });

  const categories = useMemo(
    () =>
      (categoriesData || []).map((section) => ({
        value: section.id,
        label: section.webTitle,
      })),
    [categoriesData]
  );

  const sourceOptions = useMemo(
    () =>
      availableSources.map((source) => ({
        value: source.id,
        label: source.name,
      })),
    [availableSources]
  );

  const { control, reset, handleSubmit } = useForm<FormData>({
    defaultValues: {
      categories: [],
      sources: [],
    },
  });

  // Load existing preferences when component mounts or opens
  useEffect(() => {
    if (isOpen && categories.length > 0) {
      const preferences = getPersonalizedFeedPreferences();
      if (preferences) {
        const categoryOptions = preferences.categories
          ? preferences.categories.split(",").map((categoryId) => {
              const category = categories.find(
                (c) => c.value === categoryId.trim()
              );
              return {
                value: categoryId.trim(),
                label: category?.label || categoryId.trim(),
              };
            })
          : [];

        const selectedSourceOptions = preferences.sources
          ? preferences.sources.split(",").map((sourceId) => {
              const source = availableSources.find((s) => s.id === sourceId);
              return { value: sourceId, label: source?.name || sourceId };
            })
          : [];

        reset({
          categories: categoryOptions,
          sources: selectedSourceOptions,
        });
      }
    }
  }, [isOpen, categories, availableSources]);

  const handleSave = async (data: FormData) => {
    setIsSaving(true);
    try {
      const preferences: PersonalizedFeedPreferences = {};

      if (data.categories && data.categories.length > 0) {
        preferences.categories = data.categories.map((c) => c.value).join(",");
      }

      if (data.sources && data.sources.length > 0) {
        preferences.sources = data.sources.map((s) => s.value).join(",");
      }

      // Only save if there are actual preferences
      if (preferences.categories || preferences.sources) {
        setPersonalizedFeedPreferences(preferences);
      } else {
        clearPersonalizedFeedPreferences();
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClear = () => {
    clearPersonalizedFeedPreferences();
    reset({
      categories: [],
      sources: [],
    });
    if (onClear) {
      onClear();
    } else {
      onSave();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <HiCog className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Personalized Feed Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleSave)} className="p-6">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Customize your news feed by selecting your preferred categories
                and sources. Your personalized feed will show articles matching
                these preferences.
              </p>
            </div>

            {/* Categories */}
            <MultiSelectField
              name="categories"
              control={control}
              options={categories}
              label="Preferred Categories"
              placeholder="Select categories..."
              helpText="Select topics you're interested in"
            />

            {/* Sources */}
            <MultiSelectField
              name="sources"
              control={control}
              options={sourceOptions}
              label="Preferred Sources"
              placeholder="Select sources..."
              helpText="Choose your trusted news sources"
            />
          </div>

          <div className="flex space-x-3 mt-8">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? "Saving..." : "Save Preferences"}
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Clear All
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
