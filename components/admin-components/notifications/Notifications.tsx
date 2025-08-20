"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationsByFilter,
  markAsRead,
  markAsArchived,
  markAllAsRead,
  deleteNotification,
  Notification,
} from "@/services/notificationService";
import IconCalendar from "@/components/icon/icon-calendar";
import IconFile from "@/components/icon/icon-file";
import IconSettings from "@/components/icon/icon-settings";
import IconBox from "@/components/icon/icon-box";
import IconChecks from "@/components/icon/icon-checks";
import IconArchive from "@/components/icon/icon-archive";
import IconTrash from "@/components/icon/icon-trash";

type FilterType = "all" | "unread" | "archived";

const Notifications: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const queryClient = useQueryClient();

  // Query for notifications based on filter
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", activeFilter],
    queryFn: () => getNotificationsByFilter(activeFilter),
  });

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAsArchivedMutation = useMutation({
    mutationFn: markAsArchived,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "calendar":
        return <IconCalendar className="h-6 w-6" />;
      case "document":
        return <IconFile className="h-6 w-6" />;
      case "gear":
        return <IconSettings className="h-6 w-6" />;
      case "briefcase":
        return <IconBox className="h-6 w-6" />;
      default:
        return <IconFile className="h-6 w-6" />;
    }
  };

  // Handle filter change
  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  // Handle mark as read
  const handleMarkAsRead = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  // Handle mark as archived
  const handleMarkAsArchived = (notification: Notification) => {
    if (!notification.isArchived) {
      markAsArchivedMutation.mutate(notification.id);
    }
  };

  // Handle delete notification
  const handleDeleteNotification = (notification: Notification) => {
    deleteMutation.mutate(notification.id);
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        {activeFilter === "all" && notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="btn btn-outline-primary btn-sm"
            disabled={markAllAsReadMutation.isPending}
          >
            <IconChecks className="mr-2 h-4 w-4" />
            Mark All as Read
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar - Filter Tabs */}
        <div className="w-48 flex-shrink-0">
          <div className="panel">
            <div className="space-y-2">
              <button
                onClick={() => handleFilterChange("all")}
                className={`w-full rounded-md px-4 py-3 text-left font-semibold transition-colors ${
                  activeFilter === "all"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("unread")}
                className={`w-full rounded-md px-4 py-3 text-left font-semibold transition-colors ${
                  activeFilter === "unread"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                Unread
              </button>
              <button
                onClick={() => handleFilterChange("archived")}
                className={`w-full rounded-md px-4 py-3 text-left font-semibold transition-colors ${
                  activeFilter === "archived"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                Archived
              </button>
            </div>
          </div>
        </div>

        {/* Main Content - Notifications List */}
        <div className="flex-1">
          <div className="panel">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">No notifications found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 rounded-lg border p-4 transition-colors ${
                      notification.isRead
                        ? "border-gray-200 dark:border-gray-700"
                        : "border-primary/20 bg-primary/5"
                    }`}
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                        {getIconComponent(notification.icon)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3
                            className={`font-semibold ${
                              notification.isRead ? "" : "font-bold"
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {notification.description}
                          </p>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="text-xs text-gray-500">
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification)}
                            className="btn btn-outline-primary btn-sm"
                            disabled={markAsReadMutation.isPending}
                          >
                            <IconChecks className="mr-1 h-3 w-3" />
                            Mark as Read
                          </button>
                        )}
                        {!notification.isArchived && (
                          <button
                            onClick={() => handleMarkAsArchived(notification)}
                            className="btn btn-outline-secondary btn-sm"
                            disabled={markAsArchivedMutation.isPending}
                          >
                            <IconArchive className="mr-1 h-3 w-3" />
                            Archive
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification)}
                          className="btn btn-outline-danger btn-sm"
                          disabled={deleteMutation.isPending}
                        >
                          <IconTrash className="mr-1 h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
