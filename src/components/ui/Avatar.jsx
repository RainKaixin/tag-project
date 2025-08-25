import React, { useState, useEffect } from 'react';

export function Avatar(props) {
  const { src, alt = 'Avatar', className = '', size = 32, lazy = true } = props;

  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const loadImage = async () => {
      try {
        if (lazy) {
          setImageSrc(null);
          setImageSrc(src);
        } else {
          setImageSrc(src);
        }
      } catch (error) {
        console.warn('Failed to load avatar:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src, lazy]);

  const defaultAvatar = (
    <svg
      className='w-full h-full text-gray-600'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      />
    </svg>
  );

  return (
    <div
      className={`rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {isLoading && (
        <div className='w-full h-full bg-gray-200 animate-pulse flex items-center justify-center'>
          {defaultAvatar}
        </div>
      )}

      {!isLoading && imageSrc && !hasError && (
        <img
          src={imageSrc}
          alt={alt}
          className='w-full h-full object-cover'
          onError={() => setHasError(true)}
        />
      )}

      {!isLoading && hasError && (
        <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
          {defaultAvatar}
        </div>
      )}
    </div>
  );
}
