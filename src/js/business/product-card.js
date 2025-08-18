document.addEventListener('DOMContentLoaded', function () {
  var carousel = document.querySelector('.carousel-container .carousel-track');
  if (!carousel) return;

  var cardContainer = carousel.querySelector('.card-container');
  var cards = cardContainer.querySelectorAll('.card-wrapper');
  var indicators = carousel.querySelectorAll('.indicator-dot');
  var current = 0;
  var startX = 0;
  var moveX = 0;
  var isMoving = false;
  var autoTimer = null;

  // 设置容器宽度
  cardContainer.style.width = (cards.length * 100) + '%';
  cards.forEach(function (card) {
    card.style.width = (100 / cards.length) + '%';
  });

  function showCard(idx) {
    cardContainer.style.transform = 'translateX(' + (-idx * 100 / cards.length) + '%)';
    indicators.forEach(function (dot, i) {
      dot.classList.toggle('active', i === idx);
    });
    current = idx;
  }

  function nextCard() {
    var next = (current + 1) % cards.length;
    showCard(next);
  }

  function prevCard() {
    var prev = (current - 1 + cards.length) % cards.length;
    showCard(prev);
  }

  function startAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(nextCard, 5000);
  }

  function stopAutoPlay() {
    if (autoTimer) clearInterval(autoTimer);
  }

  // 绑定指示点点击
  indicators.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      showCard(i);
      stopAutoPlay();
      startAutoPlay();
    });
  });

  // 触摸事件
  cardContainer.addEventListener('touchstart', function (e) {
    if (!e.touches || e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    isMoving = true;
    stopAutoPlay();
  });
  cardContainer.addEventListener('touchmove', function (e) {
    if (!isMoving || !e.touches || e.touches.length !== 1) return;
    moveX = e.touches[0].clientX;
  });
  cardContainer.addEventListener('touchend', function (e) {
    if (!isMoving) return;
    var deltaX = moveX - startX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) nextCard();
      else prevCard();
    }
    isMoving = false;
    startAutoPlay();
  });

  // 鼠标拖拽事件（PC端）
  cardContainer.addEventListener('mousedown', function (e) {
    isMoving = true;
    startX = e.clientX;
    stopAutoPlay();
  });
  cardContainer.addEventListener('mousemove', function (e) {
    if (!isMoving) return;
    moveX = e.clientX;
  });
  cardContainer.addEventListener('mouseup', function (e) {
    if (!isMoving) return;
    var deltaX = moveX - startX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) nextCard();
      else prevCard();
    }
    isMoving = false;
    startAutoPlay();
  });
  cardContainer.addEventListener('mouseleave', function (e) {
    if (!isMoving) return;
    isMoving = false;
    startAutoPlay();
  });

  // 初始化
  showCard(0);
  startAutoPlay();
});
