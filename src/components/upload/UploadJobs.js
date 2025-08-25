import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadJobs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    salary: '',
    description: '',
    requirements: '',
    contactEmail: '',
  });

  // 处理表单数据变化
  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 处理表单提交
  const handleSubmit = e => {
    e.preventDefault();
    console.log('Jobs form submitted:', formData);
    // 模拟提交成功
    alert('Job posting created successfully on TAGMe!');
    navigate('/');
  };

  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
      <div className='text-center mb-6'>
        <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg
            className='w-8 h-8 text-tag-purple'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 7a2 2 0 012-2h12a2 2 0 012 2v2H4V7zM4 9h16v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9z'
            />
          </svg>
        </div>
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
          Post Job Opportunity
        </h2>
        <p className='text-gray-600'>
          Share creative job opportunities with the TAG community
        </p>
      </div>

      {/* Jobs 表单 */}
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* 基础信息 */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Job Title
            </label>
            <input
              type='text'
              name='title'
              value={formData.title}
              onChange={handleFormChange}
              placeholder='e.g., Senior UI/UX Designer'
              className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Company
            </label>
            <input
              type='text'
              name='company'
              value={formData.company}
              onChange={handleFormChange}
              placeholder='Company name'
              className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
            />
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Location
            </label>
            <input
              type='text'
              name='location'
              value={formData.location}
              onChange={handleFormChange}
              placeholder='City, Country or Remote'
              className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Job Type
            </label>
            <div className='relative'>
              <select
                name='jobType'
                value={formData.jobType}
                onChange={handleFormChange}
                className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple appearance-none'
              >
                <option value=''>Select type</option>
                <option value='full-time'>Full-time</option>
                <option value='part-time'>Part-time</option>
                <option value='contract'>Contract</option>
                <option value='freelance'>Freelance</option>
                <option value='internship'>Internship</option>
              </select>
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
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Salary Range
            </label>
            <input
              type='text'
              name='salary'
              value={formData.salary}
              onChange={handleFormChange}
              placeholder='e.g., $50k-$80k'
              className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Job Description
          </label>
          <textarea
            name='description'
            value={formData.description}
            onChange={handleFormChange}
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            rows={6}
            className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Requirements
          </label>
          <textarea
            name='requirements'
            value={formData.requirements}
            onChange={handleFormChange}
            placeholder='List required skills, experience, and qualifications...'
            rows={4}
            className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Contact Email
          </label>
          <input
            type='email'
            name='contactEmail'
            value={formData.contactEmail}
            onChange={handleFormChange}
            placeholder='hr@company.com'
            className='w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple'
          />
        </div>

        {/* 提交按钮 */}
        <button
          type='submit'
          className='w-full bg-tag-purple text-white font-semibold py-3 rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center'
        >
          <svg
            className='w-5 h-5 mr-2'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5M8 6V4a2 2 0 00-2-2H4a2 2 0 00-2 2v2m8 0V6a2 2 0 012 2v6.5'
            />
          </svg>
          Post Job TAGMe!
        </button>
      </form>
    </div>
  );
};

export default UploadJobs;
