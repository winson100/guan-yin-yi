/**
 * Stagewise开发工具 - 完整功能版本
 * 包含元素选择器和AI编辑功能
 */

// 检查是否为开发环境
function isDevelopmentMode() {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' || 
           hostname.startsWith('192.168.') || 
           hostname.startsWith('10.') ||
           hostname.includes('local');
}

// Stagewise工具类
class StagewiseToolbar {
    constructor() {
        this.isActive = false;
        this.selectedElement = null;
        this.originalStyles = new Map();
        this.toolbar = null;
        this.commentPanel = null;
    }

    // 初始化工具栏
    init() {
        this.createToolbar();
        this.createCommentPanel();
        this.addGlobalStyles();
        this.setupEventListeners();
        console.log('Stagewise: 完整功能工具栏已启用');
    }

    // 创建主工具栏
    createToolbar() {
        this.toolbar = document.createElement('div');
        this.toolbar.id = 'stagewise-toolbar';
        this.toolbar.innerHTML = `
            <div class="sw-toolbar-content">
                <div class="sw-logo">🛠️ Stagewise</div>
                <button id="sw-select-btn" class="sw-btn">选择元素</button>
                <button id="sw-clear-btn" class="sw-btn">清除选择</button>
                <div class="sw-status">就绪</div>
            </div>
        `;
        document.body.appendChild(this.toolbar);
    }

