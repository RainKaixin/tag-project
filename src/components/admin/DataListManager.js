// DataListManager.js - 数据列表管理组件
// 类似数据库管理界面，可以查看和选择性删除数据

import React, { useState, useEffect } from 'react';

import ConfirmDialog from '../common/ConfirmDialog';

const DataListManager = ({ dataType, onDeleteSelected }) => {
  const [dataList, setDataList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('key');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // 获取数据列表
  useEffect(() => {
    loadDataList();
  }, [dataType]);

  const loadDataList = () => {
    try {
      const allKeys = Object.keys(localStorage);
      let filteredKeys = [];

      // 根据数据类型过滤
      switch (dataType) {
        case 'collaborations':
          filteredKeys = allKeys.filter(key =>
            key.toLowerCase().includes('collaboration')
          );
          break;
        case 'portfolios':
          filteredKeys = allKeys.filter(key => key.startsWith('portfolio_'));
          break;
        case 'comments':
          filteredKeys = allKeys.filter(key => key.includes('comment'));
          break;
        case 'notifications':
          filteredKeys = allKeys.filter(key => key.includes('notification'));
          break;
        case 'likes':
          filteredKeys = allKeys.filter(key => key.includes('like'));
          break;
        case 'views':
          filteredKeys = allKeys.filter(key => key.includes('view'));
          break;
        default:
          filteredKeys = allKeys;
      }

      // 构建数据列表
      const list = filteredKeys.map(key => {
        const value = localStorage.getItem(key);
        let parsedValue = null;
        let itemCount = 0;
        let preview = '';

        try {
          parsedValue = JSON.parse(value);
          if (Array.isArray(parsedValue)) {
            itemCount = parsedValue.length;
            preview = `数组，包含 ${itemCount} 项`;
          } else if (typeof parsedValue === 'object') {
            itemCount = Object.keys(parsedValue).length;
            preview = `对象，包含 ${itemCount} 个属性`;
          } else {
            preview = String(parsedValue).substring(0, 50);
          }
        } catch {
          preview = String(value).substring(0, 50);
        }

        return {
          key,
          value: parsedValue,
          rawValue: value,
          itemCount,
          preview,
          size: value ? value.length : 0,
        };
      });

      setDataList(list);
      setLoading(false);
    } catch (error) {
      console.error('Error loading data list:', error);
      setLoading(false);
    }
  };

  // 搜索过滤
  const filteredData = dataList.filter(
    item =>
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 排序
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'size') {
      aValue = a.size;
      bValue = b.size;
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // 选择/取消选择单个项目
  const toggleItemSelection = key => {
    setSelectedItems(prev =>
      prev.includes(key) ? prev.filter(item => item !== key) : [...prev, key]
    );
  };

  // 全选/取消全选
  const toggleSelectAll = () => {
    if (selectedItems.length === sortedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(sortedData.map(item => item.key));
    }
  };

  // 删除选中的项目
  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;

    setShowConfirmDialog(true);
  };

  // 确认删除
  const confirmDelete = () => {
    selectedItems.forEach(key => {
      localStorage.removeItem(key);
    });

    // 重新加载数据
    loadDataList();
    setSelectedItems([]);

    // 调用父组件的回调
    if (onDeleteSelected) {
      onDeleteSelected(selectedItems.length);
    }
  };

  // 格式化文件大小
  const formatSize = bytes => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
        <span className='ml-2 text-gray-600'>加载数据中...</span>
      </div>
    );
  }

  return (
    <div className='bg-white rounded-lg shadow'>
      {/* 头部工具栏 */}
      <div className='p-4 border-b border-gray-200'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className='flex items-center space-x-4'>
            <h3 className='text-lg font-semibold text-gray-800'>
              {dataType === 'collaborations' && '协作项目数据'}
              {dataType === 'portfolios' && '作品数据'}
              {dataType === 'comments' && '评论数据'}
              {dataType === 'notifications' && '通知数据'}
              {dataType === 'likes' && '点赞数据'}
              {dataType === 'views' && '浏览记录数据'}
            </h3>
            <span className='text-sm text-gray-500'>
              共 {dataList.length} 项数据
            </span>
          </div>

          <div className='flex items-center space-x-2'>
            <input
              type='text'
              placeholder='搜索数据...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='px-3 py-1 border border-gray-300 rounded text-sm'
            />

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className='px-3 py-1 border border-gray-300 rounded text-sm'
            >
              <option value='key'>按键名</option>
              <option value='size'>按大小</option>
              <option value='itemCount'>按项目数</option>
            </select>

            <button
              onClick={() =>
                setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
              }
              className='px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50'
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* 操作栏 */}
      <div className='p-4 border-b border-gray-200 bg-gray-50'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={
                  selectedItems.length === sortedData.length &&
                  sortedData.length > 0
                }
                onChange={toggleSelectAll}
                className='mr-2'
              />
              全选
            </label>
            <span className='text-sm text-gray-600'>
              已选择 {selectedItems.length} 项
            </span>
          </div>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedItems.length === 0}
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            🗑️ 删除选中 ({selectedItems.length})
          </button>
        </div>
      </div>

      {/* 数据列表 */}
      <div className='max-h-96 overflow-y-auto'>
        {sortedData.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>
            没有找到匹配的数据
          </div>
        ) : (
          <table className='w-full'>
            <thead className='bg-gray-50 sticky top-0'>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  选择
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  键名
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  大小
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  项目数
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  预览
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {sortedData.map((item, index) => (
                <tr
                  key={item.key}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className='px-4 py-2'>
                    <input
                      type='checkbox'
                      checked={selectedItems.includes(item.key)}
                      onChange={() => toggleItemSelection(item.key)}
                      className='mr-2'
                    />
                  </td>
                  <td className='px-4 py-2 text-sm font-mono text-gray-900'>
                    {item.key}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-600'>
                    {formatSize(item.size)}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-600'>
                    {item.itemCount > 0 ? item.itemCount : '-'}
                  </td>
                  <td className='px-4 py-2 text-sm text-gray-600 max-w-xs truncate'>
                    {item.preview}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 确认删除弹窗 */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmDelete}
        title='确认删除'
        message={`确定要删除选中的 ${selectedItems.length} 项数据吗？\n\n此操作不可撤销！`}
        confirmText='删除'
        cancelText='取消'
        type='danger'
      />
    </div>
  );
};

export default DataListManager;
