"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DataVisualizations = () => {
  // Claims Performance Chart Data
  const claimsPerformanceData = {
    labels: ["Total", "Submit", "Pending"],
    datasets: [
      {
        label: "Claims Count",
        data: [1250, 930, 320],
        backgroundColor: ["#6F4FF3", "#10B981", "#1A1A2E"],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const claimsPerformanceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "#6F4FF3",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#6B7280",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            weight: "500",
          },
        },
      },
    },
  };

  // Top Performing Staff Chart Data
  const staffPerformanceData = {
    labels: ["Staff A", "Staff B", "Staff C", "Staff D"],
    datasets: [
      {
        label: "Performance Score",
        data: [95, 75, 25, 65],
        backgroundColor: ["#6F4FF3", "#10B981", "#1A1A2E", "#DA5C2A"],
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const staffPerformanceOptions = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "#6F4FF3",
        borderWidth: 1,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#6B7280",
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#6B7280",
          font: {
            weight: "500",
          },
        },
      },
    },
  };

  return (
    <div className="mt-8">
      <h3 className="mb-4 text-lg font-semibold">Data Visualizations</h3>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Claims Performance Chart */}
        <div className="panel">
          <h4 className="mb-4 text-base font-medium">Claims Performance</h4>
          <div className="h-48">
            <Bar
              data={claimsPerformanceData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    titleColor: "white",
                    bodyColor: "white",
                    borderColor: "#6F4FF3",
                    borderWidth: 1,
                    cornerRadius: 8,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(0, 0, 0, 0.1)",
                    },
                    ticks: {
                      color: "#6B7280",
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: "#6B7280",
                      font: {
                        weight: "bold",
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Top Performing Staff Chart */}
        <div className="panel">
          <h4 className="mb-4 text-base font-medium">Top Performing Staff</h4>
          <div className="h-48">
            <Bar
              data={staffPerformanceData}
              options={{
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    titleColor: "white",
                    bodyColor: "white",
                    borderColor: "#6F4FF3",
                    borderWidth: 1,
                    cornerRadius: 8,
                  },
                },
                scales: {
                  x: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                      color: "rgba(0, 0, 0, 0.1)",
                    },
                    ticks: {
                      color: "#6B7280",
                    },
                  },
                  y: {
                    grid: {
                      display: false,
                    },
                    ticks: {
                      color: "#6B7280",
                      font: {
                        weight: "bold" as const,
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataVisualizations;
