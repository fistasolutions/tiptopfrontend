import React from 'react';

interface Metrics {
  duration?: number;
  wordsPerMinute?: number;
  talkRatio?: number;
  fillerWords?: number;
}

interface CallMetricsDisplayProps {
  metrics: Metrics;
}

const CallMetricsDisplay: React.FC<CallMetricsDisplayProps> = ({ metrics }) => {
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Duration</p>
        <p className="text-2xl font-semibold mt-1">{formatDuration(metrics.duration)}</p>
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Words/Min</p>
        <p className="text-2xl font-semibold mt-1">{metrics.wordsPerMinute || 0}</p>
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Talk Ratio</p>
        <p className="text-2xl font-semibold mt-1">{metrics.talkRatio || 0}%</p>
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500">Filler Words</p>
        <p className="text-2xl font-semibold mt-1">{metrics.fillerWords || 0}</p>
      </div>
    </div>
  );
};

export default CallMetricsDisplay; 