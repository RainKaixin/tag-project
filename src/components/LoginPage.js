import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase/client.js';

import { ForgotPasswordModal } from './forgot-password';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 强制清除任何可能的默认值
  React.useEffect(() => {
    // 延迟执行，确保DOM已渲染
    const timer = setTimeout(() => {
      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');

      if (emailInput && emailInput.value !== '') {
        emailInput.value = '';
        setFormData(prev => ({ ...prev, email: '' }));
      }

      if (passwordInput && passwordInput.value !== '') {
        passwordInput.value = '';
        setFormData(prev => ({ ...prev, password: '' }));
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
        // 登錄成功，獲取 session 並跳轉到用戶的個人頁面
        setErrorMessage('');

        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.user?.id) {
            // 跳轉到用戶的個人頁面
            navigate(`/artist/${session.user.id}`);
          } else {
            // 如果沒有 session，跳轉到首頁
            navigate('/');
          }
        } catch (error) {
          console.warn('Failed to get session, redirecting to home:', error);
          navigate('/');
        }
      } else {
        // 登錄失敗，顯示錯誤信息
        console.error('Login failed:', result.error);
        setErrorMessage(result.error || 'Login failed. Please try again.');
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
        <div className='max-w-sm w-full space-y-6'>
          {/* Mobile Logo - Outside card, above slogan */}
          <div className='text-center mb-4 block md:hidden'>
            <img
              src={`${process.env.PUBLIC_URL}/TAG_Logo.png`}
              alt='TAG Logo'
              className='h-12 w-auto mx-auto'
            />
          </div>

          {/* Slogan Title */}
          <div className='text-center mb-4'>
            <h1 className='text-lg sm:text-xl font-bold mb-2'>
              <span className='bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent'>
                Show your work.
              </span>
              <span className='bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent ml-2'>
                Find your team.
              </span>
            </h1>
            <p className='text-sm text-gray-700 font-medium'>
              New here? Please Sign Up first.
            </p>
          </div>

          {/* Login Card */}
          <div className='bg-white rounded-lg shadow-lg p-4 sm:p-6'>
            {/* Desktop Logo and Header - Inside card */}
            <div className='text-center mb-4 sm:mb-6 hidden md:block'>
              <img
                src={`${process.env.PUBLIC_URL}/TAG_Logo.png`}
                alt='TAG Logo'
                className='h-12 w-auto mx-auto mb-3 sm:mb-4'
              />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-5'>
              {/* Email Field */}
              <div>
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
                    placeholder='Student Email'
                    autoComplete='off'
                    className='block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-tag-blue focus:border-tag-blue text-sm'
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor='password'
                  className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'
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
                    autoComplete='off'
                    className='block w-full pl-8 sm:pl-10 pr-3 py-2 sm:py-2.5 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-tag-blue focus:border-tag-blue text-sm'
                  />
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className='rounded-md bg-red-50 p-4'>
                  <div className='flex'>
                    <div className='flex-shrink-0'>
                      <svg
                        className='h-5 w-5 text-red-400'
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='ml-3'>
                      <p className='text-sm text-red-700'>{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

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
                  <button
                    type='button'
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className='font-medium text-tag-blue hover:text-tag-dark-blue'
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type='submit'
                disabled={isLoading}
                className='w-full flex justify-center py-2 sm:py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
              >
                {isLoading ? (
                  <svg
                    className='animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700'
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
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Bottom Options */}
            <div className='mt-4 sm:mt-5 flex justify-center'>
              <Link
                to='/register'
                className='w-full flex justify-center py-2 sm:py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-tag-blue hover:bg-tag-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-tag-blue transition-colors duration-200'
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className='bg-gray-900 border-t border-gray-700'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
          <div className='flex justify-between items-center'>
            <div className='text-sm text-gray-300'>
              <span className='font-bold'>Tech Art Guide</span>
              <span className='ml-2'>© 2025 TAG. All rights reserved.</span>
            </div>
            <div className='flex space-x-6 text-sm text-gray-300'>
              <a href='#' className='hover:text-white'>
                Privacy Policy
              </a>
              <a href='#' className='hover:text-white'>
                Terms of Service
              </a>
              <a href='#' className='hover:text-white'>
                Help Center
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
};

export default LoginPage;
