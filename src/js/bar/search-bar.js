// search-bar.js - 搜索栏交互脚本

document.addEventListener('DOMContentLoaded', function() {
    // 获取所有搜索输入框
    const searchInputs = document.querySelectorAll('.search-input');
    
    // 为每个搜索输入框添加事件监听
    searchInputs.forEach(input => {
        // 获取最近的搜索框父元素
        const searchBox = input.closest('.search-box');
        const clearBtn = searchBox.querySelector('.clear-btn');
        
        // 初始检查输入框是否有内容
        if (input.value.trim() !== '') {
            searchBox.classList.add('has-text');
        } else {
            searchBox.classList.remove('has-text');
        }
        
        // 当输入内容变化时检查是否显示清除按钮
        input.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                searchBox.classList.add('has-text');
            } else {
                searchBox.classList.remove('has-text');
            }
        });
        
        // 为清除按钮添加点击事件
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                input.value = '';
                searchBox.classList.remove('has-text');
                input.focus(); // 保持焦点在输入框
            });
        }
    });
}); 