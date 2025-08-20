"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSettings,
  updateProfile,
  updateSecurity,
  updateNotifications,
  changePassword,
  UserProfile,
  SecuritySettings,
  NotificationSettings,
} from "@/services/settingsService";
import IconUser from "@/components/icon/icon-user";
import IconLock from "@/components/icon/icon-lock";
import IconBell from "@/components/icon/icon-bell";
import Swal from "sweetalert2";

type TabType = "profile" | "security" | "notification";

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  // Query for settings data
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  // Form states
  const [profileForm, setProfileForm] = useState<UserProfile>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [securityForm, setSecurityForm] = useState<SecuritySettings>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationForm, setNotificationForm] =
    useState<NotificationSettings>({
      emailClaimAssignments: true,
      emailClaimUpdates: true,
      inAppSystemAnnouncements: false,
    });

  // Update form data when settings are loaded
  React.useEffect(() => {
    if (settings) {
      setProfileForm(settings.profile);
      setSecurityForm(settings.security);
      setNotificationForm(settings.notifications);
    }
  }, [settings]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      showSuccessMessage("Profile updated successfully");
    },
    onError: (error) => {
      showErrorMessage("Failed to update profile");
    },
  });

  const updateSecurityMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      setSecurityForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showSuccessMessage("Password changed successfully");
    },
    onError: (error) => {
      showErrorMessage(
        error instanceof Error ? error.message : "Failed to change password"
      );
    },
  });

  const updateNotificationMutation = useMutation({
    mutationFn: updateNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      showSuccessMessage("Notification settings updated successfully");
    },
    onError: (error) => {
      showErrorMessage("Failed to update notification settings");
    },
  });

  // Handle tab change
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show confirmation modal
    const result = await Swal.fire({
      title: "Confirm settings update",
      text: "To apply the changes, please confirm your settings update",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "panel",
        title: "text-center",
        htmlContainer: "text-center",
        actions: "text-center",
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
      },
    });

    if (result.isConfirmed) {
      updateProfileMutation.mutate(profileForm);
    }
  };

  // Handle security form submission
  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showErrorMessage("New passwords do not match");
      return;
    }

    if (securityForm.newPassword.length < 8) {
      showErrorMessage("Password must be at least 8 characters long");
      return;
    }

    // Show confirmation modal
    const result = await Swal.fire({
      title: "Confirm settings update",
      text: "To apply the changes, please confirm your settings update",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "panel",
        title: "text-center",
        htmlContainer: "text-center",
        actions: "text-center",
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
      },
    });

    if (result.isConfirmed) {
      updateSecurityMutation.mutate(securityForm);
    }
  };

  // Handle notification form submission
  const handleNotificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Show confirmation modal
    const result = await Swal.fire({
      title: "Confirm settings update",
      text: "To apply the changes, please confirm your settings update",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "panel",
        title: "text-center",
        htmlContainer: "text-center",
        actions: "text-center",
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
      },
    });

    if (result.isConfirmed) {
      updateNotificationMutation.mutate(notificationForm);
    }
  };

  // Handle form input changes
  const handleProfileInputChange =
    (field: keyof UserProfile) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setProfileForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSecurityInputChange =
    (field: keyof SecuritySettings) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSecurityForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleNotificationChange =
    (field: keyof NotificationSettings) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNotificationForm((prev) => ({ ...prev, [field]: e.target.checked }));
    };

  // Show success message
  const showSuccessMessage = (message: string) => {
    Swal.fire({
      title: "Settings saved successfully",
      text: message,
      icon: "success",
      confirmButtonText: "Close",
      customClass: {
        popup: "panel",
        title: "text-center",
        htmlContainer: "text-center",
        actions: "text-center",
        confirmButton: "btn btn-primary",
      },
    });
  };

  // Show error message
  const showErrorMessage = (message: string) => {
    Swal.fire({
      title: "Error",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
      customClass: {
        popup: "panel",
        title: "text-center",
        htmlContainer: "text-center",
        actions: "text-center",
        confirmButton: "btn btn-primary",
      },
    });
  };

  if (isLoadingSettings) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your personal and professional settings
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar - Navigation Tabs */}
        <div className="w-48 flex-shrink-0">
          <div className="panel">
            <div className="space-y-2">
              <button
                onClick={() => handleTabChange("profile")}
                className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left font-semibold transition-colors ${
                  activeTab === "profile"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <IconUser className="h-5 w-5" />
                Profile
              </button>
              <button
                onClick={() => handleTabChange("security")}
                className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left font-semibold transition-colors ${
                  activeTab === "security"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <IconLock className="h-5 w-5" />
                Security
              </button>
              <button
                onClick={() => handleTabChange("notification")}
                className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left font-semibold transition-colors ${
                  activeTab === "notification"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <IconBell className="h-5 w-5" />
                Notification
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="panel">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="mb-6 text-center text-xl font-bold">Profile</h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block font-semibold">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={handleProfileInputChange("firstName")}
                        className="form-input w-full"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block font-semibold">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={handleProfileInputChange("lastName")}
                        className="form-input w-full"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block font-semibold">Email</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileInputChange("email")}
                      className="form-input w-full"
                      placeholder="Enter your email address"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-semibold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phoneNumber}
                      onChange={handleProfileInputChange("phoneNumber")}
                      className="form-input w-full"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h2 className="mb-6 text-center text-xl font-bold">Security</h2>
                <form onSubmit={handleSecuritySubmit} className="space-y-6">
                  <div>
                    <label className="mb-2 block font-semibold">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={handleSecurityInputChange("currentPassword")}
                      className="form-input w-full"
                      placeholder="Enter your current password"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-semibold">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={handleSecurityInputChange("newPassword")}
                      className="form-input w-full"
                      placeholder="Enter your new password"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block font-semibold">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityInputChange("confirmPassword")}
                      className="form-input w-full"
                      placeholder="Confirm your new password"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updateSecurityMutation.isPending}
                    >
                      {updateSecurityMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Notification Tab */}
            {activeTab === "notification" && (
              <div>
                <h2 className="mb-6 text-center text-xl font-bold">
                  Notification
                </h2>
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailClaimAssignments"
                        checked={notificationForm.emailClaimAssignments}
                        onChange={handleNotificationChange(
                          "emailClaimAssignments"
                        )}
                        className="form-checkbox mr-3"
                      />
                      <label
                        htmlFor="emailClaimAssignments"
                        className="font-semibold"
                      >
                        Email notifications for new claim assignments
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailClaimUpdates"
                        checked={notificationForm.emailClaimUpdates}
                        onChange={handleNotificationChange("emailClaimUpdates")}
                        className="form-checkbox mr-3"
                      />
                      <label
                        htmlFor="emailClaimUpdates"
                        className="font-semibold"
                      >
                        Email notifications for claim updates
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="inAppSystemAnnouncements"
                        checked={notificationForm.inAppSystemAnnouncements}
                        onChange={handleNotificationChange(
                          "inAppSystemAnnouncements"
                        )}
                        className="form-checkbox mr-3"
                      />
                      <label
                        htmlFor="inAppSystemAnnouncements"
                        className="font-semibold"
                      >
                        In-app notifications for system announcements
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updateNotificationMutation.isPending}
                    >
                      {updateNotificationMutation.isPending
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
