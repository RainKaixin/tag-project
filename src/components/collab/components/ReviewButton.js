/**
 * ReviewButton组件 - 显示不同状态的按钮
 * @param {Object} props - 组件属性
 * @param {string} props.state - 按钮状态
 * @param {Function} props.onClick - 点击处理函数
 * @param {boolean} props.disabled - 是否禁用
 * @param {string} props.className - 额外的CSS类名
 * @param {string} props.ariaLabel - 无障碍标签
 */
const ReviewButton = ({
  state = 'none',
  onClick,
  disabled = false,
  className = '',
  ariaLabel,
  children,
}) => {
  // 根据状态获取按钮样式
  const getButtonStyles = buttonState => {
    const baseStyles =
      'px-4 py-2 rounded-lg font-medium transition-colors duration-200';

    switch (buttonState) {
      case 'loading':
        return `${baseStyles} bg-gray-300 text-gray-500 cursor-not-allowed`;
      case 'submitted':
        return `${baseStyles} bg-green-100 text-green-800 cursor-not-allowed`;
      case 'pending':
        return `${baseStyles} bg-gray-300 text-gray-500 cursor-not-allowed`;
      case 'approved':
        return `${baseStyles} bg-purple-600 text-white hover:bg-purple-700`;
      case 'none':
        return `${baseStyles} bg-purple-600 text-white hover:bg-purple-700`;
      default:
        return `${baseStyles} bg-gray-300 text-gray-500 cursor-not-allowed`;
    }
  };

  // 根据状态获取按钮文本
  const getButtonText = buttonState => {
    switch (buttonState) {
      case 'loading':
        return 'Loading...';
      case 'submitted':
        return 'Final Comment Submitted';
      case 'pending':
        return 'Pending Approval';
      case 'approved':
        return 'Submit Final Comment';
      case 'none':
        return 'Send Request';
      default:
        return 'Unknown State';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={
        disabled ||
        state === 'loading' ||
        state === 'submitted' ||
        state === 'pending'
      }
      className={`${getButtonStyles(state)} ${className}`}
      aria-label={ariaLabel || getButtonText(state)}
    >
      {children || getButtonText(state)}
    </button>
  );
};

export default ReviewButton;
