import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { artistService } from '../services/index.js';
import { useNavigation } from '../utils/navigation';

// 添加CSS样式来移除所有可能的列表项指示器
const listStyleReset = {
  listStyle: 'none',
  listStyleType: 'none',
  listStyleImage: 'none',
  listStylePosition: 'outside',
};

const ArtistsList = ({ onArtistClick }) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { navigateToArtist } = useNavigation();

  // 添加CSS样式来移除所有可能的列表项指示器
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .no-markers::before,
      .no-markers::after,
      .no-markers *::before,
      .no-markers *::after {
        content: none !important;
        display: none !important;
      }
      .no-markers {
        list-style: none !important;
        list-style-type: none !important;
        list-style-image: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setLoading(true);
      const result = await artistService.getPublicArtists();

      if (result && result.success) {
        console.log('[ArtistsList] Loaded artists:', result.data.length);
        setArtists(result.data);
      } else {
        console.error('[ArtistsList] Failed to load artists:', result?.error);
        setError('Failed to load artists');
      }
    } catch (error) {
      console.error('[ArtistsList] Error loading artists:', error);
      setError('Error loading artists');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = category => {
    const colors = {
      'Visual Effects': 'bg-blue-500',
      'Game Design': 'bg-purple-500',
      'UI/UX': 'bg-green-500',
      Illustration: 'bg-pink-500',
      'Fine Art': 'bg-yellow-500',
      '3D Model': 'bg-indigo-500',
      Animation: 'bg-red-500',
      Photography: 'bg-gray-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const handleArtistClick = (artist, event) => {
    // 使用navigateToArtist函数，传递来源信息和元素信息
    navigateToArtist(artist.id, 'artists', 'Artists', event.currentTarget);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-tag-blue'></div>
        <span className='ml-3 text-gray-600'>Loading artists...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='text-red-500 text-center'>
          <p className='text-lg font-medium'>Error loading artists</p>
          <p className='text-sm text-gray-600 mt-2'>{error}</p>
          <button
            onClick={loadArtists}
            className='mt-4 px-4 py-2 bg-tag-blue text-white rounded-lg hover:bg-blue-600 transition-colors'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (artists.length === 0) {
    return (
      <div className='flex justify-center items-center py-12'>
        <div className='text-center'>
          <p className='text-lg font-medium text-gray-900'>No artists found</p>
          <p className='text-sm text-gray-600 mt-2'>
            Check back later for new artists
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-0 list-none no-markers' style={listStyleReset}>
      {artists.map(artist => (
        <div
          key={artist.id}
          className='group cursor-pointer bg-white border-b border-gray-200 p-6 hover:bg-gray-50 transition-all duration-300 block'
          style={listStyleReset}
          onClick={event => handleArtistClick(artist, event)}
          data-artist-id={artist.id}
        >
          <div className='flex gap-4'>
            {/* Left Side - Artist Avatar */}
            <div className='flex-shrink-0'>
              <img
                src={
                  artist.avatar ||
                  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                }
                alt={artist.name}
                className='w-40 h-32 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300'
              />
            </div>

            {/* Right Side - Content */}
            <div className='flex-1 flex flex-col justify-center'>
              {/* Artist Name */}
              <h3 className='text-xl font-bold text-gray-900 mb-2 group-hover:text-tag-blue transition-colors duration-200'>
                {artist.name}
              </h3>

              {/* Role */}
              <span className='text-sm text-gray-500 mb-2'>{artist.role}</span>

              {/* Description */}
              <div className='mb-4'>
                {artist.bio ? (
                  <p className='text-sm text-gray-600 leading-relaxed'>
                    {artist.bio}
                  </p>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {/* Title */}
                    <span className='bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full'>
                      {artist.title || 'Artist'}
                    </span>

                    {/* School */}
                    {artist.school && (
                      <span className='bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full'>
                        {artist.school}
                      </span>
                    )}

                    {/* Majors */}
                    {artist.majors &&
                      artist.majors.length > 0 &&
                      artist.majors.map((major, index) => (
                        <span
                          key={index}
                          className='bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full'
                        >
                          {major}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Bottom Info Row */}
              <div className='flex items-center gap-6 text-sm text-gray-500'>
                {/* Works Count */}
                <div className='flex items-center gap-1'>
                  <svg
                    className='w-4 h-4 text-blue-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
                    />
                  </svg>
                  <span>{artist.worksCount || 0} works</span>
                </div>

                {/* Followers */}
                <div className='flex items-center gap-1'>
                  <svg
                    className='w-4 h-4 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                    />
                  </svg>
                  <span>{artist.followers || 0} followers</span>
                </div>

                {/* Following */}
                <div className='flex items-center gap-1'>
                  <svg
                    className='w-4 h-4 text-gray-400'
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
                  <span>{artist.following || 0} following</span>
                </div>

                {/* Role Tag */}
                <span
                  className={`px-2 py-1 text-xs font-medium text-white rounded-full ${getCategoryColor(
                    artist.role
                  )}`}
                >
                  {artist.role}
                </span>

                {/* School */}
                {artist.school && (
                  <span className='text-gray-400'>{artist.school}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArtistsList;
