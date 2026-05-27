(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var toggle = document.querySelector(".menu-toggle");
        var panel = document.querySelector(".mobile-panel");
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener("click", function () {
            var expanded = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", expanded ? "false" : "true");
            panel.hidden = expanded;
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        if (slides.length <= 1) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            start();
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                restart();
            });
        });
        start();
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll("[data-filter-panel]"));
        panels.forEach(function (panel) {
            var input = panel.querySelector("[data-filter-input]");
            var list = document.querySelector("[data-filter-list]");
            var empty = document.querySelector("[data-empty-state]");
            var buttons = Array.prototype.slice.call(panel.querySelectorAll("[data-filter-value]"));
            var activeValue = "all";
            if (!list) {
                return;
            }
            var cards = Array.prototype.slice.call(list.querySelectorAll(".movie-card"));

            function textFor(card) {
                return normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags")
                ].join(" "));
            }

            function apply() {
                var query = normalize(input ? input.value : "");
                var visible = 0;
                cards.forEach(function (card) {
                    var haystack = textFor(card);
                    var matchQuery = !query || haystack.indexOf(query) !== -1;
                    var matchButton = activeValue === "all" || haystack.indexOf(normalize(activeValue)) !== -1;
                    var matched = matchQuery && matchButton;
                    card.hidden = !matched;
                    if (matched) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.hidden = visible !== 0;
                }
            }

            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    activeValue = button.getAttribute("data-filter-value") || "all";
                    buttons.forEach(function (item) {
                        item.classList.toggle("is-active", item === button);
                    });
                    apply();
                });
            });
            if (input) {
                var params = new URLSearchParams(window.location.search);
                var query = params.get("q");
                if (query) {
                    input.value = query;
                }
                input.addEventListener("input", apply);
            }
            apply();
        });
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupFilters();
    });
})();
