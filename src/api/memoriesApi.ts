import type {
  MemoryDto,
  CursorPaginationResponse,
  CreateMemoryFormRequest,
} from "@/types/memory";

import apiClient from "./apiClient";
import { API_PREFIXES, buildEndpoint } from "./apiConfig";

export const memoriesApi = {
  // Get memories from a group with cursor pagination
  getMemories: async (
    groupId: string,
    limit: number = 20,
    cursor?: string | null,
  ): Promise<CursorPaginationResponse<MemoryDto>> => {
    const params = new URLSearchParams();

    params.append("limit", limit.toString());
    if (cursor) {
      params.append("cursor", cursor);
    }

    const response = await apiClient.get(
      buildEndpoint(
        API_PREFIXES.MEMORIES,
        `/groups/${groupId}/memories?${params.toString()}`,
      ),
    );

    return response.data;
  },

  // Get a specific memory by ID
  getMemoryById: async (memoryId: string): Promise<MemoryDto> => {
    const response = await apiClient.get(
      buildEndpoint(API_PREFIXES.MEMORIES, `/memories/${memoryId}`),
    );

    return response.data;
  },

  // Create a new memory
  createMemory: async (
    groupId: string,
    memoryData: CreateMemoryFormRequest,
  ): Promise<MemoryDto> => {
    const formData = new FormData();

    formData.append("title", memoryData.title);
    formData.append("description", memoryData.description);
    formData.append("content", memoryData.content);

    if (memoryData.existingFileIds) {
      formData.append("existingFileIds", memoryData.existingFileIds);
    }

    if (memoryData.images) {
      memoryData.images.forEach((image) => {
        formData.append("images", image);
      });
    }

    const response = await apiClient.post(
      buildEndpoint(API_PREFIXES.MEMORIES, `/groups/${groupId}/memories`),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  // Get image URL helper function
  getImageUrl: (fileId: string, postId: string): string => {
    const baseUrl = `${apiClient.defaults.baseURL}${buildEndpoint(API_PREFIXES.MEMORIES, `/posts/${postId}/images/${fileId}`)}`;
    const token = localStorage.getItem("token");

    // Add token as query parameter for authenticated access
    return token ? `${baseUrl}?token=${token}` : baseUrl;
  },

  // Fetch image with proper authentication and return a blob URL
  fetchImage: async (fileId: string, postId: string): Promise<string> => {
    try {
      // Make an authenticated request to get the image
      const response = await apiClient.get(
        buildEndpoint(
          API_PREFIXES.MEMORIES,
          `/posts/${postId}/images/${fileId}`,
        ),
        { responseType: "blob" },
      );

      // Create a local blob URL that can be used in image tags
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error fetching image:", error);

      // Return a placeholder image
      return "/images/placeholder-image.svg";
    }
  },
};
