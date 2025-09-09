// webpack.config.js - 性能配置
const path = require('path');

module.exports = {
  // 性能配置
  performance: {
    hints: 'warning',
    maxAssetSize: 500000, // 500KB
    maxEntrypointSize: 500000,
    assetFilter: function (assetFilename) {
      // 只對JS和CSS文件進行大小檢查
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
    },
  },

  // 優化配置
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\/]node_modules[\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
