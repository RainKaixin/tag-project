import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
} from 'react';

import { artistService } from '../services/index.js';
import {
  browserChecker,
  fallbackManager,
} from '../utils/browserCompatibility.js';
import { clearAllTAGData, resetCurrentUser } from '../utils/resetData.js';
import { ensureMockSeed } from '../utils/seed';

// 初始状态
const initialState = {
  selectedArtist: null,
  selectedCollaboration: null,
  selectedMilestone: null,
  isLoading: false,
  showDetail: false,
  navigationHistory: [], // 用于记录导航历史
  scrollPositions: {}, // 用于记录各页面的滚动位置
  isInitialized: false, // 应用是否已初始化
  // 统一的评论数据管理
  comments: [
    {
      id: 1,
      user: 'Alex Chen',
      avatar: null, // 移除默认头像
      role: 'Character Designer',
      comment:
        'The character sketches are looking great! I think we should focus more on the facial expressions for the next iteration.',
      timestamp: '2 hours ago',
      likes: 3,
    },
    {
      id: 2,
      user: 'Maya Rodriguez',
      avatar: null, // 移除默认头像
      role: 'Art Director',
      comment:
        'Love the color palette choices. The purple hair really makes the character stand out.',
      timestamp: '4 hours ago',
      likes: 5,
    },
    {
      id: 3,
      user: 'Jordan Kim',
      avatar: null, // 移除默认头像
      role: '3D Modeler',
      comment:
        "The 3D models are coming along nicely. Can't wait to see the final renders!",
      timestamp: '1 day ago',
      likes: 2,
    },
  ],
};

// Action类型
const ACTIONS = {
  SET_SELECTED_ARTIST: 'SET_SELECTED_ARTIST',
  SET_SELECTED_COLLABORATION: 'SET_SELECTED_COLLABORATION',
  SET_SELECTED_MILESTONE: 'SET_SELECTED_MILESTONE',
  SET_LOADING: 'SET_LOADING',
  SET_SHOW_DETAIL: 'SET_SHOW_DETAIL',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
  RESET_STATE: 'RESET_STATE',
  SAVE_SCROLL_POSITION: 'SAVE_SCROLL_POSITION',
  CLEAR_SCROLL_POSITION: 'CLEAR_SCROLL_POSITION',
  ADD_COMMENT: 'ADD_COMMENT',
  UPDATE_COMMENT: 'UPDATE_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  SET_INITIALIZED: 'SET_INITIALIZED',
};

// Reducer函数
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_SELECTED_ARTIST:
      return {
        ...state,
        selectedArtist: action.payload,
      };
    case ACTIONS.SET_SELECTED_COLLABORATION:
      return {
        ...state,
        selectedCollaboration: action.payload,
      };
    case ACTIONS.SET_SELECTED_MILESTONE:
      return {
        ...state,
        selectedMilestone: action.payload,
      };
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case ACTIONS.SET_SHOW_DETAIL:
      return {
        ...state,
        showDetail: action.payload,
      };
    case ACTIONS.ADD_TO_HISTORY:
      return {
        ...state,
        navigationHistory: [...state.navigationHistory, action.payload],
      };
    case ACTIONS.CLEAR_HISTORY:
      return {
        ...state,
        navigationHistory: [],
      };
    case ACTIONS.RESET_STATE:
      return {
        ...initialState,
        isInitialized: state.isInitialized, // 保留初始化状态
        navigationHistory: state.navigationHistory,
        scrollPositions: state.scrollPositions,
      };
    case ACTIONS.SAVE_SCROLL_POSITION:
      return {
        ...state,
        scrollPositions: {
          ...state.scrollPositions,
          [action.payload.path]: action.payload.position,
        },
      };
    case ACTIONS.CLEAR_SCROLL_POSITION: {
      const { [action.payload]: removed, ...restScrollPositions } =
        state.scrollPositions;
      // removed variable is intentionally unused
      return {
        ...state,
        scrollPositions: restScrollPositions,
      };
    }
    case ACTIONS.ADD_COMMENT:
      return {
        ...state,
        comments: [action.payload, ...state.comments],
      };
    case ACTIONS.UPDATE_COMMENT:
      return {
        ...state,
        comments: state.comments.map(comment =>
          comment.id === action.payload.id ? action.payload : comment
        ),
      };
    case ACTIONS.DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(
          comment => comment.id !== action.payload
        ),
      };
    case ACTIONS.SET_INITIALIZED:
      return {
        ...state,
        isInitialized: action.payload,
      };
    default:
      return state;
  }
};

// 创建Context
const AppContext = createContext();

// Provider组件
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 便捷的action creators
  const actions = {
    setSelectedArtist: useCallback(
      artist =>
        dispatch({ type: ACTIONS.SET_SELECTED_ARTIST, payload: artist }),
      [dispatch]
    ),

    setSelectedCollaboration: useCallback(
      collaboration =>
        dispatch({
          type: ACTIONS.SET_SELECTED_COLLABORATION,
          payload: collaboration,
        }),
      [dispatch]
    ),

    setSelectedMilestone: useCallback(
      milestone =>
        dispatch({ type: ACTIONS.SET_SELECTED_MILESTONE, payload: milestone }),
      [dispatch]
    ),

    setLoading: useCallback(
      loading => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
      [dispatch]
    ),

    setShowDetail: useCallback(
      show => dispatch({ type: ACTIONS.SET_SHOW_DETAIL, payload: show }),
      [dispatch]
    ),

    addToHistory: useCallback(
      route => dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: route }),
      [dispatch]
    ),

    clearHistory: useCallback(
      () => dispatch({ type: ACTIONS.CLEAR_HISTORY }),
      [dispatch]
    ),

    resetState: useCallback(
      () => dispatch({ type: ACTIONS.RESET_STATE }),
      [dispatch]
    ),

    saveScrollPosition: useCallback(
      (path, position) =>
        dispatch({
          type: ACTIONS.SAVE_SCROLL_POSITION,
          payload: { path, position },
        }),
      [dispatch]
    ),

    clearScrollPosition: useCallback(
      path => dispatch({ type: ACTIONS.CLEAR_SCROLL_POSITION, payload: path }),
      [dispatch]
    ),

    // 评论管理actions
    addComment: useCallback(
      comment => dispatch({ type: ACTIONS.ADD_COMMENT, payload: comment }),
      [dispatch]
    ),

    updateComment: useCallback(
      comment => dispatch({ type: ACTIONS.UPDATE_COMMENT, payload: comment }),
      [dispatch]
    ),

    deleteComment: useCallback(
      commentId =>
        dispatch({ type: ACTIONS.DELETE_COMMENT, payload: commentId }),
      [dispatch]
    ),
    setInitialized: useCallback(
      initialized =>
        dispatch({ type: ACTIONS.SET_INITIALIZED, payload: initialized }),
      [dispatch]
    ),
  };

  // 应用启动时的初始化逻辑
  useEffect(() => {
    // 立即设置初始化状态
    dispatch({ type: ACTIONS.SET_INITIALIZED, payload: true });

    // 添加超时保护作为最后兜底
    const timeoutId = setTimeout(() => {
      if (!state.isInitialized) {
        dispatch({ type: ACTIONS.SET_INITIALIZED, payload: true });
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []); // 空依赖数组，只在组件挂载时执行一次

  const value = React.useMemo(
    () => ({
      state,
      actions,
    }),
    [state, actions]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 自定义Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
