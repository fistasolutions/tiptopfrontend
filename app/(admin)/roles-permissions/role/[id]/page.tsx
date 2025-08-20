"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import IconDesktop from "@/components/icon/icon-desktop";
import IconUser from "@/components/icon/icon-user";
import IconArrowBackward from "@/components/icon/icon-arrow-backward";

interface Permission {
  id: string;
  name: string;
  admin: boolean;
  staff: boolean;
}

interface PermissionSection {
  id: string;
  title: string;
  permissions: Permission[];
}

function AssignPermissions() {
  const params = useParams();
  const router = useRouter();
  const roleId = params.id as string;

  const [permissions, setPermissions] = useState<PermissionSection[]>([
    {
      id: "1",
      title: "Claim Intake - Form Entry",
      permissions: [
        { id: "1", name: "Create New Claim", admin: false, staff: false },
        { id: "2", name: "View Claim History", admin: false, staff: false },
        { id: "3", name: "Edit Claim Details", admin: false, staff: false },
        { id: "4", name: "Submit Claim", admin: false, staff: false },
      ],
    },
    {
      id: "2",
      title: "Claim Review & Submission Queue",
      permissions: [
        { id: "5", name: "Review Claim", admin: false, staff: false },
        { id: "6", name: "Submit Claim", admin: false, staff: false },
        {
          id: "7",
          name: "Override Submission Logic",
          admin: false,
          staff: false,
        },
      ],
    },
    {
      id: "3",
      title: "Automated Notifications / Alerts",
      permissions: [
        { id: "8", name: "Set Alerts", admin: false, staff: false },
        { id: "9", name: "View Pending Alerts", admin: false, staff: false },
        { id: "10", name: "Trigger Alerts", admin: false, staff: false },
      ],
    },
    {
      id: "4",
      title: "Document Upload & Management",
      permissions: [
        { id: "11", name: "Upload Documents", admin: false, staff: false },
        { id: "12", name: "View Documents", admin: false, staff: false },
        { id: "13", name: "Delete Documents", admin: false, staff: false },
      ],
    },
    {
      id: "5",
      title: "Reporting Dashboard",
      permissions: [
        { id: "14", name: "View Report Dashboard", admin: false, staff: false },
        { id: "15", name: "Export Reports", admin: false, staff: false },
        { id: "16", name: "Customize Reports", admin: false, staff: false },
      ],
    },
    {
      id: "6",
      title: "AI-Powered Claim Assistance",
      permissions: [
        {
          id: "17",
          name: "View AI Recommendations",
          admin: false,
          staff: false,
        },
        {
          id: "18",
          name: "Approve AI Suggestions",
          admin: false,
          staff: false,
        },
        { id: "19", name: "View Audit Logs", admin: false, staff: false },
      ],
    },
    {
      id: "7",
      title: "Audit Trail / Activity Logs",
      permissions: [
        { id: "20", name: "View Activity Logs", admin: false, staff: false },
        { id: "21", name: "Edit Activity Logs", admin: false, staff: false },
        { id: "22", name: "Delete Activity Logs", admin: false, staff: false },
      ],
    },
  ]);

  const handlePermissionToggle = (
    sectionId: string,
    permissionId: string,
    roleType: "admin" | "staff"
  ) => {
    setPermissions((prev) =>
      prev.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              permissions: section.permissions.map((permission) =>
                permission.id === permissionId
                  ? { ...permission, [roleType]: !permission[roleType] }
                  : permission
              ),
            }
          : section
      )
    );
  };

  const handleSaveChanges = () => {
    // Handle saving permission changes here
    console.log("Saving permissions:", permissions);
    // You can add API call here to save the permissions
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-black">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <IconArrowBackward className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Permission Matrix</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage role permissions and access controls
            </p>
          </div>
        </div>
      </div>

      {/* Content with bottom padding for floating bar */}
      <div className="mx-auto max-w-7xl px-6 py-8 pb-32">
        <div className="space-y-8">
          {permissions.map((section) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-black"
            >
              {/* Section Header */}
              <div className="bg-primary px-6 py-4">
                <h2 className="text-lg font-semibold text-white">
                  {section.title}
                </h2>
              </div>

              {/* Permissions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="w-1/2 px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                        Feature
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                        Admin Permissions
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-medium text-gray-900 dark:text-white">
                        Staff Permissions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.permissions.map((permission, index) => (
                      <tr
                        key={permission.id}
                        className={`border-b border-gray-200 dark:border-gray-700 ${
                          index === section.permissions.length - 1
                            ? "border-b-0"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {permission.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={permission.admin}
                            className={`${
                              permission.admin
                                ? "bg-primary"
                                : "bg-gray-200 dark:bg-gray-700"
                            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                            onClick={() =>
                              handlePermissionToggle(
                                section.id,
                                permission.id,
                                "admin"
                              )
                            }
                          >
                            <span
                              aria-hidden="true"
                              className={`${
                                permission.admin
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                          </button>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            type="button"
                            role="switch"
                            aria-checked={permission.staff}
                            className={`${
                              permission.staff
                                ? "bg-primary"
                                : "bg-gray-200 dark:bg-gray-700"
                            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                            onClick={() =>
                              handlePermissionToggle(
                                section.id,
                                permission.id,
                                "staff"
                              )
                            }
                          >
                            <span
                              aria-hidden="true"
                              className={`${
                                permission.staff
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-gray-800 px-6 py-4 shadow-lg dark:bg-gray-900">
        <div className="flex items-center space-x-6">
          {/* Left Side Icons */}

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleCancel}
              //   className="bg-black px-4 py-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              className="btn btn-outline-primary px-6 py-2 text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              className="btn btn-primary px-6 py-2"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignPermissions;
