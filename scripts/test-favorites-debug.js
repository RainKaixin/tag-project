// 测试收藏功能调试脚本
// 在浏览器控制台中运行此脚本来调试收藏功能

console.log('=== 收藏功能调试脚本 ===');

// 导入必要的服务
import { favoritesService } from '../src/services/favoritesService/index.js';
import { getCurrentUser } from '../src/utils/currentUser.js';

async function testFavoritesFunctionality() {
  try {
    console.log('1. 检查当前用户...');
    const currentUser = getCurrentUser();
    console.log('当前用户:', currentUser);

    if (!currentUser?.id) {
      console.error('❌ 当前用户ID不存在');
      return;
    }

    console.log('2. 测试添加收藏...');
    const addResult = await favoritesService.addFavorite('collaboration', '1');
    console.log('添加收藏结果:', addResult);

    console.log('3. 测试检查收藏状态...');
    const statusResult = await favoritesService.checkFavoriteStatus(
      'collaboration',
      '1'
    );
    console.log('收藏状态检查结果:', statusResult);

    console.log('4. 测试获取收藏列表...');
    const favoritesResult = await favoritesService.getFavorites();
    console.log('收藏列表结果:', favoritesResult);

    console.log('5. 测试切换收藏状态...');
    const toggleResult = await favoritesService.toggleFavorite(
      'collaboration',
      '1',
      false
    );
    console.log('切换收藏结果:', toggleResult);

    console.log('6. 再次检查收藏状态...');
    const finalStatusResult = await favoritesService.checkFavoriteStatus(
      'collaboration',
      '1'
    );
    console.log('最终收藏状态:', finalStatusResult);

    console.log('7. 检查localStorage...');
    const storageKeys = Object.keys(localStorage).filter(key =>
      key.includes('favorite')
    );
    console.log('收藏相关的localStorage键:', storageKeys);

    for (const key of storageKeys) {
      const value = localStorage.getItem(key);
      console.log(`${key}:`, value);
    }
  } catch (error) {
    console.error('测试过程中出现错误:', error);
  }
}

// 执行测试
testFavoritesFunctionality();

// 导出函数供手动调用
window.testFavorites = testFavoritesFunctionality;
