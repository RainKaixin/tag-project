// tag-renderer v1: 標籤渲染工具

import React from 'react';

import { extractTags } from './tagParser';

/**
 * 將文本中的標籤渲染為可點擊的鏈接
 * @param {string} text - 要渲染的文本
 * @param {Function} onTagClick - 標籤點擊回調函數
 * @returns {Array} React 元素數組
 */
export const renderWithTags = (text, onTagClick) => {
  if (!text || typeof text !== 'string') {
    return text;
  }

  // 提取標籤
  const tags = extractTags(text);

  if (tags.length === 0) {
    return text;
  }

  // 將文本分割為標籤和非標籤部分
  const parts = [];
  let lastIndex = 0;

  tags.forEach(tag => {
    const tagPattern = `#${tag.name}`;
    const tagIndex = text.indexOf(tagPattern, lastIndex);

    if (tagIndex !== -1) {
      // 添加標籤前的文本
      if (tagIndex > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, tagIndex),
        });
      }

      // 添加標籤
      parts.push({
        type: 'tag',
        content: tagPattern,
        tag: tag,
      });

      lastIndex = tagIndex + tagPattern.length;
    }
  });

  // 添加剩餘文本
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.slice(lastIndex),
    });
  }

  // 渲染為 React 元素
  return parts.map((part, index) => {
    if (part.type === 'tag') {
      return (
        <TagLink key={index} tag={part.tag} onClick={onTagClick}>
          {part.content}
        </TagLink>
      );
    } else {
      return <span key={index}>{part.content}</span>;
    }
  });
};

/**
 * 標籤鏈接組件
 */
const TagLink = ({ tag, onClick, children }) => {
  const handleClick = e => {
    // 如果提供了自定义点击处理函数，则使用它
    if (onClick) {
      e.preventDefault();
      onClick(tag);
    }
    // 否则使用原生链接行为，支持新标签页打开
  };

  return (
    <a
      href={`/t/${tag.slug}`}
      onClick={handleClick}
      target='_blank'
      rel='noopener noreferrer'
      className='text-blue-600 hover:text-blue-800 underline cursor-pointer'
      title={`View all content tagged with ${tag.name}`}
    >
      {children}
    </a>
  );
};

/**
 * 渲染標籤列表（用於顯示多個標籤）
 * @param {Array<{name: string, slug: string}>} tags - 標籤數組
 * @param {Function} onTagClick - 標籤點擊回調函數
 * @param {string} className - 額外的 CSS 類名
 * @returns {React.Element} 標籤列表組件
 */
export const renderTagList = (tags, onTagClick, className = '') => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <TagLink key={`${tag.slug}-${index}`} tag={tag} onClick={onTagClick}>
          #{tag.name}
        </TagLink>
      ))}
    </div>
  );
};
