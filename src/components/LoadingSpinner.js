import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const containerClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${containerClasses[size]} ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-primary-600`}></div>
      {text && (
        <p className="mt-2 text-gray-600">{text}</p>
      )}
    </div>
  );
};

// Full screen loading component
export const FullScreenLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <LoadingSpinner size="large" text={text} />
    </div>
  );
};

// Inline loading component for buttons
export const ButtonSpinner = () => {
  return (
    <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
  );
};

export default LoadingSpinner;