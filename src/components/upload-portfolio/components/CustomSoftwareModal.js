// custom-software-modal v1: 自定義軟件模態框組件

import React, { useState } from 'react';

/**
 * 自定義軟件模態框組件
 * @param {Object} props - 組件屬性
 * @param {boolean} props.isOpen - 是否顯示模態框
 * @param {Function} props.onClose - 關閉模態框處理函數
 * @param {Function} props.onAdd - 添加軟件處理函數
 * @returns {JSX.Element|null} 自定義軟件模態框組件
 */
const CustomSoftwareModal = ({ isOpen, onClose, onAdd }) => {
  const [customSoftware, setCustomSoftware] = useState('');

  // 處理添加軟件
  const handleAddSoftware = () => {
    if (customSoftware.trim()) {
      const success = onAdd(customSoftware.trim());
      if (success) {
        setCustomSoftware('');
        onClose();
      }
    }
  };

  // 處理鍵盤事件
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleAddSoftware();
    }
  };

  // 處理關閉
  const handleClose = () => {
    setCustomSoftware('');
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
        <h3 className='text-lg font-semibold mb-4'>Add Custom Software</h3>
        <input
          type='text'
          value={customSoftware}
          onChange={e => setCustomSoftware(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder='Enter software name...'
          className='w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-tag-blue focus:border-tag-blue'
        />
        <div className='flex justify-end space-x-3'>
          <button
            type='button'
            onClick={handleClose}
            className='px-4 py-2 text-gray-600 hover:text-gray-800'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleAddSoftware}
            disabled={!customSoftware.trim()}
            className='px-4 py-2 bg-tag-blue text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomSoftwareModal;
