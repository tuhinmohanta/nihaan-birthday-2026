(function () {
  var track = document.getElementById('carouselTrack');
  var slides = track.querySelectorAll('.car-slide');
  var dotsWrap = document.getElementById('carouselDots');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var total = slides.length;
  var current = 0;
  var timer;

  // Build dots
  var dots = [];
  for (var i = 0; i < total; i++) {
    var dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.setAttribute('data-index', i);
    dotsWrap.appendChild(dot);
    dots.push(dot);
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function (d, i) {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() {
    timer = setInterval(next, 3000);
  }

  function resetAuto() {
    clearInterval(timer);
    startAuto();
  }

  nextBtn.addEventListener('click', function () { next(); resetAuto(); });
  prevBtn.addEventListener('click', function () { prev(); resetAuto(); });

  dotsWrap.addEventListener('click', function (e) {
    var btn = e.target.closest('.carousel-dot');
    if (!btn) return;
    goTo(parseInt(btn.getAttribute('data-index'), 10));
    resetAuto();
  });

  // Touch swipe
  var touchStartX = 0;
  track.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', function (e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? next() : prev();
      resetAuto();
    }
  }, { passive: true });

  startAuto();
})();
