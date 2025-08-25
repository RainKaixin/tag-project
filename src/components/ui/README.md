# TAG UI 组件库使用文档

## 📋 概述

TAG UI 组件库是 TAG 项目的统一基础组件库，提供了一致的用户界面组件，确保整个应用的 UI 风格统一和代码复用。

## 🚀 快速开始

### 导入组件

```javascript
// 导入单个组件
import { PrimaryButton } from '../ui';

// 导入多个组件
import { PrimaryButton, SecondaryButton, InfoCard } from '../ui';
```

## 📦 组件列表

### Button 组件

#### PrimaryButton

主要操作按钮，用于重要的用户操作。

```javascript
import { PrimaryButton } from '../ui';

<PrimaryButton
  onClick={handleClick}
  disabled={false}
  size='md'
  fullWidth={false}
  className='custom-class'
>
  点击我
</PrimaryButton>;
```

**Props:**

- `onClick` (Function): 点击事件处理函数
- `disabled` (Boolean): 是否禁用，默认 false
- `size` (String): 按钮尺寸，可选 'sm' | 'md' | 'lg'，默认 'md'
- `fullWidth` (Boolean): 是否占满容器宽度，默认 false
- `className` (String): 额外的 CSS 类名

#### SecondaryButton

次要操作按钮，用于辅助操作。

```javascript
import { SecondaryButton } from '../ui';

<SecondaryButton
  onClick={handleClick}
  disabled={false}
  size='md'
  fullWidth={false}
  className='custom-class'
>
  取消
</SecondaryButton>;
```

**Props:** 与 PrimaryButton 相同

### Card 组件

#### InfoCard

信息展示卡片，用于展示重要信息。

```javascript
import { InfoCard } from '../ui';

<InfoCard
  title='项目信息'
  subtitle='项目描述'
  icon={<IconComponent />}
  className='custom-class'
>
  卡片内容
</InfoCard>;
```

**Props:**

- `title` (String): 卡片标题
- `subtitle` (String): 卡片副标题
- `icon` (ReactNode): 卡片图标
- `className` (String): 额外的 CSS 类名
- `children` (ReactNode): 卡片内容

#### MetricCard

指标展示卡片，用于展示数据指标。

```javascript
import { MetricCard } from '../ui';

<MetricCard
  value='1,234'
  label='总作品数'
  trend='+12%'
  trendDirection='up'
  className='custom-class'
/>;
```

**Props:**

- `value` (String|Number): 指标值
- `label` (String): 指标标签
- `trend` (String): 趋势值
- `trendDirection` (String): 趋势方向，'up' | 'down' | 'neutral'
- `className` (String): 额外的 CSS 类名

### Modal 组件

#### BaseModal

基础模态框组件，提供模态框的基本功能。

```javascript
import { BaseModal } from '../ui';

<BaseModal
  isOpen={isModalOpen}
  onClose={handleClose}
  title='模态框标题'
  maxWidth='max-w-md'
>
  模态框内容
</BaseModal>;
```

**Props:**

- `isOpen` (Boolean): 是否显示模态框
- `onClose` (Function): 关闭模态框的处理函数
- `title` (String): 模态框标题
- `maxWidth` (String): 最大宽度类名
- `children` (ReactNode): 模态框内容

### Avatar 组件

#### Avatar

用户头像组件，支持不同尺寸和懒加载。

```javascript
import { Avatar } from '../ui';

<Avatar
  src='avatar.jpg'
  alt='用户头像'
  size={32}
  lazy={true}
  className='custom-class'
/>;
```

**Props:**

- `src` (String): 头像图片 URL
- `alt` (String): 图片替代文本
- `size` (Number): 头像尺寸，默认 32
- `lazy` (Boolean): 是否启用懒加载，默认 false
- `className` (String): 额外的 CSS 类名

### SaveButton 组件

#### SaveButton

保存按钮组件，支持保存状态显示。

```javascript
import { SaveButton } from '../ui';

<SaveButton
  isSaved={false}
  onSave={handleSave}
  disabled={false}
  className='custom-class'
/>;
```

**Props:**

- `isSaved` (Boolean): 是否已保存
- `onSave` (Function): 保存操作处理函数
- `disabled` (Boolean): 是否禁用
- `className` (String): 额外的 CSS 类名

### BackButton 组件

#### BackButton

返回按钮组件，用于页面导航。

```javascript
import { BackButton } from '../ui';

<BackButton onClick={handleBack} text='返回' className='custom-class' />;
```

**Props:**

- `onClick` (Function): 点击事件处理函数
- `text` (String): 按钮文本，默认"← Back"
- `className` (String): 额外的 CSS 类名

### Modal 组件

#### ErrorModal

错误提示模态框。

