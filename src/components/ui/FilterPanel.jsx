import React, { useState } from 'react';

/**
 * 筛选面板组件
 * 提供作品筛选功能，包括排序、分类和软件筛选
 */
export function FilterPanel() {
  const [sortBy, setSortBy] = useState('Latest');
  const [categories, setCategories] = useState(['All']);
  const [software, setSoftware] = useState(['All']);

  const categoryOptions = [
    'All',
    'Visual Effects',
    'Game Design',
    'Animation',
    'Illustration',
    'Sequential Art',
    'Graphic Design',
    'UI/UX',
    'Fine Art',
    'Film',
    'Photography',
    'Architecture',
    'Industrial Design',
    'Fashion Design',
    'Motion Design',
  ];

  const softwareOptions = [
    'All',
    'Blender',
    'Maya',
    'Photoshop',
    'Illustrator',
    'Unreal Engine',
    'Unity',
    'Nuke',
    'After Effects',
    'Cinema 4D',
    'Zbrush',
    'Houdini',
    'Substance Painter',
    'Substance Designer',
    'Figma',
    'Python',
  ];

  const handleCategoryChange = category => {
    if (category === 'All') {
      setCategories(['All']);
    } else {
      setCategories(prev => {
        const newCategories = prev.filter(c => c !== 'All');
        if (newCategories.includes(category)) {
          return newCategories.filter(c => c !== category);
        } else {
          return [...newCategories, category];
        }
      });
    }
  };

  const handleSoftwareChange = softwareName => {
    if (softwareName === 'All') {
      setSoftware(['All']);
    } else {
      setSoftware(prev => {
        const newSoftware = prev.filter(s => s !== 'All');
        if (newSoftware.includes(softwareName)) {
          return newSoftware.filter(s => s !== softwareName);
        } else {
          return [...newSoftware, softwareName];
        }
      });
    }
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
      <h3 className='text-lg font-semibold text-gray-900 mb-6'>Filters</h3>

      {/* Sort By */}
      <div className='mb-6'>
        <h4 className='text-sm font-medium text-gray-900 mb-3'>Sort By</h4>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue'
        >
          <option value='Latest'>Latest</option>
          <option value='Popular'>Popular</option>
          <option value='Trending'>Trending</option>
        </select>
      </div>

      {/* Major */}
      <div className='mb-6'>
        <h4 className='text-sm font-medium text-gray-900 mb-3'>Major</h4>
        <div className='space-y-2'>
          {categoryOptions.map(category => (
            <label key={category} className='flex items-center'>
              <input
                type='checkbox'
                checked={categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className='h-4 w-4 text-tag-blue focus:ring-tag-blue border-gray-300 rounded'
              />
              <span className='ml-2 text-sm text-gray-700'>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Software */}
      <div className='mb-6'>
        <h4 className='text-sm font-medium text-gray-900 mb-3'>Software</h4>
        <div className='space-y-2'>
          {softwareOptions.map(softwareName => (
            <label key={softwareName} className='flex items-center'>
              <input
                type='checkbox'
                checked={software.includes(softwareName)}
                onChange={() => handleSoftwareChange(softwareName)}
                className='h-4 w-4 text-tag-blue focus:ring-tag-blue border-gray-300 rounded'
              />
              <span className='ml-2 text-sm text-gray-700'>{softwareName}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
