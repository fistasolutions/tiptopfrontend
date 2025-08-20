"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { createUser } from "@/services/userService";

const AddUser = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    teamAssignment: "",
    role: "",
    status: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    if (!formData.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await createUser({
        name: formData.name,
        email: formData.email,
        role: formData.role as "Admin" | "Staff",
        status: formData.status as "Active" | "Inactive",
        lastLogin: "Never",
      });

      Swal.fire({
        title: "Success!",
        text: "User has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        router.push("/user-managment");
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to create user. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleCancel = () => {
    router.push("/user-managment");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add User</h1>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="mb-2 block font-semibold">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter user's full name"
                  className={`form-input ${errors.name ? "border-danger" : ""}`}
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-danger">{errors.name}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-2 block font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  className={`form-input ${
                    errors.password ? "border-danger" : ""
                  }`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-danger">{errors.password}</p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label
                  htmlFor="contactNumber"
                  className="mb-2 block font-semibold"
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="Enter contact number (optional)"
                  className="form-input"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                />
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="mb-2 block font-semibold">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className={`form-select ${
                    errors.role ? "border-danger" : ""
                  }`}
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  <option value="">Select Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Staff">Staff</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-danger">{errors.role}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Email Address */}
              <div>
                <label htmlFor="email" className="mb-2 block font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter user's email"
                  className={`form-input ${
                    errors.email ? "border-danger" : ""
                  }`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-danger">{errors.email}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block font-semibold"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  className={`form-input ${
                    errors.confirmPassword ? "border-danger" : ""
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Team Assignment */}
              <div>
                <label
                  htmlFor="teamAssignment"
                  className="mb-2 block font-semibold"
                >
                  Team Assignment
                </label>
                <input
                  type="text"
                  id="teamAssignment"
                  name="teamAssignment"
                  placeholder="Assign to a team (optional)"
                  className="form-input"
                  value={formData.teamAssignment}
                  onChange={handleInputChange}
                />
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="mb-2 block font-semibold">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className={`form-select ${
                    errors.status ? "border-danger" : ""
                  }`}
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-danger">{errors.status}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
