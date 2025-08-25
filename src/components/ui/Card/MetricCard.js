import React from 'react';

const MetricCard = ({ icon, value, label, className = '' }) => {
  return (
    <div className={`bg-gray-50 rounded-lg p-4 text-center ${className}`}>
      <div className='flex items-center justify-center mb-2'>{icon}</div>
      <div className='text-sm font-medium text-gray-900'>{value}</div>
      <div className='text-xs text-gray-500'>{label}</div>
    </div>
  );
};

export default MetricCard;
