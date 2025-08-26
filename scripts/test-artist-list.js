// test-artist-list.js - 测试Artist板块数据获取

// 模拟浏览器环境
global.window = {
  localStorage: {
    getItem: key => {
      console.log(`[Test] localStorage.getItem(${key})`);
      return null;
    },
    setItem: (key, value) => {
      console.log(`[Test] localStorage.setItem(${key}, ${value})`);
    },
    removeItem: key => {
      console.log(`[Test] localStorage.removeItem(${key})`);
    },
    key: index => {
      console.log(`[Test] localStorage.key(${index})`);
      return null;
    },
    length: 0,
    clear: () => {
      console.log(`[Test] localStorage.clear()`);
    },
  },
};

global.localStorage = global.window.localStorage;

// 模拟一些测试数据
const testProfiles = {
  'tag.userProfile.alice': JSON.stringify({
    id: 'alice',
    fullName: 'Alice',
    title: 'Photographer',
    majors: ['Photography', 'Fine Art'],
    minors: ['Digital Art'],
    updatedAt: '2024-01-15T10:00:00.000Z',
  }),
  'tag.userProfile.bryan': JSON.stringify({
    id: 'bryan',
    fullName: 'Bryan Rodriguez',
    title: 'Illustrator',
    majors: ['Illustration', 'Digital Art'],
    minors: ['Typography'],
    updatedAt: '2024-01-10T10:00:00.000Z',
  }),
  'tag.userProfile.alex': JSON.stringify({
    id: 'alex',
    fullName: 'Alex Chen',
    title: 'Concept Artist',
    majors: ['Animation', 'Game Design'],
    minors: ['3D Modeling'],
    updatedAt: '2024-01-20T10:00:00.000Z',
  }),
};

// 模拟作品数据
const testPortfolios = {
  portfolio_alice: JSON.stringify([
    { id: 'work1', title: 'Traditional Japanese Temple', isPublic: true },
    { id: 'work2', title: 'Portrait Study', isPublic: true },
  ]),
  portfolio_bryan: JSON.stringify([
    { id: 'work3', title: 'Character Design', isPublic: true },
  ]),
  portfolio_alex: JSON.stringify([
    { id: 'work4', title: 'Mountain Landscape', isPublic: true },
    { id: 'work5', title: 'Character Design', isPublic: true },
    { id: 'work6', title: '3D Environment', isPublic: false }, // 私有作品
  ]),
};

// 更新localStorage模拟
Object.keys(testProfiles).forEach(key => {
  global.window.localStorage.setItem(key, testProfiles[key]);
});

Object.keys(testPortfolios).forEach(key => {
  global.window.localStorage.setItem(key, testPortfolios[key]);
});

// 更新keys方法
global.window.localStorage.keys = () => {
  return Object.keys(testProfiles).concat(Object.keys(testPortfolios));
};

global.window.localStorage.length =
  Object.keys(testProfiles).length + Object.keys(testPortfolios).length;

// 更新getItem方法
const originalGetItem = global.window.localStorage.getItem;
global.window.localStorage.getItem = key => {
  const result = testProfiles[key] || testPortfolios[key] || null;
  console.log(
    `[Test] localStorage.getItem(${key}) = ${result ? 'found' : 'null'}`
  );
  return result;
};

console.log('[Test] Starting Artist List test...');

// 测试artistService
async function testArtistService() {
  try {
    const { artistService } = await import(
      '../src/services/artistService/index.js'
    );

    console.log('[Test] Testing getPublicArtists...');
    const result = await artistService.getPublicArtists();

    console.log('[Test] Result:', JSON.stringify(result, null, 2));

    if (result.success) {
      console.log(`[Test] ✅ Success! Found ${result.data.length} artists`);
      result.data.forEach((artist, index) => {
        console.log(`[Test] Artist ${index + 1}:`, {
          name: artist.name,
          title: artist.title,
          major: artist.major,
          minor: artist.minor,
          worksCount: artist.worksCount,
          createdAt: artist.createdAt,
        });
      });
    } else {
      console.log('[Test] ❌ Failed:', result.error);
    }
  } catch (error) {
    console.error('[Test] ❌ Error testing artistService:', error);
  }
}

// 运行测试
testArtistService();
