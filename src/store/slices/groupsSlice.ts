import type { GroupDto, GroupMemberDto } from "@/types/group";
import type { RootState } from "..";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import { groupsApi } from "@/api/groupsApi";

interface GroupsState {
  groups: GroupDto[];
  currentGroup: GroupDto | null;
  currentGroupMembers: GroupMemberDto[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  currentGroup: null,
  currentGroupMembers: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchGroupMembers = createAsyncThunk(
  "groups/fetchGroupMembers",
  async (groupId: string, { rejectWithValue }) => {
    try {
      const members = await groupsApi.getGroupMembers(groupId);

      return { groupId, members };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || error.message);
    }
  },
);

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {
    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Groups operations
    setGroups: (state, action: PayloadAction<GroupDto[]>) => {
      state.groups = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    addGroup: (state, action: PayloadAction<GroupDto>) => {
      state.groups.push(action.payload);
    },

    updateGroup: (state, action: PayloadAction<GroupDto>) => {
      const index = state.groups.findIndex(
        (group) => group.id === action.payload.id,
      );

      if (index !== -1) {
        state.groups[index] = action.payload;
      }
      // Update current group if it's the same
      if (state.currentGroup?.id === action.payload.id) {
        state.currentGroup = action.payload;
      }
    },

    removeGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(
        (group) => group.id !== action.payload,
      );
      // Clear current group if it's the same
      if (state.currentGroup?.id === action.payload) {
        state.currentGroup = null;
        state.currentGroupMembers = [];
      }
    },

    // Current group operations
    setCurrentGroup: (state, action: PayloadAction<GroupDto>) => {
      state.currentGroup = action.payload;
    },

    clearCurrentGroup: (state) => {
      state.currentGroup = null;
      state.currentGroupMembers = [];
    },

    setCurrentGroupMembers: (
      state,
      action: PayloadAction<GroupMemberDto[]>,
    ) => {
      state.currentGroupMembers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroupMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchGroupMembers.fulfilled,
        (
          state,
          action: PayloadAction<{ groupId: string; members: GroupMemberDto[] }>,
        ) => {
          const { members } = action.payload;

          state.currentGroupMembers = members;
          state.isLoading = false;
          state.error = null;
        },
      )
      .addCase(fetchGroupMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setGroups,
  addGroup,
  updateGroup,
  removeGroup,
  setCurrentGroup,
  clearCurrentGroup,
  setCurrentGroupMembers,
} = groupsSlice.actions;

export default groupsSlice.reducer;

// Selectors
export const selectCurrentGroupMembers = (state: RootState) =>
  state.groups.currentGroupMembers;
export const selectGroupsLoading = (state: RootState) => state.groups.isLoading;
