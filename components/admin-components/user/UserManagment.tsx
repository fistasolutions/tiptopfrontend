"use client";
import IconSearch from "@/components/icon/icon-search";
import IconUserPlus from "@/components/icon/icon-user-plus";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUsers,
  deleteUser as deleteUserApi,
  deactivateUser as deactivateUserApi,
  User,
} from "@/services/userService";

const UserManagement = () => {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch users data
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: deleteUserApi,
    onMutate: async (userId: number) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData(["users"]);

      queryClient.setQueryData(["users"], (old: any) => {
        return old?.filter((user: User) => user.id !== userId) || [];
      });

      return { previousUsers };
    },
    onError: (err, userId, context) => {
      queryClient.setQueryData(["users"], context?.previousUsers);
      showMessage("Failed to delete user", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onSuccess: () => {
      showMessage("User has been deleted successfully.");
    },
  });

  // Deactivate user mutation
  const deactivateMutation = useMutation({
    mutationFn: deactivateUserApi,
    onMutate: async (userId: number) => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
      const previousUsers = queryClient.getQueryData(["users"]);

      queryClient.setQueryData(["users"], (old: any) => {
        return (
          old?.map((user: User) =>
            user.id === userId ? { ...user, status: "Inactive" as const } : user
          ) || []
        );
      });

      return { previousUsers };
    },
    onError: (err, userId, context) => {
      queryClient.setQueryData(["users"], context?.previousUsers);
      showMessage("Failed to deactivate user", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onSuccess: () => {
      showMessage("User has been deactivated successfully.");
    },
  });

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!search) return users;
    return users.filter((user: User) => {
      return (
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [users, search]);

  const handleEditUser = (user: User) => {
    // TODO: Implement edit user functionality
    showMessage("Edit user functionality coming soon", "info");
  };

  const handleDeactivateUser = (user: User) => {
    if (user.status === "Active") {
      Swal.fire({
        title: "Deactivate User?",
        text: `Are you sure you want to deactivate ${user.name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, deactivate",
        cancelButtonText: "Cancel",
        reverseButtons: true,
        customClass: {
          confirmButton: "btn btn-warning",
          cancelButton: "btn btn-secondary",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          deactivateMutation.mutate(user.id);
        }
      });
    } else {
      showMessage("User is already inactive", "info");
    }
  };

  const handleDeleteUser = (user: User) => {
    Swal.fire({
      title: "Delete User?",
      text: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(user.id);
      }
    });
  };

  const handleViewDetails = (user: User) => {
    // TODO: Implement view details functionality
    showMessage("View details functionality coming soon", "info");
  };

  const handleAddUser = () => {
    router.push("/add-user");
  };

  const showMessage = (msg = "", type = "success") => {
    const toast: any = Swal.mixin({
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: "toast" },
    });
    toast.fire({
      icon: type,
      title: msg,
      padding: "10px 20px",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">
          Error loading users. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">User Management</h2>
        </div>
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
          <div className="flex gap-3">
            <button className="btn btn-primary" onClick={handleAddUser}>
              <IconUserPlus className="mr-2 h-4 w-4" />
              Add User
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users"
              className="peer form-input py-2 ltr:pr-11 rtl:pl-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="button"
              className="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]"
            >
              <IconSearch className="mx-auto" />
            </button>
          </div>
        </div>
      </div>

      <div className="panel mt-5 overflow-hidden border-0 p-0">
        <div className="table-responsive">
          <table className="table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th className="!text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user: User) => (
                  <tr key={user.id}>
                    <td className="font-medium">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge badge-outline-secondary">
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          user.status === "Active"
                            ? "badge-outline-success"
                            : "badge-outline-warning"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>{user.lastLogin}</td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleDeactivateUser(user)}
                        >
                          Deactivate
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-info"
                          onClick={() => handleViewDetails(user)}
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-4 text-center">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
