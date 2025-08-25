// search-bar v1: 搜索栏组件

/**
 * 搜索栏组件
 * @param {Function} onInputChange - 输入变化处理函数
 * @param {string} placeholder - 占位符文本
 * @param {string} className - 额外的CSS类名
 */
const SearchBar = ({
  onInputChange,
  placeholder = 'Search for art, artists, or collections...',
  className = '',
}) => {
  return (
    <div className={`${className}`}>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <svg
            className='h-4 w-4 text-gray-400'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            />
          </svg>
        </div>
        <input
          type='text'
          placeholder={placeholder}
          onChange={onInputChange}
          className='block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:placeholder-gray-300 focus:ring-1 focus:ring-gray-300 focus:border-gray-300 text-sm shadow-sm'
        />
      </div>
    </div>
  );
};

export default SearchBar;
