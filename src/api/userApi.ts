import type { UserProfile } from "@/types/user";

import apiClient from "./apiClient";

// User API
export const userApi = {
  // Get current user profile
  getUserProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get("/users/profile");

    return response.data;
  },

  // Update user name
  updateName: async (name: string): Promise<{ message: string }> => {
    const response = await apiClient.put("/users/name", { name });

    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (
    avatarFile: File,
  ): Promise<{ message: string; avatarFileId: string }> => {
    const formData = new FormData();

    formData.append("avatar", avatarFile);

    const response = await apiClient.post("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // Get avatar by fileId
  getAvatarUrl: (fileId: string): string => {
    return `${apiClient.defaults.baseURL}/users/avatar/${fileId}`;
  },
};
