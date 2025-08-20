import React from 'react';

interface Recommendation {
  id: string;
  type: 'suggestion' | 'warning' | 'tip';
  message: string;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ recommendations }) => {
  const getTypeStyles = (type: Recommendation['type']) => {
    switch (type) {
      case 'suggestion':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'tip':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  if (!recommendations.length) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">AI Recommendations</h3>
      <div className="space-y-2">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`p-3 rounded-lg border ${getTypeStyles(rec.type)}`}
          >
            <p className="text-sm">{rec.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations; 