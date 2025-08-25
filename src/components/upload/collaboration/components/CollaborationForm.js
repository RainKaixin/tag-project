import React from 'react';

import { SelectField } from '../../../ui';
import {
  teamSizeOptions,
  durationOptions,
  meetingScheduleOptions,
} from '../data/formOptions';

const CollaborationForm = ({ formData, onFormChange }) => {
  return (
    <div className='space-y-4'>
      {/* Project Title */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Project Title
        </label>
        <input
          type='text'
          name='title'
          value={formData.title}
          onChange={onFormChange}
          placeholder="What's your project about?"
          className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
        />
      </div>

      {/* Project Type */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Project Type
        </label>
        <div className='flex'>
          <input
            type='text'
            name='projectType'
            value={formData.projectType}
            onChange={onFormChange}
            placeholder='Tags'
            className='flex-1 bg-gray-50 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
          />
          <button
            type='button'
            className='bg-tag-purple text-white px-3 py-2 rounded-r hover:bg-purple-700 transition-colors duration-200'
          >
            +
          </button>
        </div>
      </div>

      {/* Project Description */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Project Description
        </label>
        <textarea
          name='description'
          value={formData.description}
          onChange={onFormChange}
          placeholder='Describe your project and what kind of help you need...'
          rows={4}
          className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
        />
      </div>

      {/* Team Size */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Team Size
        </label>
        <SelectField
          options={teamSizeOptions}
          value={formData.teamSize}
          onChange={onFormChange}
          name='teamSize'
          placeholder='Select size'
        />
      </div>

      {/* Duration */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Duration
        </label>
        <SelectField
          options={durationOptions}
          value={formData.duration}
          onChange={onFormChange}
          name='duration'
          placeholder='Select duration'
        />
      </div>

      {/* Meeting Schedule */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Meeting Schedule
        </label>
        <SelectField
          options={meetingScheduleOptions}
          value={formData.meetingSchedule}
          onChange={onFormChange}
          name='meetingSchedule'
          placeholder='Select schedule'
        />
      </div>

      {/* Contact Information */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Contact Information
        </label>
        <input
          type='text'
          name='contactInfo'
          value={formData.contactInfo}
          onChange={onFormChange}
          placeholder='Discord, Slack, Email, etc.'
          className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
        />
      </div>

      {/* Application Deadline */}
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Application Deadline
        </label>
        <div className='relative'>
          <input
            type='date'
            name='applicationDeadline'
            value={formData.applicationDeadline}
            onChange={onFormChange}
            className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
          />
          <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
            <svg
              className='w-4 h-4 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationForm;
