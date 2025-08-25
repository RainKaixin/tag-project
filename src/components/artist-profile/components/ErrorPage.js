// error-page v1: 错误页面组件


/**
 * 错误页面组件
 * @param {string} id - 艺术家ID
 * @param {Function} onBackClick - 返回按钮点击事件
 * @param {string} className - 额外的CSS类名
 */
const ErrorPage = ({ id, onBackClick, className = '' }) => {
  return (
    <div
      className={`bg-white min-h-screen flex items-center justify-center ${className}`}
    >
      <div className='text-center'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>艺术家未找到</h1>
        <p className='text-gray-600 mb-6'>抱歉，找不到ID为 {id} 的艺术家。</p>
        <button
          onClick={onBackClick}
          className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200'
        >
          返回画廊
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
