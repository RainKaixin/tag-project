# Portfolio Mock API 更新说明

## 🎯 更新目标

实现 Portfolio 上传与本地持久化的 Mock API，确保：

- 刷新或切页后作品仍可见
- Edit Profile 与 Public Page 两端同步展示
- 为后续迁移到 Supabase 做好准备

## 🔧 修改内容

### 1. 新增函数

#### `getPortfolioImageUrl(filePath)`

- **功能**：从 localStorage 读取单个图片的 base64 数据
- **参数**：`filePath` - 图片文件路径
- **返回**：`{ success: boolean, data: { url: string, path: string } }`

#### `getPortfolioImageUrls(imagePaths)`

- **功能**：批量从 localStorage 读取多个图片的 base64 数据
- **参数**：`imagePaths` - 图片文件路径数组
- **返回**：`{ success: boolean, data: string[] }`

### 2. 增强现有函数

#### `getMyPortfolio()`

- 现在会自动为每个作品获取正确的图片 URL
- 返回的作品数据包含 `thumbnailPath` 字段，值为 base64 图片数据

#### `getPublicPortfolio(userId)`

- 同样自动获取图片 URL
- 确保公开页面能正确显示图片

#### `getAllPublicPortfolios()`

- 为所有公开作品获取图片 URL
- 用于公共画廊展示

#### `deletePortfolioItem(itemId)`

- 删除作品时自动删除相关的图片文件
- 避免 localStorage 中残留无用数据

### 3. 图片持久化机制

#### 存储方式

- 图片转换为 base64 格式存储到 localStorage
- 存储键格式：`portfolio_image_${filePath}`
- 文件路径格式：`portfolio/${userId}/${timestamp}-${random}.${ext}`

#### 读取方式

- 通过 `getPortfolioImageUrl()` 函数读取
- 直接返回 base64 数据作为图片 URL
- 支持在 `<img>` 标签中直接使用

## 🚀 使用方法

### 1. 上传作品

```javascript
// 在 UploadPortfolio.js 中已经实现
const result = await uploadPortfolioImage(file, userId);
if (result.success) {
  // result.data.url 包含 base64 图片数据
  // result.data.path 包含文件路径
}
```

### 2. 获取作品列表

```javascript
// 获取当前用户的所有作品
const result = await getMyPortfolio();
if (result.success) {
  result.data.forEach(item => {
    // item.thumbnailPath 包含 base64 图片数据
    console.log(item.thumbnailPath);
  });
}
```

### 3. 获取公开作品

```javascript
// 获取指定用户的公开作品
const result = await getPublicPortfolio(userId);
if (result.success) {
  result.data.forEach(item => {
    // item.thumbnailPath 包含 base64 图片数据
    console.log(item.thumbnailPath);
  });
}
```

### 4. 在组件中显示图片

```javascript
// 直接使用 base64 数据
<img src={item.thumbnailPath} alt={item.title} />
```

## 🔄 数据流程

1. **上传阶段**：

   - 用户选择文件 → `handleFileUpload()`
   - 文件转换为 base64 → `uploadPortfolioImage()`
   - 保存到 localStorage → `portfolio_image_${filePath}`

2. **保存阶段**：

   - 创建作品记录 → `createPortfolioItem()`
   - 保存到 localStorage → `portfolio_${userId}`

3. **显示阶段**：
   - 读取作品列表 → `getMyPortfolio()` / `getPublicPortfolio()`
   - 自动获取图片 URL → `getPortfolioImageUrl()`
   - 在组件中显示 → `<img src={thumbnailPath} />`

## 🧪 测试方法

### 1. 浏览器控制台测试

```javascript
// 加载测试脚本
// 在浏览器控制台运行
testPortfolioMockAPI();
```

### 2. 功能测试步骤

1. 访问 Upload Portfolio 页面
2. 上传图片文件
3. 填写作品信息并提交
4. 刷新页面，确认作品仍在
5. 访问 Edit Profile 页面，确认作品可见
6. 访问 Artist Profile 页面，确认作品可见

## 📋 兼容性说明

### 现有代码兼容性

- ✅ Edit Profile 页面无需修改
- ✅ Artist Profile 页面无需修改
- ✅ Upload Portfolio 页面无需修改
- ✅ 所有现有功能保持不变

### 未来迁移准备

- ✅ 接口设计与 Supabase 保持一致
- ✅ 数据格式标准化
- ✅ 错误处理机制完善
- ✅ 日志记录完整

## 🐛 故障排除

### 常见问题

1. **图片不显示**

   - 检查 localStorage 中是否有对应的图片数据
   - 确认 `getPortfolioImageUrl()` 返回成功

2. **作品列表为空**

   - 检查 localStorage 中是否有 `portfolio_${userId}` 数据
   - 确认用户 ID 正确

3. **上传失败**
   - 检查文件大小是否超过限制
   - 确认文件类型是否支持

### 调试方法

```javascript
// 检查 localStorage 中的作品数据
console.log(localStorage.getItem('portfolio_alice'));

// 检查 localStorage 中的图片数据
console.log(localStorage.getItem('portfolio_image_portfolio/alice/123456.jpg'));
```

## 📝 更新日志

- **2024-01-XX**：完成 Portfolio Mock API 图片持久化功能
- 新增图片 URL 获取函数
- 增强现有函数的图片处理能力
- 完善删除功能，自动清理图片文件
- 添加测试脚本和文档
