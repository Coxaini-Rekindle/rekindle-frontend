import type { MemoryDto, CreateMemoryFormRequest } from "@/types/memory";
import type { RootState, AppDispatch } from "@/store";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { memoriesApi } from "@/api/memoriesApi";
import {
  setLoading,
  setLoadingMore,
  setError,
  setMemories,
  addMemory,
  setCurrentMemory,
  clearMemories,
} from "@/store/slices/memoriesSlice";

export const useMemories = (groupId?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    memoriesByGroup,
    currentMemory,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    nextCursor,
  } = useSelector((state: RootState) => state.memories);

  const memories = groupId ? memoriesByGroup[groupId] || [] : [];
  const hasMoreMemories = groupId ? hasMore[groupId] || false : false;
  const cursor = groupId ? nextCursor[groupId] : null;

  // Fetch memories for a group
  const fetchMemories = useCallback(
    async (groupId: string, limit: number = 20, replace: boolean = false) => {
      try {
        dispatch(setLoading(true));

        const data = await memoriesApi.getMemories(groupId, limit);

        dispatch(setMemories({ groupId, data, replace }));
      } catch (error) {
        dispatch(
          setError(
            error instanceof Error ? error.message : "Failed to fetch memories",
          ),
        );
      }
    },
    [dispatch],
  );

  // Load more memories (pagination)
  const loadMoreMemories = useCallback(
    async (groupId: string, limit: number = 20) => {
      if (!hasMoreMemories || isLoadingMore || !cursor) return;

      try {
        dispatch(setLoadingMore(true));

        const data = await memoriesApi.getMemories(groupId, limit, cursor);

        dispatch(setMemories({ groupId, data, replace: false }));
      } catch (error) {
        dispatch(
          setError(
            error instanceof Error
              ? error.message
              : "Failed to load more memories",
          ),
        );
      }
    },
    [dispatch, hasMoreMemories, isLoadingMore, cursor],
  );

  // Fetch a specific memory
  const fetchMemory = useCallback(
    async (memoryId: string) => {
      try {
        dispatch(setLoading(true));

        const memory = await memoriesApi.getMemoryById(memoryId);

        dispatch(setCurrentMemory(memory));
      } catch (error) {
        dispatch(
          setError(
            error instanceof Error ? error.message : "Failed to fetch memory",
          ),
        );
      }
    },
    [dispatch],
  );

  // Create a new memory
  const createMemory = useCallback(
    async (
      groupId: string,
      memoryData: CreateMemoryFormRequest,
    ): Promise<MemoryDto | null> => {
      try {
        dispatch(setLoading(true));

        const newMemory = await memoriesApi.createMemory(groupId, memoryData);

        dispatch(addMemory({ groupId, memory: newMemory }));

        return newMemory;
      } catch (error) {
        dispatch(
          setError(
            error instanceof Error ? error.message : "Failed to create memory",
          ),
        );

        return null;
      }
    },
    [dispatch],
  );

  // Clear memories for a group
  const clearGroupMemories = useCallback(
    (groupId: string) => {
      dispatch(clearMemories(groupId));
    },
    [dispatch],
  );

  return {
    memories,
    currentMemory,
    isLoading,
    isLoadingMore,
    error,
    hasMore: hasMoreMemories,
    nextCursor: cursor,
    fetchMemories,
    loadMoreMemories,
    fetchMemory,
    createMemory,
    clearGroupMemories,
  };
};
