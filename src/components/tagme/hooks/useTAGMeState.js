import { useState, useMemo } from 'react';

const useTAGMeState = () => {
  const [activeTab, setActiveTab] = useState('Collaborations');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedMajors, setSelectedMajors] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const result = useMemo(
    () => ({
      state: {
        activeTab,
        selectedCategories,
        selectedMajors,
        selectedTags,
      },
      setters: {
        setActiveTab,
        setSelectedCategories,
        setSelectedMajors,
        setSelectedTags,
      },
    }),
    [activeTab, selectedCategories, selectedMajors, selectedTags]
  );

  return result;
};

export default useTAGMeState;
