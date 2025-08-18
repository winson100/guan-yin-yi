// carousel.js - 轮播图组件相关交互脚本

document.addEventListener('DOMContentLoaded', function() {
  // 添加条状轮播器样式
  addBarCarouselStyles();
  
  // 判断并修复条状轮播器结构
  fixBarCarouselStructure();
  
  // 初始化所有轮播图组件
  initCarousels();
  
  /**
   * 添加条状轮播器样式
   */
  function addBarCarouselStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* 条状轮播器样式补充 */
      .carousel-bars {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 100px;
          height: 3px;
          background-color: rgba(255, 255, 255, 0.4);
          border-radius: 1.5px;
          overflow: hidden;
      }
      
      .carousel-bar {
          position: absolute;
          width: 14px;
          height: 100%;
          background-color: #fff;
          border-radius: 1.5px;
          transition: transform 0.3s ease-in-out;
      }
      
      /* 位置：第一张图片 */
      .carousel-bar.position-0 {
          transform: translateX(0%);
      }
      
      /* 位置：第二张图片 */
      .carousel-bar.position-1 {
          transform: translateX(calc(100px - 14px));
      }
    `;
    document.head.appendChild(style);
  }
  
  /**
   * 判断并修复条状轮播器结构
   */
  function fixBarCarouselStructure() {
    const barContainers = document.querySelectorAll('.carousel-bars');
    barContainers.forEach(container => {
      // 如果有多个.carousel-bar，保留第一个，删除其他的
      const bars = container.querySelectorAll('.carousel-bar');
      if (bars.length > 1) {
        // 保留第一个
        const firstBar = bars[0];
        // 删除其他的
        for (let i = 1; i < bars.length; i++) {
          container.removeChild(bars[i]);
        }
        
        // 给第一个添加位置类
        firstBar.classList.remove('active');
        firstBar.classList.add('position-0');
      } else if (bars.length === 1) {
        // 已经只有一个，添加位置类
        bars[0].classList.remove('active');
        bars[0].classList.add('position-0');
      }
    });
  }
  
  /**
   * 初始化所有轮播图组件
   */
  function initCarousels() {
    // 获取所有轮播图容器
    const smallCarousels = document.querySelectorAll('.carousel-container-small');
    const largeCarousels = document.querySelectorAll('.carousel-container-larger');
    const barCarousels = document.querySelectorAll('.carousel-content');
    
    // 初始化小型轮播图
    smallCarousels.forEach(carousel => {
      initCarousel(carousel, 'dots');
    });
    
    // 初始化大型轮播图
    largeCarousels.forEach(carousel => {
      initCarousel(carousel, 'dots');
    });
    
    // 初始化条状轮播图
    barCarousels.forEach(carousel => {
      if (carousel.querySelector('.carousel-bars')) {
        initCarousel(carousel, 'bar');
      }
    });
  }
  
  /**
   * 初始化单个轮播图
   * @param {HTMLElement} carouselContainer - 轮播图容器元素
   * @param {string} type - 轮播图类型，'dots'或'bar'
   */
  function initCarousel(carouselContainer, type) {
    // 获取轮播图内容区域
    const contentArea = carouselContainer.querySelector('.dark-gray-area, .white-area') || 
                        carouselContainer.querySelector('.carousel-content');
    if (!contentArea) return;
    
    // 获取所有图片
    const imageContainer = contentArea.querySelector('div') || contentArea;
    const images = imageContainer.querySelectorAll('img');
    
    // 阻止图片被拖拽
    images.forEach(img => {
      img.addEventListener('dragstart', e => e.preventDefault());
    });
    
    // 如果没有图片，退出初始化
    if (images.length <= 0) return;
    
    // 如果是条状轮播图，设置指示器宽度
    if (type === 'bar') {
      setupBarIndicator(carouselContainer, images.length);
    }
    
    // 根据类型获取指示器
    let indicators = [];
    if (type === 'dots') {
      indicators = carouselContainer.querySelectorAll('.carousel-dot');
      if (indicators.length <= 0) return;
    } else if (type === 'bar') {
      const bar = carouselContainer.querySelector('.carousel-bar');
      if (!bar) return;
    }
    
    // 确保其他图片都隐藏，只显示第一张
    images.forEach((img, i) => {
      if (i === 0) {
        img.style.display = 'block';
      } else {
        img.style.display = 'none';
      }
    });
    
    // 如果只有一张图片，不需要轮播
    if (images.length <= 1) {
      if (type === 'dots' && indicators.length > 0) {
        indicators[0].classList.add('active');
      }
      return;
    }
    
    // 确保只有第一个指示器处于激活状态（点状指示器）
    if (type === 'dots') {
      indicators.forEach((indicator, i) => {
        if (i === 0) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }
    
    let currentIndex = 0;
    const intervalTime = 3000;
    let autoPlayTimer = null;
    
    // 切换到指定索引的图片
    function showImage(index) {
      // 先隐藏所有图片
      images.forEach(img => {
        img.style.display = 'none';
      });
      
      // 显示当前索引的图片
      if (images[index]) {
        images[index].style.display = 'block';
      }
      
      // 更新指示器状态
      if (type === 'dots') {
        // 点状指示器：激活当前索引对应的指示点
        indicators.forEach((indicator, i) => {
          if (i === index) {
            indicator.classList.add('active');
          } else {
            indicator.classList.remove('active');
          }
        });
      } else if (type === 'bar') {
        // 条状指示器：移动指示条到对应位置
        const bar = carouselContainer.querySelector('.carousel-bar');
        if (bar) {
          updateBarPosition(bar, index, images.length);
        }
      }
      
      currentIndex = index;
    }
    
    // 切换到下一张图片
    function nextImage() {
      let nextIndex = (currentIndex + 1) % images.length;
      showImage(nextIndex);
    }
    
    // 切换到上一张图片
    function prevImage() {
      let prevIndex = (currentIndex - 1 + images.length) % images.length;
      showImage(prevIndex);
    }
    
    // 开始自动轮播
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(nextImage, intervalTime);
    }
    
    // 停止自动轮播
    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }
    
    // 为点状指示器添加点击事件
    if (type === 'dots') {
      indicators.forEach((indicator, i) => {
        indicator.addEventListener('click', () => {
          showImage(i);
          // 点击后重置自动轮播
          stopAutoPlay();
          startAutoPlay();
        });
      });
    }
    
    // 移动端触摸事件
    let startX = 0;
    let endX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopAutoPlay();
    });
    
    carouselContainer.addEventListener('touchmove', (e) => {
      endX = e.touches[0].clientX;
    });
    
    carouselContainer.addEventListener('touchend', () => {
      const threshold = 50;
      if (startX - endX > threshold) {
        // 左滑，下一张
        nextImage();
      } else if (endX - startX > threshold) {
        // 右滑，上一张
        prevImage();
      }
      startAutoPlay();
    });
    
    // ====== 新增：PC端鼠标拖拽横滑切换 ======
    let isMouseDown = false;
    let mouseStartX = 0;
    let mouseMoveX = 0;
    
    carouselContainer.addEventListener('mousedown', (e) => {
      isMouseDown = true;
      mouseStartX = e.clientX;
      stopAutoPlay();
    });
    carouselContainer.addEventListener('mousemove', (e) => {
      if (!isMouseDown) return;
      mouseMoveX = e.clientX;
    });
    carouselContainer.addEventListener('mouseup', (e) => {
      if (!isMouseDown) return;
      const deltaX = mouseMoveX - mouseStartX;
      const threshold = 40;
      if (Math.abs(deltaX) > threshold) {
        if (deltaX < 0) {
          nextImage();
        } else {
          prevImage();
        }
      }
      isMouseDown = false;
      startAutoPlay();
    });
    carouselContainer.addEventListener('mouseleave', (e) => {
      if (!isMouseDown) return;
      isMouseDown = false;
      startAutoPlay();
    });
    
    // 启动自动轮播
    startAutoPlay();
  }
  
  /**
   * 设置条状指示器
   * @param {HTMLElement} container - 轮播图容器元素
   * @param {number} imageCount - 图片数量
   */
  function setupBarIndicator(container, imageCount) {
    const barsContainer = container.querySelector('.carousel-bars');
    if (!barsContainer) return;
    
    // 条状指示器相关尺寸
    const barWidth = 14; // 单个指示器宽度
    
    // 根据图片数量计算容器宽度
    const containerWidth = Math.max(imageCount * barWidth, barWidth);
    
    // 设置容器样式
    barsContainer.style.width = containerWidth + 'px';
    barsContainer.style.height = '3px';
    barsContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
    barsContainer.style.borderRadius = '1.5px';
    barsContainer.style.overflow = 'hidden';
    
    // 获取并设置指示器元素样式
    const bar = barsContainer.querySelector('.carousel-bar');
    if (bar) {
      // 清除可能的位置类
      bar.className = 'carousel-bar';
      
      // 设置指示器样式
      bar.style.position = 'absolute';
      bar.style.width = barWidth + 'px';
      bar.style.height = '100%';
      bar.style.backgroundColor = '#fff';
      bar.style.borderRadius = '1.5px';
      bar.style.transition = 'transform 0.3s ease-in-out';
      bar.style.transform = 'translateX(0)';
    }
  }
  
  /**
   * 更新条状指示器位置
   * @param {HTMLElement} barElement - 条状指示器元素
   * @param {number} index - 当前图片索引
   * @param {number} totalImages - 图片总数
   */
  function updateBarPosition(barElement, index, totalImages) {
    if (!barElement) return;
    
    const barWidth = 14; // 单个指示器宽度
    const translateX = index * barWidth;
    
    barElement.style.transform = `translateX(${translateX}px)`;
  }
});