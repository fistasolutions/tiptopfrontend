"use client";
import IconUsers from "@/components/icon/icon-users";
import IconUserPlus from "@/components/icon/icon-user-plus";
import IconSettings from "@/components/icon/icon-settings";
import IconLock from "@/components/icon/icon-lock";
import IconNotes from "@/components/icon/icon-notes";
import IconBarChart from "@/components/icon/icon-bar-chart";
import HeaderSection from "@/components/live-calls/HeaderSection";
import StatisticsCards from "@/components/live-calls/StatisticsCards";
import React from "react";

function AdminAccessComponent() {
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
      icon: IconUsers,
      title: "User Management",
      description: "Manage existing users",
    },
    {
      icon: IconUserPlus,
      title: "Add User",
      description: "Add new users",
    },
    {
      icon: IconSettings,
      title: "System Configuration",
      description: "Configure system settings",
    },
    {
      icon: IconLock,
      title: "Roles & Permissions",
      description: "Manage roles and permissions",
    },
    {
      icon: IconNotes,
      title: "Audit Logs",
      description: "View system activity logs",
    },
    {
      icon: IconBarChart,
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
        <h1 className="mb-6 text-lg font-bold  ">Administrative Functions</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {administrativeFunctions.map((func, index) => (
            <AdminCard
              key={index}
              Icon={func.icon}
              title={func.title}
              description={func.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminAccessComponent;

// AdminCard Component
const AdminCard = ({
  Icon,
  title,
  description,
}: {
  Icon: React.FC;
  title: string;
  description: string;
}) => {
  return (
    <div className="panel">
      <div className="mb-4 text-2xl">
        <Icon />
      </div>
      <h3 className="mb-2 text-lg font-semibold ">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};
