import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // 登錄成功，跳轉到首頁
        navigate('/');
      } else {
        // 登錄失敗，顯示錯誤信息
        console.error('Login failed:', result.error);
        // 顯示錯誤提示
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col'>
      {/* Main Content */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-md w-full space-y-8'>
          {/* Login Card */}
          <div className='bg-white rounded-lg shadow-lg p-8'>
            {/* Logo and Header */}
            <div className='text-center mb-8'>
              <img
                src='/TAG_Logo.png'
                alt='TAG Logo'
                className='h-12 w-auto mx-auto mb-6'
              />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Email Field */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Student Email
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <svg
                      className='h-5 w-5 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                  <input
                    id='email'
                    name='email'
                    type='email'
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder='your.name@university.edu'
                    className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm'
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor='password'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Password
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <svg
                      className='h-5 w-5 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                      />
                    </svg>
                  </div>
                  <input
                    id='password'
                    name='password'
                    type='password'
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='••••••••'
                    className='block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue sm:text-sm'
                  />
                </div>
              </div>

              {/* Remember Me and Forgot Password */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <input
                    id='rememberMe'
                    name='rememberMe'
                    type='checkbox'
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className='h-4 w-4 text-tag-blue focus:ring-tag-blue border-gray-300 rounded'
                  />
                  <label
                    htmlFor='rememberMe'
                    className='ml-2 block text-sm text-gray-700'
                  >
                    Remember me
                  </label>
                </div>
                <div className='text-sm'>
                  <a
                    href='#'
                    className='font-medium text-tag-blue hover:text-tag-dark-blue'
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-tag-blue hover:bg-tag-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
              >
                {isLoading ? (
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                ) : null}
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {/* Bottom Options */}
            <div className='mt-6 flex justify-center'>
              <Link
                to='/register'
                className='w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue transition-colors duration-200'
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex justify-between items-center'>
            <div className='text-sm text-gray-500'>
              <span className='font-bold'>Tech Art Guide</span>
              <span className='ml-2'>© 2025 TAG. All rights reserved.</span>
            </div>
            <div className='flex space-x-6 text-sm text-gray-500'>
              <a href='#' className='hover:text-gray-700'>
                Privacy Policy
              </a>
              <a href='#' className='hover:text-gray-700'>
                Terms of Service
              </a>
              <a href='#' className='hover:text-gray-700'>
                Help Center
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
