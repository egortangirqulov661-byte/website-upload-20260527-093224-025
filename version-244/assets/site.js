(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }

    current = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === current);
    });

    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === current);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }

    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      if (timer) {
        window.clearInterval(timer);
      }
      showSlide(index);
      startHero();
    });
  });

  showSlide(0);
  startHero();

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  function setupFilters() {
    var input = document.querySelector('.site-search');
    var yearFilter = document.querySelector('.year-filter');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .rank-item'));
    var emptyState = document.querySelector('.empty-state');

    if (!cards.length) {
      return;
    }

    function apply() {
      var keyword = normalize(input ? input.value : '');
      var year = normalize(yearFilter ? yearFilter.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-region'),
          card.textContent
        ].join(' '));
        var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchedYear = !year || normalize(card.getAttribute('data-year')) === year;
        var shown = matchedKeyword && matchedYear;

        card.classList.toggle('is-filter-hidden', !shown);
        if (shown) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.style.display = visible ? 'none' : 'block';
      }
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    if (yearFilter) {
      yearFilter.addEventListener('change', apply);
    }

    apply();
  }

  function setupPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.video-shell'));

    shells.forEach(function (shell) {
      var video = shell.querySelector('video');
      var layer = shell.querySelector('.play-layer');
      var hlsInstance = null;

      if (!video) {
        return;
      }

      function bindSource() {
        var source = video.getAttribute('data-video');

        if (!source || video.getAttribute('data-ready') === '1') {
          return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
          video.setAttribute('data-ready', '1');
          return;
        }

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          video.setAttribute('data-ready', '1');
          return;
        }

        video.src = source;
        video.setAttribute('data-ready', '1');
      }

      function start() {
        bindSource();

        if (layer) {
          layer.classList.add('is-hidden');
        }

        video.controls = true;
        var playResult = video.play();

        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(function () {});
        }
      }

      if (layer) {
        layer.addEventListener('click', start);
      }

      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });

      video.addEventListener('play', function () {
        if (layer) {
          layer.classList.add('is-hidden');
        }
      });

      window.addEventListener('beforeunload', function () {
        if (hlsInstance) {
          hlsInstance.destroy();
        }
      });
    });
  }

  setupFilters();
  setupPlayers();
})();
