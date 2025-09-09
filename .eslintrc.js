module.exports = {
  extends: ['react-app', 'react-app/jest'],
  rules: {
    // 忽略未使用變量警告
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',

    // 忽略React Hooks依賴項警告
    'react-hooks/exhaustive-deps': 'off',

    // 忽略可訪問性警告
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/label-has-associated-control': 'off',

    // 忽略字符轉義警告
    'react/no-unescaped-entities': 'off',

    // 忽略空函數警告
    '@typescript-eslint/no-empty-function': 'off',

    // 忽略any類型警告
    '@typescript-eslint/no-explicit-any': 'off',

    // 忽略其他警告
    'jsx-a11y/anchor-is-valid': 'off',
    'import/no-anonymous-default-export': 'off',
    'no-restricted-globals': 'off',
    'import/first': 'off',
  },
};
