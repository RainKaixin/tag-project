import { useState, useMemo } from 'react';

import { getInitialFormData } from '../data/formOptions';

const useCollaborationState = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());

  const result = useMemo(
    () => ({
      state: {
        showSuccess,
        isSubmitting,
        isSaving,
        formData,
      },
      setters: {
        setShowSuccess,
        setIsSubmitting,
        setIsSaving,
        setFormData,
      },
    }),
    [showSuccess, isSubmitting, isSaving, formData]
  );

  return result;
};

export default useCollaborationState;
