const cards = document.querySelectorAll('.portfolio-card');
let introFinished = false; // 開場動畫狀態鎖

// 1. 初始化每張卡片的功能與狀態
const cardsData = Array.from(cards).map(card => {
  const thumbs = card.querySelectorAll('.thumb-btn');
  const imgs = card.querySelectorAll('.image-viewer img');
  let currentIndex = 0;
  
  // 🌟 新增：這張卡片是否已經被手動點擊過（被終止自動輪播）
  let isManuallyStopped = false; 

  // 切換圖片功能
  function switchImage(index) {
    if (index < 0 || index >= thumbs.length) return;
    thumbs.forEach(t => t.classList.remove('active'));
    imgs.forEach(img => img.classList.remove('active'));
    
    thumbs[index].classList.add('active');
    imgs[index].classList.add('active');
    currentIndex = index;
  }

  // 點擊縮圖切換
  thumbs.forEach((thumb, index) => {
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      isManuallyStopped = true; // 🌟 使用者點擊了！永久終止這張卡片的自動輪播
      switchImage(index);
    });
  });

  // 回傳這張卡片專屬的操作方法與狀態給全域計時器使用
  return {
    element: card,
    next: () => {
      let nextIndex = (currentIndex + 1) % thumbs.length;
      switchImage(nextIndex);
    },
    // 讓外部計時器可以檢查這張卡片是否已經被終止
    isStopped: () => isManuallyStopped 
  };
});

// 2. 設定全域統一計時器 (Master Timer)
setInterval(() => {
  if (!introFinished) return; // 如果開場動畫還沒完，就不做事
  cardsData.forEach(cardData => {
    if (!cardData.isStopped() && !cardData.element.matches(':hover')) {
      cardData.next();
    }
  });
}, 2500);
setTimeout(() => {
  introFinished = true;
  document.body.classList.remove('no-scroll');
  const container = document.querySelector('.intro-container');
  const svgFilter = document.querySelector('svg[style*="position: absolute"]');
  if (container) container.remove();
  if (svgFilter) svgFilter.remove();
}, 3300);