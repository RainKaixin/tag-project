
/**
 * ReviewHeader组件 - 显示review区域的标题和说明
 * @param {Object} props - 组件属性
 * @param {string} props.title - 标题文本
 * @param {string} props.description - 说明文本
 * @param {string} props.className - 额外的CSS类名
 */
const ReviewHeader = ({
  title = 'After-Finished Review',
  description = 'Final, qualitative comments after project completion only.',
  className = '',
}) => {
  return (
    <div className={`${className}`}>
      {/* 分节标题 */}
      <h3 className='text-base font-semibold text-gray-900 mb-2'>{title}</h3>

      {/* 说明文本 */}
      <p className='text-sm text-gray-600 mb-8'>{description}</p>
    </div>
  );
};

export default ReviewHeader;
