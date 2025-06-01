import type { RootState } from "..";
import type { ReactionSummaryDto } from "@/types/memory";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  type MemoryActivityDto,
  type CreateCommentRequest,
  type UpdateCommentRequest,
  type AddReactionRequest,
  MemoryActivityType,
} from "@/types/activity";
import { activitiesApi } from "@/api/activitiesApi";

interface ActivitiesState {
  activities: MemoryActivityDto[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  nextCursor: string | null;
  error: string | null;
}

const initialState: ActivitiesState = {
  activities: [],
  loading: false,
  loadingMore: false,
  hasMore: false,
  nextCursor: null,
  error: null,
};

// Async thunks for API operations
export const fetchActivities = createAsyncThunk(
  "activities/fetchActivities",
  async (
    {
      memoryId,
      pageSize = 20,
      reset = false,
    }: { memoryId: string; pageSize?: number; reset?: boolean },
    { getState },
  ) => {
    const state = getState() as RootState;
    const cursor = reset ? null : state.activities.nextCursor;

    const response = await activitiesApi.getMemoryActivities(
      memoryId,
      pageSize,
      cursor,
    );

    return {
      activities: response.items,
      nextCursor: response.nextCursor,
      hasMore: response.hasMore,
      reset,
    };
  },
);

export const createComment = createAsyncThunk(
  "activities/createComment",
  async (
    {
      memoryId,
      commentData,
    }: { memoryId: string; commentData: CreateCommentRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await activitiesApi.createComment(memoryId, commentData);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create comment",
      );
    }
  },
);

export const createPost = createAsyncThunk(
  "activities/createPost",
  async (
    { memoryId, content }: { memoryId: string; content: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await activitiesApi.createPost(memoryId, content);

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create post",
      );
    }
  },
);

export const updateComment = createAsyncThunk(
  "activities/updateComment",
  async (
    {
      commentId,
      commentData,
    }: { commentId: string; commentData: UpdateCommentRequest },
    { rejectWithValue },
  ) => {
    try {
      const response = await activitiesApi.updateComment(
        commentId,
        commentData,
      );

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update comment",
      );
    }
  },
);

export const deleteComment = createAsyncThunk(
  "activities/deleteComment",
  async (commentId: string, { rejectWithValue }) => {
    try {
      await activitiesApi.deleteComment(commentId);

      return commentId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete comment",
      );
    }
  },
);

export const addReaction = createAsyncThunk(
  "activities/addReaction",
  async (
    {
      activityId,
      isComment,
      reactionData,
    }: {
      activityId: string;
      isComment: boolean;
      reactionData: AddReactionRequest;
    },
    { rejectWithValue },
  ) => {
    try {
      let response: ReactionSummaryDto;

      if (isComment) {
        response = await activitiesApi.addCommentReaction(
          activityId,
          reactionData,
        );
      } else {
        response = await activitiesApi.addPostReaction(
          activityId,
          reactionData,
        );
      }

      return {
        activityId,
        reactionSummary: response,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add reaction",
      );
    }
  },
);

export const removeReaction = createAsyncThunk(
  "activities/removeReaction",
  async (
    { activityId, isComment }: { activityId: string; isComment: boolean },
    { rejectWithValue },
  ) => {
    try {
      let response: ReactionSummaryDto;

      if (isComment) {
        response = await activitiesApi.removeCommentReaction(activityId);
      } else {
        response = await activitiesApi.removePostReaction(activityId);
      }

      return {
        activityId,
        reactionSummary: response,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove reaction",
      );
    }
  },
);

// Add reaction to memory main post
export const addMemoryMainPostReaction = createAsyncThunk(
  "activities/addMemoryMainPostReaction",
  async (
    {
      postId,
      reactionData,
    }: {
      postId: string;
      reactionData: AddReactionRequest;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await activitiesApi.addPostReaction(
        postId,
        reactionData,
      );

      return {
        postId,
        reactionSummary: response,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add reaction to memory",
      );
    }
  },
);

