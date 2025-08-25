import { useCallback } from 'react';

import { createNewStage } from '../data/formOptions';

const useMilestonesActions = ({ state, setters }) => {
  const { setMilestoneStages } = setters;

  // 处理阶段名称变化
  const handleStageNameChange = useCallback(
    (stageId, value) => {
      setMilestoneStages(prev =>
        prev.map(stage =>
          stage.id === stageId ? { ...stage, stageName: value } : stage
        )
      );
    },
    [setMilestoneStages]
  );

  // 处理进度条变化
  const handleProgressChange = useCallback(
    (stageId, value) => {
      setMilestoneStages(prev =>
        prev.map(stage =>
          stage.id === stageId ? { ...stage, progress: parseInt(value) } : stage
        )
      );
    },
    [setMilestoneStages]
  );

  // 处理文件上传
  const handleFileUpload = useCallback(
    (stageId, e) => {
      const files = Array.from(e.target.files);
      setMilestoneStages(prev =>
        prev.map(stage =>
          stage.id === stageId ? { ...stage, posterFiles: files } : stage
        )
      );
    },
    [setMilestoneStages]
  );

  // 处理其他字段变化
  const handleFieldChange = useCallback(
    (stageId, field, value) => {
      setMilestoneStages(prev =>
        prev.map(stage =>
          stage.id === stageId ? { ...stage, [field]: value } : stage
        )
      );
    },
    [setMilestoneStages]
  );

  // 添加新阶段
  const addNewStage = useCallback(() => {
    const newStage = createNewStage();
    setMilestoneStages(prev => [...prev, newStage]);
  }, [setMilestoneStages]);

  // 删除阶段
  const removeStage = useCallback(
    stageId => {
      if (state.milestoneStages.length > 1) {
        setMilestoneStages(prev => prev.filter(stage => stage.id !== stageId));
      }
    },
    [state.milestoneStages.length, setMilestoneStages]
  );

  // 防止回车键触发表单提交
  const handleKeyDown = useCallback(e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  // 处理表单提交
  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      console.log('Milestones stages submitted:', state.milestoneStages);

      // 直接显示成功界面
      setters.setShowSuccess(true);
    },
    [state.milestoneStages, setters]
  );

  return {
    handleStageNameChange,
    handleProgressChange,
    handleFileUpload,
    handleFieldChange,
    addNewStage,
    removeStage,
    handleKeyDown,
    handleSubmit,
  };
};

export default useMilestonesActions;






















