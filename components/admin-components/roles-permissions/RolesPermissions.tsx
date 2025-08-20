"use client";
import HeaderSection from "@/components/live-calls/HeaderSection";
import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import IconUser from "@/components/icon/icon-user";
import IconPencil from "@/components/icon/icon-pencil";
import IconX from "@/components/icon/icon-x";
import IconTrash from "@/components/icon/icon-trash";

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  userType: string;
}

function RolesPermissionsComponent() {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [deletingRole, setDeletingRole] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
  });

  const roles: Role[] = [
    {
      id: "1",
      name: "Administrator",
      description: "Full access to all system features and data.",
      userCount: 8,
      userType: "Administrator",
    },
    {
      id: "2",
      name: "Billing Manager",
      description: "Access to billing-related features, reports, and data.",
      userCount: 12,
      userType: "Manager",
    },
    {
      id: "3",
      name: "Intake Staff",
      description: "Limited access to intake forms and basic case information.",
      userCount: 20,
      userType: "Intake Staff",
    },
  ];

  const handleAddRole = () => {
    // Handle adding new role logic here
    console.log("Adding new role:", newRole);
    setIsAddModalOpen(false);
    setNewRole({ name: "", description: "" });
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    setIsEditModalOpen(true);
  };

  const handleUpdateRole = () => {
    // Handle updating role logic here
    console.log("Updating role:", editingRole);
    setIsEditModalOpen(false);
    setEditingRole(null);
  };

  const handleDeleteClick = (role: Role) => {
    setDeletingRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteRole = () => {
    // Handle deleting role logic here
    console.log("Deleting role:", deletingRole);
    setIsDeleteModalOpen(false);
    setDeletingRole(null);
  };

  const handleAssignPermissions = (roleId: string) => {
    router.push(`/roles-permissions/role/${roleId}`);
  };

  const headerData = {
    title: "Roles and Permissions",
    description:
      "Manage user roles and their associated permissions within the system.",
    buttons: [
      {
        label: "Add New Role",
        onClick: () => setIsAddModalOpen(true),
        variant: "primary" as const,
      },
    ],
  };

  return (
    <div>
      <HeaderSection {...headerData} />

      {/* Roles Grid */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <div
            key={role.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-black"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <IconUser className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{role.name}</h3>
                  <span className="inline-block rounded-full bg-gray-100 px-2 py-1 text-xs dark:bg-gray-800">
                    {role.userCount} {role.userType}
                  </span>
                </div>
              </div>
            </div>

            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {role.description}
            </p>

            <div className="flex items-center justify-between">
              <button
                className="btn btn-primary px-4 py-2 text-sm"
                onClick={() => handleAssignPermissions(role.id)}
              >
                Assign Permissions
              </button>
              <div className="flex items-center space-x-2">
                <button
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleEditRole(role)}
                >
                  <IconPencil className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Role Modal */}
      <Transition appear show={isAddModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsAddModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 dark:bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left align-middle shadow-xl transition-all dark:border-gray-700 dark:bg-black">
                  <div className="mb-5 flex items-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      Add Role
                    </Dialog.Title>
                    <button
                      onClick={() => setIsAddModalOpen(false)}
                      className="rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <IconX className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Role Name
                      </label>
                      <input
                        type="text"
                        className="form-input w-full"
                        placeholder="e.g., Senior Biller"
                        value={newRole.name}
                        onChange={(e) =>
                          setNewRole({ ...newRole, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Role Description
                      </label>
                      <textarea
                        className="form-textarea w-full"
                        rows={3}
                        placeholder="Enter role description (optional)"
                        value={newRole.description}
                        onChange={(e) =>
                          setNewRole({
                            ...newRole,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddRole}
                    >
                      Save
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Edit Role Modal */}
      <Transition appear show={isEditModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsEditModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 dark:bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left align-middle shadow-xl transition-all dark:border-gray-700 dark:bg-black">
                  <div className="mb-5 flex items-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      Edit Role
                    </Dialog.Title>
                    <button
                      onClick={() => setIsEditModalOpen(false)}
                      className="rounded-lg p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <IconX className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Role Name
                      </label>
                      <input
                        type="text"
                        className="form-input w-full"
                        value={editingRole?.name || ""}
                        onChange={(e) =>
                          setEditingRole(
                            editingRole
                              ? { ...editingRole, name: e.target.value }
                              : null
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Role Description
                      </label>
                      <textarea
                        className="form-textarea w-full"
                        rows={3}
                        value={editingRole?.description || ""}
                        onChange={(e) =>
                          setEditingRole(
                            editingRole
                              ? { ...editingRole, description: e.target.value }
                              : null
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        if (editingRole) {
                          handleDeleteClick(editingRole);
                        }
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleUpdateRole}
                    >
                      Update
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Modal */}
      <Transition appear show={isDeleteModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 dark:bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg border border-gray-200 bg-white p-6 text-left align-middle shadow-xl transition-all dark:border-gray-700 dark:bg-black">
                  <div className="mb-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6"
                    >
                      Delete Confirmation
                    </Dialog.Title>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm">
                      Are you sure, you want to delete this role?
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => setIsDeleteModalOpen(false)}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleDeleteRole}
                    >
                      Delete
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default RolesPermissionsComponent;
