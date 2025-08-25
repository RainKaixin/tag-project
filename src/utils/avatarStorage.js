// 头像存储工具 - 统一使用 Blob + IndexedDB + ObjectURL
class AvatarStorage {
  constructor() {
    this.dbName = 'TAGAvatarDB';
    this.dbVersion = 1;
    this.storeName = 'avatars';
  }

  // 初始化数据库
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = event => {
        const db = event.target.result;

        // 创建头像存储对象
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: 'userId',
          });
          store.createIndex('userId', 'userId', { unique: true });
        }
      };
    });
  }

  // 存储头像（统一使用 Blob）
  async storeAvatar(userId, data) {
    const db = await this.initDB();

    try {
      // 统一转换为 Blob
      let blob;
      if (data instanceof Blob) {
        blob = data;
      } else if (data instanceof File) {
        blob = data;
      } else if (typeof data === 'string' && data.startsWith('data:image/')) {
        // Data URL 转换为 Blob
        const response = await fetch(data);
        blob = await response.blob();
      } else {
        throw new Error('Unsupported avatar data format');
      }

      return new Promise((resolve, reject) => {
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);

        const request = store.put({
          userId,
          avatar: blob, // 存储 Blob 对象
          timestamp: Date.now(),
        });

        request.onsuccess = () => {
          console.log(
            `[AvatarStorage] Stored avatar for user: ${userId}, size: ${blob.size} bytes`
          );
          resolve({ success: true, userId });
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error(`[AvatarStorage] Error storing avatar: ${error}`);
      throw error;
    }
  }

  // 获取头像 Blob
  async getAvatar(userId) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      const request = store.get(userId);

      request.onsuccess = () => {
        if (request.result && request.result.avatar instanceof Blob) {
          console.log(
            `[AvatarStorage] Found avatar for user: ${userId}, size: ${request.result.avatar.size} bytes`
          );
          resolve({ success: true, avatar: request.result.avatar });
        } else {
          console.log(`[AvatarStorage] No avatar found for user: ${userId}`);
          resolve({ success: false, error: 'Avatar not found' });
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 获取头像 ObjectURL（用于显示）
  async getAvatarUrl(userId) {
    try {
      const result = await this.getAvatar(userId);
      if (result.success && result.avatar instanceof Blob) {
        const objectUrl = URL.createObjectURL(result.avatar);
        console.log(
          `[AvatarStorage] Created ObjectURL for user: ${userId}: ${objectUrl}`
        );
        return objectUrl;
      } else {
        console.log(`[AvatarStorage] No avatar URL for user: ${userId}`);
        return null;
      }
    } catch (error) {
      console.error(`[AvatarStorage] Error getting avatar URL: ${error}`);
      return null;
    }
  }

  // 删除头像
  async deleteAvatar(userId) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const request = store.delete(userId);

      request.onsuccess = () => {
        console.log(`[AvatarStorage] Deleted avatar for user: ${userId}`);
        resolve({ success: true });
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 清理过期的 ObjectURL
  revokeAvatarUrl(url) {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
      console.log(`[AvatarStorage] Revoked ObjectURL: ${url}`);
    }
  }

  // 检查头像是否存在
  async hasAvatar(userId) {
    const result = await this.getAvatar(userId);
    return result.success;
  }
}

// 创建单例实例
const avatarStorage = new AvatarStorage();

export default avatarStorage;
