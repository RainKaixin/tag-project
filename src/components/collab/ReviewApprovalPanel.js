import React, { useState, useEffect } from 'react';

import * as reviewService from '../../services/mock/reviewRequestService.js';

// after-finished-review v1 (dev panel) - 开发用审批面板
const ReviewApprovalPanel = ({ projectId, isOwner = false }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 加载评论请求
  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const projectRequests = await reviewService.getProjectReviewRequests(
        projectId
      );
      setRequests(projectRequests);
    } catch (error) {
      setError('Failed to load review requests');
      console.error('Error loading requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理审批
  const handleApproval = async (requestId, status) => {
    try {
      setIsLoading(true);
      await reviewService.updateReviewRequest(requestId, status);

      // 重新加载请求列表
      await loadRequests();
    } catch (error) {
      setError(`Failed to ${status} request`);
      console.error('Error updating request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取状态颜色
  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'denied':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 格式化时间
  const formatTime = timestamp => {
    return new Date(timestamp).toLocaleString();
  };

  useEffect(() => {
    if (isOwner) {
      loadRequests();
    }
  }, [projectId, isOwner]);

  // 如果不是Owner，不显示面板
  if (!isOwner) {
    return null;
  }

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 relative'>
      <div className='flex items-center justify-between mb-4'>
        <h3 className='text-lg font-semibold text-gray-900'>Review Requests</h3>
        <button
          onClick={loadRequests}
          disabled={isLoading}
          className='px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors duration-200'
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}

      {/* 请求列表 */}
      {requests.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-500'>No review requests yet</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {requests.map(request => (
            <div
              key={request.id}
              className='border border-gray-200 rounded-lg p-4'
            >
              <div className='flex items-start justify-between mb-3'>
                <div>
                  <h4 className='font-medium text-gray-900'>
                    {request.userName}
                  </h4>
                  <p className='text-sm text-gray-600'>{request.projectName}</p>
                  <p className='text-xs text-gray-500'>
                    Requested: {formatTime(request.createdAt)}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    request.status
                  )}`}
                >
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </div>

              {/* 操作按钮 */}
              {request.status === 'pending' && (
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleApproval(request.id, 'approved')}
                    disabled={isLoading}
                    className='px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 disabled:opacity-50'
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(request.id, 'denied')}
                    disabled={isLoading}
                    className='px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200 disabled:opacity-50'
                  >
                    Deny
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 开发工具 */}
      <div className='mt-6 pt-4 border-t border-gray-200'>
        <h4 className='text-sm font-medium text-gray-900 mb-2'>
          Development Tools
        </h4>
        <div className='flex gap-2'>
          <button
            onClick={() => reviewService.clearTestData()}
            className='px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200'
          >
            Clear Test Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewApprovalPanel;
