
import React from 'react';

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
