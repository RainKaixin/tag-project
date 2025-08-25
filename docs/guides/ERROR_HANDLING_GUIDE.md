# 错误处理统一指南

本文档介绍 TAG 项目中统一的错误处理机制和使用方法。

## 📋 概述

TAG 项目采用统一的错误处理系统，包括：

- **错误分类**: 自动识别和分类不同类型的错误
- **错误日志**: 统一的错误记录和日志管理
- **用户提示**: 友好的错误信息展示
- **错误边界**: React 组件错误捕获和处理
- **错误通知**: 实时错误提示系统

## 🏗️ 架构组件

### 1. 错误处理器 (`src/utils/errorHandler.js`)

核心错误处理工具，提供：

- 错误类型分析
- 错误严重程度评估
- 统一错误日志记录
- 用户友好消息生成

### 2. 错误边界组件 (`src/components/ui/ErrorBoundary.jsx`)

React 错误边界，用于：

- 捕获组件渲染错误
- 显示降级 UI
- 错误恢复机制

### 3. 错误通知组件 (`src/components/ui/ErrorNotification.jsx`)

用户界面错误提示，提供：

- 实时错误通知
- 自动消失功能
- 重试操作支持

## 🚀 使用方法

### 基本错误处理

```javascript
import { errorHandler } from '../utils/errorHandler';

// 处理异步操作错误
const handleAsyncOperation = async () => {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    return errorHandler.handleError(error, 'Async Operation', {
      customMessage: 'Failed to perform operation',
      log: true,
    });
  }
};
```

### 使用错误包装器

```javascript
import { withErrorHandling } from '../utils/errorHandler';

// 包装异步函数
const safeAsyncFunction = withErrorHandling(
  async data => {
    // 你的异步逻辑
    return await apiCall(data);
  },
  'API Call',
  { customMessage: 'API call failed' }
);

// 使用包装后的函数
const result = await safeAsyncFunction(data);
if (!result.success) {
  // 处理错误
  console.log(result.error);
}
```

### React 组件错误边界

```javascript
import { ErrorBoundary, withErrorBoundary } from '../components/ui';

// 方法1: 直接使用ErrorBoundary组件
function MyComponent() {
  return (
    <ErrorBoundary fallbackMessage='Component failed to load'>
      <SomeComponent />
    </ErrorBoundary>
  );
}

// 方法2: 使用高阶组件
const SafeComponent = withErrorBoundary(SomeComponent, {
  fallbackMessage: 'Component failed to load',
  showRetry: true,
});
```

### 错误通知

```javascript
import { ErrorNotification } from '../components/ui';

function MyComponent() {
  const [error, setError] = useState(null);

  const handleError = error => {
    setError(error);
  };

  return (
    <div>
      {/* 你的组件内容 */}

      {/* 错误通知 */}
      {error && (
        <ErrorNotification
          error={error}
          title='Operation Failed'
          message='Please try again'
          type='error'
          duration={5000}
          onClose={() => setError(null)}
          onRetry={() => handleRetry()}
          showRetry={true}
        />
      )}
    </div>
  );
}
```

## 📊 错误类型

### 预定义错误类型

| 类型             | 描述         | 示例                 |
| ---------------- | ------------ | -------------------- |
| `NETWORK`        | 网络连接错误 | 网络超时、连接失败   |
| `VALIDATION`     | 数据验证错误 | 表单验证失败         |
| `AUTHENTICATION` | 认证错误     | 登录失败、token 过期 |
| `AUTHORIZATION`  | 授权错误     | 权限不足             |
| `NOT_FOUND`      | 资源未找到   | 404 错误             |
| `SERVER`         | 服务器错误   | 500 错误             |
| `CLIENT`         | 客户端错误   | 400 错误             |
| `UNKNOWN`        | 未知错误     | 未分类的错误         |

### 错误严重程度

| 级别       | 描述       | 处理方式                                 |
| ---------- | ---------- | ---------------------------------------- |
| `LOW`      | 低严重性   | 记录日志，用户提示                       |
| `MEDIUM`   | 中等严重性 | 记录日志，用户提示，可能需要重试         |
| `HIGH`     | 高严重性   | 记录日志，用户提示，可能需要重新认证     |
| `CRITICAL` | 严重错误   | 记录完整堆栈，用户提示，可能需要刷新页面 |

## 🔧 配置选项

### 错误处理器配置

```javascript
// 处理错误时的选项
const options = {
  log: true, // 是否记录日志
  customMessage: '自定义消息', // 自定义错误消息
  additionalData: {}, // 额外数据
  rethrow: false, // 是否重新抛出错误
};

const result = errorHandler.handleError(error, 'Context', options);
```

### 错误边界配置

```javascript
<ErrorBoundary
  fallbackMessage='组件加载失败'
  showRetry={true}
  showReport={false}
  fallback={CustomFallbackComponent}
>
  <YourComponent />
</ErrorBoundary>
```

### 错误通知配置

```javascript
<ErrorNotification
  error={error}
  title='错误标题'
  message='错误消息'
  type='error' // 'error', 'warning', 'info'
  duration={5000} // 自动消失时间（毫秒）
  onClose={handleClose}
  onRetry={handleRetry}
  showRetry={true}
/>
```

## 📝 最佳实践

### 1. 错误处理原则

- **及时处理**: 在错误发生的地方立即处理
- **用户友好**: 提供清晰的错误信息
- **可恢复**: 提供重试或恢复机制
- **日志记录**: 记录足够的错误信息用于调试

### 2. 错误消息规范

- 使用简洁明了的语言
- 避免技术术语
- 提供具体的解决建议
- 保持一致的错误消息格式

### 3. 错误边界使用

- 在关键组件周围使用错误边界
- 为不同的错误类型提供不同的降级 UI
- 避免在错误边界中放置太多逻辑

### 4. 性能考虑

- 避免在错误处理中执行昂贵的操作
- 合理设置错误日志大小限制
- 使用异步错误处理避免阻塞 UI

## 🐛 调试和监控

### 错误日志查看

```javascript
// 获取错误日志
const errorLog = errorHandler.getErrorLog();
console.log('Error log:', errorLog);

// 清除错误日志
errorHandler.clearErrorLog();
```

### 开发环境调试

在开发环境中，错误边界会显示详细的错误信息：

- 错误消息
- 错误堆栈
- 组件堆栈信息

### 生产环境监控

在生产环境中，建议：

- 集成错误监控服务（如 Sentry）
- 设置错误报警机制
- 定期分析错误日志

## 🔄 迁移指南

### 从旧错误处理迁移

1. **替换 console.error**

```javascript
// 旧方式
console.error('Error:', error);

// 新方式
errorHandler.logError(error, 'Context');
```

2. **替换 try-catch**

```javascript
// 旧方式
try {
  await someOperation();
} catch (error) {
  console.error('Operation failed:', error);
  setError('Operation failed');
}

// 新方式
const result = await withErrorHandling(someOperation, 'Operation')();
if (!result.success) {
  setError(result.error);
}
```

3. **替换错误 UI**

```javascript
// 旧方式
{
  error && <div className='error'>{error}</div>;
}

// 新方式
{
  error && <ErrorNotification error={error} onClose={() => setError(null)} />;
}
```

## 📚 相关文档

- [错误处理工具 API](./errorHandler-api.md)
- [错误边界组件 API](./errorBoundary-api.md)
- [错误通知组件 API](./errorNotification-api.md)
- [调试工具指南](./debugging-guide.md)

---

**最后更新**: 2024 年 1 月  
**维护者**: AI Assistant + Rain Wang
