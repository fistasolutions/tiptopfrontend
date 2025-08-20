import React from 'react';

interface CallContextInsightsProps {
  isVisible: boolean;
  product: string;
  focus: string;
  isRecording: boolean;
}

const CallContextInsights: React.FC<CallContextInsightsProps> = ({
  isVisible,
  product,
  focus,
  isRecording
}) => {
  if (!isVisible) return null;

  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Call Context</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Product:</span>
          <span className="font-medium">{product}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Focus Area:</span>
          <span className="font-medium">{focus}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${isRecording ? 'text-green-600' : 'text-gray-600'}`}>
            {isRecording ? 'Recording' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CallContextInsights; 