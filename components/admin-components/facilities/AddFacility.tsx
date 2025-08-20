"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { createFacility } from "@/services/facilityService";

const AddFacility = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    contactName: "",
    status: "Active",
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
      newErrors.name = "Facility name is required";
    }

    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
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

    // Show confirmation modal first
    Swal.fire({
      title: "Confirmation Message",
      text: "Are you sure you want to add a new facility?",
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Construct the full address
          const address = `${formData.streetAddress}, ${formData.city}, ${formData.state} ${formData.zipCode}`;

          await createFacility({
            name: formData.name,
            address: address,
            contactInformation: formData.phoneNumber,
            status: formData.status as "Active" | "Inactive",
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            phoneNumber: formData.phoneNumber,
            contactName: formData.contactName,
          });

          // Show success modal
          Swal.fire({
            title: "Add New Facility successfully",
            text: "Your changes have been updated.",
            icon: "success",
            confirmButtonText: "Close",
            customClass: {
              popup: "panel",
              title: "text-center",
              htmlContainer: "text-center",
              actions: "text-center",
              confirmButton: "btn btn-primary",
            },
          }).then(() => {
            router.push("/facilities");
          });
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "Failed to create facility. Please try again.",
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
        }
      }
    });
  };

  const handleCancel = () => {
    // Show confirmation modal before canceling
    Swal.fire({
      title: "Confirmation Message",
      text: "Are you sure you want to cancel? All entered data will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Cancel",
      cancelButtonText: "Continue Editing",
      reverseButtons: true,
      customClass: {
        popup: "panel",
        title: "text-center",
        htmlContainer: "text-center",
        actions: "text-center",
        confirmButton: "btn btn-secondary",
        cancelButton: "btn btn-primary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/facilities");
      }
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Facility</h1>
      </div>

      <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Facility Name */}
              <div>
                <label htmlFor="name" className="mb-2 block font-semibold">
                  Facility Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter facility name"
                  className={`form-input ${errors.name ? "border-danger" : ""}`}
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-danger">{errors.name}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="mb-2 block font-semibold">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="Enter city name"
                  className={`form-input ${errors.city ? "border-danger" : ""}`}
                  value={formData.city}
                  onChange={handleInputChange}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-danger">{errors.city}</p>
                )}
              </div>

              {/* Zip Code */}
              <div>
                <label htmlFor="zipCode" className="mb-2 block font-semibold">
                  Zip Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  placeholder="Enter zip code"
                  className={`form-input ${
                    errors.zipCode ? "border-danger" : ""
                  }`}
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-danger">{errors.zipCode}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-2 block font-semibold"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter phone number"
                  className={`form-input ${
                    errors.phoneNumber ? "border-danger" : ""
                  }`}
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Street Address */}
              <div>
                <label
                  htmlFor="streetAddress"
                  className="mb-2 block font-semibold"
                >
                  Street Address
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  placeholder="Enter street address"
                  className={`form-input ${
                    errors.streetAddress ? "border-danger" : ""
                  }`}
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                />
                {errors.streetAddress && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.streetAddress}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label htmlFor="state" className="mb-2 block font-semibold">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  className={`form-select ${
                    errors.state ? "border-danger" : ""
                  }`}
                  value={formData.state}
                  onChange={handleInputChange}
                >
                  <option value="">Select state</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-danger">{errors.state}</p>
                )}
              </div>

              {/* Contact Name */}
              <div>
                <label
                  htmlFor="contactName"
                  className="mb-2 block font-semibold"
                >
                  Contact Name
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  placeholder="Enter contact name"
                  className={`form-input ${
                    errors.contactName ? "border-danger" : ""
                  }`}
                  value={formData.contactName}
                  onChange={handleInputChange}
                />
                {errors.contactName && (
                  <p className="mt-1 text-sm text-danger">
                    {errors.contactName}
                  </p>
                )}
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFacility;
