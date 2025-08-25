import React from 'react';

export function Splash() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center'>
      <div className='text-center'>
        {/* TAG Logo */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
            TAG
          </h1>
          <p className='text-gray-600 mt-2'>Loading your creative world...</p>
        </div>

        {/* Loading Animation */}
        <div className='flex justify-center space-x-2'>
          <div className='w-3 h-3 bg-blue-500 rounded-full animate-bounce'></div>
          <div
            className='w-3 h-3 bg-purple-500 rounded-full animate-bounce'
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className='w-3 h-3 bg-blue-500 rounded-full animate-bounce'
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>

        {/* Loading Text */}
        <p className='text-sm text-gray-500 mt-6'>
          Initializing application...
        </p>
      </div>
    </div>
  );
}

export default Splash;
