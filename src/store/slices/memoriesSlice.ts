import type { MemoryDto, CursorPaginationResponse } from "@/types/memory";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MemoriesState {
  memoriesByGroup: Record<string, MemoryDto[]>;
  currentMemory: MemoryDto | null;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: Record<string, boolean>;
  nextCursor: Record<string, string | null>;
}

const initialState: MemoriesState = {
  memoriesByGroup: {},
  currentMemory: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  hasMore: {},
  nextCursor: {},
};

const memoriesSlice = createSlice({
  name: "memories",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMore = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isLoadingMore = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Memories operations
    setMemories: (
      state,
      action: PayloadAction<{
        groupId: string;
        data: CursorPaginationResponse<MemoryDto>;
        replace?: boolean;
      }>,
    ) => {
      const { groupId, data, replace = false } = action.payload;

      if (replace || !state.memoriesByGroup[groupId]) {
        state.memoriesByGroup[groupId] = data.items;
      } else {
        // Append new memories (for pagination)
        const existingIds = new Set(
          state.memoriesByGroup[groupId].map((m) => m.id),
        );
        const newMemories = data.items.filter((m) => !existingIds.has(m.id));

        state.memoriesByGroup[groupId].push(...newMemories);
      }

      state.hasMore[groupId] = data.hasMore;
      state.nextCursor[groupId] = data.nextCursor;
      state.isLoading = false;
      state.isLoadingMore = false;
      state.error = null;
    },

    addMemory: (
      state,
      action: PayloadAction<{ groupId: string; memory: MemoryDto }>,
    ) => {
      const { groupId, memory } = action.payload;

      if (!state.memoriesByGroup[groupId]) {
        state.memoriesByGroup[groupId] = [];
      }

      // Add to the beginning of the list (newest first)
      state.memoriesByGroup[groupId].unshift(memory);
    },

    updateMemory: (state, action: PayloadAction<MemoryDto>) => {
      const updatedMemory = action.payload;

      // Update in the group memories list
      const groupMemories = state.memoriesByGroup[updatedMemory.groupId];

      if (groupMemories) {
        const index = groupMemories.findIndex((m) => m.id === updatedMemory.id);

        if (index !== -1) {
          groupMemories[index] = updatedMemory;
        }
      }

      // Update current memory if it's the same
      if (state.currentMemory?.id === updatedMemory.id) {
        state.currentMemory = updatedMemory;
      }
    },

    removeMemory: (
      state,
      action: PayloadAction<{ groupId: string; memoryId: string }>,
    ) => {
      const { groupId, memoryId } = action.payload;

      if (state.memoriesByGroup[groupId]) {
        state.memoriesByGroup[groupId] = state.memoriesByGroup[groupId].filter(
          (m) => m.id !== memoryId,
        );
      }

      if (state.currentMemory?.id === memoryId) {
        state.currentMemory = null;
      }
    },

    setCurrentMemory: (state, action: PayloadAction<MemoryDto | null>) => {
      state.currentMemory = action.payload;
    },

    clearMemories: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;

      delete state.memoriesByGroup[groupId];
      delete state.hasMore[groupId];
      delete state.nextCursor[groupId];
    },

    clearAllMemories: (state) => {
      state.memoriesByGroup = {};
      state.currentMemory = null;
      state.hasMore = {};
      state.nextCursor = {};
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setLoadingMore,
  setError,
  clearError,
  setMemories,
  addMemory,
  updateMemory,
  removeMemory,
  setCurrentMemory,
  clearMemories,
  clearAllMemories,
} = memoriesSlice.actions;

export default memoriesSlice.reducer;
