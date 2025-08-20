"use client";
import HeaderSection from "@/components/live-calls/HeaderSection";
import StatisticsCards from "@/components/live-calls/StatisticsCards";
import DataVisualizations from "./DataVisualizations";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface KPIStats {
  title: string;
  value: string;
  color: string;
}

const ReportingAnalytics = () => {
  const router = useRouter();
  const [filters, setFilters] = useState({
    dateRange: "",
    claimStatus: "",
    staff: "",
    insuranceCompany: "",
  });

  // KPI Data
  const kpiStats: KPIStats[] = [
    {
      title: "Total Claims",
      value: "1,250",
      color: "#6F4FF3",
    },
    {
      title: "Pending Claims",
      value: "320",
      color: "#10B981",
    },
    {
      title: "Submitted Claims",
      value: "930",
      color: "#1A1A2E",
    },
    {
      title: "Avg. Processing Time",
      value: "7 Days",
      color: "#DA5C2A",
    },
  ];

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateReport = () => {
    router.push("/generated-report");
  };

  const handleDownloadCSV = () => {
    // Handle CSV download logic here
    console.log("Downloading CSV with filters:", filters);
  };

  return (
    <div>
      {/* Header */}
      <HeaderSection
        title="Reporting & Analytics"
        description="Analyze key metrics of the claims process with customizable filters and visual representations."
        buttons={[]}
      />

      {/* Key Performance Indicators */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">
          Key Performance Indicators
        </h3>
        <StatisticsCards stats={kpiStats} title="" />
      </div>

      {/* Data Visualizations */}
      <DataVisualizations />

      {/* Filters Section */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold">Filters</h3>
        <div className="panel">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium">Date Range</label>
              <input
                type="text"
                placeholder="Select date range"
                className="form-input"
                value={filters.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium">Claim Status</label>
              <input
                type="text"
                placeholder="Select claim status"
                className="form-input"
                value={filters.claimStatus}
                onChange={(e) =>
                  handleFilterChange("claimStatus", e.target.value)
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium">Staff</label>
              <input
                type="text"
                placeholder="Select staff member"
                className="form-input"
                value={filters.staff}
                onChange={(e) => handleFilterChange("staff", e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 text-sm font-medium">
                Insurance Company
              </label>
              <input
                type="text"
                placeholder="Select insurance company"
                className="form-input"
                value={filters.insuranceCompany}
                onChange={(e) =>
                  handleFilterChange("insuranceCompany", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={handleGenerateReport}
          className="btn btn-outline-dark px-6 py-3"
        >
          Generate Report
        </button>
        <button
          onClick={handleDownloadCSV}
          className="btn btn-primary px-6 py-3"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
};

export default ReportingAnalytics;
