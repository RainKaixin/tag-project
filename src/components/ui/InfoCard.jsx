import React from 'react';

export function InfoCard({ title, subtitle, children }) {
  return (
    <div className='rounded-2xl border border-gray-200 p-4'>
      {(title || subtitle) && (
        <div className='mb-2'>
          {title && <h3 className='text-base font-semibold'>{title}</h3>}
          {subtitle && <p className='text-sm text-gray-500'>{subtitle}</p>}
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
