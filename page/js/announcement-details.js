/**
 * 公告详情页面逻辑
 * 读取后台管理系统中的生效公告并展示
 */

class AnnouncementDetails {
    constructor() {
        this.calculatorService = null;
        this.announcements = [];
        this.isInitialized = false;
    }

    /**
     * 初始化
     */
    async init() {
        try {
            console.log('初始化公告详情页面...');

            // 检查依赖是否加载
            if (!window.databaseService) {
                throw new Error('数据库服务未加载');
            }
            if (!window.calculatorService) {
                throw new Error('计算器服务未加载');
            }

            this.calculatorService = window.calculatorService;
            await this.calculatorService.init();

            this.isInitialized = true;
            console.log('公告详情页面初始化成功');

            // 加载公告数据
            await this.loadAnnouncements();

        } catch (error) {
            console.error('公告详情页面初始化失败:', error);
            this.showError('页面初始化失败，请刷新重试');
        }
    }

    /**
     * 加载公告数据
     */
    async loadAnnouncements() {
        try {
            console.log('开始加载公告数据...');
            this.showLoading();

            // 获取所有数据
            const allData = await this.calculatorService.getCalculatorSettings();
            console.log('获取到的数据:', allData);

            // 过滤出生效状态的公告，并按时间倒序排列
            this.announcements = allData
                .filter(item => item.status === 'active' && !item.isExpired)
                .sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime));

            console.log('过滤后的生效公告:', this.announcements);