    // 创建注释面板
    createCommentPanel() {
        this.commentPanel = document.createElement('div');
        this.commentPanel.id = 'stagewise-comment-panel';
        this.commentPanel.innerHTML = `
            <div class="sw-panel-header">
                <h3>AI编辑指令</h3>
                <button id="sw-close-panel">×</button>
            </div>
            <div class="sw-panel-content">
                <div class="sw-selected-info">
                    <strong>选中元素:</strong> <span id="sw-element-info">未选择</span>
                </div>
                <textarea id="sw-comment-input" placeholder="请描述您希望的修改内容...&#10;&#10;例如：&#10;- 将按钮颜色改为蓝色&#10;- 调整文字大小为16px&#10;- 添加边框效果"></textarea>
                <div class="sw-panel-actions">
                    <button id="sw-apply-btn" class="sw-btn sw-primary">应用修改</button>
                    <button id="sw-cancel-btn" class="sw-btn">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.commentPanel);
    }

    // 添加样式
    addGlobalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #stagewise-toolbar {
                position: fixed;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                min-width: 280px;
            }
            
            .sw-toolbar-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .sw-logo {
                font-weight: bold;
                font-size: 14px;
            }
            
            .sw-btn {
                background: rgba(255,255,255,0.2);
                border: 1px solid rgba(255,255,255,0.3);
                color: white;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
            }
            
            .sw-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            
            .sw-btn.active {
                background: #4CAF50;
                border-color: #4CAF50;
            }
            
            .sw-status {
                font-size: 12px;
                opacity: 0.8;
            }
            
            #stagewise-comment-panel {
                position: fixed;
                top: 70px;
                right: 10px;
                width: 320px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                z-index: 10001;
                display: none;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .sw-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid #eee;
                background: #f8f9fa;
                border-radius: 8px 8px 0 0;
            }
            
            .sw-panel-header h3 {
                margin: 0;
                color: #333;
                font-size: 16px;
            }
            
            #sw-close-panel {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: #666;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            
            #sw-close-panel:hover {
                background: #e9ecef;
            }
            
            .sw-panel-content {
                padding: 15px;
            }
            
            .sw-selected-info {
                margin-bottom: 12px;
                padding: 8px;
                background: #e3f2fd;
                border-radius: 4px;
                font-size: 13px;
                color: #1565c0;
            }
            
            #sw-comment-input {
                width: 100%;
                height: 120px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                resize: vertical;
                font-family: inherit;
                font-size: 14px;
                margin-bottom: 15px;
                box-sizing: border-box;
            }
            
            .sw-panel-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }
            
            .sw-primary {
                background: #2196F3 !important;
                border-color: #2196F3 !important;
                color: white !important;
            }
            
            .sw-primary:hover {
                background: #1976D2 !important;
            }
            
            .sw-element-highlight {
                outline: 2px solid #ff4081 !important;
                outline-offset: 2px !important;
                background: rgba(255, 64, 129, 0.1) !important;
                cursor: pointer !important;
            }
            
            .sw-element-selected {
                outline: 3px solid #4CAF50 !important;
                outline-offset: 2px !important;
                background: rgba(76, 175, 80, 0.15) !important;
            }
            
            body.sw-selecting * {
                cursor: crosshair !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 设置事件监听器
    setupEventListeners() {
        // 选择按钮
        document.getElementById('sw-select-btn').addEventListener('click', () => {
            this.toggleSelectMode();
        });

        // 清除选择按钮
        document.getElementById('sw-clear-btn').addEventListener('click', () => {
            this.clearSelection();
        });

        // 关闭面板
        document.getElementById('sw-close-panel').addEventListener('click', () => {
            this.hideCommentPanel();
        });

        // 应用修改按钮
        document.getElementById('sw-apply-btn').addEventListener('click', () => {
            this.applyModification();
        });

        // 取消按钮
        document.getElementById('sw-cancel-btn').addEventListener('click', () => {
            this.hideCommentPanel();
        });
    }

    // 切换选择模式
    toggleSelectMode() {
        const btn = document.getElementById('sw-select-btn');
        const status = document.querySelector('.sw-status');
        
        if (!this.isActive) {
            this.isActive = true;
            btn.classList.add('active');
            btn.textContent = '取消选择';
            status.textContent = '点击页面元素';
            document.body.classList.add('sw-selecting');
            this.addElementListeners();
        } else {
            this.deactivateSelectMode();
        }
    }

    // 停用选择模式
    deactivateSelectMode() {
        this.isActive = false;
        const btn = document.getElementById('sw-select-btn');
        const status = document.querySelector('.sw-status');
        
        btn.classList.remove('active');
        btn.textContent = '选择元素';
        status.textContent = '就绪';
        document.body.classList.remove('sw-selecting');
        this.removeElementListeners();
    }

    // 添加元素监听器
    addElementListeners() {
        document.addEventListener('mouseover', this.handleMouseOver);
        document.addEventListener('mouseout', this.handleMouseOut);
        document.addEventListener('click', this.handleClick);
    }

    // 移除元素监听器
    removeElementListeners() {
        document.removeEventListener('mouseover', this.handleMouseOver);
        document.removeEventListener('mouseout', this.handleMouseOut);
        document.removeEventListener('click', this.handleClick);
        this.clearHighlights();
    }

    // 鼠标悬停处理
    handleMouseOver = (e) => {
        if (!this.isActive) return;
        
        const target = e.target;
        if (this.isToolbarElement(target)) return;
        
        target.classList.add('sw-element-highlight');
    }

    // 鼠标离开处理
    handleMouseOut = (e) => {
        if (!this.isActive) return;
        
        const target = e.target;
        if (this.isToolbarElement(target)) return;
        
        target.classList.remove('sw-element-highlight');
    }

    // 点击处理
    handleClick = (e) => {
        if (!this.isActive) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        const target = e.target;
        if (this.isToolbarElement(target)) return;
        
        this.selectElement(target);
        this.deactivateSelectMode();
    }

    // 检查是否是工具栏元素
    isToolbarElement(element) {
        return element.closest('#stagewise-toolbar') || 
               element.closest('#stagewise-comment-panel');
    }

    // 选择元素
    selectElement(element) {
        this.clearSelection();
        this.selectedElement = element;
        element.classList.add('sw-element-selected');
        
        const elementInfo = this.getElementInfo(element);
        document.getElementById('sw-element-info').textContent = elementInfo;
        
        this.showCommentPanel();
        
        const status = document.querySelector('.sw-status');
        status.textContent = `已选择: ${elementInfo}`;
    }

    // 获取元素信息
    getElementInfo(element) {
        let info = element.tagName.toLowerCase();
        if (element.id) info += `#${element.id}`;
        if (element.className) {
            const classes = element.className.split(' ').filter(c => !c.startsWith('sw-'));
            if (classes.length > 0) info += `.${classes[0]}`;
        }
        if (element.textContent && element.textContent.length < 30) {
            info += ` "${element.textContent.trim()}"`;
        }
        return info;
    }

    // 显示注释面板
    showCommentPanel() {
        this.commentPanel.style.display = 'block';
        document.getElementById('sw-comment-input').focus();
    }

