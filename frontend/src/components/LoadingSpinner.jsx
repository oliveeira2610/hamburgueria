import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Carregando' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`burger-loading ${sizeClasses[size]} mb-4`}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p className="font-nunito text-gray-600 loading-dots">{text}</p>
    </div>
  );
};

export default LoadingSpinner;

