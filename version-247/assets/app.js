(function () {
    var header = document.querySelector('[data-header]');
    var mobileToggle = document.querySelector('[data-mobile-toggle]');

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 36) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (mobileToggle && header) {
        mobileToggle.addEventListener('click', function () {
            header.classList.toggle('is-open');
            document.body.classList.toggle('no-scroll', header.classList.contains('is-open'));
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var prev = document.querySelector('[data-hero-prev]');
    var next = document.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('active', slideIndex === current);
        });
        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('active', dotIndex === current);
        });
    }

    function startHero() {
        if (slides.length < 2) {
            return;
        }
        stopHero();
        timer = window.setInterval(function () {
            showSlide(current + 1);
        }, 5000);
    }

    function stopHero() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
    }

    if (slides.length) {
        showSlide(0);
        startHero();
        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startHero();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startHero();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.dataset.heroDot || 0));
                startHero();
            });
        });
    }

    var cardSearch = document.querySelector('[data-card-search]');
    var cardGrid = document.querySelector('[data-card-grid]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-term]'));
    var activeTerm = '';

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyCardFilter() {
        if (!cardGrid) {
            return;
        }
        var query = normalize(cardSearch ? cardSearch.value : '');
        var term = normalize(activeTerm);
        var cards = Array.prototype.slice.call(cardGrid.querySelectorAll('.movie-card'));

        cards.forEach(function (card) {
            var text = normalize([
                card.dataset.title,
                card.dataset.region,
                card.dataset.genre,
                card.textContent
            ].join(' '));
            var matchQuery = !query || text.indexOf(query) !== -1;
            var matchTerm = !term || text.indexOf(term) !== -1;
            card.classList.toggle('hidden-by-filter', !(matchQuery && matchTerm));
        });
    }

    if (cardSearch) {
        cardSearch.addEventListener('input', applyCardFilter);
    }

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeTerm = button.dataset.filterTerm || '';
            filterButtons.forEach(function (item) {
                item.classList.toggle('active', item === button);
            });
            applyCardFilter();
        });
    });
})();
