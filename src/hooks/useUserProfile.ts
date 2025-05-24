import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "@/store";
import {
  fetchUserProfile,
  updateUserName,
  uploadUserAvatar,
  clearUserError,
} from "@/store/slices/userSlice";
import { userApi } from "@/api/userApi";

export const useUserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, isLoading, error } = useSelector(
    (state: RootState) => state.user,
  );

  const getProfile = useCallback(() => {
    return dispatch(fetchUserProfile());
  }, [dispatch]);

  const updateName = useCallback(
    (name: string) => {
      return dispatch(updateUserName(name));
    },
    [dispatch],
  );

  const uploadAvatar = useCallback(
    (file: File) => {
      return dispatch(uploadUserAvatar(file));
    },
    [dispatch],
  );

  const clearError = useCallback(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  const getAvatarUrl = useCallback((fileId: string) => {
    return userApi.getAvatarUrl(fileId);
  }, []);

  return {
    profile,
    isLoading,
    error,
    getProfile,
    updateName,
    uploadAvatar,
    clearError,
    getAvatarUrl,
  };
};
