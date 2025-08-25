
import { roleTypeOptions } from '../data/formOptions';

const CollaborationRoles = ({
  roles,
  onAddRole,
  onRemoveRole,
  onRoleChange,
}) => {
  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold text-gray-800'>
          Team Roles Needed
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
                  Select Role
                </label>
                <div className='relative'>
                  <select
                    value={role.roleType}
                    onChange={e =>
                      onRoleChange(role.id, 'roleType', e.target.value)
                    }
                    className='w-full bg-white border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple appearance-none text-sm'
                  >
                    <option value=''>Choose a creative role</option>
                    {roleTypeOptions.map((option, idx) => (
                      <option key={idx} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                    <svg
                      className='w-4 h-4 text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className='block text-xs font-medium text-gray-600 mb-1'>
                  Add custom role...
                </label>
                <input
                  type='text'
                  value={role.customRole}
                  onChange={e =>
                    onRoleChange(role.id, 'customRole', e.target.value)
                  }
                  placeholder='Or specify custom role'
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
                  value={role.requiredSkills}
                  onChange={e =>
                    onRoleChange(role.id, 'requiredSkills', e.target.value)
                  }
                  placeholder='e.g., Figma, Adobe Creative Suite, Sketch, Cinema 4D'
                  className='w-full bg-white border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-tag-purple focus:border-tag-purple text-sm'
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborationRoles;






















