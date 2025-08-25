import React, { useState } from 'react';

import styles from '../EditProfile.module.css';
import type { PortfolioGridCardProps } from '../types';

import PortfolioItemModal, { PortfolioItemData } from './PortfolioItemModal';

const PortfolioGridCard: React.FC<PortfolioGridCardProps> = ({
  items,
  onChange,
  onDelete,
  onToggleVisibility,
}) => {
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemTitle: string;
  }>({
    isOpen: false,
    itemId: null,
    itemTitle: '',
  });

  // 编辑弹窗状态
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    itemId: string | null;
    itemData: PortfolioItemData | null;
  }>({
    isOpen: false,
    itemId: null,
    itemData: null,
  });

  const togglePublic = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item && onToggleVisibility) {
      // 使用新的处理函数
      onToggleVisibility(id, item.isPublic);
    } else {
      // 回退到原来的逻辑
      const next = items.map(i =>
        i.id === id ? { ...i, isPublic: !i.isPublic } : i
      );
      onChange(next);
    }
  };

  const openDeleteModal = (id: string, title: string) => {
    setDeleteModal({
      isOpen: true,
      itemId: id,
      itemTitle: title,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      itemId: null,
      itemTitle: '',
    });
  };

  const confirmDelete = () => {
    if (deleteModal.itemId) {
      if (onDelete) {
        // 使用新的处理函数
        onDelete(deleteModal.itemId);
      } else {
        // 回退到原来的逻辑
        const next = items.filter(i => i.id !== deleteModal.itemId);
        onChange(next);
      }
      closeDeleteModal();
    }
  };

  // 打开编辑弹窗
  const openEditModal = (item: any) => {
    // 从 tags 中分离软件和标签信息
    let softwareList: string[] = [];
    let tagsList: string[] = [];

    if (item.tags && Array.isArray(item.tags)) {
      // 过滤出软件标签（不包含 @ 的标签）
      softwareList = item.tags.filter((tag: string) =>
        [
          'Photoshop',
          'Illustrator',
          'Blender',
          'Maya',
          '3ds Max',
          'Cinema 4D',
          'After Effects',
          'Premiere Pro',
          'Figma',
          'Sketch',
          'Procreate',
          'ZBrush',
          'Substance Painter',
          'Unity',
          'Unreal Engine',
        ].includes(tag)
      );

      // 过滤出用户标签（包含 @ 的标签）
      tagsList = item.tags.filter((tag: string) => tag.startsWith('@'));
    }

    setEditModal({
      isOpen: true,
      itemId: item.id,
      itemData: {
        title: item.title || '',
        description: item.description || '',
        software: softwareList,
        tags: tagsList,
      },
    });
  };

  // 关闭编辑弹窗
  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      itemId: null,
      itemData: null,
    });
  };

  // 处理编辑保存
  const handleEditSave = async (data: PortfolioItemData) => {
    if (editModal.itemId) {
      try {
        // 导入 Mock API 的更新函数
        const { updatePortfolioItem } = await import(
          '../../../services/supabase/portfolio'
        );

        // 更新 Mock API 中的数据
        const updateResult = await updatePortfolioItem(editModal.itemId, {
          title: data.title,
          description: data.description,
          tags: [...data.software, ...data.tags, 'uploaded'],
        });

        if (updateResult.success) {
          // 更新本地状态
          const updatedItems = items.map(item =>
            item.id === editModal.itemId
              ? {
                  ...item,
                  title: data.title,
                  description: data.description,
                  software: data.software,
                  tags: [...data.software, ...data.tags, 'uploaded'],
                }
              : item
          );
          onChange(updatedItems);
          closeEditModal();
        } else {
          console.error('Failed to update portfolio item:', updateResult.error);
          alert('Failed to update work details. Please try again.');
        }
      } catch (error) {
        console.error('Error updating portfolio item:', error);
        alert('Failed to update work details. Please try again.');
      }
    }
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Portfolio</h3>

      {items.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg viewBox='0 0 24 24' fill='none' stroke='currentColor'>
              <rect x='3' y='3' width='18' height='18' rx='2' ry='2' />
              <circle cx='8.5' cy='8.5' r='1.5' />
              <polyline points='21,15 16,10 5,21' />
            </svg>
          </div>
          <p className={styles.emptyText}>No works uploaded yet</p>
          <p className={styles.emptySubtext}>
            Upload your first work to start building your portfolio
          </p>
        </div>
      ) : (
        <div className={styles.portfolioGrid}>
          {items.map(item => (
            <div key={item.id} className={styles.portfolioItem}>
              <div className={styles.portfolioImageContainer}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={styles.portfolioImage}
                />
                <div className={styles.portfolioOverlay}>
                  <button
                    type='button'
                    onClick={() => openEditModal(item)}
                    className={styles.editButton}
                    title='Edit work details'
                  >
                    <svg viewBox='0 0 24 24' fill='currentColor'>
                      <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
                    </svg>
                  </button>
                  <button
                    type='button'
                    onClick={() => togglePublic(item.id)}
                    className={`${styles.visibilityButton} ${
                      item.isPublic ? styles.public : styles.private
                    }`}
                    title={item.isPublic ? 'Make Private' : 'Make Public'}
                  >
                    {item.isPublic ? (
                      <svg viewBox='0 0 24 24' fill='currentColor'>
                        <path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' />
                      </svg>
                    ) : (
                      <svg viewBox='0 0 24 24' fill='currentColor'>
                        <path d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z' />
                      </svg>
                    )}
                  </button>
                  <button
                    type='button'
                    onClick={() => openDeleteModal(item.id, item.title)}
                    className={styles.removeButton}
                    title='Remove from portfolio'
                  >
                    <svg viewBox='0 0 24 24' fill='currentColor'>
                      <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
                    </svg>
                  </button>
                </div>
                <div className={styles.portfolioStatus}>
                  <span
                    className={`${styles.statusBadge} ${
                      item.isPublic ? styles.publicBadge : styles.privateBadge
                    }`}
                  >
                    {item.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
              <div className={styles.portfolioInfo}>
                <h4 className={styles.portfolioTitle}>{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 删除确认弹框 */}
      {deleteModal.isOpen && (
        <div className={styles.modalOverlay} onClick={closeDeleteModal}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Delete Work</h3>
            </div>
            <div className={styles.modalContent}>
              <p>
                Are you sure you want to delete{' '}
                <strong>"{deleteModal.itemTitle}"</strong> from your portfolio?
              </p>
              <p className={styles.modalWarning}>
                This action cannot be undone.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button
                type='button'
                onClick={closeDeleteModal}
                className={styles.modalCancelButton}
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={confirmDelete}
                className={styles.modalDeleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑弹窗 */}
      <PortfolioItemModal
        isOpen={editModal.isOpen}
        onClose={closeEditModal}
        onSave={handleEditSave}
        initialData={editModal.itemData || {}}
      />
    </div>
  );
};

export default PortfolioGridCard;
