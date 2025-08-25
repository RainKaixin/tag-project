import React, { useState, useRef, useEffect } from 'react';

// 专业选项列表 - 与 Filter 保持一致
const MAJOR_OPTIONS = [
  'Accessory Design',
  'Acting',
  'Advertising',
  'Animation',
  'Architecture',
  'Art History',
  'Creative Business Leadership',
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

const MajorSelector = ({ onAddMajor, disabled = false }) => {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [error, setError] = useState('');

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // 过滤选项
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredOptions(MAJOR_OPTIONS);
    } else {
      const filtered = MAJOR_OPTIONS.filter(option =>
        option.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
    setSelectedIndex(-1);
  }, [inputValue]);

  // 处理输入变化
  const handleInputChange = e => {
    const value = e.target.value;
    setInputValue(value);
    setError('');
    setShowDropdown(true);
  };

  // 处理键盘导航
  const handleKeyDown = e => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredOptions.length) {
        handleSelectOption(filteredOptions[selectedIndex]);
      } else if (inputValue.trim()) {
        handleAddMajor();
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  // 选择选项
  const handleSelectOption = option => {
    setInputValue(option);
    setShowDropdown(false);
    setSelectedIndex(-1);
    onAddMajor(option);
  };

  // 添加专业
  const handleAddMajor = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) {
      setError('Please enter a major or minor');
      return;
    }

    // 检查是否在预定义列表中
    const exactMatch = MAJOR_OPTIONS.find(
      option => option.toLowerCase() === trimmedValue.toLowerCase()
    );

    if (exactMatch) {
      onAddMajor(exactMatch);
      setInputValue('');
      setError('');
      setShowDropdown(false);
    } else {
      setError('Please select a valid major or minor from the list');
    }
  };

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className='relative'>
      <div className='flex gap-2'>
        <div className='relative flex-1'>
          <input
            ref={inputRef}
            type='text'
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowDropdown(true)}
            placeholder='Type to search majors...'
            disabled={disabled}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed'
          />

          {/* 下拉箭头 */}
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

          {/* 下拉选项 */}
          {showDropdown && filteredOptions.length > 0 && (
            <div
              ref={dropdownRef}
              className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto'
            >
              {filteredOptions.map((option, index) => (
                <div
                  key={option}
                  className={`px-3 py-2 cursor-pointer hover:bg-purple-50 ${
                    index === selectedIndex ? 'bg-purple-100' : ''
                  }`}
                  onClick={() => handleSelectOption(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type='button'
          onClick={handleAddMajor}
          disabled={!inputValue.trim() || disabled}
          className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200'
        >
          <svg
            className='w-4 h-4'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 6v6m0 0v6m0-6h6m-6 0H6'
            />
          </svg>
        </button>
      </div>

      {/* 错误信息 */}
      {error && <div className='mt-1 text-sm text-red-600'>{error}</div>}

      {/* 帮助文本 */}
      <div className='mt-1 text-xs text-gray-500'>
        Type to search and select from the list. Maximum 3 majors & minors.
      </div>
    </div>
  );
};

export default MajorSelector;
