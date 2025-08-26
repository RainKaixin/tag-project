export const SectionCard = props => <div className='card' {...props} />;
export const SectionTitle = ({ children, ...props }) => (
  <h3 {...props}>{children}</h3>
);
export const IconButton = props => <button type='button' {...props} />;
export const Tag = props => <span className='tag' {...props} />;
export const EmptyState = ({ children }) => (
  <div className='empty'>{children}</div>
);
export const FormField = ({ label, children, ...props }) => (
  <div {...props}>
    {label && (
      <label className='block text-sm font-medium text-gray-700 mb-2'>
        {label}
      </label>
    )}
    {children}
  </div>
);
export const ProgressBar = ({ progress, ...props }) => (
  <div className='w-full bg-gray-200 rounded-full h-2' {...props}>
    <div
      className='bg-tag-purple h-2 rounded-full transition-all duration-500'
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);
export const FileUploadArea = ({ onFileUpload, id, children, ...props }) => (
  <div
    className='border-2 border-dashed border-gray-300 rounded-lg bg-white py-8 px-4 text-center'
    {...props}
  >
    <svg
      className='w-8 h-8 text-gray-400 mx-auto mb-3'
      fill='none'
      stroke='currentColor'
      viewBox='0 0 24 24'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
      />
    </svg>
    {children}
    <input
      type='file'
      multiple={false}
      accept='.jpg,.jpeg,.png'
      onChange={onFileUpload}
      className='hidden'
      id={id}
    />
    <label
      htmlFor={id}
      className='bg-tag-purple text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-700 transition-colors duration-200'
    >
      Choose Image
    </label>
  </div>
);