```javascript
import { ErrorModal } from '../ui';

<ErrorModal
  isOpen={isErrorOpen}
  onClose={handleClose}
  title='错误'
  message='发生了一个错误'
/>;
```

**Props:**

- `isOpen` (Boolean): 是否显示
- `onClose` (Function): 关闭处理函数
- `title` (String): 错误标题
- `message` (String): 错误信息

#### SuccessModal

成功提示模态框。

```javascript
import { SuccessModal } from '../ui';

<SuccessModal
  isOpen={isSuccessOpen}
  onClose={handleClose}
  title='成功'
  message='操作成功完成'
/>;
```

**Props:** 与 ErrorModal 相同

### Loading 组件

#### LoadingSpinner

加载动画组件。

```javascript
import { LoadingSpinner } from '../ui';

<LoadingSpinner
  message='加载中...'
  className='custom-class'
  size='md'
  color='blue'
  fullScreen={false}
  variant='default'
/>;
```

**Props:**

- `message` (String): 加载提示信息
- `className` (String): 额外的 CSS 类名
- `size` (String): 尺寸，'sm' | 'md' | 'lg'
- `color` (String): 颜色主题
- `fullScreen` (Boolean): 是否全屏显示
- `variant` (String): 样式变体

### ErrorDisplay 组件

#### ErrorDisplay

错误信息显示组件。

```javascript
import { ErrorDisplay } from '../ui';

<ErrorDisplay error='错误信息' className='custom-class' variant='default' />;
```

**Props:**

- `error` (String): 错误信息
- `className` (String): 额外的 CSS 类名
- `variant` (String): 样式变体，'default' | 'compact' | 'full'

### ActionButton 组件

#### ActionButton

操作按钮组件，支持多种样式变体。

```javascript
import { ActionButton } from '../ui';

<ActionButton
  variant='primary'
  size='md'
  disabled={false}
  onClick={handleClick}
  className='custom-class'
>
  操作
</ActionButton>;
```

**Props:**

- `variant` (String): 按钮变体，'primary' | 'success' | 'danger' | 'secondary'
- `size` (String): 按钮尺寸，'sm' | 'md' | 'lg'
- `disabled` (Boolean): 是否禁用
- `onClick` (Function): 点击事件处理函数
- `className` (String): 额外的 CSS 类名

### Badge 组件

#### Badge

徽章组件，用于显示数量或状态。

```javascript
import { Badge } from '../ui';

<Badge
  count={5}
  color='red'
  size='md'
  variant='default'
  className='custom-class'
/>;
```

**Props:**

- `count` (String|Number): 徽章数值
- `color` (String): 颜色，'gray' | 'blue' | 'green' | 'red' | 'yellow' | 'purple'
- `size` (String): 尺寸，'sm' | 'md' | 'lg'
- `variant` (String): 变体，'default' | 'outline' | 'dot'
- `className` (String): 额外的 CSS 类名

### NotificationBadge 组件

#### NotificationBadge

通知徽章组件，用于显示未读通知数量。

```javascript
import { NotificationBadge } from '../ui';

<NotificationBadge
  unreadCount={3}
  className='custom-class'
  size='md'
  color='red'
/>;
```

**Props:**

- `unreadCount` (Number): 未读通知数量
- `className` (String): 额外的 CSS 类名
- `size` (String): 尺寸，'sm' | 'md' | 'lg'
- `color` (String): 颜色，'red' | 'blue' | 'green' | 'orange'

### ProgressBar 组件

#### ProgressBar

进度条组件。

```javascript
import { ProgressBar } from '../ui';

<ProgressBar
  progress={75}
  color='blue'
  size='md'
  showLabel={true}
  label='上传进度'
  className='custom-class'
/>;
```

**Props:**

- `progress` (Number): 进度百分比 (0-100)
- `color` (String): 进度条颜色
- `size` (String): 进度条高度，'sm' | 'md' | 'lg'
- `showLabel` (Boolean): 是否显示标签
- `label` (String): 自定义标签文本
- `className` (String): 额外的 CSS 类名

### FileUploadArea 组件

#### FileUploadArea

文件上传区域组件。

```javascript
import { FileUploadArea } from '../ui';

<FileUploadArea
  onFileUpload={handleFileUpload}
  id='file-upload'
  variant='default'
  accept='.jpg,.png'
  multiple={true}
  buttonText='选择文件'
  placeholder='拖拽文件到此处'
  className='custom-class'
>
  自定义内容
</FileUploadArea>;
```

**Props:**

- `onFileUpload` (Function): 文件上传处理函数
- `id` (String): 文件输入框 ID
- `variant` (String): 上传区域变体，'default' | 'compact' | 'large'
- `accept` (String): 接受的文件类型
- `multiple` (Boolean): 是否允许多文件选择
- `buttonText` (String): 按钮文本
- `placeholder` (String): 占位符文本
- `className` (String): 额外的 CSS 类名

