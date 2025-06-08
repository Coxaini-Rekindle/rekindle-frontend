import { Spinner } from "@heroui/spinner";
import { useTranslation } from "react-i18next";
import { MdImageSearch, MdSearchOff } from "react-icons/md";

import SearchResultCard from "./SearchResultCard";

import { SearchMemoryResponse } from "@/types/search";

interface SearchResultsProps {
  results: SearchMemoryResponse[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  groupId: string;
}

export default function SearchResults({
  results,
  isLoading,
  error,
  searchQuery,
  groupId,
}: SearchResultsProps) {
  const { t } = useTranslation();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Spinner className="mb-4" size="lg" />
        <p className="text-foreground-500">{t("search.searching")}</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <MdSearchOff className="mx-auto mb-4 text-danger" size={48} />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t("search.error.title")}
        </h3>
        <p className="text-foreground-500 mb-4">{error}</p>
      </div>
    );
  }

  // No results
  if (results.length === 0 && searchQuery.trim()) {
    return (
      <div className="text-center py-12">
        <MdImageSearch className="mx-auto mb-4 text-foreground-400" size={48} />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t("search.noResults.title")}
        </h3>
        <p className="text-foreground-500">
          {t("search.noResults.subtitle", { query: searchQuery })}
        </p>
      </div>
    );
  }

  // Results
  return (
    <div className="space-y-4">
      {/* Results Header */}
      <div className="flex items-center gap-3 py-4 border-b border-divider">
        <MdImageSearch className="text-primary" size={24} />
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {t("search.results.title")}
          </h2>
          <p className="text-sm text-foreground-500">
            {t("search.results.subtitle", {
              count: results.length,
              query: searchQuery,
            })}
          </p>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {results.map((result) => (
          <SearchResultCard
            key={`${result.memoryId}-${result.photo.photoId}`}
            groupId={groupId}
            result={result}
          />
        ))}
      </div>
    </div>
  );
}
