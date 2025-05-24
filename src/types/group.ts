// Types based on the OpenAPI specification

export interface GroupDto {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  memberCount: number;
  isCurrentUserMember: boolean;
  isCurrentUserOwner: boolean;
}

export interface GroupMemberDto {
  userId: string;
  name: string;
  username: string;
  email: string;
  role: GroupUserRole;
  joinedAt: string;
}

export enum GroupUserRole {
  Owner = "Owner",
  Member = "Member",
}

export interface CreateGroupRequest {
  name: string;
  description: string;
  invitationEmails: string[];
}

export interface UpdateGroupRequest {
  name: string;
  description: string;
}

export interface InviteToGroupRequest {
  email: string;
}

export interface GroupInviteDto {
  id: string;
  groupId: string;
  groupName: string;
  invitedByUsername: string;
  invitedUsername: string | null;
  email: string | null;
  status: InvitationStatus;
  createdAt: string;
  expiresAt: string;
}

export enum InvitationStatus {
  Pending = "Pending",
  Accepted = "Accepted",
  Declined = "Declined",
  Expired = "Expired",
}

export interface CreateInviteLinkRequest {
  maxUses?: number;
  expirationDays?: number;
}

export interface InviteLinkResponse {
  invitationLink: string;
}

// Legacy interface for compatibility with existing components
export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
}
