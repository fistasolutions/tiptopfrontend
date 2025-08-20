// Mock notification data based on the UI design
export interface Notification {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  type: "schedule" | "claim" | "system" | "availability" | "case";
  isRead: boolean;
  isArchived: boolean;
  icon: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "Schedule Update",
    description: "Your schedule for tomorrow has been updated.",
    timestamp: "2 hours ago",
    type: "schedule",
    isRead: false,
    isArchived: false,
    icon: "calendar",
  },
  {
    id: 2,
    title: "New Claim Received",
    description: "A new claim has been submitted for your review.",
    timestamp: "4 hours ago",
    type: "claim",
    isRead: false,
    isArchived: false,
    icon: "document",
  },
  {
    id: 3,
    title: "System Maintenance",
    description: "System maintenance will occur tonight at 11 PM.",
    timestamp: "1 day ago",
    type: "system",
    isRead: true,
    isArchived: false,
    icon: "gear",
  },
  {
    id: 4,
    title: "Availability Confirmed",
    description: "Your availability for next week has been confirmed.",
    timestamp: "2 days ago",
    type: "availability",
    isRead: true,
    isArchived: false,
    icon: "calendar",
  },
  {
    id: 5,
    title: "New Case Assigned",
    description: "A case has been assigned to you for next Monday.",
    timestamp: "3 days ago",
    type: "case",
    isRead: true,
    isArchived: false,
    icon: "briefcase",
  },
  {
    id: 6,
    title: "Payment Processed",
    description: "Your payment for claim #12345 has been processed.",
    timestamp: "1 week ago",
    type: "claim",
    isRead: true,
    isArchived: true,
    icon: "document",
  },
  {
    id: 7,
    title: "Meeting Reminder",
    description: "You have a team meeting in 30 minutes.",
    timestamp: "1 week ago",
    type: "schedule",
    isRead: true,
    isArchived: true,
    icon: "calendar",
  },
];

// Get all notifications
export const getNotifications = async (): Promise<Notification[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return [...mockNotifications];
};

// Get notifications by filter
export const getNotificationsByFilter = async (
  filter: "all" | "unread" | "archived"
): Promise<Notification[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  switch (filter) {
    case "unread":
      return mockNotifications.filter(
        (notification) => !notification.isRead && !notification.isArchived
      );
    case "archived":
      return mockNotifications.filter(
        (notification) => notification.isArchived
      );
    default:
      return mockNotifications.filter(
        (notification) => !notification.isArchived
      );
  }
};

// Mark notification as read
export const markAsRead = async (id: number): Promise<Notification | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const notification = mockNotifications.find((n) => n.id === id);
  if (notification) {
    notification.isRead = true;
    return notification;
  }
  return null;
};

// Mark notification as archived
export const markAsArchived = async (
  id: number
): Promise<Notification | null> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const notification = mockNotifications.find((n) => n.id === id);
  if (notification) {
    notification.isArchived = true;
    return notification;
  }
  return null;
};

// Mark all notifications as read
export const markAllAsRead = async (): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  mockNotifications.forEach((notification) => {
    if (!notification.isArchived) {
      notification.isRead = true;
    }
  });

  return true;
};

// Delete notification
export const deleteNotification = async (id: number): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = mockNotifications.findIndex((n) => n.id === id);
  if (index !== -1) {
    mockNotifications.splice(index, 1);
    return true;
  }
  return false;
};
