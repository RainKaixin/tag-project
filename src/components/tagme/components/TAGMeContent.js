import SearchBar from '../../navbar/components/SearchBar';

const TAGMeContent = ({
  children,
  activeTab,
  onTabChange,
  onCollaborationClick,
  onMilestoneClick,
}) => {
  const tabs = ['Collaborations', 'Milestones', 'Jobs'];

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
      {/* Section Header */}
      <div className='flex flex-col mb-8' data-tagme-section>
        <h2 className='text-3xl font-bold text-gray-400 mb-6'>TAG Me</h2>

        {/* Search Bar and Tab Button Group - Left Aligned */}
        <div className='flex items-center space-x-6'>
          {/* Search Bar - 70% width */}
          <div className='w-7/12'>
            <SearchBar
              onInputChange={e => console.log('Search:', e.target.value)}
              placeholder='Search for Collaborations or Artists'
              className='w-full'
            />
          </div>

          {/* Segmented Tab Button Group - 30% width */}
          <div className='inline-flex rounded-full border border-gray-300 bg-white p-1'>
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`relative px-12 py-3 text-base font-semibold tracking-wide transition-all duration-300 ease-in-out ${
                  activeTab === tab
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {/* Active Background */}
                {activeTab === tab && (
                  <div className='absolute inset-0 bg-purple-500 rounded-full transition-all duration-300 ease-in-out' />
                )}

                {/* Text Content */}
                <span className='relative z-10'>{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className='flex flex-col lg:flex-row gap-8'>{children}</div>
    </div>
  );
};

export default TAGMeContent;
