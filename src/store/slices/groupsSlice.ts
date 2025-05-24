import type { GroupDto, GroupMemberDto } from "@/types/group";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
