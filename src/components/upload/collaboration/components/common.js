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
export const SelectField = ({
  options,
  value,
  onChange,
  placeholder,
  ...props
}) => (
  <div className='relative'>
    <select
      value={value}
      onChange={onChange}
      className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple appearance-none'
      {...props}
    >
      {placeholder && <option value=''>{placeholder}</option>}
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
      <svg
        className='w-4 h-4 text-gray-400'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M19 9l-7 7-7-7'
        />
      </svg>
    </div>
  </div>
);
