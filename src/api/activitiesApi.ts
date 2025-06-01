import type {
  CommentDto,
  CreateCommentRequest,
  UpdateCommentRequest,
  CreatePostRequest,
  AddReactionRequest,
  CursorPaginationResponseOfMemoryActivityDto,
  MemoryActivityDto,
} from "@/types/activity";
import type { ReactionSummaryDto } from "@/types/memory";

import apiClient from "./apiClient";
import { API_PREFIXES, buildEndpoint } from "./apiConfig";

export const activitiesApi = {
  // Get all activities (posts and comments) from a memory
  getMemoryActivities: async (
    memoryId: string,
    pageSize: number = 20,
    cursor?: string | null,
  ): Promise<CursorPaginationResponseOfMemoryActivityDto> => {
    const params = new URLSearchParams();

    params.append("pageSize", pageSize.toString());
    if (cursor) {
      params.append("cursor", cursor);
    }

    const response = await apiClient.get(
      buildEndpoint(
        API_PREFIXES.MEMORIES,
        `/memories/${memoryId}/activities?${params.toString()}`,
      ),
    );

    return response.data;
  },

  // Create a new comment
  createComment: async (
    memoryId: string,
    commentData: CreateCommentRequest,
  ): Promise<CommentDto> => {
    const response = await apiClient.post(
      buildEndpoint(
        API_PREFIXES.MEMORIES,
        `/memories/${memoryId}/activities/comments`,
      ),
      commentData,
    );

    return response.data;
  },

  // Update a comment
  updateComment: async (
    commentId: string,
    commentData: UpdateCommentRequest,
  ): Promise<CommentDto> => {
    const response = await apiClient.put(
      buildEndpoint(API_PREFIXES.MEMORIES, `/comments/${commentId}`),
      commentData,
    );

    return response.data;
  },

  // Delete a comment
  deleteComment: async (commentId: string): Promise<void> => {
    await apiClient.delete(
      buildEndpoint(API_PREFIXES.MEMORIES, `/comments/${commentId}`),
    );
  },

  // Add or update reaction to a comment
  addCommentReaction: async (
    commentId: string,
    reactionData: AddReactionRequest,
  ): Promise<ReactionSummaryDto> => {
    const response = await apiClient.post(
      buildEndpoint(API_PREFIXES.MEMORIES, `/comments/${commentId}/reactions`),
      reactionData,
    );

    return response.data;
  },

  // Remove reaction from a comment
  removeCommentReaction: async (
    commentId: string,
  ): Promise<ReactionSummaryDto> => {
    const response = await apiClient.delete(
      buildEndpoint(API_PREFIXES.MEMORIES, `/comments/${commentId}/reactions`),
    );

    return response.data;
  },

  // Add or update reaction to a post
  addPostReaction: async (
    postId: string,
    reactionData: AddReactionRequest,
  ): Promise<ReactionSummaryDto> => {
    const response = await apiClient.post(
      buildEndpoint(API_PREFIXES.MEMORIES, `/posts/${postId}/reactions`),
      reactionData,
    );

    return response.data;
  },

  // Remove reaction from a post
  removePostReaction: async (postId: string): Promise<ReactionSummaryDto> => {
    const response = await apiClient.delete(
      buildEndpoint(API_PREFIXES.MEMORIES, `/posts/${postId}/reactions`),
    );

    return response.data;
  },

  // Create a new post
  createPost: async (
    memoryId: string,
    postData: CreatePostRequest,
  ): Promise<MemoryActivityDto> => {
    const formData = new FormData();

    formData.append("content", postData.content);

    if (postData.title) {
      formData.append("title", postData.title);
    }

    if (postData.images && postData.images.length > 0) {
      postData.images.forEach((image) => {
        formData.append("images", image);
      });
    }
    const response = await apiClient.post(
      buildEndpoint(API_PREFIXES.MEMORIES, `/memories/${memoryId}/posts`),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },
};
