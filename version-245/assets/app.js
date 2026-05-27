(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-button]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var active = 0;
    function show(index) {
      active = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show((active + 1) % slides.length);
    }, 5600);
  }

  function initSearch() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll("[data-search-input]"));
    inputs.forEach(function (input) {
      var scope = input.getAttribute("data-search-scope");
      var container = document.querySelector('[data-search-container="' + scope + '"]');
      if (!container) {
        return;
      }
      var items = Array.prototype.slice.call(container.querySelectorAll("[data-search-text]"));
      input.addEventListener("input", function () {
        var value = input.value.trim().toLowerCase();
        items.forEach(function (item) {
          var text = (item.getAttribute("data-search-text") || "").toLowerCase();
          item.classList.toggle("is-filtered", value && text.indexOf(value) === -1);
        });
      });
    });
  }

  function ensureHls() {
    return new Promise(function (resolve, reject) {
      if (window.Hls) {
        resolve(window.Hls);
        return;
      }
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
      script.onload = function () {
        resolve(window.Hls);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function startVideo(video, url) {
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play();
      return;
    }
    ensureHls().then(function (Hls) {
      if (Hls && Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play();
        });
        return;
      }
      video.src = url;
      video.play();
    }).catch(function () {
      video.src = url;
      video.play();
    });
  }

  window.MoviePlayer = {
    init: function (url) {
      var video = document.getElementById("movie-player");
      var overlay = document.querySelector("[data-play-overlay]");
      if (!video || !overlay || !url) {
        return;
      }
      var started = false;
      function begin() {
        overlay.classList.add("is-hidden");
        if (!started) {
          started = true;
          startVideo(video, url);
          return;
        }
        video.play();
      }
      overlay.addEventListener("click", begin);
      video.addEventListener("play", function () {
        overlay.classList.add("is-hidden");
      });
    }
  };

  ready(function () {
    initMenu();
    initHero();
    initSearch();
  });
})();
