// src/js/bar/top-tabs.js
// 顶部Tabs交互控制

(function() {
    // 指示器HTML
    const indicatorHTML = '<div class="indicator"><img src="/src/assets/images/tab_on.png" class="tab_on_img"></div>';

    // 判断是否为二级tabs
    function isLevel2Tabs(tabs) {
        return tabs.classList.contains('level-2');
    }

    // 初始化所有top-tabs
    function initTopTabs() {
        document.querySelectorAll('.top-tabs').forEach((tabs, groupIndex) => {
            const defaultIndex = parseInt(tabs.getAttribute('data-default-index')) || 0;
            setActiveTab(tabs, defaultIndex);

            tabs.querySelectorAll('.top-tabs-item').forEach((item, idx) => {
                item.addEventListener('click', function() {
                    setActiveTab(tabs, idx);
                    // 触发自定义事件
                    const event = new CustomEvent('topTabChange', {
                        detail: { groupIndex, tabIndex: idx }
                    });
                    document.dispatchEvent(event);
                });
            });
        });
        // 添加触摸滑动支持
        initTouchScroll();
    }

    // 设置激活tab，只在激活tab插入指示器（非二级tabs）
    function setActiveTab(tabs, idx) {
        const isLevel2 = isLevel2Tabs(tabs);
        tabs.querySelectorAll('.top-tabs-item').forEach((item, i) => {
            item.classList.toggle('active', i === idx);
            // 移除所有指示器
            const oldIndicator = item.querySelector('.indicator');
            if (oldIndicator) oldIndicator.remove();
            // 只在激活tab插入指示器，且不是二级tabs
            if (i === idx && !isLevel2) {
                item.insertAdjacentHTML('beforeend', indicatorHTML);
            }
        });
    }

    // 获取当前激活tab索引
    function getActiveTab(tabs) {
        const items = tabs.querySelectorAll('.top-tabs-item');
        for (let i = 0; i < items.length; i++) {
            if (items[i].classList.contains('active')) return i;
        }
        return 0;
    }

    // 添加触摸滑动处理
    function initTouchScroll() {
        document.querySelectorAll('.top-tabs').forEach(tabs => {
            let startX = 0;
            let scrollLeft = 0;
            let isTouching = false;
            // 触摸事件
            tabs.addEventListener('touchstart', (e) => {
                isTouching = true;
                startX = e.touches[0].pageX - tabs.offsetLeft;
                scrollLeft = tabs.scrollLeft;
            });
            tabs.addEventListener('touchmove', (e) => {
                if (!isTouching) return;
                const x = e.touches[0].pageX - tabs.offsetLeft;
                const walk = (x - startX) * 1.5;
                tabs.scrollLeft = scrollLeft - walk;
            });
            tabs.addEventListener('touchend', () => {
                isTouching = false;
            });
            tabs.addEventListener('touchcancel', () => {
                isTouching = false;
            });
            // 鼠标事件（PC端拖动模拟横滑）
            let isMouseDown = false;
            let mouseStartX = 0;
            let mouseScrollLeft = 0;
            tabs.addEventListener('mousedown', (e) => {
                isMouseDown = true;
                tabs.classList.add('dragging');
                mouseStartX = e.pageX - tabs.offsetLeft;
                mouseScrollLeft = tabs.scrollLeft;
            });
            tabs.addEventListener('mousemove', (e) => {
                if (!isMouseDown) return;
                e.preventDefault();
                const x = e.pageX - tabs.offsetLeft;
                const walk = (x - mouseStartX) * 1.5;
                tabs.scrollLeft = mouseScrollLeft - walk;
            });
            tabs.addEventListener('mouseup', () => {
                isMouseDown = false;
                tabs.classList.remove('dragging');
            });
            tabs.addEventListener('mouseleave', () => {
                isMouseDown = false;
                tabs.classList.remove('dragging');
            });
        });
    }

    // 全局API
    window.TopTabs = {
        init: function() {
            initTopTabs();
        },
        setActiveTab: function(selector, idx) {
            const tabGroups = selector ? document.querySelectorAll(selector) : document.querySelectorAll('.top-tabs');
            tabGroups.forEach(tabs => setActiveTab(tabs, idx));
        },
        getActiveTab: function(selector) {
            const tabs = document.querySelector(selector);
            return tabs ? getActiveTab(tabs) : null;
        }
    };

    // 页面加载后自动初始化
    document.addEventListener('DOMContentLoaded', function() {
        TopTabs.init();
    });
})(); 