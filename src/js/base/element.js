// element.html 相关交互脚本
// 标签选择按钮（可单独切换选中/取消，不影响其他按钮）

document.addEventListener('DOMContentLoaded', function() {
  // 单行文本选项按钮
  const singleOptionButtons = document.querySelectorAll('.option-button.single-option');
  singleOptionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('selected');
    });
  });

  // 双行文本选项按钮
  const doubleOptionButtons = document.querySelectorAll('.option-button.double-option');
  doubleOptionButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      this.classList.toggle('selected');
    });
  });

  // 所有 .form-option 选项统一切换选中状态
  document.querySelectorAll('.form-option').forEach(function(option) {
    option.addEventListener('click', function() {
      const icon = this.querySelector('.selected-icon');
      if (icon) {
        icon.classList.toggle('not-selected');
      }
    });
  });

  // 折叠器-带文字和图标 切换展开/收起
  const accordionToggleList = document.querySelectorAll('.accordion-header.with-text');
  accordionToggleList.forEach(header => {
    header.addEventListener('click', function() {
      const title = this.querySelector('.accordion-title');
      const icon = this.querySelector('.accordion-badge');
      const isExpanded = icon.getAttribute('src').includes('expand');
      if (isExpanded) {
        // 切换为收起
        icon.setAttribute('src', '/src/assets/images/retract.png');
        icon.setAttribute('alt', '收起');
        if (title) title.textContent = '内容收起';
      } else {
        // 切换为展开
        icon.setAttribute('src', '/src/assets/images/expand.png');
        icon.setAttribute('alt', '展开');
        if (title) title.textContent = '内容展开';
      }
    });
  });

  // 没有文字的折叠器 切换展开/收起
  const accordionIconList = document.querySelectorAll('.accordion-header:not(.with-text)');
  accordionIconList.forEach(header => {
    header.addEventListener('click', function() {
      const icon = this.querySelector('.accordion-icon');
      if (!icon) return;
      const isExpanded = icon.getAttribute('src').includes('expand');
      if (isExpanded) {
        icon.setAttribute('src', '/src/assets/images/retract.png');
        icon.setAttribute('alt', '收起');
      } else {
        icon.setAttribute('src', '/src/assets/images/expand.png');
        icon.setAttribute('alt', '展开');
      }
    });
  });

  // 金额输入框大写金额显示
  function numberToChineseMoney(num) {
    if (!num || isNaN(num)) return '';
    const fraction = ['角', '分'];
    const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
    let head = num < 0 ? '负' : '';
    num = Math.abs(num);

    let s = '';
    for (let i = 0; i < fraction.length; i++) {
      s += (digit[Math.floor(num * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
    }
    s = s || '整';
    num = Math.floor(num);

    for (let i = 0; i < unit[0].length && num > 0; i++) {
      let p = '';
      for (let j = 0; j < unit[1].length && num > 0; j++) {
        p = digit[num % 10] + unit[1][j] + p;
        num = Math.floor(num / 10);
      }
      s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
    }
    return head + s.replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整');
  }

  document.querySelectorAll('.form-money-item').forEach(function(item) {
    const input = item.querySelector('.currency-input input');
    const amountInWords = item.querySelector('.amount-in-words');
    let timer = null;
    if (input && amountInWords) {
      input.addEventListener('input', function() {
        clearTimeout(timer);
        const val = this.value.replace(/,/g, '');
        amountInWords.textContent = numberToChineseMoney(val);
        // 3秒后自动补全
        timer = setTimeout(() => {
          autoCompleteDecimal(input);
        }, 3000);
      });
      input.addEventListener('blur', function() {
        clearTimeout(timer);
        autoCompleteDecimal(input);
      });
      // 初始化时也显示一次
      amountInWords.textContent = numberToChineseMoney(input.value.replace(/,/g, ''));
    }
  });

  function autoCompleteDecimal(input) {
    let val = input.value.replace(/,/g, '');
    if (val && /^\d+(\.\d{0,2})?$/.test(val)) {
      if (!val.includes('.')) {
        val = val + '.00';
      } else {
        const parts = val.split('.');
        if (parts[1].length === 1) {
          val = parts[0] + '.' + parts[1] + '0';
        } else if (parts[1].length === 0) {
          val = parts[0] + '.00';
        }
      }
      input.value = val;
    }
  }

  // 验证码获取按钮交互（仅两种状态：获取验证码、倒计时）
  document.querySelectorAll('.input-verification-item').forEach(function(item) {
    const btn = item.querySelector('.get-code-button');
    if (!btn) return;
    let timer = null;
    let count = 60;
    function setState(state) {
      if (state === 'default') {
        btn.textContent = '获取验证码';
        btn.classList.remove('countdown');
        btn.style.pointerEvents = 'auto';
        btn.style.color = '';
      } else if (state === 'countdown') {
        btn.classList.add('countdown');
        btn.style.pointerEvents = 'none';
        btn.style.color = '';
      }
    }
    function startCountdown() {
      count = 60;
      setState('countdown');
      btn.textContent = count + 's';
      timer = setInterval(function() {
        count--;
        if (count > 0) {
          btn.textContent = count + 's';
        } else {
          clearInterval(timer);
          setState('default');
        }
      }, 1000);
    }
    // 默认状态
    setState('default');
    btn.addEventListener('click', function() {
      if (btn.classList.contains('countdown')) return;
      startCountdown();
    });
  });

  // 独立验证码输入框交互（与普通验证码一致）
  document.querySelectorAll('.verification-standalone-item').forEach(function(item) {
    const btn = item.querySelector('.get-code-button');
    if (!btn) return;
    let timer = null;
    let count = 60;
    function setState(state) {
      if (state === 'default') {
        btn.textContent = '获取验证码';
        btn.classList.remove('countdown');
        btn.style.pointerEvents = 'auto';
        btn.style.color = '';
      } else if (state === 'countdown') {
        btn.classList.add('countdown');
        btn.style.pointerEvents = 'none';
        btn.style.color = '';
      }
    }
    function startCountdown() {
      count = 60;
      setState('countdown');
      btn.textContent = count + 's';
      timer = setInterval(function() {
        count--;
        if (count > 0) {
          btn.textContent = count + 's';
        } else {
          clearInterval(timer);
          setState('default');
        }
      }, 1000);
    }
    // 默认状态
    setState('default');
    btn.addEventListener('click', function() {
      if (btn.classList.contains('countdown')) return;
      startCountdown();
    });
  });

  // 带下拉箭头的一般提示 展开/收起交互（增强：仅文本超一行时才显示icon和展开功能）
  document.querySelectorAll('.collapsible-tip').forEach(function(collapsibleTip) {
    var tipContent = collapsibleTip.querySelector('.tip-content-gray');
    var tipIcon = collapsibleTip.querySelector('.tip-toggle-icon');
    var collapsedIcon = '/src/assets/images/expands.png';
    var expandedIcon = '/src/assets/images/retracts.png';
    if (!tipContent || !tipIcon) return;

    // 判断文本是否超出一行
    function isOverflowing(element) {
      return element.scrollWidth > element.clientWidth;
    }

    // 初始判断
    if (isOverflowing(tipContent)) {
      tipIcon.style.display = '';
      collapsibleTip.classList.remove('expanded');
      tipIcon.src = collapsedIcon;
      // 展开/收起事件
      collapsibleTip.addEventListener('click', function (e) {
        // 避免点击icon时选中文字
        e.preventDefault();
        var expanded = collapsibleTip.classList.toggle('expanded');
        if (expanded) {
          tipContent.style.whiteSpace = 'normal';
          tipIcon.src = expandedIcon;
        } else {
          tipContent.style.whiteSpace = 'nowrap';
          tipIcon.src = collapsedIcon;
        }
      });
      // 默认收起
      tipContent.style.whiteSpace = 'nowrap';
    } else {
      // 不超一行，隐藏icon，移除展开功能
      tipIcon.style.display = 'none';
      tipContent.style.whiteSpace = 'nowrap';
      // 移除点击事件（如有）
      var newElem = collapsibleTip.cloneNode(true);
      collapsibleTip.parentNode.replaceChild(newElem, collapsibleTip);
    }
  });

  // 密码输入框自动切换焦点
  document.querySelectorAll('.password-dots-container').forEach(function(container) {
    const inputs = container.querySelectorAll('.password-dots-row input[type="password"]');
    inputs.forEach((input, idx) => {
      input.addEventListener('input', function(e) {
        // 只允许输入一个字符
        if (this.value.length > 1) {
          this.value = this.value.slice(0, 1);
        }
        // 自动跳到下一个输入框
        if (this.value && idx < inputs.length - 1) {
          inputs[idx + 1].focus();
        }
      });
      // 支持退格自动回到上一个
      input.addEventListener('keydown', function(e) {
        if ((e.key === 'Backspace' || e.keyCode === 8) && !this.value && idx > 0) {
          inputs[idx - 1].focus();
        }
      });
    });
  });

  // ====== 滚动选择器交互逻辑（来自scroll-picker.js） ======
  document.querySelectorAll('.date-column').forEach(column => {
    // 动态插入首尾占位项
    const items = Array.from(column.querySelectorAll('.date-item'));
    if (items.length > 0) {
      // 计算可见区域能容纳多少个item
      const itemHeight = items[0].offsetHeight || 32; // 兜底高度
      const columnHeight = column.offsetHeight || (itemHeight * 5); // 兜底5个
      const visibleCount = Math.round(columnHeight / itemHeight);
      const placeholderCount = Math.floor(visibleCount / 2);
      // 插入前置占位
      for (let i = 0; i < placeholderCount; i++) {
        const placeholder = document.createElement('div');
        placeholder.className = 'date-item placeholder';
        placeholder.style.visibility = 'hidden';
        column.insertBefore(placeholder, column.firstChild);
      }
      // 插入后置占位
      for (let i = 0; i < placeholderCount; i++) {
        const placeholder = document.createElement('div');
        placeholder.className = 'date-item placeholder';
        placeholder.style.visibility = 'hidden';
        column.appendChild(placeholder);
      }
    }
    // 鼠标/触摸拖动滚动
    let isDown = false;
    let startY, scrollTop;

    // 阻止选中文字
    column.addEventListener('selectstart', e => e.preventDefault());

    // 鼠标事件
    column.addEventListener('mousedown', function(e) {
      isDown = true;
      column.classList.add('dragging');
      startY = e.pageY - column.offsetTop;
      scrollTop = column.scrollTop;
      column.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', function(e) {
      if (!isDown) return;
      const y = e.pageY - column.offsetTop;
      const walk = y - startY;
      column.scrollTop = scrollTop - walk;
    });
    document.addEventListener('mouseup', function() {
      isDown = false;
      column.classList.remove('dragging');
      column.style.cursor = '';
    });

    // 触摸事件
    column.addEventListener('touchstart', function(e) {
      isDown = true;
      startY = e.touches[0].pageY - column.offsetTop;
      scrollTop = column.scrollTop;
    });
    column.addEventListener('touchmove', function(e) {
      if (!isDown) return;
      const y = e.touches[0].pageY - column.offsetTop;
      const walk = y - startY;
      column.scrollTop = scrollTop - walk;
    });
    column.addEventListener('touchend', function() {
      isDown = false;
    });

    // 滚动时高亮最近的项
    column.addEventListener('scroll', function() {
      const items = Array.from(column.querySelectorAll('.date-item'));
      const columnRect = column.getBoundingClientRect();
      const centerY = columnRect.top + columnRect.height / 2;
      let minDist = Infinity, selectedIdx = 0;
      items.forEach((item, idx) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const dist = Math.abs(centerY - itemCenter);
        if (dist < minDist) {
          minDist = dist;
          selectedIdx = idx;
        }
      });
      items.forEach((item, idx) => {
        item.classList.toggle('selected', idx === selectedIdx);
      });
      // 新增：派发自定义事件
      const columnIndex = Array.from(column.parentNode.children).indexOf(column);
      const value = items[selectedIdx].textContent;
      column.dispatchEvent(new CustomEvent('columnChange', {
        detail: {
          columnIndex,
          value
        }
      }));
    });

    // 吸附到最近的item
    column.addEventListener('scrollend', function() {
      const items = Array.from(column.querySelectorAll('.date-item'));
      const columnRect = column.getBoundingClientRect();
      const centerY = columnRect.top + columnRect.height / 2;
      let minDist = Infinity, selectedIdx = 0;
      items.forEach((item, idx) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2;
        const dist = Math.abs(centerY - itemCenter);
        if (dist < minDist) {
          minDist = dist;
          selectedIdx = idx;
        }
      });
      items[selectedIdx].scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // 兼容性处理：scrollend 事件在部分浏览器不支持，可用定时器模拟
    let scrollTimer = null;
    column.addEventListener('scroll', function() {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        column.dispatchEvent(new Event('scrollend'));
      }, 100);
    });

    // 初始化时自动滚动到选中项
    const selected = column.querySelector('.date-item.selected');
    if (selected) {
      selected.scrollIntoView({block: 'center'});
    }
  });
}); 