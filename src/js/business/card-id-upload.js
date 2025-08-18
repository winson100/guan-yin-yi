// 卡片选择多选切换

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.card-list .card-item').forEach(function(cardItem) {
        const icon = cardItem.querySelector('.select-icon');
        cardItem.addEventListener('click', function(e) {
            // 阻止事件冒泡，避免点击图片也触发
            if (e.target !== icon) return;
            const isSelected = icon.getAttribute('src').includes('imgon.png');
            if (isSelected) {
                icon.setAttribute('src', '/src/assets/images/imgoff.png');
                icon.setAttribute('alt', '未选中');
            } else {
                icon.setAttribute('src', '/src/assets/images/imgon.png');
                icon.setAttribute('alt', '已选中');
            }
        });
    });
}); 