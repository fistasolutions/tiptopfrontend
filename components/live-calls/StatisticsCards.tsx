import React from "react";

interface StatCard {
  title: string;
  value: number | string;
  color: string;
  icon?: React.ReactNode;
}

interface StatisticsCardsProps {
  stats: StatCard[];
  title?: string;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({ stats, title }) => {
  return (
    <div>
      {title && <h2 className="mb-4 text-lg font-bold">{title}</h2>}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl shadow-sm"
            style={{ backgroundColor: stat.color }}
          >
            <div className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-white text-opacity-80">
                  {stat.title}
                </p>
                <h3 className="mt-1 text-3xl font-bold text-white">
                  {stat.value}
                </h3>
              </div>
              <div
                className="rounded-full p-3"
                style={{ backgroundColor: `${stat.color}80` }}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsCards;
