// 选择所有筛选条件按钮
document.querySelectorAll('.filter-item:not(.sort-item)').forEach(item => {
    item.addEventListener('click', function () {
        const icon = this.querySelector('.filter-icon');
        // 判断当前是下箭头还是上箭头
        if (icon.getAttribute('src').includes('arrow-down.svg')) {
            icon.setAttribute('src', '/src/assets/icons/arrow-up.svg');
        } else {
            icon.setAttribute('src', '/src/assets/icons/arrow-down.svg');
        }
    });
});

// 排序条件按钮三态切换
document.querySelectorAll('.filter-item.sort-item').forEach(item => {
    item.addEventListener('click', function () {
        const icon = this.querySelector('.filter-icon');
        const src = icon.getAttribute('src');
        if (src.includes('sortable.svg')) {
            icon.setAttribute('src', '/src/assets/icons/sort-asc.svg');
        } else if (src.includes('sort-asc.svg')) {
            icon.setAttribute('src', '/src/assets/icons/sort-desc.svg');
        } else {
            icon.setAttribute('src', '/src/assets/icons/sortable.svg');
        }
    });
}); 