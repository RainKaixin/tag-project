// image-viewer v1: 图片查看器模态框组件

import React, { useEffect, useState, useCallback } from 'react';

/**
 * 图片查看器模态框组件
 * @param {string} imageUrl - 图片URL
 * @param {string} imageAlt - 图片alt文本
 * @param {boolean} isOpen - 是否显示模态框
 * @param {Function} onClose - 关闭事件
 * @param {string} className - 额外的CSS类名
 */
const ImageViewer = ({
  imageUrl,
  imageAlt = 'Image',
  isOpen = false,
  onClose,
  className = '',
}) => {
  // 缩放状态
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // 缩放限制
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 5;

  // 处理缩放
  const handleWheel = useCallback(
    e => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale + delta));
      setScale(newScale);
    },
    [scale]
  );

  // 处理双击重置
  const handleDoubleClick = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // 处理鼠标拖拽开始
  const handleMouseDown = useCallback(
    e => {
      if (scale > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - position.x,
          y: e.clientY - position.y,
        });
      }
    },
    [scale, position]
  );

  // 处理鼠标拖拽移动
  const handleMouseMove = useCallback(
    e => {
      if (isDragging && scale > 1) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    },
    [isDragging, scale, dragStart]
  );

  // 处理鼠标拖拽结束
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // ESC键关闭模态框
  useEffect(() => {
    const handleEscape = event => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // 恢复背景滚动
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 重置缩放状态
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm ${className}`}
      onClick={onClose}
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        className='absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200'
        aria-label='Close image viewer'
      >
        <svg
          className='w-6 h-6 text-white'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M6 18L18 6M6 6l12 12'
          />
        </svg>
      </button>

      {/* 重置缩放按钮 */}
      {scale !== 1 && (
        <button
          onClick={handleDoubleClick}
          className='absolute top-4 left-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200'
          aria-label='Reset zoom'
        >
          <svg
            className='w-6 h-6 text-white'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4'
            />
          </svg>
        </button>
      )}

      {/* 图片容器 */}
      <div
        className='relative max-w-[90vw] max-h-[90vh] flex items-center justify-center'
        onClick={e => e.stopPropagation()}
        onMouseDown={handleMouseDown}
        style={{
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
      >
        <img
          src={imageUrl}
          alt={imageAlt}
          className='max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-200'
          loading='eager'
          onDoubleClick={handleDoubleClick}
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${
              position.y / scale
            }px)`,
            transformOrigin: 'center',
          }}
        />
      </div>

      {/* 缩放比例显示 */}
      {scale !== 1 && (
        <div className='absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm'>
          {Math.round(scale * 100)}%
        </div>
      )}

      {/* 提示文本 */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm'>
        Scroll to zoom • Double-click to reset • ESC to close
      </div>
    </div>
  );
};

export default ImageViewer;
