// visual-examples v1: 视觉示例组件
// 从 UploadGuidelines.js 中提取的视觉示例

import React from 'react';

import { VISUAL_EXAMPLES } from '../utils/guidelinesData';

/**
 * VisualExamples 组件 - 视觉示例对比
 * @returns {JSX.Element} 视觉示例组件
 */
const VisualExamples = () => {
  const renderExample = type => {
    const example = VISUAL_EXAMPLES[type];
    const { content } = example;

    return (
      <div className='text-center'>
        <div className='relative mb-4'>
          <div
            className={`w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center ${
              content.containerClass || ''
            }`}
          >
            <div className='text-white text-center'>
              <div
                className={`text-2xl font-bold mb-2 ${
                  content.titleClass || ''
                }`}
              >
                {content.title}
              </div>
              <div className={content.icon}></div>
              <div className={content.bar}></div>
            </div>
          </div>
          <div
            className={`absolute -top-2 -right-2 ${example.className} text-white px-2 py-1 rounded-full text-xs font-medium`}
          >
            {example.title}
          </div>
        </div>
        <p
          className={`text-sm ${
            type === 'good' ? 'text-green-600' : 'text-red-600'
          } font-medium`}
        >
          {example.description}
        </p>
      </div>
    );
  };

  return (
    <div className='border-t border-gray-200 pt-8'>
      <h3 className='text-xl font-semibold text-gray-900 mb-6'>
        Visual Examples
      </h3>
      <div className='grid md:grid-cols-2 gap-8'>
        {renderExample('good')}
        {renderExample('bad')}
      </div>
    </div>
  );
};

export default VisualExamples;
