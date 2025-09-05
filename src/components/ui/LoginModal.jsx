import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

import { BaseModal } from './BaseModal';

/**
 * 登錄 Modal 組件
 * 用於在需要認證時彈出登錄界面
 */
export function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        console.log('[LoginModal] Login successful');
        // 登錄成功，關閉 Modal 並觸發回調
        onClose();
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        setErrorMessage(result.error || 'Login failed');
        console.error('[LoginModal] Login failed:', result.error);
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred');
      console.error('[LoginModal] Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title='Sign In Required'
      maxWidth='max-w-sm'
    >
      <div className='space-y-4'>
        <p className='text-sm text-gray-600'>
          Please sign in to save favorites and access all features.
        </p>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleInputChange}
              required
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter your email'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleInputChange}
              required
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter your password'
            />
          </div>

          {errorMessage && (
            <div className='text-sm text-red-600 bg-red-50 p-2 rounded'>
              {errorMessage}
            </div>
          )}

          <div className='flex space-x-3'>
            <button
              type='submit'
              disabled={isLoading}
              className='flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none'
            >
              Cancel
            </button>
          </div>
        </form>

        <div className='text-center'>
          <p className='text-sm text-gray-600'>
            Don't have an account?{' '}
            <button
              type='button'
              onClick={handleGoToRegister}
              className='text-blue-600 hover:text-blue-800 focus:outline-none'
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
