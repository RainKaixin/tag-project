import { useState, useMemo } from 'react';

import { getInitialFormData } from '../data/formOptions';

const useCollaborationState = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const result = useMemo(
    () => ({
      state: {
        showSuccess,
        isSubmitting,
        isSaving,
        formData,
        showValidationModal,
        validationErrors,
      },
      setters: {
        setShowSuccess,
        setIsSubmitting,
        setIsSaving,
        setFormData,
        setShowValidationModal,
        setValidationErrors,
      },
    }),
    [
      showSuccess,
      isSubmitting,
      isSaving,
      formData,
      showValidationModal,
      validationErrors,
    ]
  );

  return result;
};

export default useCollaborationState;
