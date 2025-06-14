import { useState, useCallback } from "react";

import { searchApi } from "@/api/searchApi";
import { SearchMemoryResponse, SearchParams } from "@/types/search";

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchMemoryResponse[]>(
    [],
  );
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchMemories = useCallback(async (params: SearchParams) => {
    // Search if we have a search term or participants selected
    if (
      !params.searchTerm.trim() &&
      (!params.participants || params.participants.length === 0)
    ) {
      setSearchResults([]);

      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchApi.searchMemories(params);

      setSearchResults(results);
    } catch {
      setSearchError("Failed to search memories. Please try again.");
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults([]);

    setSearchError(null);
  }, []);

  return {
    searchResults,
    isSearching,
    searchError,
    searchMemories,
    clearSearch,
  };
};
