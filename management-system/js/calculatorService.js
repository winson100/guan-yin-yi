/**
 * 测算器设置业务服务
 */

class CalculatorService {
    constructor() {
        this.database = window.databaseService;
    }

    /**
     * 初始化服务
     */
    async init() {
        try {
            console.log('开始初始化 calculatorService...');
            await this.database.init();
            console.log('calculatorService 初始化成功');
        } catch (error) {
            console.error('calculatorService 初始化失败:', error);
            throw error;
        }
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
     * 获取测算器设置列表
     */
    async getCalculatorSettings(filters = {}) {
        try {
            let data;
            if (filters.status) {
                data = await this.database.getCalculatorSettingsByStatus(filters.status);
            } else {
                data = await this.database.getAllCalculatorSettings();
            }

            // 处理过期逻辑和格式化数据
            return data.map(item => {
                // 检查是否过期
                const isExpired = this.checkRecordExpired(item.createTime);
                const actualStatus = isExpired ? 'inactive' : (item.status || 'active');

                return {
                    ...item,
                    status: actualStatus, // 更新状态
                    statusText: actualStatus === 'active' ? '生效' : '失效',
                    updateTimeFormatted: this.formatDateTime(item.updateTime),
                    createTimeFormatted: this.formatDateTime(item.createTime),
                    isExpired: isExpired,
                    expireInfo: isExpired ? '已过期' : '有效'
                };
            });
        } catch (error) {
            console.error('获取测算器设置列表失败:', error);
            throw error;
        }
    }

    /**
     * 根据ID获取测算器设置
     */
    async getCalculatorSettingById(id) {
        try {
            const data = await this.database.getCalculatorSettingById(id);
            if (!data) return null;

            // 检查是否过期并更新状态
            const isExpired = this.checkRecordExpired(data.createTime);
            const actualStatus = isExpired ? 'inactive' : (data.status || 'active');

            return {
                ...data,
                status: actualStatus,
                statusText: actualStatus === 'active' ? '生效' : '失效',
                createTimeFormatted: this.formatDateTime(data.createTime),
                updateTimeFormatted: this.formatDateTime(data.updateTime),
                isExpired: isExpired,
                expireInfo: isExpired ? '已过期' : '有效'
            };
        } catch (error) {
            console.error('获取测算器设置失败:', error);
            throw error;
        }
    }

    /**
     * 新增测算器设置
     */
    async addCalculatorSetting(data) {
        try {
            console.log('calculatorService.addCalculatorSetting 接收到的数据:', data);
            
            if (!this.database) {
                throw new Error('数据库服务未初始化');
            }
            
            const settingData = {
                title: data.title || '未命名设置',
                contentBlocks: data.contentBlocks || [], // 新的多段内容结构
                status: 'active', // 新增时默认为生效状态
                maintainer: data.maintainer || '系统管理员'
            };
            
            console.log('准备保存到数据库的数据:', settingData);
            
            const id = await this.database.addCalculatorSetting(settingData);
            console.log('数据库返回的ID:', id);
            
            return { id, ...settingData };
        } catch (error) {
            console.error('新增测算器设置失败:', error);
            throw error;
        }
    }

    /**
     * 更新测算器设置
     */
    async updateCalculatorSetting(id, data) {
        try {
            const updateData = {
                title: data.title,
                contentBlocks: data.contentBlocks || [], // 新的多段内容结构
                maintainer: data.maintainer || '系统管理员'
            };
            
            await this.database.updateCalculatorSetting(id, updateData);
            return await this.getCalculatorSettingById(id);
        } catch (error) {
            console.error('更新测算器设置失败:', error);
            throw error;
        }
    }

    /**
     * 删除测算器设置
     */
    async deleteCalculatorSetting(id) {
        try {
            // 先获取记录信息
            const record = await this.getCalculatorSettingById(id);
            if (!record) {
                throw new Error('记录不存在');
            }
            
            if (record.status === 'inactive') {
                throw new Error('只能对状态为【生效】的记录执行删除操作，请重新选择！');
            }
            
            await this.database.deleteCalculatorSetting(id);
            return true;
        } catch (error) {
            console.error('删除测算器设置失败:', error);
            throw error;
        }
    }

    /**
     * 上传图片
     */
    async uploadImage(file) {
        try {
            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                throw new Error('只能上传图片文件');
            }
            
            // 验证文件大小 (限制为5MB)
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('图片大小不能超过5MB');
            }
            
            // 生成唯一文件名
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 8);
            const extension = file.name.split('.').pop();
            const fileName = `image_${timestamp}_${randomStr}.${extension}`;
            
            const result = await this.database.saveImage(file, fileName);
            return result;
        } catch (error) {
            console.error('上传图片失败:', error);
            throw error;
        }
    }

    /**
     * 删除图片
     */
    async deleteImage(imageId) {
        try {
            await this.database.deleteImage(imageId);
            return true;
        } catch (error) {
            console.error('删除图片失败:', error);
            throw error;
        }
    }

    /**
     * 获取图片
     */
    async getImage(imageId) {
        try {
            return await this.database.getImage(imageId);
        } catch (error) {
            console.error('获取图片失败:', error);
            throw error;
        }
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
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * 验证数据
     */
    validateCalculatorSetting(data) {
        const errors = [];
        
        if (!data.title || data.title.trim() === '') {
            errors.push('标题不能为空');
        }
        
        if (data.title && data.title.length > 100) {
            errors.push('标题长度不能超过100个字符');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * 导出数据
     */
    async exportData() {
        try {
            const data = await this.database.getAllCalculatorSettings();
            const exportData = {
                exportTime: new Date().toISOString(),
                version: '1.0',
                data: data
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `calculator_settings_${this.formatDateTime(new Date().toISOString()).replace(/[:\s]/g, '_')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('导出数据失败:', error);
            throw error;
        }
    }

    /**
     * 导入数据
     */
    async importData(file) {
        try {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    try {
                        const importData = JSON.parse(e.target.result);
                        
                        if (!importData.data || !Array.isArray(importData.data)) {
                            throw new Error('无效的数据格式');
                        }
                        
                        // 清空现有数据
                        await this.database.clearAllData();
                        
                        // 导入新数据
                        for (const item of importData.data) {
                            await this.database.addCalculatorSetting(item);
                        }
                        
                        resolve(true);
                    } catch (error) {
                        reject(error);
                    }
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsText(file);
            });
        } catch (error) {
            console.error('导入数据失败:', error);
            throw error;
        }
    }
}

// 创建全局服务实例
window.calculatorService = new CalculatorService();
