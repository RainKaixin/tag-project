import React, { useState } from 'react';

const CollaborationRoles = ({
  roles,
  onAddRole,
  onRemoveRole,
  onRoleChange,
}) => {
  const [skillInputs, setSkillInputs] = useState({});

  // 處理技能輸入
  const handleSkillInputChange = (roleId, value) => {
    setSkillInputs(prev => ({
      ...prev,
      [roleId]: value,
    }));
  };

  // 處理技能輸入的鍵盤事件
  const handleSkillInputKeyDown = (roleId, e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputValue = skillInputs[roleId] || '';
      const currentSkills =
        roles.find(role => role.id === roleId)?.requiredSkills || '';

      if (inputValue.trim()) {
        const newSkill = inputValue.trim();
        const existingSkills = currentSkills
          ? currentSkills.split(',').map(s => s.trim())
          : [];

        if (!existingSkills.includes(newSkill)) {
          const updatedSkills = [...existingSkills, newSkill].join(', ');
          onRoleChange(roleId, 'requiredSkills', updatedSkills);
        }

        setSkillInputs(prev => ({
          ...prev,
          [roleId]: '',
        }));
      }
    }
  };

  // 移除技能標籤
  const removeSkill = (roleId, skillToRemove) => {
    const currentSkills =
      roles.find(role => role.id === roleId)?.requiredSkills || '';
    const skills = currentSkills
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== skillToRemove);
    onRoleChange(roleId, 'requiredSkills', skills.join(', '));
  };

  // 渲染技能標籤
  const renderSkills = (roleId, skillsString) => {
    if (!skillsString) return null;

    const skills = skillsString
      .split(',')
      .map(s => s.trim())
      .filter(s => s);

    return (
      <div className='flex flex-wrap gap-2 mt-2'>
        {skills.map((skill, index) => (
          <span
            key={index}
            className='inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full'
          >
            {skill}
            <button
              type='button'
              onClick={() => removeSkill(roleId, skill)}
              className='text-purple-600 hover:text-purple-800'
            >
              <svg
                className='w-3 h-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold text-gray-800'>
          Team Roles Needed <span className='text-red-500'>*</span>
        </h3>
        <button
          type='button'
          onClick={onAddRole}
          className='bg-tag-purple text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors duration-200'
        >
          + Add Role
        </button>
      </div>

      <div className='space-y-4'>
        {roles.map((role, index) => (
          <div
            key={role.id}
            className='bg-gray-50 border border-gray-200 rounded-lg p-4'
          >
            <div className='flex justify-between items-start mb-3'>
              <h4 className='text-sm font-medium text-gray-700'>
                Role #{index + 1}
              </h4>
              {roles.length > 1 && (
                <button
                  type='button'
                  onClick={() => onRemoveRole(role.id)}
                  className='text-red-500 hover:text-red-700'
                >
                  <svg
                    className='w-4 h-4'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                    />
                  </svg>
                </button>
              )}
            </div>

            <div className='space-y-3'>
              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>
                  Role Name
                </label>
                <input
                  type='text'
                  value={role.customRole}
                  onChange={e =>
                    onRoleChange(role.id, 'customRole', e.target.value)
                  }
                  placeholder='e.g., UI/UX Designer, Frontend Developer, Motion Designer'
                  className='w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>
                  Role Description
                </label>
                <textarea
                  value={role.roleDescription}
                  onChange={e =>
                    onRoleChange(role.id, 'roleDescription', e.target.value)
                  }
                  placeholder='Describe responsibilities and expectations for this role...'
                  rows={3}
                  className='w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple text-sm'
                />
              </div>

              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>
                  Required Skills
                </label>
                <input
                  type='text'
                  value={skillInputs[role.id] || ''}
                  onChange={e =>
                    handleSkillInputChange(role.id, e.target.value)
                  }
                  onKeyDown={e => handleSkillInputKeyDown(role.id, e)}
                  placeholder='Type a skill and press Enter to add (e.g., Adobe Creative Suite, React Native)'
                  className='w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple text-sm'
                />
                <div className='text-xs text-gray-500 mt-1'>
                  Press Enter to add each skill.
                </div>
                {renderSkills(role.id, role.requiredSkills)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationRoles;
