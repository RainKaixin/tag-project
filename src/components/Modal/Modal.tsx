import { X } from 'lucide-react';
import React from 'react';

import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToCompetition: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onGoToCompetition,
}) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleUnderstand = () => {
    onGoToCompetition();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.content}>
          <h2 className={styles.title}>Student Competitions 2025 — Notice</h2>

          <div className={styles.body}>
            <p>This competition is currently in testing (beta).</p>
            <p>
              Some website features are still under development and will be
              released gradually.
            </p>
            <p>
              If you have any questions, please email:{' '}
              <a href='mailto:tag@rainwang.art' className={styles.emailLink}>
                tag@rainwang.art
              </a>
            </p>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.signature}>
            <p>Founder of TAG — Rain Wang</p>
          </div>

          <div className={styles.actions}>
            <button className={styles.primaryButton} onClick={handleUnderstand}>
              I Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
