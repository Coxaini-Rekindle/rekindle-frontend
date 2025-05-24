import type { UserProfile } from "@/types/user";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { userApi } from "@/api/userApi";

interface UserState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.getUserProfile();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  },
);

export const updateUserName = createAsyncThunk(
  "user/updateName",
  async (name: string, { rejectWithValue, dispatch }) => {
    try {
      await userApi.updateName(name);
      dispatch(fetchUserProfile());

      return name;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  },
);

export const uploadUserAvatar = createAsyncThunk(
  "user/uploadAvatar",
  async (avatarFile: File, { rejectWithValue, dispatch }) => {
    try {
      await userApi.uploadAvatar(avatarFile);
      dispatch(fetchUserProfile());

      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.isLoading = false;
          state.profile = action.payload;
        },
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update name
      .addCase(updateUserName.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserName.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Upload avatar
      .addCase(uploadUserAvatar.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadUserAvatar.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadUserAvatar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
