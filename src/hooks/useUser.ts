import type { RootState, AppDispatch } from "@/store";

import { useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { userApi } from "@/api/userApi";
import {
  fetchUserProfile,
  updateUserName,
  uploadUserAvatar,
  clearProfileError,
  clearUpdateNameError,
  clearUploadAvatarError,
} from "@/store/slices/userSlice";

// Hook to get user profile data and actions
export const useUserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    profile,
    profileLoading,
    profileError,
    profileFetched,
    updateNameLoading,
    updateNameError,
    uploadAvatarLoading,
    uploadAvatarError,
  } = useSelector((state: RootState) => state.user);

  // Auto-fetch profile if not already fetched and not currently loading
  useEffect(() => {
    if (!profileFetched && !profileLoading && !profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profileFetched, profileLoading, profile]);

  // Manual fetch function (for refresh scenarios)
  const fetchProfile = useCallback(() => {
    return dispatch(fetchUserProfile());
  }, [dispatch]);

  // Update user name
  const updateName = useCallback(
    (name: string) => {
      return dispatch(updateUserName(name));
    },
    [dispatch],
  );

  // Upload avatar
  const uploadAvatar = useCallback(
    (avatarFile: File) => {
      return dispatch(uploadUserAvatar(avatarFile));
    },
    [dispatch],
  );

  // Clear errors
  const clearErrors = useCallback(() => {
    dispatch(clearProfileError());
    dispatch(clearUpdateNameError());
    dispatch(clearUploadAvatarError());
  }, [dispatch]);

  // Get avatar URL helper
  const getAvatarUrl = useCallback((fileId: string) => {
    return userApi.getAvatarUrl(fileId);
  }, []);

  return {
    // Data
    profile,

    // Loading states
    profileLoading,
    updateNameLoading,
    uploadAvatarLoading,

    // Error states
    profileError,
    updateNameError,
    uploadAvatarError,

    // Actions
    fetchProfile,
    updateName,
    uploadAvatar,
    clearErrors,
    getAvatarUrl,
  };
};
