import React from 'react';

const PrimaryButton = ({
  children,
  onClick,
  disabled = false,
  className = '',
  size = 'md',
  fullWidth = false,
}) => {
  const baseClasses =
    'bg-purple-600 text-white font-medium hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-3 text-lg',
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
        rounded-lg
      `}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
