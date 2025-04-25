import React from 'react';

const BadgeWithProgress = ({ xp }) => {
  let badge = {
    label: '🥉 Bronze',
    pillBg: 'bg-yellow-100',
    text: 'text-yellow-700',
    range: [0, 100],
  };
  
  if (xp > 300) {
    badge = {
      label: '🥇 Gold',
      pillBg: 'bg-yellow-200',
      text: 'text-yellow-800',
      range: [300,infinity],
    };
  } else if (xp > 100) {
    badge = {
      label: '🥈 Silver',
      pillBg: 'bg-gray-200',
      text: 'text-gray-800',
      range: [100,300],
    };
  }
  
  const [lower, upper] = badge.range;
  const progress = Math.min(((xp - lower) / (upper - lower)) * 100, 100).toFixed(0);
  
  return (
    <div className="space-y-2">
      <div
        className={`inline-block px-4 py-2 rounded-full font-medium text-sm border ${badge.text} ${badge.pillBg} border-opacity-60 border-gray-400`}
      >
        <span className="font-semibold">Badge:</span> {badge.label} ({xp} XP)
      </div>
      <div>
        <div className="text-sm text-gray-400 mb-1">Progress to next badge</div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-green-500 h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm mt-1 text-gray-300 font-medium">{progress}% Complete</div>
      </div>
    </div>
  );
};

export default BadgeWithProgress;