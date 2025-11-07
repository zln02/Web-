// js/nav.js
// 페이지 순서 정의
const ORDER = ['particles', 'deep-space', 'cube'];
const HOME = '/';

// GSAP 로드 (없으면 CDN 자동 추가)
if (!window.gsap) {
  const script = document.createElement("script");
  script.src = "https://unpkg.com/gsap@3/dist/gsap.min.js";
  document.head.appendChild(script);
}

function currentPage() {
  const path = window.location.pathname.replace(/\/+$/, '');
  const parts = path.split('/');
  const folder = parts[parts.length - 2] || '';
  return ORDER.includes(folder) ? folder : '';
}

function nextPage(dir) {
  const cur = currentPage();
  if (!cur) return dir === 'next' ? ORDER[0] : ORDER[ORDER.length - 1];
  const i = ORDER.indexOf(cur);
  const n = ORDER.length;
  const nextIdx = dir === 'next' ? (i + 1) % n : (i - 1 + n) % n;
  return ORDER[nextIdx];
}

function go(dir) {
  const target = nextPage(dir);
  const isSub = !!currentPage();
  const href = target
    ? (isSub ? `../${target}/index.html` : `./${target}/index.html`)
    : (isSub ? '../index.html' : './index.html');

  const transition = document.createElement("div");
  transition.className = "page-transition";
  document.body.appendChild(transition);

  // GSAP 애니메이션 실행
  gsap.set(transition, { scaleY: 0, transformOrigin: "top", opacity: 1 });
  gsap.to(transition, {
    scaleY: 1,
    duration: 0.5,
    ease: "power2.inOut",
    onComplete: () => {
      window.location.href = href;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector('.nav-icon.left')?.addEventListener('click', () => go('prev'));
  document.querySelector('.nav-icon.right')?.addEventListener('click', () => go('next'));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go('prev');
    if (e.key === 'ArrowRight') go('next');
  });
});

// 페이지 진입 애니메이션
window.addEventListener("pageshow", () => {
  const overlay = document.createElement("div");
  overlay.className = "page-transition fade-out";
  document.body.appendChild(overlay);
  gsap.set(overlay, { scaleY: 1, transformOrigin: "bottom", opacity: 1 });
  gsap.to(overlay, {
    scaleY: 0,
    duration: 0.5,
    ease: "power2.inOut",
    onComplete: () => overlay.remove()
  });
});
