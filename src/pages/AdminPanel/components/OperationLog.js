import React from 'react';

/**
 * 操作日志区域组件
 * @param {Object} props - 组件属性
 * @param {Array} props.operationLog - 操作日志数组
 */
const OperationLog = ({ operationLog }) => {
  return (
    <div className='bg-white rounded-lg shadow'>
      <div className='p-6 border-b'>
        <h2 className='text-xl font-semibold text-gray-800'>操作日志</h2>
      </div>
      <div className='p-6'>
        <div className='max-h-64 overflow-y-auto'>
          {operationLog.length === 0 ? (
            <p className='text-gray-500 text-center py-4'>暂无操作记录</p>
          ) : (
            <div className='space-y-2'>
              {operationLog.map((log, index) => (
                <div key={index} className='flex items-start space-x-2 text-sm'>
                  <span className='text-gray-500 min-w-[60px]'>
                    {log.timestamp}
                  </span>
                  <span
                    className={`flex-1 ${
                      log.type === 'success'
                        ? 'text-green-600'
                        : log.type === 'error'
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperationLog;
