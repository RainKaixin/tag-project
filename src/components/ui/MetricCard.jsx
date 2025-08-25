import React from 'react';

export function MetricCard({ label, value, hint }) {
  return (
    <div className='rounded-2xl border border-gray-200 p-4 text-center'>
      <div className='text-2xl font-bold leading-none'>{value}</div>
      <div className='text-sm text-gray-600'>{label}</div>
      {hint && <div className='mt-1 text-xs text-gray-400'>{hint}</div>}
    </div>
  );
}
