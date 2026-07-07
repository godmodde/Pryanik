// Общий скрипт всех страниц «Яркий пряник»: тема, меню, корзина, анимации.
(function () {
  'use strict';
  /* ---------- Активная ссылка в шапке ---------- */
  const here = (location.pathname.split('/').pop() || 'index.html') || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here || (here === 'index.html' && href === 'index.html')) a.classList.add('active');
    if (here === 'product.html' && href === 'catalog.html') a.classList.add('active');
  });

  /* ---------- Мобильное меню ---------- */
  const burger = document.getElementById('burger');
  const mnav = document.getElementById('mobileNav');
  function closeMenu() { if (mnav) { mnav.classList.remove('open'); burger && burger.classList.remove('is-open'); document.body.classList.remove('menu-open'); burger && burger.setAttribute('aria-expanded', 'false'); } }
  if (burger && mnav) {
    burger.addEventListener('click', () => {
      const open = mnav.classList.toggle('open');
      burger.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    mnav.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Бейдж корзины ---------- */
  function syncCart() {
    if (!window.YP) return;
    const n = YP.cartCount();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = n;
      el.hidden = n === 0;
    });
  }
  window.addEventListener('yp:cart', () => { syncCart(); bumpCart(); });
  function bumpCart() {
    document.querySelectorAll('.cart-btn').forEach(b => {
      b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    });
  }
  syncCart();

  /* ---------- Добавление в корзину (делегирование) ---------- */
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-add]');
    if (!btn || !window.YP) return;
    e.preventDefault();
    const id = btn.getAttribute('data-add');
    const qty = parseInt(btn.getAttribute('data-qty') || '1', 10);
    YP.cartAdd(id, qty);
    const p = YP.get(id);
    toast(`«${p ? p.name : 'Товар'}» в корзине`);
    if (btn.classList.contains('add')) {
      btn.classList.add('added'); const t = btn.textContent; btn.textContent = 'Добавлено ✓';
      setTimeout(() => { btn.classList.remove('added'); btn.textContent = t; }, 1200);
    }
  });

  /* ---------- Тост ---------- */
  let toastEl, toastTimer;
  window.toast = function (msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  };

  /* ---------- Появление при скролле ---------- */
  function initReveal() {
    const els = [...document.querySelectorAll('.reveal:not(.in)')];
    if (!els.length) return;
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(el => el.classList.add('in')); return;
    }
    const inView = el => { const r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; };
    const io = new IntersectionObserver((ents) => {
      ents.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    // то, что уже видно, показываем сразу — не ждём первый колбэк наблюдателя
    // (после cross-document View Transition он не срабатывает для видимого контента → пустой экран)
    els.forEach(el => { if (inView(el)) el.classList.add('in'); else io.observe(el); });
    // подстраховка на кадр позже — если после перехода что-то осталось скрытым в зоне видимости
    requestAnimationFrame(() => els.forEach(el => {
      if (!el.classList.contains('in') && inView(el)) { el.classList.add('in'); io.unobserve(el); }
    }));
  }
  if (document.readyState !== 'loading') initReveal();
  else document.addEventListener('DOMContentLoaded', initReveal);
  // повторный проход после навигации/возврата из bfcache
  window.addEventListener('pageshow', initReveal);

  /* ---------- Ленивая загрузка видео ---------- */
  function initVideos() {
    const vids = document.querySelectorAll('video.lazy-video');
    if (!vids.length) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = v => {
      if (v.dataset.src && !v.src) v.src = v.dataset.src;
      if (reduce) { v.controls = true; return; }
      const p = v.play(); if (p && p.catch) p.catch(() => { v.controls = true; });
    };
    if (!('IntersectionObserver' in window)) { vids.forEach(start); return; }
    const io = new IntersectionObserver(ents => {
      ents.forEach(en => {
        if (en.isIntersecting) start(en.target);
        else if (!reduce) en.target.pause();
      });
    }, { threshold: 0.25 });
    vids.forEach(v => io.observe(v));
  }
  if (document.readyState !== 'loading') initVideos();
  else document.addEventListener('DOMContentLoaded', initVideos);

  /* ---------- Год в подвале ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();