// Remove reaction from memory main post
export const removeMemoryMainPostReaction = createAsyncThunk(
  "activities/removeMemoryMainPostReaction",
  async ({ postId }: { postId: string }, { rejectWithValue }) => {
    try {
      const response = await activitiesApi.removePostReaction(postId);

      return {
        postId,
        reactionSummary: response,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Failed to remove reaction from memory",
      );
    }
  },
);

const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    clearActivities: (state) => {
      state.activities = [];
      state.nextCursor = null;
      state.hasMore = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch activities
      .addCase(fetchActivities.pending, (state, action) => {
        if (action.meta.arg.reset) {
          state.loading = true;
          state.loadingMore = false;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action) => {
        const { activities, nextCursor, hasMore, reset } = action.payload;

        if (reset) {
          state.activities = activities;
        } else {
          // Add new items while avoiding duplicates
          const existingIds = new Set(state.activities.map((a) => a.id));
          const newActivities = activities.filter(
            (a) => !existingIds.has(a.id),
          );

          state.activities = [...state.activities, ...newActivities];
        }

        state.nextCursor = nextCursor;
        state.hasMore = hasMore;
        state.loading = false;
        state.loadingMore = false;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.error = action.error.message || "Failed to fetch activities";
        state.loading = false;
        state.loadingMore = false;
      })

      // Create comment
      .addCase(createComment.fulfilled, (state, action) => {
        // Create a new activity from the comment
        const newComment = action.payload;
        const newActivity: MemoryActivityDto = {
          id: newComment.id,
          memoryId: newComment.memoryId,
          content: newComment.content,
          createdAt: newComment.createdAt,
          creatorUserId: newComment.creatorUserId,
          type: MemoryActivityType.Comment,
          reactions: newComment.reactions,
          reactionSummary: newComment.reactionSummary,
          images: [],
          replyToPostId: newComment.replyToPostId,
          replyToCommentId: newComment.replyToCommentId,
          isReplyToPost: newComment.isReplyToPost,
          isReplyToComment: newComment.isReplyToComment,
          isTopLevelComment: newComment.isTopLevelComment,
        };

        // Add to the top of the list
        state.activities.unshift(newActivity);
      })

      // Create post
      .addCase(createPost.fulfilled, (state, action) => {
        // Add the new post to the top of the list
        state.activities.unshift(action.payload);
      })

      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const updatedComment = action.payload;
        const index = state.activities.findIndex(
          (activity) =>
            activity.id === updatedComment.id && activity.type === "Comment",
        );

        if (index !== -1) {
          state.activities[index].content = updatedComment.content;
        }
      })

      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        const commentId = action.payload;

        state.activities = state.activities.filter(
          (activity) =>
            !(activity.id === commentId && activity.type === "Comment"),
        );
      })

      // Add/update reaction
      .addCase(addReaction.fulfilled, (state, action) => {
        const { activityId, reactionSummary } = action.payload;
        const index = state.activities.findIndex(
          (activity) => activity.id === activityId,
        );

        if (index !== -1) {
          state.activities[index].reactionSummary = reactionSummary;
        }
      }) // Remove reaction
      .addCase(removeReaction.fulfilled, (state, action) => {
        const { activityId, reactionSummary } = action.payload;
        const index = state.activities.findIndex(
          (activity) => activity.id === activityId,
        );

        if (index !== -1) {
          state.activities[index].reactionSummary = reactionSummary;
        }
      })

      // Memory main post reactions
      .addCase(addMemoryMainPostReaction.fulfilled, (_state, _action) => {
        // These reactions are handled by memoriesSlice
        // No need to update activities state here
      })
      .addCase(removeMemoryMainPostReaction.fulfilled, (_state, _action) => {
        // These reactions are handled by memoriesSlice
        // No need to update activities state here
      });
  },
});

export const { clearActivities } = activitiesSlice.actions;
export default activitiesSlice.reducer;

// Selectors
export const selectActivities = (state: RootState) =>
  state.activities.activities;
export const selectActivitiesLoading = (state: RootState) =>
  state.activities.loading;
export const selectActivitiesLoadingMore = (state: RootState) =>
  state.activities.loadingMore;
export const selectActivitiesHasMore = (state: RootState) =>
  state.activities.hasMore;
export const selectActivitiesError = (state: RootState) =>
  state.activities.error;
