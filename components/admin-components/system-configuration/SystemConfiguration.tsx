"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

interface SystemConfig {
  id: string;
  name: string;
  value: string;
  description: string;
  category: string;
  isActive: boolean;
  lastModified: string;
}

// Mock service for system configuration
const systemConfigService = {
  getSystemConfigurations: async (): Promise<SystemConfig[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        id: "1",
        name: "System Name",
        value: "Tip Top Anesthesia",
        description:
          "The name of the system displayed throughout the application",
        category: "General",
        isActive: true,
        lastModified: "2024-01-15 10:30:00",
      },
      {
        id: "2",
        name: "Session Timeout",
        value: "30",
        description: "Session timeout in minutes before automatic logout",
        category: "Security",
        isActive: true,
        lastModified: "2024-01-14 15:45:00",
      },
      {
        id: "3",
        name: "Email Notifications",
        value: "enabled",
        description: "Enable or disable email notifications for system events",
        category: "Notifications",
        isActive: true,
        lastModified: "2024-01-13 09:20:00",
      },

      {
        id: "4",
        name: "Max Login Attempts",
        value: "4",
        description:
          "Maximum number of failed login attempts before account lockout",
        category: "Security",
        isActive: true,
        lastModified: "2024-01-11 11:30:00",
      },
    ];
  },

  updateSystemConfiguration: async (
    id: string,
    value: string
  ): Promise<SystemConfig> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
      id,
      name: "Updated Config",
      value,
      description: "Updated configuration",
      category: "General",
      isActive: true,
      lastModified: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
  },

  toggleConfigurationStatus: async (
    id: string,
    isActive: boolean
  ): Promise<SystemConfig> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      id,
      name: "Toggled Config",
      value: "value",
      description: "Configuration with toggled status",
      category: "General",
      isActive,
      lastModified: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
  },
};

const SystemConfiguration = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const queryClient = useQueryClient();

  const {
    data: configurations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["system-configurations"],
    queryFn: systemConfigService.getSystemConfigurations,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) =>
      systemConfigService.updateSystemConfiguration(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-configurations"] });
      setEditingId(null);
      setEditValue("");
      Swal.fire({
        title: "Success!",
        text: "System configuration updated successfully",
        icon: "success",
        customClass: {
          popup: "panel",
          title: "text-center",
          htmlContainer: "text-center",
          actions: "text-center",
          confirmButton: "btn btn-primary",
        },
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to update system configuration",
        icon: "error",
        customClass: {
          popup: "panel",
          title: "text-center",
          htmlContainer: "text-center",
          actions: "text-center",
          confirmButton: "btn btn-danger",
        },
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      systemConfigService.toggleConfigurationStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["system-configurations"] });
      Swal.fire({
        title: "Success!",
        text: "Configuration status updated successfully",
        icon: "success",
        customClass: {
          popup: "panel",
          title: "text-center",
          htmlContainer: "text-center",
          actions: "text-center",
          confirmButton: "btn btn-primary",
        },
      });
    },
    onError: () => {
      Swal.fire({
        title: "Error!",
        text: "Failed to update configuration status",
        icon: "error",
        customClass: {
          popup: "panel",
          title: "text-center",
          htmlContainer: "text-center",
          actions: "text-center",
          confirmButton: "btn btn-danger",
        },
      });
    },
  });

  const handleEdit = (config: SystemConfig) => {
    setEditingId(config.id);
    setEditValue(config.value);
  };

  const handleSave = (id: string) => {
    if (!editValue.trim()) {
      Swal.fire({
        title: "Error!",
        text: "Configuration value cannot be empty",
        icon: "error",
        customClass: {
          popup: "panel",
          title: "text-center",
          htmlContainer: "text-center",
          actions: "text-center",
          confirmButton: "btn btn-danger",
        },
      });
      return;
    }

    updateMutation.mutate({ id, value: editValue });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    Swal.fire({
      title: "Confirm Status Change",
      text: `Are you sure you want to ${
        currentStatus ? "deactivate" : "activate"
      } this configuration?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, change it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "panel",
        title: "text-center",
        htmlContainer: "text-center",
        actions: "text-center",
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        toggleMutation.mutate({ id, isActive: !currentStatus });
      }
    });
  };

  const filteredConfigurations = configurations?.filter(
    (config) => activeCategory === "all" || config.category === activeCategory
  );

  const categories = [
    "all",
    ...Array.from(
      new Set(configurations?.map((config) => config.category) || [])
    ),
  ];

  if (isLoading) {
    return (
      <div className="panel">
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel">
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mb-2 text-xl font-semibold">
              Error Loading Configuration
            </div>
            <div className="text-sm opacity-70">Please try again later</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="panel">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">System Configuration</h2>
            <p className="mt-1 text-sm opacity-70">
              Manage system-wide settings and configurations
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm opacity-70">Last Updated:</span>
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="panel">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration List */}
      <div className="panel">
        <div className="overflow-x-auto">
          <table className="table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
                <th>Description</th>
                <th>Category</th>
                <th>Status</th>
                <th>Last Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConfigurations?.map((config) => (
                <tr key={config.id}>
                  <td className="font-medium">{config.name}</td>
                  <td>
                    {editingId === config.id ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="form-input w-full"
                        autoFocus
                      />
                    ) : (
                      <span className="font-mono text-sm">{config.value}</span>
                    )}
                  </td>
                  <td className="max-w-xs">
                    <span className="text-sm opacity-70">
                      {config.description}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-outline-primary">
                      {config.category}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        config.isActive ? "badge-success" : "badge-danger"
                      }`}
                    >
                      {config.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="text-sm opacity-70">
                    {new Date(config.lastModified).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      {editingId === config.id ? (
                        <>
                          <button
                            onClick={() => handleSave(config.id)}
                            className="btn btn-sm btn-primary"
                            disabled={updateMutation.isPending}
                          >
                            {updateMutation.isPending ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={handleCancel}
                            className="btn btn-sm btn-secondary"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(config)}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              handleToggleStatus(config.id, config.isActive)
                            }
                            className={`btn btn-sm ${
                              config.isActive
                                ? "btn-outline-danger"
                                : "btn-outline-success"
                            }`}
                            disabled={toggleMutation.isPending}
                          >
                            {toggleMutation.isPending
                              ? "Updating..."
                              : config.isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredConfigurations?.length === 0 && (
          <div className="py-8 text-center">
            <div className="mb-2 text-lg font-medium">
              No configurations found
            </div>
            <div className="text-sm opacity-70">
              {activeCategory === "all"
                ? "No system configurations available"
                : `No configurations found in the "${activeCategory}" category`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemConfiguration;
