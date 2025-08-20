"use client";
import IconSearch from "@/components/icon/icon-search";
import HeaderSection from "@/components/live-calls/HeaderSection";
import Image from "next/image";
import React, { useState, useMemo } from "react";

interface AuditLog {
  id: string;
  userId: string;
  claimId: string;
  actionType: string;
  timestamp: string;
}

const AuditLogs = () => {
  const [search, setSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Mock audit logs data
  const auditLogs: AuditLog[] = [
    {
      id: "1",
      userId: "user123",
      claimId: "claim001",
      actionType: "Claim Created",
      timestamp: "2024-01-15 10:00 AM",
    },
    {
      id: "2",
      userId: "user456",
      claimId: "claim001",
      actionType: "Claim Updated",
      timestamp: "2024-01-15 11:30 AM",
    },
    {
      id: "3",
      userId: "user789",
      claimId: "claim005",
      actionType: "Claim Paid",
      timestamp: "2024-01-19 11:00 AM",
    },
    {
      id: "4",
      userId: "user123",
      claimId: "claim006",
      actionType: "Claim Created",
      timestamp: "2024-01-20 08:30 AM",
    },
    {
      id: "5",
      userId: "user456",
      claimId: "claim007",
      actionType: "Claim Updated",
      timestamp: "2024-01-21 01:15 PM",
    },
    {
      id: "6",
      userId: "user789",
      claimId: "claim008",
      actionType: "Claim Submitted",
      timestamp: "2024-01-22 10:45 AM",
    },
    {
      id: "7",
      userId: "user123",
      claimId: "claim009",
      actionType: "Claim Approved",
      timestamp: "2024-01-23 03:30 PM",
    },
  ];

  // Filter audit logs based on search and date range
  const filteredAuditLogs = useMemo(() => {
    let filtered = auditLogs;

    // Apply search filter
    if (search) {
      filtered = filtered.filter((log) => {
        return (
          log.userId.toLowerCase().includes(search.toLowerCase()) ||
          log.claimId.toLowerCase().includes(search.toLowerCase()) ||
          log.actionType.toLowerCase().includes(search.toLowerCase())
        );
      });
    }

    // Apply date range filter
    if (startDate && endDate) {
      filtered = filtered.filter((log) => {
        const logDate = new Date(log.timestamp);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return logDate >= start && logDate <= end;
      });
    }

    return filtered;
  }, [auditLogs, search, startDate, endDate]);

  const handleClearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div>
      {/* Header */}
      <HeaderSection
        title="Audit Logs"
        description="Track all actions performed on claims within the system."
        buttons={[]}
      />

      {/* Search and Filter Section */}
      <div className="mt-8 space-y-6">
        {/* Search Bar */}
        <div className="w-full">
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <IconSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by User ID, Claim ID, or Action Type"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-12 py-3 text-gray-900 placeholder-gray-500 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary dark:focus:bg-gray-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex items-end gap-6">
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              Start Date
            </label>
            <input
              type="date"
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary dark:focus:bg-gray-600"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
              End Date
            </label>
            <input
              type="date"
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary dark:focus:bg-gray-600"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            onClick={handleClearFilters}
            className="btn btn-outline-secondary px-6 py-3"
            disabled={!search && !startDate && !endDate}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Table Section */}
      {filteredAuditLogs.length > 0 ? (
        <div className="panel mt-5 overflow-hidden border-0 p-0">
          <div className="table-responsive">
            <table className="table-striped table-hover">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Claim ID</th>
                  <th>Action Type</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-medium">{log.userId}</td>
                    <td>{log.claimId}</td>
                    <td>
                      <span className="badge badge-outline-primary">
                        {log.actionType}
                      </span>
                    </td>
                    <td>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* No Results Found UI */
        <div className="mt-12 flex flex-col items-center justify-center text-center">
          {/* Illustration */}
          <div className="mb-6 flex h-full w-full max-w-[350px] items-center justify-center rounded-2xl">
            <Image
              src={"/assets/images/no-results.png"}
              alt="no results"
              className="h-full w-full object-cover"
              width={360}
              height={254}
            />
          </div>

          {/* Message */}
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
            No activities found matching your criteria
          </h3>
          <p className="mb-8 text-gray-600 dark:text-gray-400">
            Clear Filters or Modify Search Criteria
          </p>

          {/* Action Button */}
          <button
            onClick={handleClearFilters}
            className="btn btn-primary px-8 py-3"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
