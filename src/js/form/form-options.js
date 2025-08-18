document.addEventListener('DOMContentLoaded', function () {
    // 获取所有选项
    const options = document.querySelectorAll('.form-option');
    options.forEach(option => {
        option.addEventListener('click', function () {
            const img = this.querySelector('.selected-icon');
            if (img) {
                img.classList.toggle('not-selected');
            }
        });
    });
}); 