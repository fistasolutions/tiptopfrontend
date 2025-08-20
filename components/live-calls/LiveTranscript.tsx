import React from 'react';

interface LiveTranscriptProps {
  transcript: string;
}

const LiveTranscript: React.FC<LiveTranscriptProps> = ({ transcript }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Live Transcript</h3>
      <div className="p-4 bg-white rounded-lg border border-gray-200 min-h-[100px] max-h-[200px] overflow-y-auto">
        {transcript ? (
          <p className="whitespace-pre-wrap">{transcript}</p>
        ) : (
          <p className="text-gray-500 italic">Waiting for speech...</p>
        )}
      </div>
    </div>
  );
};

export default LiveTranscript; 