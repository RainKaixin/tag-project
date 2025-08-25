import React from 'react';

/**
 * 骨架屏组件
 * 在加载收藏数据时显示
 */
const FavoritesSkeleton = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse'
        >
          {/* 图片骨架 */}
          <div className='w-full h-48 bg-gray-200' />

          {/* 内容骨架 */}
          <div className='p-4'>
            {/* 标题骨架 */}
            <div className='h-5 bg-gray-200 rounded mb-2' />
            <div className='h-4 bg-gray-200 rounded w-3/4 mb-3' />

            {/* 作者骨架 */}
            <div className='flex items-center mb-3'>
              <div className='w-6 h-6 bg-gray-200 rounded-full mr-2' />
              <div className='h-4 bg-gray-200 rounded w-24' />
            </div>

            {/* 描述骨架 */}
            <div className='space-y-2 mb-3'>
              <div className='h-3 bg-gray-200 rounded' />
              <div className='h-3 bg-gray-200 rounded w-5/6' />
            </div>

            {/* 标签骨架 */}
            <div className='flex gap-1 mb-3'>
              <div className='w-12 h-6 bg-gray-200 rounded-full' />
              <div className='w-16 h-6 bg-gray-200 rounded-full' />
              <div className='w-14 h-6 bg-gray-200 rounded-full' />
            </div>

            {/* 底部信息骨架 */}
            <div className='flex items-center justify-between'>
              <div className='flex space-x-4'>
                <div className='w-12 h-4 bg-gray-200 rounded' />
                <div className='w-16 h-4 bg-gray-200 rounded' />
              </div>
              <div className='w-16 h-8 bg-gray-200 rounded' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FavoritesSkeleton;
