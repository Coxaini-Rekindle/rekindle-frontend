import { useState } from "react";

import { NotificationDto, NotificationType } from "@/types/notification";

// Mock notification data
const mockNotifications: NotificationDto[] = [
  {
    id: "1",
    type: NotificationType.MEMBER_JOINED,
    title: "New member joined",
    message: "Alice Johnson joined the Smith Family group",
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
    data: {
      groupId: "group1",
      groupName: "Smith Family",
      userId: "user123",
      userName: "Alice Johnson",
    },
  },
  {
    id: "2",
    type: NotificationType.MEMORY_SHARED,
    title: "New memory shared",
    message:
      "John shared a photo from 'Summer Vacation 2023' in College Friends",
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    data: {
      groupId: "group2",
      groupName: "College Friends",
      userId: "user456",
      userName: "John",
      memoryId: "memory789",
      memoryTitle: "Summer Vacation 2023",
    },
  },
  {
    id: "3",
    type: NotificationType.GROUP_INVITATION,
    title: "Group invitation",
    message: "You've been invited to join 'Miller Family Reunion'",
    isRead: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
    data: {
      groupId: "group3",
      groupName: "Miller Family Reunion",
      invitationId: "invite123",
    },
  },
  {
    id: "4",
    type: NotificationType.GROUP_UPDATED,
    title: "Group updated",
    message: "Sarah updated the description of 'Work Friends'",
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(), // 3 days ago
    data: {
      groupId: "group4",
      groupName: "Work Friends",
      userId: "user789",
      userName: "Sarah",
    },
  },
  {
    id: "5",
    type: NotificationType.WELCOME,
    title: "Welcome to Rekindle!",
    message:
      "Welcome! Start by creating your first group or joining existing ones.",
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60000).toISOString(), // 1 week ago
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] =
    useState<NotificationDto[]>(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mark notifications as read
  const markAsRead = (notificationIds: string[]) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notificationIds.includes(notification.id)
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  };

  // Delete notification
  const deleteNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId),
    );
  };

  // Get recent notifications (last 10)
  const getRecentNotifications = () => {
    return notifications
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);
  };

  // Simulate fetching notifications
  const refreshNotifications = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  // Simulate adding a new notification (for demo purposes)
  const addMockNotification = () => {
    const newNotification: NotificationDto = {
      id: `mock-${Date.now()}`,
      type: NotificationType.MEMORY_SHARED,
      title: "New memory shared",
      message: `Someone shared a new memory in one of your groups`,
      isRead: false,
      createdAt: new Date().toISOString(),
      data: {
        groupId: "group1",
        groupName: "Demo Group",
        userId: "user999",
        userName: "Demo User",
        memoryId: "memory999",
        memoryTitle: "Demo Memory",
      },
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getRecentNotifications,
    refreshNotifications,
    addMockNotification, // For demo purposes
  };
};
