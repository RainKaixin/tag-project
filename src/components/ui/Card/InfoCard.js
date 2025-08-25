import React from 'react';

const InfoCard = ({
  children,
  className = '',
  padding = 'p-6',
  shadow = 'shadow-sm',
  border = 'border border-gray-200',
}) => {
  return (
    <div
      className={`
      bg-white rounded-lg ${shadow} ${border} ${padding} ${className}
    `}
    >
      {children}
    </div>
  );
};

export default InfoCard;
