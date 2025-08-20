// Mock user settings data
export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface NotificationSettings {
  emailClaimAssignments: boolean;
  emailClaimUpdates: boolean;
  inAppSystemAnnouncements: boolean;
}

export interface Settings {
  profile: UserProfile;
  security: SecuritySettings;
  notifications: NotificationSettings;
}

// Mock initial settings data
const mockSettings: Settings = {
  profile: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phoneNumber: "+1 (555) 123-4567",
  },
  security: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
  notifications: {
    emailClaimAssignments: true,
    emailClaimUpdates: true,
    inAppSystemAnnouncements: false,
  },
};

// Get current settings
export const getSettings = async (): Promise<Settings> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  return { ...mockSettings };
};

// Update profile settings
export const updateProfile = async (
  profileData: Partial<UserProfile>
): Promise<UserProfile> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  mockSettings.profile = { ...mockSettings.profile, ...profileData };
  return mockSettings.profile;
};

// Update security settings
export const updateSecurity = async (
  securityData: Partial<SecuritySettings>
): Promise<SecuritySettings> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  mockSettings.security = { ...mockSettings.security, ...securityData };
  return mockSettings.security;
};

// Update notification settings
export const updateNotifications = async (
  notificationData: Partial<NotificationSettings>
): Promise<NotificationSettings> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  mockSettings.notifications = {
    ...mockSettings.notifications,
    ...notificationData,
  };
  return mockSettings.notifications;
};

// Change password
export const changePassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<boolean> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulate password validation
  if (passwordData.newPassword !== passwordData.confirmPassword) {
    throw new Error("New passwords do not match");
  }

  if (passwordData.newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  // Update the password in settings
  mockSettings.security = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  return true;
};
