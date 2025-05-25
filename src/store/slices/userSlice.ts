import type { UserProfile } from "@/types/user";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { userApi } from "@/api/userApi";

interface UserState {
  // Authentication state
  isAuthenticated: boolean;
  currentUserId: string | null;

  // Profile state
  profile: UserProfile | null;
  profileLoading: boolean;
  profileError: string | null;
  profileFetched: boolean; // Track if profile has been fetched

  // Update name state
  updateNameLoading: boolean;
  updateNameError: string | null;

  // Upload avatar state
  uploadAvatarLoading: boolean;
  uploadAvatarError: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  currentUserId: null,
  profile: null,
  profileLoading: false,
  profileError: null,
  profileFetched: false,
  updateNameLoading: false,
  updateNameError: null,
  uploadAvatarLoading: false,
  uploadAvatarError: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const profile = await userApi.getUserProfile();

      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const state = getState() as { user: UserState };

      // Don't fetch if already loading or already fetched
      return !state.user.profileLoading && !state.user.profileFetched;
    },
  },
);

export const updateUserName = createAsyncThunk(
  "user/updateName",
  async (name: string, { rejectWithValue }) => {
    try {
      await userApi.updateName(name);

      return name;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  },
);

export const uploadUserAvatar = createAsyncThunk(
  "user/uploadAvatar",
  async (avatarFile: File, { rejectWithValue }) => {
    try {
      const response = await userApi.uploadAvatar(avatarFile);

      return response.avatarFileId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setCurrentUserId: (state, action: PayloadAction<string | null>) => {
      state.currentUserId = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUserId = null;
      state.profile = null;
      state.profileError = null;
      state.profileFetched = false;
      state.updateNameError = null;
      state.uploadAvatarError = null;
    },
    clearProfileError: (state) => {
      state.profileError = null;
    },
    clearUpdateNameError: (state) => {
      state.updateNameError = null;
    },
    clearUploadAvatarError: (state) => {
      state.uploadAvatarError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch user profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.profileError = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.profile = action.payload;
        state.profileError = null;
        state.profileFetched = true;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.profileError = action.payload as string;
      });

    // Update user name
    builder
      .addCase(updateUserName.pending, (state) => {
        state.updateNameLoading = true;
        state.updateNameError = null;
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.updateNameLoading = false;
        state.updateNameError = null;
        // Update profile name immediately
        if (state.profile) {
          state.profile.name = action.payload;
        }
        toast.success("Name updated successfully!");
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.updateNameLoading = false;
        state.updateNameError = action.payload as string;
        toast.error(`Error updating name: ${action.payload}`);
      });

    // Upload avatar
    builder
      .addCase(uploadUserAvatar.pending, (state) => {
        state.uploadAvatarLoading = true;
        state.uploadAvatarError = null;
      })
      .addCase(uploadUserAvatar.fulfilled, (state, action) => {
        state.uploadAvatarLoading = false;
        state.uploadAvatarError = null;
        // Update profile avatar immediately
        if (state.profile) {
          state.profile.avatarFileId = action.payload;
        }
        toast.success("Avatar updated successfully!");
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.uploadAvatarLoading = false;
        state.uploadAvatarError = action.payload as string;
        toast.error(`Error uploading avatar: ${action.payload}`);
      });
  },
});

export const {
  setAuthenticated,
  setCurrentUserId,
  logout,
  clearProfileError,
  clearUpdateNameError,
  clearUploadAvatarError,
} = userSlice.actions;

export default userSlice.reducer;
