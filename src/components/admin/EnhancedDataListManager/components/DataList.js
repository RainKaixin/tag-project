import React from 'react';

/**
 * 数据列表组件
 * @param {Object} props - 组件属性
 * @param {Array} props.items - 数据项列表
 * @param {Array} props.selectedItems - 选中的项目
 * @param {Function} props.toggleItemSelection - 切换项目选择
 * @param {string} props.viewMode - 视图模式
 */
const DataList = ({ items, selectedItems, toggleItemSelection, viewMode }) => {
  if (items.length === 0) {
    return (
      <div className='p-8 text-center text-gray-500'>没有找到匹配的项目</div>
    );
  }

  if (viewMode === 'table') {
    return (
      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                选择
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                标题
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                创建者
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                创建时间
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                大小
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {items.map(item => (
              <tr key={item.id} className='hover:bg-gray-50'>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <input
                    type='checkbox'
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    className='mr-2'
                  />
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {item.title}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {item.creator}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {item.createdAt}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {item.size} B
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 列表视图
  return (
    <div className='divide-y divide-gray-200'>
      {items.map(item => (
        <div
          key={item.id}
          className='p-4 hover:bg-gray-50 flex items-center space-x-4'
        >
          <input
            type='checkbox'
            checked={selectedItems.includes(item.id)}
            onChange={() => toggleItemSelection(item.id)}
            className='mr-2'
          />
          <div className='flex-1 min-w-0'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <h4 className='text-sm font-medium text-gray-900 truncate'>
                  {item.title}
                </h4>
                <div className='flex items-center space-x-4 text-sm text-gray-500'>
                  <span>创建者: {item.creator}</span>
                  <span>时间: {item.createdAt}</span>
                  <span>大小: {item.size} B</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataList;
