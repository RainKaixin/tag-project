# TAG 项目调试脚本

本目录包含 TAG 项目的各种调试和测试工具。

## 📁 目录结构

### `/debug/` - 调试脚本

用于调试特定功能或数据问题的脚本文件。

**包含文件：**

- `debug-*.js` - 各种功能的调试脚本
- `fix-*.js` - 数据修复脚本
- `test-*.js` - 功能测试脚本

**使用方法：**

```bash
# 在浏览器控制台中运行
node scripts/debug/debug-works-count.js
```

### `/clear/` - 数据清理脚本

用于清理各种缓存和测试数据的脚本。

**包含文件：**

- `clear-*.js` - 各种数据清理脚本

**使用方法：**

```bash
# 清理所有TAG数据
node scripts/clear/clear-all-data.js

# 清理特定类型的数据
node scripts/clear/clear-favorites-cache.js
```

### `/test/` - 测试页面

用于功能测试的 HTML 页面。

**包含文件：**

- `test-*.html` - 各种功能的测试页面

**使用方法：**
直接在浏览器中打开 HTML 文件进行测试。

## 🚀 常用调试命令

### 数据调试

```bash
# 调试作品数量问题
node scripts/debug/debug-works-count.js

# 调试关注同步问题
node scripts/debug/debug-follow-sync.js

# 调试浏览量问题
node scripts/debug/debug-view-count.js
```

### 数据清理

```bash
# 清理所有数据
node scripts/clear/clear-all-data.js

# 清理收藏缓存
node scripts/clear/clear-favorites-cache.js

# 清理Firefox数据
node scripts/clear/clear-firefox-data.js
```

### 功能测试

```bash
# 打开关注功能测试页面
open scripts/test/test-follow-functionality.html

# 打开点赞功能测试页面
open scripts/test/test-like-functionality.html
```

## 📝 注意事项

1. **备份数据**：运行清理脚本前请确保重要数据已备份
2. **开发环境**：这些脚本主要用于开发环境调试
3. **浏览器控制台**：部分脚本需要在浏览器控制台中运行
4. **权限检查**：确保有足够的文件系统权限

## 🔧 添加新脚本

添加新的调试脚本时，请遵循以下规范：

1. **命名规范**：使用 `debug-功能名.js` 格式
2. **文档注释**：在脚本开头添加详细的使用说明
3. **错误处理**：包含适当的错误处理机制
4. **测试验证**：确保脚本在多种环境下都能正常工作
