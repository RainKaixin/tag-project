// IndexedDB 工具类 - 用于存储图片文件
class ImageStorage {
  constructor() {
    this.dbName = 'TAGPortfolioDB';
    this.dbVersion = 1;
    this.storeName = 'images';
  }

  // 初始化数据库
  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = event => {
        const db = event.target.result;

        // 创建图片存储对象
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: 'path',
          });
          store.createIndex('path', 'path', { unique: true });
        }
      };
    });
  }

  // 存储图片（统一使用 Blob）
  async storeImage(filePath, data) {
    const db = await this.initDB();

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
      throw new Error('Unsupported data format');
    }

    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const request = store.put({
        path: filePath,
        file: blob, // 存储 Blob 对象
        timestamp: Date.now(),
      });

      request.onsuccess = () => resolve({ success: true, path: filePath });
      request.onerror = () => reject(request.error);
    });
  }

  // 获取图片（返回 Blob）
  async getImage(filePath) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);

      const request = store.get(filePath);

      request.onsuccess = () => {
        if (request.result) {
          const file = request.result.file;
          if (file instanceof Blob) {
            console.log(
              `[ImageStorage] Found Blob for ${filePath}: ${file.size} bytes`
            );
            resolve({ success: true, file: file });
          } else {
            console.warn(
              `[ImageStorage] Invalid Blob format for ${filePath}: ${typeof file}`
            );
            resolve({ success: false, error: 'Invalid Blob format' });
          }
        } else {
          resolve({ success: false, error: 'Image not found' });
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 删除图片
  async deleteImage(filePath) {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);

      const request = store.delete(filePath);

      request.onsuccess = () => resolve({ success: true });
      request.onerror = () => reject(request.error);
    });
  }

  // 批量删除图片
  async deleteImages(filePaths) {
    const results = await Promise.all(
      filePaths.map(path => this.deleteImage(path))
    );
    return results.every(result => result.success);
  }

  // 获取图片 URL（用于显示）- 统一返回 ObjectURL
  async getImageUrl(filePath) {
    // 类型兜底：确保输入是字符串
    if (!filePath || typeof filePath !== 'string') {
      console.log(
        `[ImageStorage] Invalid filePath type: ${typeof filePath}, returning null`
      );
      return null;
    }

    console.log(`[ImageStorage] Getting URL for: ${filePath}`);

    // 第一步：优先处理 Data URL - 转换为 Blob 并创建 ObjectURL
    if (filePath.startsWith('data:image/')) {
      try {
        const response = await fetch(filePath);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        console.log(
          `[ImageStorage] Created ObjectURL from Data URL: ${objectUrl}`
        );
        return objectUrl;
      } catch (error) {
        console.error(
          `[ImageStorage] Error converting Data URL to ObjectURL: ${error}`
        );
        return null;
      }
    }

    // 第二步：处理远程 URL - 如果已经是完整的 URL，直接返回
    if (filePath.startsWith('http')) {
      console.log(`[ImageStorage] Returning remote URL: ${filePath}`);
      return filePath;
    }

    // 第三步：从 IndexedDB 读取 Blob 并创建 ObjectURL
    if (filePath.startsWith('portfolio/')) {
      try {
        console.log(`[ImageStorage] Looking up in IndexedDB: ${filePath}`);
        const result = await this.getImage(filePath);
        console.log(`[ImageStorage] IndexedDB lookup result:`, result);

        if (result.success && result.file instanceof Blob) {
          const objectUrl = URL.createObjectURL(result.file);
          console.log(
            `[ImageStorage] Created ObjectURL from IndexedDB: ${objectUrl}`
          );
          return objectUrl;
        } else {
          console.log(
            `[ImageStorage] Blob not found in IndexedDB for ${filePath}`
          );
          return null;
        }
      } catch (error) {
        console.error(`[ImageStorage] Error reading from IndexedDB: ${error}`);
        return null;
      }
    }

    // 兜底：返回null
    console.log(`[ImageStorage] No valid image found for ${filePath}`);
    return null;
  }

  // 清理过期的 URL
  revokeImageUrl(url) {
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}

// 创建单例实例
const imageStorage = new ImageStorage();

export default imageStorage;
