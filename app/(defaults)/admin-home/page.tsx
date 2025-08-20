"use client";
import HeaderSection from "@/components/live-calls/HeaderSection";
import StatisticsCards from "@/components/live-calls/StatisticsCards";
import React from "react";

// AdminCard Component
const AdminCard = ({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="cursor-pointer rounded-lg border border-gray-100 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="mb-4 text-2xl">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

function AdminHome() {
  const headerData = {
    title: "Welcome back, Mr. Ahmad",
    description:
      "Manage users, system settings, and other administrative tasks.",
    buttons: [],
  };

  const statisticsData = [
    {
      title: "Total Users",
      value: 1250,
      color: "#6F4FF3",
      icon: null,
    },
    {
      title: "Active Users",
      value: 320,
      color: "#10B981",
      icon: null,
    },
    {
      title: "Pending Claims",
      value: 930,
      color: "#1A1A2E",
      icon: null,
    },
    {
      title: "Average Claim Processing Time",
      value: "7 Days",
      color: "#DA5C2A",
      icon: null,
    },
  ];

  const administrativeFunctions = [
    {
      icon: "👥",
      title: "User Management",
      description: "Manage existing users",
    },
    {
      icon: "➕",
      title: "Add User",
      description: "Add new users",
    },
    {
      icon: "⚙️",
      title: "System Configuration",
      description: "Configure system settings",
    },
    {
      icon: "🛡️",
      title: "Roles & Permissions",
      description: "Manage roles and permissions",
    },
    {
      icon: "📋",
      title: "Audit Logs",
      description: "View system activity logs",
    },
    {
      icon: "📊",
      title: "Reporting & Analytics",
      description: "Generate system reports",
    },
  ];

  return (
    <div>
      <HeaderSection {...headerData} />
      <StatisticsCards stats={statisticsData} title="Key Metrics" />

      {/* Administrative Functions Section */}
      <div className="mt-8 ">
        <h1 className="mb-6 text-xl font-bold  sm:text-2xl">
          Administrative Functions
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {administrativeFunctions.map((func, index) => (
            <AdminCard
              key={index}
              icon={func.icon}
              title={func.title}
              description={func.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
