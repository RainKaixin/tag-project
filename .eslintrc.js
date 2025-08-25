module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'import', '@typescript-eslint'],
  rules: {
    // React相关规则
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要导入React
    'react/prop-types': 'off', // 使用TypeScript时关闭
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    'react/no-unescaped-entities': 'warn', // 开发阶段允许未转义实体

    // React Hooks规则
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // 导入规则
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/no-unresolved': 'off', // 让IDE处理路径解析

    // 代码风格规则
    'no-console': 'off', // 开发阶段允许console
    'no-debugger': 'error',
    'no-unused-vars': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
    '@typescript-eslint/no-empty-function': 'warn', // 开发阶段允许空函数
    '@typescript-eslint/no-explicit-any': 'warn', // 开发阶段允许any类型
    '@typescript-eslint/no-non-null-assertion': 'warn', // 开发阶段允许非空断言

    // JSX规则
    'jsx-a11y/anchor-is-valid': 'warn',
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    'jsx-a11y/label-has-associated-control': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
