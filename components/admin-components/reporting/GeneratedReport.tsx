"use client";
import HeaderSection from "@/components/live-calls/HeaderSection";
import StatisticsCards from "@/components/live-calls/StatisticsCards";
import React from "react";

interface GeneratedReportData {
  claimId: string;
  patientName: string;
  insuranceCompany: string;
  status: string;
  submissionDate: string;
}

const GeneratedReport = () => {
  // KPI Data for the report
  const reportKpiStats = [
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

  // Generated Report Data
  const reportData: GeneratedReportData[] = [
    {
      claimId: "CL-2023-001",
      patientName: "Sophia Clark",
      insuranceCompany: "United Health",
      status: "Submitted",
      submissionDate: "2023-08-15",
    },
    {
      claimId: "CL-2023-002",
      patientName: "Ethan Carter",
      insuranceCompany: "Blue Cross",
      status: "Pending",
      submissionDate: "2023-08-16",
    },
    {
      claimId: "CL-2023-003",
      patientName: "Olivia Bennett",
      insuranceCompany: "Aetna",
      status: "Rejected",
      submissionDate: "2023-08-17",
    },
    {
      claimId: "CL-2023-004",
      patientName: "Liam Foster",
      insuranceCompany: "Cigna",
      status: "Submitted",
      submissionDate: "2023-08-18",
    },
    {
      claimId: "CL-2023-005",
      patientName: "Ava Harper",
      insuranceCompany: "Humana",
      status: "Pending",
      submissionDate: "2023-08-19",
    },
    {
      claimId: "CL-2023-006",
      patientName: "Noah Wilson",
      insuranceCompany: "United Health",
      status: "Submitted",
      submissionDate: "2023-08-20",
    },
    {
      claimId: "CL-2023-007",
      patientName: "Emma Thompson",
      insuranceCompany: "Blue Cross",
      status: "Rejected",
      submissionDate: "2023-08-21",
    },
    {
      claimId: "CL-2023-008",
      patientName: "William Davis",
      insuranceCompany: "Aetna",
      status: "Submitted",
      submissionDate: "2023-08-22",
    },
    {
      claimId: "CL-2023-009",
      patientName: "Isabella Garcia",
      insuranceCompany: "Cigna",
      status: "Pending",
      submissionDate: "2023-08-23",
    },
    {
      claimId: "CL-2023-010",
      patientName: "James Johnson",
      insuranceCompany: "Humana",
      status: "Submitted",
      submissionDate: "2023-08-24",
    },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return "badge badge-outline-secondary";
      case "pending":
        return "badge badge-outline-warning";
      case "rejected":
        return "badge badge-outline-danger";
      default:
        return "badge badge-outline-secondary";
    }
  };

  const handleExportPDF = () => {
    // Handle PDF export logic here
    console.log("Exporting report as PDF");
  };

  const handleExportCSV = () => {
    // Handle CSV export logic here
    console.log("Exporting report as CSV");
  };

  return (
    <div>
      {/* Header */}
      <HeaderSection
        title="Generated Report"
        description="Detailed overview of claims based on selected filters."
        buttons={[]}
      />

      {/* Key Performance Indicators */}
      <div className="mt-8">
        <StatisticsCards stats={reportKpiStats} />
      </div>

      {/* Claims Table */}
      <div className="mt-8">
        <div className="panel overflow-hidden border-0 p-0">
          <div className="table-responsive">
            <table className="table-striped table-hover">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Patient Name</th>
                  <th>Insurance Company</th>
                  <th>Status</th>
                  <th>Submission Date</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((report, index) => (
                  <tr key={index}>
                    <td className="font-medium">{report.claimId}</td>
                    <td>{report.patientName}</td>
                    <td>{report.insuranceCompany}</td>
                    <td>
                      <span className={getStatusBadgeClass(report.status)}>
                        {report.status}
                      </span>
                    </td>
                    <td>{report.submissionDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={handleExportPDF}
          className="btn btn-outline-dark px-6 py-3"
        >
          Export as PDF
        </button>
        <button onClick={handleExportCSV} className="btn btn-primary px-6 py-3">
          Export as CSV
        </button>
      </div>
    </div>
  );
};

export default GeneratedReport;
