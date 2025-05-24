export interface NotificationDto {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: NotificationData;
}

export enum NotificationType {
  GROUP_JOINED = "group_joined",
  MEMORY_SHARED = "memory_shared",
  GROUP_INVITATION = "group_invitation",
  GROUP_UPDATED = "group_updated",
  WELCOME = "welcome",
  MEMBER_LEFT = "member_left",
  MEMBER_JOINED = "member_joined",
}

export interface NotificationData {
  groupId?: string;
  groupName?: string;
  userId?: string;
  userName?: string;
  memoryId?: string;
  memoryTitle?: string;
  invitationId?: string;
}

export interface NotificationMarkAsReadRequest {
  notificationIds: string[];
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  groupUpdates: boolean;
  memoryShares: boolean;
  groupInvitations: boolean;
}
