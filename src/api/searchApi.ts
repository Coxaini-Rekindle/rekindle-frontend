import apiClient from "./apiClient";
import { API_PREFIXES, buildEndpoint } from "./apiConfig";

import { SearchMemoryResponse, SearchParams } from "@/types/search";

export const searchApi = {
  // Search memories by natural language
  searchMemories: async (
    params: SearchParams,
  ): Promise<SearchMemoryResponse[]> => {
    const {
      groupId,
      searchTerm,
      limit = 20,
      offset = 0,
      participants,
    } = params;

    const searchParams = new URLSearchParams();

    searchParams.append("searchTerm", searchTerm);
    searchParams.append("limit", limit.toString());
    searchParams.append("offset", offset.toString());

    // Add participants query parameters
    if (participants && participants.length > 0) {
      participants.forEach((participantId) => {
        searchParams.append("participants", participantId);
      });
    }

    const response = await apiClient.get(
      buildEndpoint(
        API_PREFIXES.MEMORIES,
        `/groups/${groupId}/search/memories?${searchParams.toString()}`,
      ),
    );

    return response.data;
  },
};
