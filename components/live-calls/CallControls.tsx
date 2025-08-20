import React from 'react';

interface CallControlsProps {
  isRecording: boolean;
  product: string;
  focus: string;
  isLoading: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
  isRecording,
  product,
  focus,
  isLoading,
  onStartCall,
  onEndCall,
}) => {
  return (
    <div className="mt-6 flex justify-center">
      {!isRecording ? (
        <button
          onClick={onStartCall}
          disabled={isLoading || !product || !focus}
          className={`
            px-6 py-3 rounded-full font-medium text-white
            ${isLoading || !product || !focus
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'}
            transition-colors duration-200
          `}
        >
          {isLoading ? 'Starting...' : 'Start Call'}
        </button>
      ) : (
        <button
          onClick={onEndCall}
          disabled={isLoading}
          className={`
            px-6 py-3 rounded-full font-medium text-white
            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}
            transition-colors duration-200
          `}
        >
          {isLoading ? 'Ending...' : 'End Call'}
        </button>
      )}
    </div>
  );
};

export default CallControls; 