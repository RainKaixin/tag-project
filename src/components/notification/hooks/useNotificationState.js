import { useState, useMemo } from 'react';

import { getDefaultFilters } from '../data/notificationOptions';

const useNotificationState = () => {
  const [items, setItems] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState(getDefaultFilters().activeTab);
  const [timeFilter, setTimeFilter] = useState(getDefaultFilters().timeFilter);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const result = useMemo(
    () => ({
      state: {
        items,
        filteredNotifications,
        activeTab,
        timeFilter,
        isLoading,
        hasMore,
      },
      setters: {
        setItems,
        setFilteredNotifications,
        setActiveTab,
        setTimeFilter,
        setIsLoading,
        setHasMore,
      },
    }),
    [items, filteredNotifications, activeTab, timeFilter, isLoading, hasMore]
  );

  return result;
};

export default useNotificationState;
