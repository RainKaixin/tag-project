import React from 'react';

import { SelectField } from '../../../ui';
import {
  teamSizeOptions,
  durationOptions,
  meetingScheduleOptions,
} from '../data/formOptions';

const CollaborationForm = ({ formData, onFormChange }) => {
  return (
    <div className='space-y-6'>
      {/* Section 1: Basic Information */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2'>
          Basic Information
        </h3>

        {/* Project Title */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Project Title <span className='text-red-500'>*</span>
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

        {/* Expected Team Size */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Expected Team Size
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
        <div className='space-y-3'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Contact Information
          </label>

          {/* Email - Required */}
          <div>
            <label className='block text-xs font-medium text-gray-600 mb-1'>
              Email <span className='text-red-500'>*</span>
            </label>
            <input
              type='email'
              name='contactEmail'
              value={formData.contactEmail || ''}
              onChange={onFormChange}
              placeholder='your.email@example.com'
              className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
            />
          </div>

          {/* Discord */}
          <div>
            <label className='block text-xs font-medium text-gray-600 mb-1'>
              Discord
            </label>
            <input
              type='text'
              name='contactDiscord'
              value={formData.contactDiscord || ''}
              onChange={onFormChange}
              placeholder='username#1234'
              className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
            />
          </div>

          {/* Other */}
          <div>
            <label className='block text-xs font-medium text-gray-600 mb-1'>
              Other
            </label>
            <input
              type='text'
              name='contactOther'
              value={formData.contactOther || ''}
              onChange={onFormChange}
              placeholder='Slack, Telegram, etc.'
              className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
            />
          </div>
        </div>

        {/* Application Deadline */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Application Deadline <span className='text-red-500'>*</span>
          </label>
          <input
            type='date'
            name='applicationDeadline'
            value={formData.applicationDeadline}
            onChange={onFormChange}
            className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
          />
        </div>

        {/* Looking For */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Looking For
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
      </div>

      {/* Section 2: Project Details */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2'>
          Project Details
        </h3>

        {/* Project Description */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Project Description <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='description'
            value={formData.description}
            onChange={onFormChange}
            placeholder='Describe your project and what kind of help you need...'
            rows={4}
            maxLength={1000}
            className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
          />
          <div className='text-xs text-gray-500 mt-1 text-right'>
            {formData.description.length}/1000 characters
          </div>
        </div>

        {/* Project Vision */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Project Vision <span className='text-red-500'>*</span>
          </label>
          <textarea
            name='projectVision'
            value={formData.projectVision}
            onChange={onFormChange}
            placeholder='In one or two sentences, explain why you started this project and what excites you about it.'
            rows={3}
            maxLength={200}
            className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
          />
          <div className='text-xs text-gray-500 mt-1 text-right'>
            {formData.projectVision.length}/200 characters
          </div>
        </div>

        {/* Why This Matters */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Why This Matters <span className='text-gray-500'>(Optional)</span>
          </label>
          <textarea
            name='whyThisMatters'
            value={formData.whyThisMatters}
            onChange={onFormChange}
            placeholder="Describe the bigger impact of your project — why it's important, and what difference it could make."
            rows={5}
            maxLength={1000}
            className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
          />
          <div className='text-xs text-gray-500 mt-1 text-right'>
            {formData.whyThisMatters.length}/1000 characters
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationForm;
