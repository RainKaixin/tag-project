import React, { useState, useCallback } from 'react';

import styles from '../EditProfile.module.css';
import type { SocialLinksCardProps, LinkItem, SocialLinks } from '../types';

const SUGGESTIONS = [
  { label: 'ArtStation', placeholder: 'https://www.artstation.com/yourname' },
  { label: 'Behance', placeholder: 'https://www.behance.net/yourname' },
];

const SocialLinksCard: React.FC<SocialLinksCardProps> = ({
  links,
  onChange,
  onOtherLinksChange,
}) => {
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [error, setError] = useState('');

  // URL 验证函数
  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return true; // 空值视为有效
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleChange = (
    platform: 'instagram' | 'portfolio' | 'discord',
    value: string
  ) => {
    onChange(platform, value);
  };

  const addLink = useCallback(() => {
    const label = newLinkLabel.trim();
    const url = newLinkUrl.trim();

    // 验证输入
    if (!label) {
      setError('Please enter a website name');
      return;
    }

    if (!url) {
      setError('Please enter a URL');
      return;
    }

    if (!/^https?:\/\/.+/i.test(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    // 检查重复域名
    try {
      const newHost = new URL(url).hostname.toLowerCase();
      const exists = (links.otherLinks || []).some(link => {
        try {
          return new URL(link.url).hostname.toLowerCase() === newHost;
        } catch {
          return false;
        }
      });

      if (exists) {
        setError('This website is already added');
        return;
      }
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    // 检查数量限制
    if ((links.otherLinks || []).length >= 5) {
      setError('Maximum of 5 links');
      return;
    }

    // 添加链接
    const newLink: LinkItem = {
      id: crypto.randomUUID(),
      label,
      url,
    };

    onOtherLinksChange([...(links.otherLinks || []), newLink]);
    setNewLinkLabel('');
    setNewLinkUrl('');
    setError('');
  }, [newLinkLabel, newLinkUrl, links, onOtherLinksChange]);

  const removeLink = useCallback(
    (id: string) => {
      onOtherLinksChange(
        (links.otherLinks || []).filter(link => link.id !== id)
      );
    },
    [links, onOtherLinksChange]
  );

  const handleSuggestionSelect = useCallback(
    (suggestion: (typeof SUGGESTIONS)[0]) => {
      setNewLinkLabel(suggestion.label);
      setNewLinkUrl('');
      setError('');
    },
    []
  );

  const getWebsiteIcon = (label: string) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('artstation')) {
      return (
        <svg
          className={styles.socialIcon}
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.25c5.385 0 9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12 6.615 2.25 12 2.25zm0 3.75c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6zm0 2.25c2.071 0 3.75 1.679 3.75 3.75s-1.679 3.75-3.75 3.75S8.25 14.821 8.25 12.75 9.929 9 12 9z' />
        </svg>
      );
    }
    if (lowerLabel.includes('behance')) {
      return (
        <svg
          className={styles.socialIcon}
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.561-5.92 5.466-5.92 3.082 0 4.588 1.837 5.038 4.426l.332 1.906H17.19l-.23-1.518c-.245-1.332-1.104-1.804-2.13-1.804-1.245 0-2.916.988-2.916 3.368 0 2.507 1.688 3.716 3.111 3.716 1.149 0 1.955-.518 2.19-1.138h1.701zM11.649 9.413c0-1.288.875-2.013 1.857-2.013.983 0 1.857.725 1.857 2.013 0 1.287-.874 2.013-1.857 2.013-.982 0-1.857-.726-1.857-2.013zM8.14 12.213c0-1.634.893-2.6 2.072-2.6 1.179 0 2.072.966 2.072 2.6 0 1.635-.893 2.6-2.072 2.6-1.179 0-2.072-.965-2.072-2.6z' />
        </svg>
      );
    }
    // 通用图标
    return (
      <svg
        className={styles.socialIcon}
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9'
        />
      </svg>
    );
  };

  const fixedPlatforms = [
    {
      key: 'instagram',
      label: 'Instagram URL',
      placeholder: 'https://www.instagram.com/yourusername',
      icon: (
        <svg
          className={styles.socialIcon}
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
        </svg>
      ),
    },
    {
      key: 'portfolio',
      label: 'Portfolio URL',
      placeholder: 'https://your-portfolio.com',
      icon: (
        <svg
          className={styles.socialIcon}
          fill='currentColor'
          viewBox='0 0 24 24'
        >
          <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z' />
        </svg>
      ),
    },
    {
      key: 'discord',
      label: 'Discord URL',
      placeholder: 'https://discord.gg/yourname',
      icon: (
        <svg
          className={styles.socialIcon}
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z' />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.card}>
      <h3 className={styles.cardTitle}>Social Links</h3>

      <div className={styles.socialLinksContainer}>
        {/* 固定平台 */}
        <div className={styles.socialSection}>
          {fixedPlatforms.map(platform => {
            const value = links[platform.key as keyof SocialLinks];
            const stringValue = typeof value === 'string' ? value : '';

            return (
              <div key={platform.key} className={styles.formField}>
                <label htmlFor={platform.key} className={styles.label}>
                  {platform.label}
                </label>
                <div className={styles.socialInputContainer}>
                  <div className={styles.socialIconContainer}>
                    {platform.icon}
                  </div>
                  <input
                    id={platform.key}
                    type='url'
                    value={stringValue}
                    onChange={e =>
                      handleChange(
                        platform.key as 'instagram' | 'portfolio' | 'discord',
                        e.target.value
                      )
                    }
                    className={`${styles.socialInput} ${
                      stringValue && !isValidUrl(stringValue)
                        ? styles.inputError
                        : ''
                    }`}
                    placeholder={platform.placeholder}
                    aria-describedby={`${platform.key}-error`}
                  />
                </div>
                {stringValue && !isValidUrl(stringValue) && (
                  <div
                    id={`${platform.key}-error`}
                    className={styles.errorMessage}
                  >
                    Please enter a valid URL starting with http:// or https://
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 其他网站 */}
        <div className={styles.socialSection}>
          <div className={styles.sectionHeader}>
            <h4 className={styles.sectionTitle}>Other Websites</h4>
          </div>

          {/* 现有链接列表 */}
          <div className={styles.otherLinksList}>
            {(links.otherLinks || []).map(link => (
              <div key={link.id} className={styles.otherLinkRow}>
                <div className={styles.socialIconContainer}>
                  {getWebsiteIcon(link.label)}
                </div>
                <div className={styles.otherLinkInfo}>
                  <div className={styles.otherLinkLabel}>{link.label}</div>
                  <div className={styles.otherLinkUrl}>{link.url}</div>
                </div>
                <button
                  type='button'
                  onClick={() => removeLink(link.id)}
                  className={styles.removeLinkButton}
                  aria-label={`Remove ${link.label} website`}
                >
                  <svg
                    className={styles.removeIcon}
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
              </div>
            ))}
          </div>

          {/* 添加新链接 */}
          {(links.otherLinks || []).length < 5 && (
            <div className={styles.addLinkSection}>
              <div className={styles.addLinkRow}>
                <div className={styles.addLinkInputGroup}>
                  <input
                    type='text'
                    value={newLinkLabel}
                    onChange={e => {
                      setNewLinkLabel(e.target.value);
                      setError('');
                    }}
                    placeholder='Website name'
                    className={styles.addLinkInput}
                  />
                  <input
                    type='url'
                    value={newLinkUrl}
                    onChange={e => {
                      setNewLinkUrl(e.target.value);
                      setError('');
                    }}
                    placeholder='https://example.com'
                    className={styles.addLinkInput}
                  />
                  <button
                    type='button'
                    onClick={addLink}
                    className={styles.addLinkButton}
                    disabled={!newLinkLabel.trim() || !newLinkUrl.trim()}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* 建议按钮 */}
              <div className={styles.suggestions}>
                {SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion.label}
                    type='button'
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={styles.suggestionButton}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>

              {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
          )}

          {(links.otherLinks || []).length >= 5 && (
            <div className={styles.maxLinksMessage}>
              Maximum of 5 links reached.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialLinksCard;
