import type { AppDispatch } from "@/store";
import type { MemoryActivityDto } from "@/types/activity";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchActivities,
  clearActivities,
  selectActivities,
  selectActivitiesLoading,
  selectActivitiesLoadingMore,
  selectActivitiesHasMore,
  selectActivitiesError,
} from "@/store/slices/activitiesSlice";

interface UseActivitiesResult {
  activities: MemoryActivityDto[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  fetchMemoryActivities: (
    memoryId: string,
    pageSize?: number,
    reset?: boolean,
  ) => Promise<void>;
  loadMoreActivities: (memoryId: string, pageSize?: number) => Promise<void>;
  clearAllActivities: () => void;
}

export const useActivities = (memoryId?: string): UseActivitiesResult => {
  const dispatch = useDispatch<AppDispatch>();

  const activities = useSelector(selectActivities);
  const isLoading = useSelector(selectActivitiesLoading);
  const isLoadingMore = useSelector(selectActivitiesLoadingMore);
  const hasMore = useSelector(selectActivitiesHasMore);
  const error = useSelector(selectActivitiesError);

  // Fetch activities with optional reset
  const fetchMemoryActivities = useCallback(
    async (id: string, pageSize = 20, reset = true) => {
      if (!id) return;

      await dispatch(
        fetchActivities({
          memoryId: id,
          pageSize,
          reset,
        }),
      );
    },
    [dispatch],
  );

  // Initial load if memoryId is provided
  useEffect(() => {
    if (memoryId) {
      fetchMemoryActivities(memoryId);
    }

    // Clean up activities when unmounting
    return () => {
      dispatch(clearActivities());
    };
  }, [memoryId, dispatch, fetchMemoryActivities]);

  // Load more activities
  const loadMoreActivities = useCallback(
    async (id: string, pageSize = 20) => {
      if (!id || !hasMore || isLoadingMore) return;

      await dispatch(
        fetchActivities({
          memoryId: id,
          pageSize,
          reset: false,
        }),
      );
    },
    [dispatch, hasMore, isLoadingMore],
  );

  // Clear all activities
  const clearAllActivities = useCallback(() => {
    dispatch(clearActivities());
  }, [dispatch]);

  return {
    activities,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    fetchMemoryActivities,
    loadMoreActivities,
    clearAllActivities,
  };
};
