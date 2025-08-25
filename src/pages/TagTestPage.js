// tag-test-page v1: 標籤功能測試頁面

import React, { useState } from 'react';

import {
  getTagStats,
  getWorksByTag,
  searchTags,
  getPopularTags,
} from '../services/tagService';
import { extractTags, limitTags } from '../utils/tagParser';
import { renderWithTags, renderTagList } from '../utils/tagRenderer';

const TagTestPage = () => {
  const [inputText, setInputText] = useState(
    'Check out this amazing #design work with #ui and #ux elements!'
  );
  const [extractedTags, setExtractedTags] = useState([]);
  const [tagStats, setTagStats] = useState(null);
  const [worksByTag, setWorksByTag] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [popularTags, setPopularTags] = useState([]);

  // 測試標籤解析
  const testTagExtraction = () => {
    const tags = extractTags(inputText);
    const limitedTags = limitTags(tags, 10);
    setExtractedTags(limitedTags);
    console.log('Extracted tags:', limitedTags);
  };

  // 測試標籤統計
  const testTagStats = async slug => {
    try {
      const stats = await getTagStats(slug);
      setTagStats(stats);
      console.log(`Tag stats for #${slug}:`, stats);
    } catch (error) {
      console.error('Error getting tag stats:', error);
    }
  };

  // 測試根據標籤獲取作品
  const testWorksByTag = async slug => {
    try {
      const result = await getWorksByTag(slug, { limit: 5 });
      setWorksByTag(result.items);
      console.log(`Works tagged with #${slug}:`, result);
    } catch (error) {
      console.error('Error getting works by tag:', error);
    }
  };

  // 測試標籤搜索
  const testTagSearch = async query => {
    try {
      const results = await searchTags(query, 5);
      setSearchResults(results);
      console.log(`Search results for "${query}":`, results);
    } catch (error) {
      console.error('Error searching tags:', error);
    }
  };

  // 測試熱門標籤
  const testPopularTags = async () => {
    try {
      const tags = await getPopularTags(10);
      setPopularTags(tags);
      console.log('Popular tags:', tags);
    } catch (error) {
      console.error('Error getting popular tags:', error);
    }
  };

  // 標籤點擊處理
  const handleTagClick = tag => {
    console.log('Tag clicked:', tag);
    alert(`Clicked on tag: #${tag.name} (${tag.slug})`);
  };

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>
          Tag System Test Page
        </h1>

        {/* Tag Parsing Test */}
        <div className='bg-white rounded-lg shadow p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Tag Parsing Test</h2>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Input text (with #tags):
            </label>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className='w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              placeholder='Enter text with #tags...'
            />
          </div>
          <button
            onClick={testTagExtraction}
            className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'
          >
            Parse Tags
          </button>

          {extractedTags.length > 0 && (
            <div className='mt-4'>
              <h3 className='text-lg font-medium mb-2'>Parsing Results:</h3>
              <div className='flex flex-wrap gap-2'>
                {extractedTags.map((tag, index) => (
                  <span
                    key={index}
                    className='inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800'
                  >
                    #{tag.name} ({tag.slug})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tag Rendering Test */}
        <div className='bg-white rounded-lg shadow p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Tag Rendering Test</h2>
          <div className='mb-4'>
            <h3 className='text-lg font-medium mb-2'>Original Text:</h3>
            <p className='text-gray-700'>{inputText}</p>
          </div>
          <div className='mb-4'>
            <h3 className='text-lg font-medium mb-2'>Rendered Text:</h3>
            <div className='text-gray-700'>
              {renderWithTags(inputText, handleTagClick)}
            </div>
          </div>
          {extractedTags.length > 0 && (
            <div>
              <h3 className='text-lg font-medium mb-2'>Tag List:</h3>
              {renderTagList(extractedTags, handleTagClick)}
            </div>
          )}
        </div>

        {/* Tag Service Test */}
        <div className='bg-white rounded-lg shadow p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Tag Service Test</h2>

          {/* Tag Statistics Test */}
          <div className='mb-6'>
            <h3 className='text-lg font-medium mb-2'>Tag Statistics</h3>
            <div className='flex gap-2 mb-2'>
              {['design', 'illustration', 'photography'].map(slug => (
                <button
                  key={slug}
                  onClick={() => testTagStats(slug)}
                  className='bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700'
                >
                  Test #{slug}
                </button>
              ))}
            </div>
            {tagStats && (
              <div className='text-sm text-gray-600'>
                Works: {tagStats.works}, Users: {tagStats.users}, Projects:{' '}
                {tagStats.projects}
              </div>
            )}
          </div>

          {/* Get Works by Tag Test */}
          <div className='mb-6'>
            <h3 className='text-lg font-medium mb-2'>Get Works by Tag</h3>
            <div className='flex gap-2 mb-2'>
              {['design', 'ui', 'illustration'].map(slug => (
                <button
                  key={slug}
                  onClick={() => testWorksByTag(slug)}
                  className='bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700'
                >
                  Get #{slug} works
                </button>
              ))}
            </div>
            {worksByTag.length > 0 && (
              <div className='text-sm'>
                <div className='font-medium mb-1'>Works List:</div>
                {worksByTag.map(work => (
                  <div key={work.id} className='text-gray-600'>
                    {work.title} - {work.author.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tag Search Test */}
          <div className='mb-6'>
            <h3 className='text-lg font-medium mb-2'>Tag Search</h3>
            <div className='flex gap-2 mb-2'>
              {['des', 'ill', 'pho'].map(query => (
                <button
                  key={query}
                  onClick={() => testTagSearch(query)}
                  className='bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700'
                >
                  Search "{query}"
                </button>
              ))}
            </div>
            {searchResults.length > 0 && (
              <div className='text-sm'>
                <div className='font-medium mb-1'>Search Results:</div>
                {searchResults.map(tag => (
                  <div key={tag.slug} className='text-gray-600'>
                    #{tag.name} ({tag.count} works)
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Popular Tags Test */}
          <div>
            <h3 className='text-lg font-medium mb-2'>Popular Tags</h3>
            <button
              onClick={testPopularTags}
              className='bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700'
            >
              Get Popular Tags
            </button>
            {popularTags.length > 0 && (
              <div className='mt-2 text-sm'>
                <div className='font-medium mb-1'>Popular Tags:</div>
                <div className='flex flex-wrap gap-1'>
                  {popularTags.map(tag => (
                    <span
                      key={tag.slug}
                      className='inline-flex items-center px-2 py-1 rounded text-xs bg-red-100 text-red-800'
                    >
                      #{tag.name} ({tag.count})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagTestPage;
