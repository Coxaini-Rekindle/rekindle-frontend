import type {
  GroupDto,
  GroupMemberDto,
  CreateGroupRequest,
  UpdateGroupRequest,
  InviteToGroupRequest,
  GroupInviteDto,
  CreateInviteLinkRequest,
  InviteLinkResponse,
} from "@/types/group";
import type { RecognizedUser, MergeUsersRequest } from "@/types/user";

import apiClient from "./apiClient";
import { API_PREFIXES, buildEndpoint } from "./apiConfig";

// Groups API
export const groupsApi = {
  // Get all user groups
  getUserGroups: async (): Promise<GroupDto[]> => {
    const response = await apiClient.get(
      buildEndpoint(API_PREFIXES.USER_GROUPS, "/groups"),
    );

    return response.data;
  },

  // Get specific group details
  getGroupDetails: async (groupId: string): Promise<GroupDto> => {
    const response = await apiClient.get(
      buildEndpoint(API_PREFIXES.USER_GROUPS, `/groups/${groupId}`),
    );

    return response.data;
  },

  // Create a new group
  createGroup: async (groupData: CreateGroupRequest): Promise<GroupDto> => {
    const response = await apiClient.post(
      buildEndpoint(API_PREFIXES.USER_GROUPS, "/groups"),
      groupData,
    );

    return response.data;
  },

  // Update a group
  updateGroup: async (
    groupId: string,
    groupData: UpdateGroupRequest,
  ): Promise<GroupDto> => {
    const response = await apiClient.put(
      buildEndpoint(API_PREFIXES.USER_GROUPS, `/groups/${groupId}`),
      groupData,
    );

    return response.data;
  },

  // Get group members
  getGroupMembers: async (groupId: string): Promise<GroupMemberDto[]> => {
    const response = await apiClient.get(
      buildEndpoint(API_PREFIXES.USER_GROUPS, `/groups/${groupId}/members`),
    );

    return response.data;
  },

  // Delete a group (only owners can delete)
  deleteGroup: async (groupId: string): Promise<void> => {
    await apiClient.delete(
      buildEndpoint(API_PREFIXES.USER_GROUPS, `/groups/${groupId}`),
    );
  },

  // Remove user from group
  removeUserFromGroup: async (
    groupId: string,
    userIdToRemove: string,
  ): Promise<void> => {
    await apiClient.delete(
      buildEndpoint(
        API_PREFIXES.USER_GROUPS,
        `/groups/${groupId}/members/${userIdToRemove}`,
      ),
    );
  },
  // Get recognized users in group
  getRecognizedUsers: async (groupId: string): Promise<RecognizedUser[]> => {
    const response = await apiClient.get(
      buildEndpoint(API_PREFIXES.MEMORIES, `/groups/${groupId}/users`),
    );

    return response.data;
  },

  // Get user face image
  getUserFaceImage: async (
    groupId: string,
    userId: string,
  ): Promise<Blob> => {
    const response = await apiClient.get(
      buildEndpoint(
        API_PREFIXES.MEMORIES,
        `/groups/${groupId}/users/${userId}/face-image`,
      ),
      { responseType: "blob" },
    );

    return response.data;
  },

  // Merge users
  mergeUsers: async (
    groupId: string,
    mergeData: MergeUsersRequest,
  ): Promise<void> => {
    await apiClient.post(
      buildEndpoint(API_PREFIXES.MEMORIES, `/groups/${groupId}/users/merge`),
      mergeData,
    );
  },
};

// Group Invitations API
export const groupInvitationsApi = {
  // Invite user to group by email
  inviteToGroup: async (
    groupId: string,
    inviteData: InviteToGroupRequest,
  ): Promise<GroupInviteDto> => {
    const response = await apiClient.post(
      buildEndpoint(API_PREFIXES.USER_GROUPS, `/groups/${groupId}/invites`),
      inviteData,
    );

    return response.data;
  },

  // Create invitation link
  createInvitationLink: async (
    groupId: string,
    linkData: CreateInviteLinkRequest = {},
  ): Promise<InviteLinkResponse> => {
    const response = await apiClient.post(
      buildEndpoint(
        API_PREFIXES.USER_GROUPS,
        `/groups/${groupId}/invites/link`,
      ),
      linkData,
    );

    return response.data;
  },

  // Get user invitations
  getUserInvitations: async (): Promise<GroupInviteDto[]> => {
    const response = await apiClient.get(
      buildEndpoint(API_PREFIXES.USER_GROUPS, "/invitations"),
    );

    return response.data;
  },

  // Accept group invitation
  acceptInvitation: async (inviteId: string): Promise<GroupDto> => {
    const response = await apiClient.post(
      buildEndpoint(
        API_PREFIXES.USER_GROUPS,
        `/invitations/${inviteId}/accept`,
      ),
    );

    return response.data;
  },

  // Join group with link
  joinGroupWithLink: async (token: string): Promise<GroupDto> => {
    const response = await apiClient.post(
      buildEndpoint(API_PREFIXES.USER_GROUPS, `/groups/join/${token}`),
    );

    return response.data;
  },

  // Get group info by invite ID
  getGroupByInviteId: async (inviteId: string): Promise<GroupDto> => {
    const response = await apiClient.get(
      buildEndpoint(API_PREFIXES.USER_GROUPS, `/invitations/${inviteId}/group`),
    );

    return response.data;
  },

  // Get group info by join token
  getGroupByJoinToken: async (token: string): Promise<GroupDto> => {
    const response = await apiClient.get(
      buildEndpoint(API_PREFIXES.USER_GROUPS, `/groups/join/${token}/info`),
    );

    return response.data;
  },
};
