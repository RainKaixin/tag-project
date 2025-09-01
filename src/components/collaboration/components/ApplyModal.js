import React from 'react';

import { BaseModal } from '../../ui';
import { PrimaryButton, SecondaryButton } from '../../ui';

const ApplyModal = ({ isOpen, onClose, applyForm, onFormChange, onSubmit }) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title='Apply for Project'
      maxWidth='max-w-md'
    >
      <form onSubmit={onSubmit} className='space-y-4'>
        <div>
          <label
            htmlFor='email'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Email *
          </label>
          <input
            id='email'
            type='email'
            name='email'
            value={applyForm.email}
            onChange={onFormChange}
            required
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            placeholder='your.email@example.com'
          />
        </div>

        <div>
          <label
            htmlFor='portfolio'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Portfolio Link
          </label>
          <input
            id='portfolio'
            type='text'
            name='portfolio'
            value={applyForm.portfolio}
            onChange={onFormChange}
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent'
            placeholder='your-portfolio.com or any link'
          />
        </div>

        <div>
          <label
            htmlFor='message'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Message
          </label>
          <textarea
            id='message'
            name='message'
            value={applyForm.message}
            onChange={onFormChange}
            rows='3'
            className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none'
            placeholder="Tell us why you'd like to join this project..."
          />
          <p className='mt-2 text-xs text-gray-500'>
            All information you submit, including your message, will remain
            private and only accessible to the project initiator.
          </p>
        </div>

        {/* 重要提示：只能提交一次 */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3'>
          <div className='flex items-start gap-2'>
            <svg
              className='w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            <div>
              <p className='text-sm font-medium text-yellow-800'>
                Important: One-time submission only
              </p>
              <p className='text-xs text-yellow-700 mt-1'>
                Please review your information carefully before submitting. You
                cannot edit your application after submission.
              </p>
            </div>
          </div>
        </div>

        <div className='flex gap-3 pt-4'>
          <SecondaryButton
            type='button'
            onClick={onClose}
            fullWidth
            className='flex-1'
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton type='submit' fullWidth className='flex-1'>
            Submit Application
          </PrimaryButton>
        </div>
      </form>
    </BaseModal>
  );
};

export default ApplyModal;
