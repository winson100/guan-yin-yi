/**
 * 存贷组合产品测算器 - 报价详情页面逻辑
 */

class QuoteDetailsPage {
    constructor() {
        this.init();
    }

    /**
     * 初始化页面
     */
    async init() {
        try {
            // 绑定事件
            this.bindEvents();
            
        } catch (error) {
            console.error('页面初始化失败:', error);
            this.showError('页面初始化失败，请刷新重试');
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 返回按钮
        document.getElementById('backBtn').addEventListener('click', () => {
            this.goBack();
        });

        // 首页按钮
        document.getElementById('homeBtn').addEventListener('click', () => {
            this.goHome();
        });
    }

    /**
     * 跳转到首页
     */
    async goHome() {
        try {
            // 清理 IndexedDB 中的所有产品数据
            await window.productDB.clearAllProducts();
            console.log('所有产品数据已清理');
        } catch (error) {
            console.error('清理数据失败:', error);
        }
        
        // 跳转到首页
        window.location.href = 'index.html';
    }

    /**
     * 返回上一页
     */
    goBack() {
        window.location.href = 'index.html';
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        this.showMessage(message, 'error');
    }

    /**
     * 显示成功信息
     */
    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    /**
     * 显示消息
     */
    showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `${type}-message`;
        messageElement.textContent = message;
        
        const container = document.querySelector('.main-content');
        container.insertBefore(messageElement, container.firstChild);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new QuoteDetailsPage();
});
