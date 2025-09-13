import React, { useState } from 'react';

/**
 * 筛选面板组件
 * 提供作品筛选功能，包括排序、分类和软件筛选
 */
export function FilterPanel() {
  const [sortBy, setSortBy] = useState('Latest');
  const [categories, setCategories] = useState([]);
  const [software, setSoftware] = useState([]);

  const categoryOptions = [
    'Accessory Design',
    'Acting',
    'Advertising',
    'Animation',
    'Architecture',
    'Art History',
    'Creative Business',
    'Fashion Design',
    'Fibers',
    'Film',
    'Film/Television',
    'Fine Art',
    'Game/ITGM',
    'Graphic Design',
    'Industrial Design',
    'Illustration',
    'Interior Design',
    'Jewelry',
    'Motion Design',
    'Painting',
    'Photography',
    'Service Design',
    'Sequential Art',
    'UI/UX',
    'Visual Effects',
  ];

  const softwareOptions = [
    '3D-Coat',
    '3ds Max',
    'After Effects',
    'Blender',
    'Cinema 4D',
    'DaVinci Resolve',
    'Figma',
    'Gaea',
    'Houdini',
    'Illustrator',
    'InDesign',
    'JavaScript',
    'Maya',
    'Nuke',
    'Photoshop',
    'Python',
    'Substance Designer',
    'Substance Painter',
    'Unity',
    'Unreal Engine',
    'ZBrush',
  ];

  const handleCategoryChange = category => {
    setCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSoftwareChange = softwareName => {
    setSoftware(prev => {
      if (prev.includes(softwareName)) {
        return prev.filter(s => s !== softwareName);
      } else {
        return [...prev, softwareName];
      }
    });
  };

  const handleApplyFilters = () => {
    // 构建筛选参数
    const params = new URLSearchParams();
    params.append('sort', sortBy.toLowerCase());

    if (categories.length > 0) {
      params.append('categories', categories.join(','));
    }

    if (software.length > 0) {
      params.append('software', software.join(','));
    }

    // 在新标签页打开专业聚合页面
    const url = `/major-aggregation?${params.toString()}`;
    window.open(url, '_blank');
  };

  const handleClearAll = () => {
    setSortBy('Latest');
    setCategories([]);
    setSoftware([]);

    // 强制重新渲染以确保UI更新
    console.log('Clear all filters - Reset to default state');
  };

  return (
    <div className='bg-white p-6 rounded-none border-t-0 border-b-0 border-l-0 border-r border-black'>
      <h3 className='text-lg font-semibold text-gray-900 mb-4'>Filters</h3>

      {/* Action Buttons - 移到最上面 */}
      <div className='flex gap-2 mb-6'>
        <button
          onClick={handleApplyFilters}
          disabled={categories.length === 0 && software.length === 0}
          className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
            categories.length === 0 && software.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-tag-blue text-white hover:bg-blue-600 focus:ring-tag-blue'
          }`}
        >
          Apply
        </button>
        <button
          onClick={handleClearAll}
          className='flex-1 px-3 py-1.5 bg-gray-100 text-gray-600 text-sm rounded-md hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1'
        >
          Clear
        </button>
      </div>

      {/* Sort By */}
      <div className='mb-6'>
        <h4 className='text-sm font-medium text-gray-900 mb-3'>Sort By</h4>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className='w-full px-3 py-2 border border-black bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue'
        >
          <option value='Latest'>Latest</option>
          <option value='Popular'>Popular</option>
        </select>
      </div>

      {/* Major */}
      <div className='mb-6'>
        <h4 className='text-base font-bold text-white mb-3 text-right uppercase bg-black px-3 py-2 -mx-6'>
          Major
        </h4>
        <div className='space-y-2'>
          {categoryOptions.map(category => (
            <label
              key={category}
              className='flex items-center justify-end px-2 py-1 rounded cursor-pointer hover:bg-tag-blue hover:text-white transition-colors duration-200'
            >
              <span className='mr-2 text-sm'>{category}</span>
              <input
                type='checkbox'
                checked={categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className='h-4 w-4 text-tag-blue focus:ring-tag-blue border-gray-300 rounded'
              />
            </label>
          ))}
        </div>
      </div>

      {/* Software */}
      <div className='mb-6'>
        <h4 className='text-base font-bold text-white mb-3 text-right uppercase bg-black px-3 py-2 -mx-6'>
          Software
        </h4>
        <div className='space-y-2'>
          {softwareOptions.map(softwareName => (
            <label
              key={softwareName}
              className='flex items-center justify-end px-2 py-1 rounded cursor-pointer hover:bg-tag-blue hover:text-white transition-colors duration-200'
            >
              <span className='mr-2 text-sm'>{softwareName}</span>
              <input
                type='checkbox'
                checked={software.includes(softwareName)}
                onChange={() => handleSoftwareChange(softwareName)}
                className='h-4 w-4 text-tag-blue focus:ring-tag-blue border-gray-300 rounded'
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
