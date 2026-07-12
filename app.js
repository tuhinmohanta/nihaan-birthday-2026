(function () {
  'use strict';

  /* ─────────────────────────────────────
     HERO BACKGROUND SLIDESHOW
  ───────────────────────────────────── */
  var slides      = document.querySelectorAll('.bg-slide');
  var fillEl      = document.getElementById('heroFill');
  var carLabelEl  = document.getElementById('heroCarLabel');
  var DURATION    = 5000;
  var current     = 0;
  var startTs     = null;
  var raf;

  var carNames = [
    'BMW M4 Competition',
    'Lamborghini Revuelto',
    'Ferrari 296 Spider',
    'BMW M8 Competition',
    'Bugatti Chiron',
    'Mercedes-AMG ONE',
    'Bugatti Bolide'
  ];

  function heroGoTo(idx) {
    slides[current].classList.remove('is-active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    if (carLabelEl) carLabelEl.textContent = carNames[current];
    startTs = null;
    if (fillEl) fillEl.style.width = '0%';
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(tick);
  }

  function tick(ts) {
    if (!startTs) startTs = ts;
    var pct = Math.min(((ts - startTs) / DURATION) * 100, 100);
    if (fillEl) fillEl.style.width = pct + '%';
    if (pct >= 100) {
      heroGoTo(current + 1);
    } else {
      raf = requestAnimationFrame(tick);
    }
  }

  if (slides.length) raf = requestAnimationFrame(tick);

  /* ─────────────────────────────────────
     GARAGE CAROUSEL
  ───────────────────────────────────── */
  var track    = document.getElementById('garageTrack');
  var gFill    = document.getElementById('gFill');
  var gCur     = document.getElementById('gCur');
  var prevBtn  = document.getElementById('gPrev');
  var nextBtn  = document.getElementById('gNext');

  if (!track) return;

  var gSlides  = track.querySelectorAll('.garage-slide');
  var gTotal   = gSlides.length;
  var gIdx     = 0;
  var gTimer;
  var G_DUR    = 4000;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function gGoTo(idx) {
    gIdx = (idx + gTotal) % gTotal;
    track.style.transform = 'translateX(-' + (gIdx * 100) + '%)';
    if (gFill) gFill.style.width = (((gIdx + 1) / gTotal) * 100) + '%';
    if (gCur)  gCur.textContent  = pad(gIdx + 1);
  }

  function gNext() { gGoTo(gIdx + 1); }
  function gPrev() { gGoTo(gIdx - 1); }

  function startAuto()  { gTimer = setInterval(gNext, G_DUR); }
  function resetAuto()  { clearInterval(gTimer); startAuto(); }

  if (prevBtn) prevBtn.addEventListener('click', function () { gPrev(); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { gNext(); resetAuto(); });

  /* touch swipe */
  var tx0 = 0;
  track.addEventListener('touchstart', function (e) { tx0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   function (e) {
    var d = tx0 - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) { d > 0 ? gNext() : gPrev(); resetAuto(); }
  }, { passive: true });

  gGoTo(0);
  startAuto();

  /* ─────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────── */
  var revEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revEls.forEach(function (el) { obs.observe(el); });
  } else {
    revEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

})();
