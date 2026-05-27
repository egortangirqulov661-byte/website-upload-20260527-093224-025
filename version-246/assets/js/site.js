(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var current = 0;

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

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var input = document.querySelector('[data-search-input]');
    var select = document.querySelector('[data-year-select]');
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-button]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var empty = document.querySelector('[data-empty-state]');
    var activeTag = '';

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function applyFilter() {
        var keyword = normalize(input ? input.value : '');
        var year = select ? select.value : '';
        var shown = 0;

        cards.forEach(function (card) {
            var text = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-year'),
                card.getAttribute('data-region'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-tags')
            ].join(' '));
            var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchYear = !year || card.getAttribute('data-year') === year;
            var matchTag = !activeTag || text.indexOf(normalize(activeTag)) !== -1;
            var visible = matchKeyword && matchYear && matchTag;
            card.style.display = visible ? '' : 'none';
            if (visible) {
                shown += 1;
            }
        });

        if (empty) {
            empty.classList.toggle('show', shown === 0);
        }
    }

    if (input) {
        input.addEventListener('input', applyFilter);
    }

    if (select) {
        select.addEventListener('change', applyFilter);
    }

    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeTag = button.getAttribute('data-filter-button') || '';
            buttons.forEach(function (item) {
                item.classList.toggle('active', item === button);
            });
            applyFilter();
        });
    });
})();