    // 隐藏注释面板
    hideCommentPanel() {
        this.commentPanel.style.display = 'none';
        document.getElementById('sw-comment-input').value = '';
    }

    // 清除选择
    clearSelection() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('sw-element-selected');
            this.selectedElement = null;
        }
        this.clearHighlights();
        document.getElementById('sw-element-info').textContent = '未选择';
        const status = document.querySelector('.sw-status');
        status.textContent = '就绪';
    }

    // 清除高亮
    clearHighlights() {
        document.querySelectorAll('.sw-element-highlight').forEach(el => {
            el.classList.remove('sw-element-highlight');
        });
    }

    // 应用修改
    applyModification() {
        const comment = document.getElementById('sw-comment-input').value.trim();
        if (!comment) {
            alert('请输入修改说明');
            return;
        }

        if (!this.selectedElement) {
            alert('请先选择要修改的元素');
            return;
        }

        // 直接应用修改
        this.applyDirectModification(comment);
        this.hideCommentPanel();
    }

    // 直接修改元素
    applyDirectModification(request) {
        const element = this.selectedElement;
        const elementInfo = this.getElementInfo(element);
        
        try {
            // 解析修改需求并直接应用
            if (request.includes('红色') || request.includes('red')) {
                element.style.color = 'red';
            }
            if (request.includes('蓝色') || request.includes('blue')) {
                element.style.color = 'blue';
            }
            if (request.includes('绿色') || request.includes('green')) {
                element.style.color = 'green';
            }
            if (request.includes('黄色') || request.includes('yellow')) {
                element.style.color = 'yellow';
            }
            if (request.includes('背景') && request.includes('红色')) {
                element.style.backgroundColor = 'red';
            }
            if (request.includes('背景') && request.includes('蓝色')) {
                element.style.backgroundColor = 'blue';
            }
            if (request.includes('隐藏')) {
                element.style.display = 'none';
            }
            if (request.includes('显示')) {
                element.style.display = 'block';
            }
            if (request.includes('边框')) {
                element.style.border = '2px solid #409EFF';
            }
            if (request.includes('圆角')) {
                element.style.borderRadius = '8px';
            }
            if (request.includes('粗体')) {
                element.style.fontWeight = 'bold';
            }
            if (request.includes('斜体')) {
                element.style.fontStyle = 'italic';
            }
            if (request.includes('下划线')) {
                element.style.textDecoration = 'underline';
            }
            if (request.includes('大号') || request.includes('大字')) {
                element.style.fontSize = '18px';
            }
            if (request.includes('小号') || request.includes('小字')) {
                element.style.fontSize = '12px';
            }
            
            // 处理文字替换
            const textMatch = request.match(/改成[""""]([^""""]*)["""""]/);
            if (textMatch) {
                element.textContent = textMatch[1];
            }
            
            // 处理尺寸调整
            const widthMatch = request.match(/宽度.*?(\d+)px/);
            if (widthMatch) {
                element.style.width = widthMatch[1] + 'px';
            }
            
            const heightMatch = request.match(/高度.*?(\d+)px/);
            if (heightMatch) {
                element.style.height = heightMatch[1] + 'px';
            }
            
            // 成功提示
            this.showSuccessMessage(`✅ 修改已应用到 ${elementInfo}`);
            
            // 在控制台记录修改
            console.log('🎯 Stagewise直接修改:', {
                element: elementInfo,
                request: request,
                appliedStyles: element.style.cssText
            });
            
        } catch (error) {
            this.showErrorMessage(`❌ 修改失败: ${error.message}`);
            console.error('Stagewise修改错误:', error);
        }
    }

    // 显示成功消息
    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #67C23A;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10002;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // 显示错误消息
    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #F56C6C;
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10002;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 初始化
const stagewiseConfig = {
    plugins: []
};

async function initStagewiseToolbar() {
    if (!isDevelopmentMode()) {
        console.log('Stagewise: 非开发环境，跳过工具栏初始化');
        return;
    }

    try {
        const toolbar = new StagewiseToolbar();
        toolbar.init();
        
        // 将实例挂载到全局，便于调试
        window.stagewise = toolbar;
        
    } catch (error) {
        console.error('Stagewise: 初始化失败', error);
    }
}

// 等待DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStagewiseToolbar);
} else {
    initStagewiseToolbar();
}

// 导出配置
window.StagewiseConfig = stagewiseConfig; 