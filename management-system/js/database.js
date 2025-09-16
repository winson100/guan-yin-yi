/**
 * IndexedDB 数据库服务
 * 用于存储测算器设置数据
 */

class DatabaseService {
    constructor() {
        this.dbName = 'CalculatorManagementDB';
        this.version = 1;
        this.db = null;
    }

    /**
     * 初始化数据库
     */
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('数据库打开失败:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('数据库初始化成功');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // 创建测算器设置表
                if (!db.objectStoreNames.contains('calculatorSettings')) {
                    const store = db.createObjectStore('calculatorSettings', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    
                    // 创建索引
                    store.createIndex('status', 'status', { unique: false });
                    store.createIndex('updateTime', 'updateTime', { unique: false });
                    store.createIndex('maintainer', 'maintainer', { unique: false });
                }

                // 创建图片存储表
                if (!db.objectStoreNames.contains('images')) {
                    const imageStore = db.createObjectStore('images', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    
                    imageStore.createIndex('fileName', 'fileName', { unique: false });
                    imageStore.createIndex('uploadTime', 'uploadTime', { unique: false });
                }
            };
        });
    }

    /**
     * 获取事务
     */
    getTransaction(storeNames, mode = 'readonly') {
        if (!this.db) {
            throw new Error('数据库未初始化');
        }
        return this.db.transaction(storeNames, mode);
    }

    /**
     * 获取对象存储
     */
    getObjectStore(storeName, mode = 'readonly') {
        const transaction = this.getTransaction([storeName], mode);
        return transaction.objectStore(storeName);
    }

    /**
     * 添加测算器设置
     */
    async addCalculatorSetting(data) {
        return new Promise((resolve, reject) => {
            const store = this.getObjectStore('calculatorSettings', 'readwrite');
            const request = store.add({
                ...data,
                createTime: new Date().toISOString(),
                updateTime: new Date().toISOString()
            });

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 更新测算器设置
     */
    async updateCalculatorSetting(id, data) {
        return new Promise((resolve, reject) => {
            const store = this.getObjectStore('calculatorSettings', 'readwrite');
            const getRequest = store.get(id);

            getRequest.onsuccess = () => {
                const existingData = getRequest.result;
                if (existingData) {
                    const updatedData = {
                        ...existingData,
                        ...data,
                        updateTime: new Date().toISOString()
                    };
                    
                    const putRequest = store.put(updatedData);
                    putRequest.onsuccess = () => {
                        resolve(putRequest.result);
                    };
                    putRequest.onerror = () => {
                        reject(putRequest.error);
                    };
                } else {
                    reject(new Error('记录不存在'));
                }
            };

            getRequest.onerror = () => {
                reject(getRequest.error);
            };
        });
    }

    /**
     * 删除测算器设置
     */
    async deleteCalculatorSetting(id) {
        return new Promise((resolve, reject) => {
            const store = this.getObjectStore('calculatorSettings', 'readwrite');
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 获取所有测算器设置
     */
    async getAllCalculatorSettings() {
        return new Promise((resolve, reject) => {
            const store = this.getObjectStore('calculatorSettings');
            const request = store.getAll();

            request.onsuccess = () => {
                // 按更新时间倒序排列
                const data = request.result.sort((a, b) => 
                    new Date(b.updateTime) - new Date(a.updateTime)
                );
                resolve(data);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 根据ID获取测算器设置
     */
    async getCalculatorSettingById(id) {
        return new Promise((resolve, reject) => {
            const store = this.getObjectStore('calculatorSettings');
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 根据状态筛选测算器设置
     */
    async getCalculatorSettingsByStatus(status) {
        return new Promise((resolve, reject) => {
            const store = this.getObjectStore('calculatorSettings');
            const index = store.index('status');
            const request = index.getAll(status);

            request.onsuccess = () => {
                const data = request.result.sort((a, b) => 
                    new Date(b.updateTime) - new Date(a.updateTime)
                );
                resolve(data);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 保存图片
     */
    async saveImage(file, fileName) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async () => {
                try {
                    const store = this.getObjectStore('images', 'readwrite');
                    const imageData = {
                        fileName: fileName,
                        data: reader.result,
                        uploadTime: new Date().toISOString(),
                        size: file.size,
                        type: file.type
                    };
                    
                    const request = store.add(imageData);
                    request.onsuccess = () => {
                        resolve({
                            id: request.result,
                            fileName: fileName,
                            url: reader.result
                        });
                    };
                    request.onerror = () => {
                        reject(request.error);
                    };
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => {
                reject(reader.error);
            };
            reader.readAsDataURL(file);
        });
    }

    /**
     * 获取图片
     */
    async getImage(id) {
        return new Promise((resolve, reject) => {
            const store = this.getObjectStore('images');
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 删除图片
     */
    async deleteImage(id) {
        return new Promise((resolve, reject) => {
            const store = this.getObjectStore('images', 'readwrite');
            const request = store.delete(id);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 获取所有图片
     */
    async getAllImages() {
        return new Promise((resolve, reject) => {
            const store = this.getObjectStore('images');
            const request = store.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 清空所有数据
     */
    async clearAllData() {
        return new Promise((resolve, reject) => {
            const transaction = this.getTransaction(['calculatorSettings', 'images'], 'readwrite');
            const settingsStore = transaction.objectStore('calculatorSettings');
            const imagesStore = transaction.objectStore('images');
            
            const settingsRequest = settingsStore.clear();
            const imagesRequest = imagesStore.clear();
            
            let completed = 0;
            const total = 2;
            
            const checkComplete = () => {
                completed++;
                if (completed === total) {
                    resolve(true);
                }
            };
            
            settingsRequest.onsuccess = checkComplete;
            imagesRequest.onsuccess = checkComplete;
            
            settingsRequest.onerror = () => reject(settingsRequest.error);
            imagesRequest.onerror = () => reject(imagesRequest.error);
        });
    }
}

// 创建全局数据库实例
window.databaseService = new DatabaseService();
