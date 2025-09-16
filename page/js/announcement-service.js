/**
 * 公告信息读取服务
 * 用于从后台管理系统的数据库中读取公告信息
 */

class AnnouncementService {
    constructor() {
        this.dbName = 'CalculatorManagementDB';
        this.version = 1;
        this.db = null;
    }

    /**
     * 初始化数据库连接
     */
    async init() {
        return new Promise((resolve, reject) => {
            console.log(`正在尝试连接数据库: ${this.dbName}`);
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('公告数据库打开失败:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('公告数据库连接成功');
                console.log('数据库对象存储:', Array.from(this.db.objectStoreNames));
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                // 如果数据库不存在，创建表结构
                const db = event.target.result;
                
                if (!db.objectStoreNames.contains('calculatorSettings')) {
                    const store = db.createObjectStore('calculatorSettings', {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    
                    store.createIndex('status', 'status', { unique: false });
                    store.createIndex('updateTime', 'updateTime', { unique: false });
                    store.createIndex('maintainer', 'maintainer', { unique: false });
                }

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
     * 获取所有生效的公告信息
     */
    async getActiveAnnouncements() {
        if (!this.db) {
            console.log('数据库未初始化，开始初始化...');
            await this.init();
        }

        return new Promise((resolve, reject) => {
            console.log('开始查询公告数据...');
            const transaction = this.db.transaction(['calculatorSettings'], 'readonly');
            const store = transaction.objectStore('calculatorSettings');
            const request = store.getAll();

            request.onsuccess = () => {
                const allData = request.result;
                console.log(`从数据库获取到 ${allData.length} 条原始数据:`, allData);
                
                // 过滤出生效的公告，按更新时间倒序排列
                const activeAnnouncements = allData
                    .filter(item => {
                        // 检查状态是否为生效
                        const isActive = item.status === 'active';
                        
                        // 检查是否过期（当天创建，第二天失效）
                        const isExpired = this.checkRecordExpired(item.createTime);
                        
                        console.log(`公告 "${item.title}": 状态=${item.status}, 生效=${isActive}, 过期=${isExpired}`);
                        
                        return isActive && !isExpired;
                    })
                    .sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime));

                console.log(`过滤后的有效公告数量: ${activeAnnouncements.length}`, activeAnnouncements);
                resolve(activeAnnouncements);
            };

            request.onerror = () => {
                console.error('查询公告数据失败:', request.error);
                reject(request.error);
            };
        });
    }

    /**
     * 检查记录是否过期（当天创建，第二天失效）
     */
    checkRecordExpired(createTime) {
        if (!createTime) return false;

        const createDate = new Date(createTime);
        const today = new Date();

        // 设置时间为00:00:00，便于日期比较
        const createDateOnly = new Date(createDate.getFullYear(), createDate.getMonth(), createDate.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        // 计算天数差
        const diffTime = todayOnly.getTime() - createDateOnly.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // 创建当天为第1天，第二天过期
        return diffDays >= 2; // 大于等于2天就过期
    }

    /**
     * 获取图片数据
     */
    async getImage(imageId) {
        if (!this.db) {
            await this.init();
        }

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['images'], 'readonly');
            const store = transaction.objectStore('images');
            const request = store.get(imageId);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    /**
     * 格式化日期时间
     */
    formatDateTime(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
}

// 创建全局公告服务实例
window.announcementService = new AnnouncementService();
