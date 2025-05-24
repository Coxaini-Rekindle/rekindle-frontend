import type {
  CreateGroupRequest,
  UpdateGroupRequest,
  InviteToGroupRequest,
  CreateInviteLinkRequest,
} from "@/types/group";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { groupsApi, groupInvitationsApi } from "@/api/groupsApi";
import {
  setLoading,
  setError,
  setGroups,
  addGroup,
  updateGroup,
  setCurrentGroup,
  setCurrentGroupMembers,
} from "@/store/slices/groupsSlice";

// Query keys
export const groupsQueryKeys = {
  all: ["groups"] as const,
  lists: () => [...groupsQueryKeys.all, "list"] as const,
  list: (filters: string) => [...groupsQueryKeys.lists(), { filters }] as const,
  details: () => [...groupsQueryKeys.all, "detail"] as const,
  detail: (id: string) => [...groupsQueryKeys.details(), id] as const,
  members: (groupId: string) =>
    [...groupsQueryKeys.detail(groupId), "members"] as const,
  invitations: () => ["invitations"] as const,
};

// Get user groups
export const useUserGroups = () => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: groupsQueryKeys.lists(),
    queryFn: async () => {
      dispatch(setLoading(true));
      try {
        const groups = await groupsApi.getUserGroups();

        dispatch(setGroups(groups));

        return groups;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch groups";

        dispatch(setError(errorMessage));
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get group details
export const useGroupDetails = (groupId: string, enabled = true) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: groupsQueryKeys.detail(groupId),
    queryFn: async () => {
      const group = await groupsApi.getGroupDetails(groupId);

      dispatch(setCurrentGroup(group));

      return group;
    },
    enabled: enabled && !!groupId,
    staleTime: 5 * 60 * 1000,
  });
};

// Get group members
export const useGroupMembers = (groupId: string, enabled = true) => {
  const dispatch = useDispatch();

  return useQuery({
    queryKey: groupsQueryKeys.members(groupId),
    queryFn: async () => {
      const members = await groupsApi.getGroupMembers(groupId);

      dispatch(setCurrentGroupMembers(members));

      return members;
    },
    enabled: enabled && !!groupId,
    staleTime: 5 * 60 * 1000,
  });
};

// Create group mutation
export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (groupData: CreateGroupRequest) =>
      groupsApi.createGroup(groupData),
    onSuccess: (newGroup) => {
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.lists() });
      dispatch(addGroup(newGroup));
      toast.success("Group created successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create group";

      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    },
  });
};

// Update group mutation
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({
      groupId,
      groupData,
    }: {
      groupId: string;
      groupData: UpdateGroupRequest;
    }) => groupsApi.updateGroup(groupId, groupData),
    onSuccess: (updatedGroup) => {
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: groupsQueryKeys.detail(updatedGroup.id),
      });
      dispatch(updateGroup(updatedGroup));
      toast.success("Group updated successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update group";

      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    },
  });
};

// Invite to group mutation
export const useInviteToGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      inviteData,
    }: {
      groupId: string;
      inviteData: InviteToGroupRequest;
    }) => groupInvitationsApi.inviteToGroup(groupId, inviteData),
    onSuccess: (invitation) => {
      queryClient.invalidateQueries({
        queryKey: groupsQueryKeys.members(invitation.groupId),
      });
      toast.success("Invitation sent successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send invitation";

      toast.error(errorMessage);
    },
  });
};

// Create invitation link mutation
export const useCreateInvitationLink = () => {
  return useMutation({
    mutationFn: ({
      groupId,
      linkData,
    }: {
      groupId: string;
      linkData?: CreateInviteLinkRequest;
    }) => groupInvitationsApi.createInvitationLink(groupId, linkData),
    onSuccess: (response) => {
      toast.success("Invitation link created successfully!");

      return response;
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create invitation link";

      toast.error(errorMessage);
    },
  });
};

// Get user invitations
export const useUserInvitations = () => {
  return useQuery({
    queryKey: groupsQueryKeys.invitations(),
    queryFn: groupInvitationsApi.getUserInvitations,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Accept invitation mutation
export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) =>
      groupInvitationsApi.acceptInvitation(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: groupsQueryKeys.invitations(),
      });
      toast.success("Invitation accepted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to accept invitation";

      toast.error(errorMessage);
    },
  });
};

// Delete group mutation
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (groupId: string) => groupsApi.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.lists() });
      toast.success("Group deleted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete group";

      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    },
  });
};

// Remove user from group mutation
export const useRemoveUserFromGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      userIdToRemove,
    }: {
      groupId: string;
      userIdToRemove: string;
    }) => groupsApi.removeUserFromGroup(groupId, userIdToRemove),
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({
        queryKey: groupsQueryKeys.members(groupId),
      });
      queryClient.invalidateQueries({ queryKey: groupsQueryKeys.lists() });
      toast.success("Member removed successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove member";

      toast.error(errorMessage);
    },
  });
};
