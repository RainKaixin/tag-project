import React from 'react';

const SecondaryButton = ({
  children,
  onClick,
  disabled = false,
  className = '',
  size = 'md',
  fullWidth = false,
  active = false,
}) => {
  const baseClasses = active
    ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
    : 'bg-white text-gray-700 border-2 border-gray-300 hover:bg-gray-50';

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        rounded-lg font-medium transition-all duration-200
      `}
    >
      {children}
    </button>
  );
};

export default SecondaryButton;
