
import { filterOptions } from '../data/mockData';

const TAGMeFilters = ({
  selectedCategories,
  selectedMajors,
  selectedTags,
  onCategoryToggle,
  onMajorToggle,
  onTagToggle,
}) => {
  return (
    <div className='lg:w-64 flex-shrink-0'>
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <h3 className='text-lg font-bold text-gray-900 mb-6'>Filters</h3>

        {/* Category Filter */}
        <div className='mb-8'>
          <h4 className='font-bold text-gray-900 mb-3'>Category</h4>
          <div className='space-y-2'>
            {filterOptions.categories.map(category => (
              <label
                key={category.id}
                className='flex items-center cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => onCategoryToggle(category.id)}
                  className='rounded border-gray-300 text-purple-600 focus:ring-purple-500'
                />
                <span className='ml-2 text-sm text-gray-700'>
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Major Filter */}
        <div className='mb-8'>
          <h4 className='font-bold text-gray-900 mb-3'>Major</h4>
          <div className='space-y-2'>
            {filterOptions.majors.map(major => (
              <label
                key={major.id}
                className='flex items-center cursor-pointer'
              >
                <input
                  type='checkbox'
                  checked={selectedMajors.includes(major.id)}
                  onChange={() => onMajorToggle(major.id)}
                  className='rounded border-gray-300 text-purple-600 focus:ring-purple-500'
                />
                <span className='ml-2 text-sm text-gray-700'>{major.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <h4 className='font-bold text-gray-900 mb-3'>Tags</h4>
          <div className='flex flex-wrap gap-2'>
            {filterOptions.tags.map(tag => (
              <button
                key={tag.id}
                onClick={() => onTagToggle(tag.id)}
                className={`px-3 py-1 text-xs rounded-full transition-colors duration-200 ${
                  selectedTags.includes(tag.id)
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TAGMeFilters;
