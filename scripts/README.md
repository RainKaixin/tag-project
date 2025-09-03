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

# 表单数据清理工具

## 问题描述

如果您在登录或注册页面看到：

- 输入框中显示默认的测试数据（如 `test@example.com`）
- 输入框显示黄色高亮背景
- 表单自动填充了不需要的数据

## 解决方案

### 方法 1：使用 HTML 清理工具（推荐）

1. 在浏览器中打开 `scripts/clear-form-data.html`
2. 点击 "清理所有数据" 按钮
3. 等待清理完成
4. 刷新您的 TAG 网站页面

### 方法 2：使用 JavaScript 脚本

1. 在 TAG 网站的浏览器控制台中运行 `scripts/clear-test-form-data.js`
2. 刷新页面

### 方法 3：手动清理

1. 打开浏览器开发者工具（F12）
2. 进入 Application/Storage 标签
3. 清理以下存储：
   - Local Storage
   - Session Storage
   - Cookies
4. 刷新页面

## 预防措施

为了避免将来再次出现这个问题：

1. **不要保存测试数据**：在开发过程中，避免将测试邮箱和密码保存到浏览器
2. **使用隐私模式**：在测试时使用浏览器的隐私/无痕模式
3. **定期清理**：定期使用清理工具清理浏览器数据

## 技术说明

### 已修复的问题

- ✅ 为所有表单输入框添加了 `autocomplete="off"` 属性
- ✅ 确保表单初始值为空字符串
- ✅ 创建了数据清理工具

### 可能的原因

1. **浏览器自动填充**：浏览器记住了之前输入的测试数据
2. **localStorage 缓存**：存储了之前的表单数据
3. **测试组件影响**：某些测试组件可能设置了默认值
4. **CSS 样式问题**：某些样式类可能导致黄色高亮

### 文件修改记录

- `src/components/LoginPage.js` - 添加 autocomplete="off"
- `src/components/register-page/components/RegisterForm.js` - 添加 autocomplete="off"
- `scripts/clear-form-data.html` - 创建 HTML 清理工具
- `scripts/clear-test-form-data.js` - 创建 JavaScript 清理脚本

## 如果问题仍然存在

如果清理后问题仍然存在，请：

1. 检查是否有其他浏览器扩展影响了表单
2. 尝试使用不同的浏览器
3. 检查是否有其他组件设置了默认值
4. 联系开发团队进一步排查

## 注意事项

⚠️ **重要提醒**：

- 清理工具会删除所有相关的测试数据
- 不会影响您的实际账户信息
- 建议在清理前备份重要的本地数据
