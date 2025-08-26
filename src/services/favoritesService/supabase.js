// favorites-service-supabase v1: Supabase适配器占位符
// 注意：这是占位符文件，未来接入Supabase时实现具体逻辑

/**
 * Supabase适配器（占位符）
 * 未来接入真实后端时替换localStorage实现
 */
const supabaseAdapter = {
  // 所有方法暂时抛出错误，提示需要实现
  _notImplemented() {
    throw new Error(
      'Supabase adapter not implemented yet. Please use localStorage adapter.'
    );
  },

  async getFavorites(params) {
    this._notImplemented();
  },

  async addFavorite(params) {
    this._notImplemented();
  },

  async removeFavorite(params) {
    this._notImplemented();
  },

  async checkFavoriteStatus(params) {
    this._notImplemented();
  },

  async getFavoriteCount(params) {
    this._notImplemented();
  },

  async batchCheckFavoriteStatus(params) {
    this._notImplemented();
  },
};

export default supabaseAdapter;
