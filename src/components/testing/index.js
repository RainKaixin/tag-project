/**
 * 测试组件索引文件
 * 统一导出所有测试相关的组件
 */

// 通知测试组件
import NotificationTest from './NotificationTest.js';
// Mock API测试组件
import TestMockAPI from './TestMockAPI.js';

// 导出组件
export { NotificationTest, TestMockAPI };

// 默认导出
export default {
  NotificationTest,
  TestMockAPI,
};
