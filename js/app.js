/* ============================================================
   anydoc — app.js
   职责：移动端导航、滚动导航态、滚动入场、计数器、
        跑马灯复制、Tab 切换、代码复制、页脚年份。
   全部遵循 prefers-reduced-motion。
   ============================================================ */

(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.nav-burger');
  var navLinks = document.querySelector('.nav-links');

  /* ---------- 移动端导航 ---------- */
  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navLinks.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 滚动：导航吸顶态 ---------- */
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 滚动入场（IntersectionObserver） ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 数字计数器（数据饰带） ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var spec = el.getAttribute('data-decimals');
    var decimals = spec ? spec.length - 1 : (String(target).split('.')[1] || '').length;
    var dur = 1100;
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !prefersReduced) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  /* ---------- 跑马灯：复制内容实现无缝循环 ---------- */
  var track = document.querySelector('.marquee-track');
  if (track) {
    var content = track.innerHTML;
    track.innerHTML = content + content;
    track.setAttribute('aria-hidden', 'false');
    if (prefersReduced) {
      track.style.animation = 'none';
    }
  }

  /* ---------- Tab 切换 ---------- */
  var tabs = document.querySelectorAll('.tab');
  var panes = document.querySelectorAll('.code-pane');
  var copyBtn = document.querySelector('.copy-btn');
  var fnameEl = document.querySelector('#shell-fname');
  var paneTitles = {
    cli: 'report.docx — stdout',
    node: 'node/index.mjs',
    python: 'main.py',
    rust: 'main.rs',
    skill: 'npx skills add firecrawl/anydoc'
  };
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.getAttribute('data-tab');
      tabs.forEach(function (t) {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panes.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      var target = document.getElementById('pane-' + key);
      if (target) target.classList.add('active');
      if (copyBtn) copyBtn.setAttribute('data-copy', 'pane-' + key);
      if (fnameEl && paneTitles[key]) fnameEl.textContent = paneTitles[key];
    });
  });

  /* ---------- 代码复制 ---------- */
  var copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-copy');
      var pane = document.getElementById(id);
      if (!pane) return;
      var text = pane.querySelector('code');
      if (!text) return;
      var raw = text.innerText;
      var done = function () {
        var old = btn.textContent;
        btn.textContent = '已复制';
        btn.classList.add('copied');
        setTimeout(function () {
          btn.textContent = old;
          btn.classList.remove('copied');
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(raw).then(done, function () { fallbackCopy(raw, done); });
      } else {
        fallbackCopy(raw, done);
      }
    });
  });
  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  /* ---------- 页脚年份 ---------- */
  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
