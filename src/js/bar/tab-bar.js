// 底部Tab栏交互控制

// 组件内部默认配置
const tabConfig = {
    defaultActiveTab: 'home', // 默认激活的tab: 'home'|'caifu'|'daikuan'|'shenghuo'|'my'
};

// tab项与其对应的值映射
const tabMapping = {
    'home': 0,      // 首页
    'caifu': 1,     // 财富
    'daikuan': 2,   // 贷款
    'shenghuo': 3,  // 生活
    'my': 4         // 我的
};

// 获取所有tab容器
const tabBars = document.querySelectorAll('.tab-bar');

// 切换图标状态（切换图片路径中的_on和_off）
function switchTabIcon(tabItems, activeIndex) {
    tabItems.forEach((tab, idx) => {
        const imgElement = tab.querySelector('.tab-icon-img');
        if (imgElement) {
            const imgSrc = imgElement.src;
            if (idx === activeIndex) {
                // 激活的tab，图标改为_on状态
                imgElement.src = imgSrc.replace('_off.png', '_on.png');
            } else {
                // 非激活的tab，图标改为_off状态
                imgElement.src = imgSrc.replace('_on.png', '_off.png');
            }
        }
    });
}

// 为每个tab-item添加点击事件
function initTabEvents() {
    tabBars.forEach(tabBar => {
        const tabItems = tabBar.querySelectorAll('.tab-item');
        
        tabItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                // 移除当前tabBar中所有tab的active类
                tabItems.forEach(tab => tab.classList.remove('active'));
                
                // 为当前点击的tab添加active类
                this.classList.add('active');
                
                // 切换图标状态
                switchTabIcon(tabItems, index);
                
                // 这里可以添加页面跳转或内容切换的逻辑
                console.log(`切换到tab: ${this.querySelector('.tab-text').textContent}`);
                
                // 可以触发自定义事件，供父页面监听
                const event = new CustomEvent('tabChange', {
                    detail: {
                        tabIndex: index,
                        tabName: this.querySelector('.tab-text').textContent
                    }
                });
                document.dispatchEvent(event);
            });
        });
    });
}

// 激活指定的tab栏中的指定tab
function activateTab(tabBar, tabName) {
    const tabIndex = tabMapping[tabName] !== undefined ? tabMapping[tabName] : 0;
    
    const tabItems = tabBar.querySelectorAll('.tab-item');
    // 移除所有active类
    tabItems.forEach(tab => tab.classList.remove('active'));
    // 为指定tab添加active类
    if(tabItems[tabIndex]) {
        tabItems[tabIndex].classList.add('active');
        // 切换tab图标状态
        switchTabIcon(tabItems, tabIndex);
    }
    
    return tabIndex;
}

// 初始化所有tab栏
function initTabBars() {
    // 尝试从URL参数获取tab值
    const urlParams = new URLSearchParams(window.location.search);
    const urlTabParam = urlParams.get('tab');
    
    // 为每个tab栏设置默认激活的tab
    tabBars.forEach(tabBar => {
        // 获取当前tab栏的data-default-tab属性值，如果没有则使用全局默认值
        const defaultTab = tabBar.getAttribute('data-default-tab') || tabConfig.defaultActiveTab;
        
        // 决定使用哪个tab值：URL参数 > HTML属性 > 全局默认值
        const activeTab = urlTabParam || defaultTab;
        
        // 激活对应的tab
        activateTab(tabBar, activeTab);
    });
}

// 对外提供的接口，用于初始化tab栏
window.TabBar = {
    // 初始化所有tab栏
    init: function(options = {}) {
        // 合并配置
        if (options.defaultActiveTab) {
            tabConfig.defaultActiveTab = options.defaultActiveTab;
        }
        
        // 初始化事件
        initTabEvents();
        
        // 初始化所有tab栏
        initTabBars();
        
        return this;
    },
    
    // 手动激活指定tab栏中的指定tab
    setActiveTab: function(tabBarSelector, tabName) {
        const targetTabBars = tabBarSelector ? 
            document.querySelectorAll(tabBarSelector) : 
            tabBars;
        
        targetTabBars.forEach(tabBar => {
            activateTab(tabBar, tabName);
        });
        
        return this;
    },
    
    // 获取当前配置
    getConfig: function() {
        return { ...tabConfig };
    }
};

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    // 如果页面没有手动调用init方法，则自动初始化
    if (!window.TabBarInitialized) {
        window.TabBarInitialized = true;
        window.TabBar.init();
    }
}); 