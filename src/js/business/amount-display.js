document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.amount-display').forEach(function (display) {
        const amountSpan = display.querySelector('.js-amount');
        const eyeIcon = display.querySelector('.js-eye');
        if (!amountSpan || !eyeIcon) return;

        const realAmount = amountSpan.textContent;
        const dotAmount = '·'.repeat(realAmount.length);
        let visible = true;

        eyeIcon.addEventListener('click', function () {
            visible = !visible;
            if (visible) {
                amountSpan.textContent = realAmount;
                eyeIcon.src = '/src/assets/icons/visible.svg';
                eyeIcon.alt = '查看';
            } else {
                amountSpan.textContent = dotAmount;
                eyeIcon.src = '/src/assets/icons/invisible.svg';
                eyeIcon.alt = '隐藏';
            }
        });
    });
});

// 气泡内容模板（顶部右侧箭头）
const bubbleHtml = `
  <div class="bubble-wrapper bubble-top" style="position:absolute;z-index:9999;">
    <div class="triangle triangle-top triangle-top-right"></div>
    <div class="bubble">这里是气泡提示内容</div>
  </div>
`;

let currentBubble = null;

// 移除原有的静态气泡相关事件
// 新增动态浮层气泡逻辑

document.querySelectorAll('.icon-help').forEach(function(helpIcon) {
  helpIcon.addEventListener('click', function(e) {
    e.stopPropagation();

    // 先移除已有气泡
    if (currentBubble) {
      currentBubble.remove();
      currentBubble = null;
    }

    // 如果已显示则关闭
    if (helpIcon.classList.contains('bubble-open')) {
      helpIcon.classList.remove('bubble-open');
      return;
    }

    // 标记已打开
    helpIcon.classList.add('bubble-open');

    // 创建气泡
    const temp = document.createElement('div');
    temp.innerHTML = bubbleHtml;
    const bubbleNode = temp.firstElementChild;

    // 计算icon位置
    const rect = helpIcon.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

    // 插入到body后再定位
    document.body.appendChild(bubbleNode);
    currentBubble = bubbleNode;

    // 让三角对齐icon右侧，气泡整体在icon下方
    // 这里可根据实际气泡宽度微调
    const bubble = bubbleNode.querySelector('.bubble');
    const bubbleWidth = bubble.offsetWidth || 160;
    // 右对齐icon，并整体向右移动10px，使三角箭头距离气泡右边10px
    // 判断箭头位置，调整top
    let top = rect.bottom + scrollTop + 8; // 默认顶部箭头，下移8px
    if (!bubbleNode.classList.contains('bubble-top')) {
      // 底部箭头，上移8px
      top = rect.top + scrollTop - bubbleNode.offsetHeight - 8;
    }
    bubbleNode.style.left = (rect.right + scrollLeft - bubbleWidth + 10) + 'px';
    bubbleNode.style.top = top + 'px';

    // 阻止冒泡
    bubbleNode.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });
});

document.addEventListener('click', function() {
  if (currentBubble) {
    currentBubble.remove();
    currentBubble = null;
  }
  document.querySelectorAll('.icon-help').forEach(function(icon){
    icon.classList.remove('bubble-open');
  });
}); 