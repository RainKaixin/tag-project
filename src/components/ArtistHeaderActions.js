import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const ArtistHeaderActions = ({ viewedUser, onFollow }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const viewedUserId = viewedUser?.id;

  const isSelf = useMemo(() => {
    if (!currentUser?.id || !viewedUserId) return false;
    return currentUser.id === viewedUserId;
  }, [currentUser?.id, viewedUserId]);

  // 加载期间不渲染按钮，避免闪烁误判
  if (!viewedUserId) return null;

  if (isSelf) {
    return (
      <Link
        to='/settings/edit-profile'
        className='px-4 py-2 rounded-md font-medium transition-colors duration-200 bg-purple-500 text-white hover:bg-purple-600 flex items-center gap-2'
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
            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
          />
        </svg>
        Edit Profile
      </Link>
    );
  }

  return (
    <button
      onClick={onFollow}
      className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
        viewedUser?.isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {viewedUser?.isFollowing ? 'Following' : 'Follow'}
    </button>
  );
};

export default ArtistHeaderActions;
