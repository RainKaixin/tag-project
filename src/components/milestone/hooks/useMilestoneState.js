import { useState, useMemo } from 'react';

const useMilestoneState = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [comment, setComment] = useState('');

  const result = useMemo(
    () => ({
      state: {
        activeTab,
        comment,
      },
      setters: {
        setActiveTab,
        setComment,
      },
    }),
    [activeTab, comment]
  );

  return result;
};

export default useMilestoneState;
