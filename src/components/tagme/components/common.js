export const SectionCard = props => <div className='card' {...props} />;
export const SectionTitle = ({ children, ...props }) => (
  <h3 {...props}>{children}</h3>
);
export const IconButton = props => <button type='button' {...props} />;
export const Tag = props => <span className='tag' {...props} />;
export const EmptyState = ({ children }) => (
  <div className='empty'>{children}</div>
);
