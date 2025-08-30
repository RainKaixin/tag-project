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
