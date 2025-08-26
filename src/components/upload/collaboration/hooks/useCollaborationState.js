import { useState, useMemo } from 'react';

import { getInitialFormData } from '../data/formOptions';

const useCollaborationState = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());

  const result = useMemo(
    () => ({
      state: {
        showSuccess,
        formData,
      },
      setters: {
        setShowSuccess,
        setFormData,
      },
    }),
    [showSuccess, formData]
  );

  return result;
};

export default useCollaborationState;
