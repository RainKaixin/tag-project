# 开发工具使用指南

## 代码格式化

### Prettier

- 自动格式化代码，保持一致的代码风格
- 配置在 `.prettierrc` 文件中
- 忽略规则在 `.prettierignore` 文件中

**使用命令：**

```bash
# 格式化所有文件
npm run format

# 检查格式化状态
npm run format:check
```

### ESLint

- 代码质量检查，发现潜在问题
- 配置在 `.eslintrc.js` 文件中
- 忽略规则在 `.eslintignore` 文件中

**使用命令：**

```bash
# 检查代码质量
npm run lint

# 自动修复可修复的问题
npm run lint:fix
```

## Git Hooks

### Husky + lint-staged

- 提交前自动运行代码检查和格式化
- 只检查暂存区的文件，提高效率
- 配置在 `.husky/pre-commit` 和 `.lintstagedrc.js` 中

**工作流程：**

1. 修改代码
2. `git add` 暂存文件
3. `git commit` 提交时自动运行检查
4. 如果有错误，提交会被阻止

## VSCode 配置

### 自动格式化

- 保存时自动格式化代码
- 自动修复 ESLint 错误
- 配置在 `.vscode/settings.json` 中

### 推荐扩展

- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer

## 开发脚本

```bash
# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test

# 代码质量检查
npm run lint

# 代码格式化
npm run format

# 一键修复（格式化 + ESLint修复）
npm run lint:fix && npm run format
```

## 最佳实践

1. **提交前检查**：确保代码通过所有检查
2. **保持格式化**：定期运行 `npm run format`
3. **遵循规则**：注意 ESLint 警告和错误
4. **团队协作**：所有成员使用相同的工具配置
