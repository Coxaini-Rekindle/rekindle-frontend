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

import apiClient from "./apiClient";

// Groups API
export const groupsApi = {
  // Get all user groups
  getUserGroups: async (): Promise<GroupDto[]> => {
    const response = await apiClient.get("/groups");

    return response.data;
  },

  // Get specific group details
  getGroupDetails: async (groupId: string): Promise<GroupDto> => {
    const response = await apiClient.get(`/groups/${groupId}`);

    return response.data;
  },

  // Create a new group
  createGroup: async (groupData: CreateGroupRequest): Promise<GroupDto> => {
    const response = await apiClient.post("/groups", groupData);

    return response.data;
  },

  // Update a group
  updateGroup: async (
    groupId: string,
    groupData: UpdateGroupRequest,
  ): Promise<GroupDto> => {
    const response = await apiClient.put(`/groups/${groupId}`, groupData);

    return response.data;
  },

  // Get group members
  getGroupMembers: async (groupId: string): Promise<GroupMemberDto[]> => {
    const response = await apiClient.get(`/groups/${groupId}/members`);

    return response.data;
  },

  // Delete a group (only owners can delete)
  deleteGroup: async (groupId: string): Promise<void> => {
    await apiClient.delete(`/groups/${groupId}`);
  },

  // Remove user from group
  removeUserFromGroup: async (
    groupId: string,
    userIdToRemove: string,
  ): Promise<void> => {
    await apiClient.delete(`/groups/${groupId}/members/${userIdToRemove}`);
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
      `/groups/${groupId}/invites`,
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
      `/groups/${groupId}/invites/link`,
      linkData,
    );

    return response.data;
  },

  // Get user invitations
  getUserInvitations: async (): Promise<GroupInviteDto[]> => {
    const response = await apiClient.get("/invitations");

    return response.data;
  },

  // Accept group invitation
  acceptInvitation: async (inviteId: string): Promise<GroupDto> => {
    const response = await apiClient.post(`/invitations/${inviteId}/accept`);

    return response.data;
  },

  // Join group with link
  joinGroupWithLink: async (token: string): Promise<GroupDto> => {
    const response = await apiClient.post(`/groups/join/${token}`);

    return response.data;
  },
};
