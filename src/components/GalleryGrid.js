import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import {
  getAllPublicPortfolios,
  getPortfolioImageUrl,
} from '../services/supabase/portfolio';
import { useNavigation } from '../utils/navigation';

const GalleryGrid = ({ currentUser }) => {
  const { navigateToWork, navigateToArtist } = useNavigation();

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 加载所有公开作品
  const loadArtworks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getAllPublicPortfolios();

      if (result.success) {
        // 转换数据格式以匹配现有的 gallery 格式
        const formattedArtworks = await Promise.all(
          result.data
            .filter(item => item && item.id) // 过滤掉无效项目
            .map(async item => {
              const imagePath =
                item.thumbnailPath ||
                (item.imagePaths && item.imagePaths[0]) ||
                null;

              // 转换图片路径为公开URL
              let image = '/assets/placeholder.svg';
              if (imagePath) {
                try {
                  console.log(
                    `[GalleryGrid] Converting image path: ${imagePath}`
                  );
                  const imageResult = await getPortfolioImageUrl(imagePath);
                  console.log(
                    `[GalleryGrid] Image conversion result:`,
                    imageResult
                  );
                  if (
                    imageResult &&
                    imageResult.success &&
                    imageResult.data &&
                    imageResult.data.url
                  ) {
                    image = imageResult.data.url;
                    console.log(
                      `[GalleryGrid] Successfully converted to: ${image}`
                    );
                  } else {
                    console.warn(
                      `[GalleryGrid] Invalid image result:`,
                      imageResult
                    );
                  }
                } catch (error) {
                  console.warn(
                    `[GalleryGrid] Failed to convert image path ${imagePath}:`,
                    error
                  );
                }
              }

              console.log(`[GalleryGrid] Item ${item.id}:`, {
                title: item.title,
                thumbnailPath: item.thumbnailPath,
                imagePaths: item.imagePaths,
                finalImage: image,
              });

              return {
                id: item.id || 'unknown',
                title: item.title || 'Untitled',
                artist: item.profiles?.full_name || 'Unknown Artist',
                image: image,
                category: item.category || '',
                tags: item.tags || [],
                description: item.description || '',
                createdAt: item.createdAt || new Date().toISOString(),
              };
            })
        );

        setArtworks(formattedArtworks);
      } else {
        setError(result.error || 'Failed to load artworks');
        // 如果加载失败，显示空状态
        setArtworks([]);
      }
    } catch (error) {
      console.error('Error loading artworks:', error);
      setError('Failed to load artworks');
      // 如果出错，显示空状态
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    loadArtworks();
  }, [loadArtworks]);

  // 根据当前用户显示不同的作品数据
  const getArtworksByUser = () => {
    // 只显示实际加载的作品，不使用默认数据
    return artworks;
  };

  // 默认作品数据已删除 - 现在只显示用户实际上传的作品

  const displayArtworks = getArtworksByUser();

  // 显示加载状态
  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0'>
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className='aspect-square bg-gray-200 animate-pulse'
          ></div>
        ))}
      </div>
    );
  }

  // 显示错误状态
  if (error) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='text-gray-400 mb-4'>
          <svg
            className='w-16 h-16 mx-auto'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          Failed to load artworks
        </h3>
        <p className='text-gray-600 mb-4'>{error}</p>
        <button
          onClick={loadArtworks}
          className='px-4 py-2 bg-tag-blue text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          Try Again
        </button>
      </div>
    );
  }

  // 显示空状态
  if (displayArtworks.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-12 text-center'>
        <div className='text-gray-400 mb-4'>
          <svg
            className='w-16 h-16 mx-auto'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
          No artworks found
        </h3>
        <p className='text-gray-600 mb-4'>
          Be the first to upload your work and share it with the community!
        </p>
        <Link
          to='/upload'
          className='px-4 py-2 bg-tag-blue text-white rounded-lg hover:bg-blue-600 transition-colors'
        >
          Upload Your Work
        </Link>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-0'>
      {displayArtworks.map(artwork => (
        <Link
          key={artwork.id}
          to={`/work/${artwork.id}`}
          className='group cursor-pointer relative overflow-hidden aspect-square w-full h-full'
        >
          <img
            src={artwork.image}
            alt={artwork.title}
            className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
            style={{ display: 'block' }}
          />

          {/* Hover Overlay with Information */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
            <div className='absolute bottom-0 left-0 right-0 p-4 text-white'>
              <h3 className='text-lg font-bold mb-1 leading-tight'>
                {artwork.title}
              </h3>
              <p className='text-sm text-gray-200'>{artwork.artist}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default GalleryGrid;
