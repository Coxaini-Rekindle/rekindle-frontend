import apiClient from "./apiClient";
import { API_PREFIXES, buildEndpoint } from "./apiConfig";

import { SearchMemoryResponse, SearchParams } from "@/types/search";

export const searchApi = {
  // Search memories by natural language
  searchMemories: async (
    params: SearchParams,
  ): Promise<SearchMemoryResponse[]> => {
    const { groupId, searchTerm, limit = 20, offset = 0 } = params;

    const response = await apiClient.get(
      buildEndpoint(
        API_PREFIXES.MEMORIES,
        `/groups/${groupId}/search/memories`,
      ),
      {
        params: {
          searchTerm,
          limit,
          offset,
        },
      },
    );

    return response.data;
  },
};
