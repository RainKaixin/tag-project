import React, { useState } from 'react';

const MarketTemplate = () => {
  const [favorites, setFavorites] = useState(new Set());

  const products = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
      title: 'Auto Retopology Tool',
      description: 'Advanced mesh optimization plugin for Blender',
      price: '$15',
      originalPrice: '$25',
      author: 'Alex Chen',
      authorAvatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      reviews: 24,
      downloads: '1.2k',
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1599305445671-ac291c9a87bb?w=400&h=300&fit=crop',
      title: 'Sci-Fi Character Pack',
      description: 'High-poly character models with PBR textures',
      price: '$45',
      originalPrice: null,
      author: 'Maya Rodriguez',
      authorAvatar:
        'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 4,
      reviews: 856,
      downloads: '856',
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop',
      title: 'Procedural Building Generator',
      description: 'Generate realistic buildings with customizable parameters',
      price: '$79',
      originalPrice: '$99',
      author: 'John Doe',
      authorAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4,
      reviews: 120,
      downloads: '3.5k',
    },
    {
      id: 4,
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
      title: 'Ocean Shader Pack',
      description: 'Realistic ocean shaders for various rendering engines',
      price: '$29',
      originalPrice: null,
      author: 'Oceanic Arts',
      authorAvatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      reviews: 78,
      downloads: '900',
    },
    {
      id: 5,
      image:
        'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      title: 'UI Kit - Modern Dashboard',
      description: 'Complete UI kit for modern web applications',
      price: '$35',
      originalPrice: '$50',
      author: 'Design Studio',
      authorAvatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      reviews: 156,
      downloads: '2.1k',
    },
    {
      id: 6,
      image:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      title: 'Animation Rigging System',
      description: 'Professional character rigging for Maya and Blender',
      price: '$89',
      originalPrice: null,
      author: 'Animation Pro',
      authorAvatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      rating: 4,
      reviews: 203,
      downloads: '1.8k',
    },
  ];

  const toggleFavorite = productId => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const StarRating = ({ rating, reviews }) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(
          <svg
            key={i}
            className='h-4 w-4 text-yellow-400 fill-current'
            viewBox='0 0 20 20'
          >
            <path d='M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z' />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className='h-4 w-4 text-gray-300 fill-current'
            viewBox='0 0 20 20'
          >
            <path d='M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z' />
          </svg>
        );
      }
    }
    return (
      <div className='flex items-center'>
        <div className='flex mr-1'>{stars}</div>
        <span className='text-sm text-gray-500'>({reviews})</span>
      </div>
    );
  };

  return (
    <div className='py-8'>
      {/* Coming Soon Message */}
      <div className='text-center py-8 mb-8'>
        <p className='text-red-500 text-lg font-medium'>
          Market feature coming soon...
        </p>
      </div>

      {/* Market Template Preview */}
      <div className='mb-8'>
        <h3 className='text-2xl font-bold text-gray-800 mb-2 text-center'>
          Marketplace Preview
        </h3>
        <p className='text-gray-600 text-center mb-8'>
          Discover student-created assets, tools, and resources
        </p>
      </div>

      {/* Products Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {products.map(product => (
          <div
            key={product.id}
            className='bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-all duration-300 cursor-pointer group'
          >
            {/* Product Image */}
            <div className='relative mb-4'>
              <img
                src={product.image}
                alt={product.title}
                className='w-full aspect-[4/3] object-cover rounded-lg'
              />

              {/* Favorite Button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  toggleFavorite(product.id);
                }}
                className='absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors duration-200'
              >
                <svg
                  className={`w-5 h-5 ${
                    favorites.has(product.id)
                      ? 'text-red-500 fill-current'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                  fill={favorites.has(product.id) ? 'currentColor' : 'none'}
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
              </button>
            </div>

            {/* Product Info */}
            <div className='space-y-3'>
              {/* Title */}
              <h4 className='text-lg font-bold text-gray-900 group-hover:text-tag-blue transition-colors duration-200'>
                {product.title}
              </h4>

              {/* Description */}
              <p className='text-sm text-gray-600 line-clamp-2'>
                {product.description}
              </p>

              {/* Price */}
              <div className='flex items-baseline gap-2'>
                <span className='text-xl font-bold text-tag-blue'>
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className='text-sm text-gray-400 line-through'>
                    {product.originalPrice}
                  </span>
                )}
              </div>

              {/* Downloads */}
              <div className='flex items-center text-sm text-gray-500'>
                <svg
                  className='w-4 h-4 mr-1'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                <span>{product.downloads} downloads</span>
              </div>

              {/* Author and Rating */}
              <div className='flex items-center justify-between pt-2 border-t border-gray-100'>
                <div className='flex items-center'>
                  <img
                    src={product.authorAvatar}
                    alt={product.author}
                    className='w-6 h-6 rounded-full mr-2'
                  />
                  <span className='text-sm text-gray-700'>
                    {product.author}
                  </span>
                </div>
                <StarRating rating={product.rating} reviews={product.reviews} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketTemplate;
