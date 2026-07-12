(function () {
  'use strict';

  /* ─────────────────────────────────────
     CAR DATA
  ───────────────────────────────────── */
  var carData = [
    { brand: 'BMW',          name: 'M4 Competition',  hp: '503',   sprint: '3.9s', top: '290', engine: 'Twin-Turbo<br>6-Cyl' },
    { brand: 'Lamborghini',  name: 'Revuelto',        hp: '1,001', sprint: '2.5s', top: '350', engine: 'V12<br>Hybrid' },
    { brand: 'Ferrari',      name: '296 Spider',      hp: '830',   sprint: '2.9s', top: '330', engine: 'V6<br>Plug-in' },
    { brand: 'BMW',          name: 'M8 Competition',  hp: '617',   sprint: '3.3s', top: '305', engine: 'V8<br>xDrive' },
    { brand: 'Bugatti',      name: 'Chiron',          hp: '1,479', sprint: '2.4s', top: '420', engine: 'W16<br>Quad-Turbo' },
    { brand: 'Mercedes-AMG', name: 'AMG ONE',         hp: '1,063', sprint: '2.9s', top: '352', engine: 'F1 Hybrid<br>V6' },
    { brand: 'Bugatti',      name: 'Bolide',          hp: '1,825', sprint: '2.2s', top: '500', engine: 'Track-Only<br>Beast' }
  ];

  /* ─────────────────────────────────────
     CAR PANEL UPDATE
  ───────────────────────────────────── */
  var panelInner = document.getElementById('carPanelInner');
  var cpBrand    = document.getElementById('cpBrand');
  var cpName     = document.getElementById('cpName');
  var cpHp       = document.getElementById('cpHp');
  var cpSprint   = document.getElementById('cpSprint');
  var cpTop      = document.getElementById('cpTop');
  var cpEngine   = document.getElementById('cpEngine');

  function updatePanel(data) {
    if (!panelInner) return;
    panelInner.classList.add('is-fading');
    setTimeout(function () {
      if (cpBrand)  cpBrand.textContent  = data.brand;
      if (cpName)   cpName.textContent   = data.name;
      if (cpHp)     cpHp.textContent     = data.hp;
      if (cpSprint) cpSprint.textContent = data.sprint;
      if (cpTop)    cpTop.textContent    = data.top;
      if (cpEngine) cpEngine.innerHTML   = data.engine;
      panelInner.classList.remove('is-fading');
    }, 300);
  }

  /* ─────────────────────────────────────
     HERO BACKGROUND SLIDESHOW
  ───────────────────────────────────── */
  var slides   = document.querySelectorAll('.bg-slide');
  var fillEl   = document.getElementById('heroFill');
  var DURATION = 5000;
  var current  = 0;
  var startTs  = null;
  var raf;

  function heroGoTo(idx) {
    slides[current].classList.remove('is-active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    updatePanel(carData[current]);
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
  var track   = document.getElementById('garageTrack');
  var gFill   = document.getElementById('gFill');
  var gCur    = document.getElementById('gCur');
  var prevBtn = document.getElementById('gPrev');
  var nextBtn = document.getElementById('gNext');

  if (!track) return;

  var gSlides = track.querySelectorAll('.garage-slide');
  var gTotal  = gSlides.length;
  var gIdx    = 0;
  var gTimer;
  var G_DUR   = 4000;

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function gGoTo(idx) {
    gIdx = (idx + gTotal) % gTotal;
    track.style.transform = 'translateX(-' + (gIdx * 100) + '%)';
    if (gFill) gFill.style.width = (((gIdx + 1) / gTotal) * 100) + '%';
    if (gCur)  gCur.textContent  = pad(gIdx + 1);
  }

  function gNext() { gGoTo(gIdx + 1); }
  function gPrev() { gGoTo(gIdx - 1); }

  function startAuto() { gTimer = setInterval(gNext, G_DUR); }
  function resetAuto() { clearInterval(gTimer); startAuto(); }

  if (prevBtn) prevBtn.addEventListener('click', function () { gPrev(); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { gNext(); resetAuto(); });

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