            if (this.announcements.length === 0) {
                this.showEmpty();
            } else {
                this.renderAnnouncements();
            }

        } catch (error) {
            console.error('加载公告数据失败:', error);
            this.showError('加载数据失败，请稍后重试');
        }
    }

    /**
     * 渲染公告列表
     */
    renderAnnouncements() {
        const container = document.getElementById('announcementList');
        if (!container) {
            console.error('公告容器不存在');
            return;
        }

        // 清空容器
        container.innerHTML = '';

        // 渲染每个公告
        this.announcements.forEach((announcement, index) => {
            const announcementElement = this.createAnnouncementElement(announcement, index);
            container.appendChild(announcementElement);
        });

        // 隐藏加载状态，显示公告列表
        this.hideLoading();
        container.style.display = 'block';
    }

    /**
     * 创建公告元素
     */
    createAnnouncementElement(announcement, index) {
        const announcementDiv = document.createElement('div');
        announcementDiv.className = 'announcement-item';

        // 公告头部信息
        const headerDiv = document.createElement('div');
        headerDiv.className = 'announcement-header';
        headerDiv.style.cssText = `
            background: #f5f5f5;
            padding: 16px 20px;
            border-bottom: 1px solid #e0e0e0;
        `;

        const titleDiv = document.createElement('h3');
        titleDiv.className = 'announcement-title';
        titleDiv.textContent = announcement.title || '未命名公告';
        titleDiv.style.cssText = `
            color: #2c2c2c;
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 8px 0;
            line-height: 1.4;
        `;

        const metaDiv = document.createElement('div');
        metaDiv.className = 'announcement-meta';
        metaDiv.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            color: #5a5a5a;
        `;

        const maintainerSpan = document.createElement('span');
        maintainerSpan.className = 'announcement-maintainer';
        maintainerSpan.textContent = `维护人：${announcement.maintainer || '系统管理员'}`;
        maintainerSpan.style.cssText = `
            font-weight: 500;
            color: #4a4a4a;
        `;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'announcement-time';
        timeSpan.textContent = `维护时间：${announcement.updateTimeFormatted || '未知时间'}`;
        timeSpan.style.cssText = `
            color: #6a6a6a;
        `;

        metaDiv.appendChild(maintainerSpan);
        metaDiv.appendChild(timeSpan);

        headerDiv.appendChild(titleDiv);
        headerDiv.appendChild(metaDiv);

        // 公告内容
        const bodyDiv = document.createElement('div');
        bodyDiv.className = 'announcement-body';

        if (announcement.contentBlocks && announcement.contentBlocks.length > 0) {
            announcement.contentBlocks.forEach(block => {
                const blockElement = this.createContentBlockElement(block);
                if (blockElement) {
                    bodyDiv.appendChild(blockElement);
                }
            });
        } else {
            // 兼容旧数据格式
            const textBlock = document.createElement('div');
            textBlock.className = 'content-block';
            const textContent = document.createElement('div');
            textContent.className = 'text-content';
            textContent.textContent = announcement.content || '暂无内容';
            textContent.style.cssText = `
                font-size: 14px;
                line-height: 1.6;
                color: var(--neutral-color-nc80);
                white-space: pre-wrap;
                word-wrap: break-word;
            `;
            textBlock.appendChild(textContent);
            bodyDiv.appendChild(textBlock);
        }

        announcementDiv.appendChild(headerDiv);
        announcementDiv.appendChild(bodyDiv);

        return announcementDiv;
    }

    /**
     * 创建内容块元素
     */
    createContentBlockElement(block) {
        const blockDiv = document.createElement('div');
        blockDiv.className = 'content-block';

        if (block.type === 'text') {
            // 文字块
            const textContent = document.createElement('div');
            textContent.className = 'text-content';
            textContent.textContent = block.content || '';
            textContent.style.cssText = `
                font-size: 14px;
                line-height: 1.6;
                color: var(--neutral-color-nc80);
                white-space: pre-wrap;
                word-wrap: break-word;
            `;
            blockDiv.appendChild(textContent);

        } else if (block.type === 'image') {
            // 图片块
            const imageContent = document.createElement('div');
            imageContent.className = 'image-content';

            if (block.imageData && block.imageData.url) {
                const img = document.createElement('img');
                img.src = block.imageData.url;
                img.alt = block.imageData.fileName || '公告图片';
                imageContent.appendChild(img);
            } else {
                // 图片加载失败的占位符
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.textContent = '[图片加载失败]';
                placeholder.style.cssText = `
                    padding: 20px;
                    text-align: center;
                    background: #f5f5f5;
                    border-radius: 8px;
                    color: #999;
                    font-style: italic;
                `;
                imageContent.appendChild(placeholder);
            }

            blockDiv.appendChild(imageContent);
        }

        return blockDiv;
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        const loadingState = document.getElementById('loadingState');
        const announcementList = document.getElementById('announcementList');
        const emptyState = document.getElementById('emptyState');

        if (loadingState) loadingState.style.display = 'flex';
        if (announcementList) announcementList.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
    }

    /**
     * 隐藏加载状态
     */
    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        if (loadingState) loadingState.style.display = 'none';
    }

    /**
     * 显示空状态
     */
    showEmpty() {
        const loadingState = document.getElementById('loadingState');
        const announcementList = document.getElementById('announcementList');
        const emptyState = document.getElementById('emptyState');

        if (loadingState) loadingState.style.display = 'none';
        if (announcementList) announcementList.style.display = 'none';
        if (emptyState) emptyState.style.display = 'flex';
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        const loadingState = document.getElementById('loadingState');
        const announcementList = document.getElementById('announcementList');
        const emptyState = document.getElementById('emptyState');

        if (loadingState) {
            loadingState.innerHTML = `
                <div style="text-align: center; color: #f56c6c;">
                    <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
                    <p>${message}</p>
                </div>
            `;
            loadingState.style.display = 'flex';
        }

        if (announcementList) announcementList.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
    }

    /**
     * 刷新数据
     */
    async refresh() {
        console.log('刷新公告数据...');
        await this.loadAnnouncements();
    }
}

// 创建全局公告详情实例
const announcementDetails = new AnnouncementDetails();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await announcementDetails.init();
    } catch (error) {
        console.error('页面初始化失败:', error);
    }
});

// 导航按钮事件
document.addEventListener('DOMContentLoaded', () => {
    const backBtn = document.getElementById('backBtn');
    const homeBtn = document.getElementById('homeBtn');

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            // 返回上一页
            if (window.history.length > 1) {
                window.history.back();
            } else {
                // 如果没有历史记录，跳转到首页
                window.location.href = 'index.html';
            }
        });
    }

    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            // 跳转到首页
            window.location.href = 'index.html';
        });
    }
});

// 导出全局实例，供调试使用
window.announcementDetails = announcementDetails;
