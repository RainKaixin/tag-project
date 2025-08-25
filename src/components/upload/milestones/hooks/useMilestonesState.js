import { useState, useMemo } from 'react';

import { getInitialMilestoneStages } from '../data/formOptions';

const useMilestonesState = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [milestoneStages, setMilestoneStages] = useState(
    getInitialMilestoneStages()
  );

  const result = useMemo(
    () => ({
      state: {
        showSuccess,
        milestoneStages,
      },
      setters: {
        setShowSuccess,
        setMilestoneStages,
      },
    }),
    [showSuccess, milestoneStages]
  );

  return result;
};

export default useMilestonesState;






















