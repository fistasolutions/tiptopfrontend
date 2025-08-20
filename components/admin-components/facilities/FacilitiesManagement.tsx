"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFacilities,
  toggleFacilityStatus,
  deleteFacility,
  Facility,
} from "@/services/facilityService";

const FacilitiesManagement = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch facilities data
  const {
    data: facilities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["facilities"],
    queryFn: getFacilities,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Toggle facility status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: toggleFacilityStatus,
    onMutate: async (facilityId: number) => {
      await queryClient.cancelQueries({ queryKey: ["facilities"] });
      const previousFacilities = queryClient.getQueryData(["facilities"]);

      queryClient.setQueryData(["facilities"], (old: any) => {
        return (
          old?.map((facility: Facility) =>
            facility.id === facilityId
              ? {
                  ...facility,
                  status: facility.status === "Active" ? "Inactive" : "Active",
                }
              : facility
          ) || []
        );
      });

      return { previousFacilities };
    },
    onError: (err, facilityId, context) => {
      queryClient.setQueryData(["facilities"], context?.previousFacilities);
      showMessage("Failed to update facility status", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
    onSuccess: () => {
      Swal.fire({
        title: "Success",
        text: "Facility status updated successfully",
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
    },
  });

  // Delete facility mutation
  const deleteMutation = useMutation({
    mutationFn: deleteFacility,
    onMutate: async (facilityId: number) => {
      await queryClient.cancelQueries({ queryKey: ["facilities"] });
      const previousFacilities = queryClient.getQueryData(["facilities"]);

      queryClient.setQueryData(["facilities"], (old: any) => {
        return (
          old?.filter((facility: Facility) => facility.id !== facilityId) || []
        );
      });

      return { previousFacilities };
    },
    onError: (err, facilityId, context) => {
      queryClient.setQueryData(["facilities"], context?.previousFacilities);
      showMessage("Failed to delete facility", "error");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["facilities"] });
    },
    onSuccess: () => {
      Swal.fire({
        title: "Success",
        text: "Facility deleted successfully",
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
    },
  });

  const handleAddNewFacility = () => {
    router.push("/facilities/add");
  };

  const handleEditFacility = (facility: Facility) => {
    // TODO: Implement edit facility functionality
    Swal.fire({
      title: "Information",
      text: "Edit facility functionality coming soon",
      icon: "info",
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

  const handleToggleStatus = (facility: Facility) => {
    const action = facility.status === "Active" ? "deactivate" : "activate";
    Swal.fire({
      title: "Confirmation Message",
      text: `Are you sure you want to ${action} ${facility.name}?`,
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
    }).then((result) => {
      if (result.isConfirmed) {
        toggleStatusMutation.mutate(facility.id);
      }
    });
  };

  const handleDeleteFacility = (facility: Facility) => {
    Swal.fire({
      title: "Confirmation Message",
      text: `Are you sure you want to delete ${facility.name}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "panel",
        title: "text-center",
        htmlContainer: "text-center",
        actions: "text-center",
        confirmButton: "btn btn-danger",
        cancelButton: "btn btn-secondary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(facility.id);
      }
    });
  };

  const showMessage = (
    msg = "",
    type: "success" | "error" | "info" = "success"
  ) => {
    Swal.fire({
      title:
        type === "success"
          ? "Success"
          : type === "error"
          ? "Error"
          : "Information",
      text: msg,
      icon: type as "success" | "error" | "warning" | "info" | "question",
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
          Error loading facilities. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Facilities Management</h1>
          <p className="text-gray-600">
            Manage and update facility information.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleAddNewFacility}>
          Add New Facility
        </button>
      </div>

      <div className="panel overflow-hidden border-0 p-0">
        <div className="table-responsive">
          <table className="table-striped table-hover">
            <thead>
              <tr>
                <th>Facility Name</th>
                <th>Address</th>
                <th>Contact Information</th>
                <th>Status</th>
                <th className="!text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.length > 0 ? (
                facilities.map((facility) => (
                  <tr key={facility.id}>
                    <td className="font-medium">{facility.name}</td>
                    <td>{facility.address}</td>
                    <td>{facility.contactInformation}</td>
                    <td>
                      <span
                        className={`badge ${
                          facility.status === "Active"
                            ? "badge-outline-success"
                            : "badge-outline-warning"
                        }`}
                      >
                        {facility.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleEditFacility(facility)}
                        >
                          Edit
                        </button>
                        <span className="text-gray-400">|</span>
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            facility.status === "Active"
                              ? "btn-outline-warning"
                              : "btn-outline-success"
                          }`}
                          onClick={() => handleToggleStatus(facility)}
                        >
                          {facility.status === "Active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center">
                    No facilities found
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

export default FacilitiesManagement;