### LoadingOverlay 组件

#### LoadingOverlay

全局加载遮罩组件。

```javascript
import { LoadingOverlay } from '../ui';

<LoadingOverlay />;
```

**说明:** 此组件会自动从 AppContext 获取 loading 状态并显示全屏加载动画。

### ScrollToTop 组件

#### ScrollToTop

页面滚动到顶部组件。

```javascript
import { ScrollToTop } from '../ui';

<ScrollToTop />;
```

**说明:** 此组件会监听路由变化，自动滚动到页面顶部（主页除外）。

### FilterPanel 组件

#### FilterPanel

筛选面板组件。

```javascript
import { FilterPanel } from '../ui';

<FilterPanel />;
```

**说明:** 此组件提供作品筛选功能，包括排序、分类和软件筛选。

### SelectField 组件

#### SelectField

选择字段组件。

```javascript
import { SelectField } from '../ui';

<SelectField
  label='选择选项'
  value={selectedValue}
  onChange={handleChange}
  options={[
    { value: 'option1', label: '选项1' },
    { value: 'option2', label: '选项2' },
  ]}
  className='custom-class'
/>;
```

**Props:**

- `label` (String): 字段标签
- `value` (String): 当前值
- `onChange` (Function): 值变化处理函数
- `options` (Array): 选项数组
- `className` (String): 额外的 CSS 类名

### StatusBadge 组件

#### StatusBadge

状态徽章组件。

```javascript
import { StatusBadge } from '../ui';

<StatusBadge className='bg-green-100 text-green-800'>已完成</StatusBadge>;
```

**Props:**

- `className` (String): 额外的 CSS 类名
- `children` (ReactNode): 显示内容

## 🎨 样式指南

### 颜色主题

TAG 项目使用以下颜色主题：

- **Primary Blue:** `#3B82F6` (tag-blue)
- **Dark Blue:** `#1E40AF` (tag-dark-blue)
- **Purple:** `#8B5CF6` (用于协作相关)
- **Gray:** `#6B7280` (用于次要信息)

### 尺寸规范

- **Small (sm):** 适用于紧凑布局
- **Medium (md):** 默认尺寸
- **Large (lg):** 适用于重要操作

### 响应式设计

所有组件都支持响应式设计，使用 Tailwind CSS 的断点系统：

- `sm:` 640px 及以上
- `md:` 768px 及以上
- `lg:` 1024px 及以上
- `xl:` 1280px 及以上

## 🔧 最佳实践

### 1. 组件导入

```javascript
// ✅ 推荐：从统一入口导入
import { PrimaryButton, InfoCard } from '../ui';

// ❌ 避免：直接从具体文件导入
import PrimaryButton from '../ui/Button/PrimaryButton';
```

### 2. 样式定制

```javascript
// ✅ 推荐：使用className属性
<PrimaryButton className='bg-red-500 hover:bg-red-600'>删除</PrimaryButton>

// ❌ 避免：修改组件内部样式
```

### 3. 事件处理

```javascript
// ✅ 推荐：使用箭头函数
<PrimaryButton onClick={() => handleClick(id)}>点击</PrimaryButton>;

// ✅ 推荐：使用useCallback优化
const handleClick = useCallback(id => {
  // 处理逻辑
}, []);
```

### 4. 条件渲染

```javascript
// ✅ 推荐：使用条件渲染
{
  isLoading && <LoadingSpinner message='加载中...' />;
}

// ✅ 推荐：使用三元运算符
{
  error ? <ErrorDisplay error={error} /> : <SuccessMessage />;
}
```

## 🐛 常见问题

### Q: 如何自定义组件样式？

A: 使用`className`属性添加自定义 CSS 类，避免修改组件内部样式。

### Q: 组件不显示怎么办？

A: 检查是否正确导入组件，确保从`../ui`导入而不是具体文件路径。

### Q: 如何添加新的组件？

A: 在`src/components/ui/`目录下创建新组件，并在`index.js`中导出。

### Q: 组件 props 类型错误怎么办？

A: 检查传入的 props 类型是否正确，参考组件文档中的 Props 说明。

## 📝 更新日志

### v1.0.0 (2024-01-XX)

- 初始版本发布
- 包含基础 UI 组件
- 支持 Tailwind CSS 样式系统

## 🤝 贡献指南

1. 在`src/components/ui/`目录下创建新组件
2. 遵循现有的组件结构和命名规范
3. 在`index.js`中添加导出
4. 更新此文档
5. 提交 Pull Request

---

**注意:** 此文档会随着组件库的更新而更新，请定期查看最新版本。
