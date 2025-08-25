// related-works v1: 相关作品组件

/**
 * 相关作品组件
 * @param {Array} relatedWorks - 相关作品数据数组
 * @param {string} authorName - 作者姓名
 * @param {Function} onAuthorClick - 作者点击事件
 * @param {Function} onWorkClick - 作品点击事件
 * @param {boolean} loading - 加载状态
 * @param {string} className - 额外的CSS类名
 */
const RelatedWorks = ({
  relatedWorks,
  authorName,
  onAuthorClick,
  onWorkClick,
  loading = false,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <h3
        className='text-lg font-semibold text-gray-900 mb-4 cursor-pointer hover:text-tag-blue transition-colors duration-200'
        onClick={onAuthorClick}
      >
        More from {authorName}
      </h3>

      {loading ? (
        // 加载状态
        <div className='grid grid-cols-2 gap-2'>
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className='aspect-square rounded-lg bg-gray-200 animate-pulse'
            />
          ))}
        </div>
      ) : relatedWorks.length > 0 ? (
        // 显示相关作品
        <div className='grid grid-cols-2 gap-2'>
          {relatedWorks.map(work => (
            <div
              key={work.id}
              className='aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity duration-200'
              onClick={() => onWorkClick(work.id)}
            >
              <img
                src={work.image}
                alt={work.title}
                className='w-full h-full object-cover'
                onError={e => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop';
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        // 空状态
        <div className='text-center py-4'>
          <p className='text-gray-500 text-sm'>No other works available</p>
        </div>
      )}
    </div>
  );
};

export default RelatedWorks;
