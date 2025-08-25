export const SectionCard = props => <div className='card' {...props} />;
export const SectionTitle = ({ children, ...props }) => (
  <h3 {...props}>{children}</h3>
);
export const IconButton = props => <button type='button' {...props} />;
export const Tag = props => <span className='tag' {...props} />;
export const EmptyState = ({ children }) => (
  <div className='empty'>{children}</div>
);
export const ProgressBar = ({ progress, ...props }) => (
  <div className='w-full bg-gray-200 rounded-full h-2' {...props}>
    <div
      className='bg-purple-600 h-2 rounded-full transition-all duration-500'
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);
// StatusBadge已迁移到统一的UI组件库
// 请从 '../../ui' 导入 StatusBadge
