document.addEventListener('DOMContentLoaded', function() {
    // 获取所有日期输入框和滚动器
    const allPickerSections = document.querySelectorAll('section.date-picker-hidden, section[data-picker], .fb-popup-container section[data-picker], .fb-wheel-container section[data-picker]');
    const allDatePickers = document.querySelectorAll('.date-picker-panel');

    // 获取所有输入框（含两组）
    const allInputs = document.querySelectorAll('.time-filter-row-no-query input, .date-filter-row .date-selector input, .fb-popup-container input, .fb-wheel-container input');

    let activeInput = null;
    let activePickerSection = null;
    let activeColumns = null;

    // 工具函数：设置某列选中项
    function setColumnSelected(column, value) {
        const items = column.querySelectorAll('.date-item');
        items.forEach(item => {
            if (item.textContent.replace(/年|月|日/g, '') === value) {
                item.classList.add('selected');
                item.scrollIntoView({block: 'center'});
            } else {
                item.classList.remove('selected');
            }
        });
    }

    // 获取今日日期字符串 yyyy-mm-dd
    function getTodayStr() {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    // 点击输入框时显示对应滚动选择器，并同步数据
    allInputs.forEach(input => {
        input.addEventListener('focus', function() {
            showPickerForInput(input);
        });
        input.addEventListener('click', function() {
            showPickerForInput(input);
        });
    });

    function showPickerForInput(input) {
        // 先全部隐藏
        allPickerSections.forEach(sec => sec.classList.add('date-picker-hidden'));
        // 找到对应的滚动器
        if (input.closest('.time-filter-row-no-query')) {
            // 第一组
            activePickerSection = document.querySelector('section[data-picker="range"]');
        } else {
            // 第二组
            activePickerSection = document.querySelectorAll('section.pad-vertical-0.date-picker-hidden, section.pad-vertical-0[data-picker]')[1];
            if (!activePickerSection) {
                // 兼容原有结构
                activePickerSection = document.querySelectorAll('section.pad-vertical-0')[1];
            }
        }
        if (!activePickerSection) return;
        activePickerSection.classList.remove('date-picker-hidden');
        activeColumns = activePickerSection.querySelectorAll('.date-column');
        activeInput = input;
        // 记录当前激活输入框
        window._activeDateInput = input;
        // 解析日期字符串
        let dateStr = input.value || input.placeholder;
        let match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (!match) {
            // 没有默认日期，使用今日
            dateStr = getTodayStr();
            match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
            // 同步到输入框
            input.value = dateStr;
        }
        if (match) {
            setColumnSelected(activeColumns[0], match[1]);
            setColumnSelected(activeColumns[1], String(Number(match[2])));
            setColumnSelected(activeColumns[2], String(Number(match[3])));
        }
    }

    // 封装事件绑定函数
    function bindColumnChangeEvents() {
        document.querySelectorAll('.date-column').forEach(column => {
            if (!column._columnChangeBound) {
                column.addEventListener('columnChange', function() {
                    // 优先用当前激活输入框
                    let input = window._activeDateInput;
                    // 如果没有激活输入框，再找最近的
                    if (!input) {
                        // 1. 优先找同一父级下的输入框
                        let section = column.closest('section[data-picker]');
                        if (section) {
                            // 先找上一个兄弟元素里的 input
                            let prev = section.previousElementSibling;
                            while (prev) {
                                input = prev.querySelector && prev.querySelector('input');
                                if (input) break;
                                prev = prev.previousElementSibling;
                            }
                        }
                        // 2. 兜底：用当前激活输入框
                        if (!input) {
                            input = document.activeElement && document.activeElement.tagName === 'INPUT' ? document.activeElement : null;
                        }
                    }
                    if (!input) return;
                    // 取三列
                    const sectionForColumns = column.closest('section[data-picker]');
                    const columns = sectionForColumns.querySelectorAll('.date-column');
                    const year = columns[0]?.querySelector('.date-item.selected')?.textContent.replace('年', '') || '';
                    const month = columns[1]?.querySelector('.date-item.selected')?.textContent.replace('月', '') || '';
                    const day = columns[2]?.querySelector('.date-item.selected')?.textContent.replace('日', '') || '';
                    if (year && month && day) {
                        const mm = month.padStart(2, '0');
                        const dd = day.padStart(2, '0');
                        input.value = `${year}-${mm}-${dd}`;
                    }
                });
                column._columnChangeBound = true;
            }
        });
    }

    // 页面初始化时绑定一次
    bindColumnChangeEvents();

    // 如果有弹窗，每次弹窗内容渲染后再调用一次
    // 这里简单处理：每次输入框 focus 时都重新绑定，保证弹窗场景下也能生效
    allInputs.forEach(input => {
        input.addEventListener('focus', function() {
            bindColumnChangeEvents();
        });
    });

    // 点击页面其他地方隐藏所有滚动选择器
    document.addEventListener('click', function(e) {
        if (![...allInputs].includes(e.target) && !e.target.closest('.date-picker-panel')) {
            allPickerSections.forEach(sec => sec.classList.add('date-picker-hidden'));
        }
    });
}); 