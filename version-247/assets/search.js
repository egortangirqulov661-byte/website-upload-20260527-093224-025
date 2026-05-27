(function () {
    var movies = window.MOVIES || [];
    var searchInput = document.getElementById('global-search');
    var regionFilter = document.getElementById('region-filter');
    var typeFilter = document.getElementById('type-filter');
    var resetButton = document.getElementById('reset-search');
    var results = document.getElementById('search-results');
    var count = document.getElementById('search-count');
    var pageSize = 120;

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function option(value) {
        var item = document.createElement('option');
        item.value = value;
        item.textContent = value;
        return item;
    }

    function fillFilters() {
        if (!regionFilter || !typeFilter) {
            return;
        }
        var regions = Array.from(new Set(movies.map(function (movie) {
            return movie.region;
        }))).filter(Boolean).sort();
        var types = Array.from(new Set(movies.map(function (movie) {
            return movie.type;
        }))).filter(Boolean).sort();

        regions.forEach(function (region) {
            regionFilter.appendChild(option(region));
        });
        types.forEach(function (type) {
            typeFilter.appendChild(option(type));
        });
    }

    function formatViews(views) {
        var number = Number(views || 0);
        if (number >= 10000) {
            return (number / 10000).toFixed(1) + '万';
        }
        return String(number);
    }

    function createCard(movie) {
        var article = document.createElement('article');
        article.className = 'movie-card';
        article.innerHTML = [
            '<a class="movie-cover" href="' + movie.url + '">',
            '    <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '    <span class="score">' + escapeHtml(movie.rating) + '</span>',
            '    <span class="play-mark">▶</span>',
            '</a>',
            '<div class="movie-info">',
            '    <a class="movie-title" href="' + movie.url + '">' + escapeHtml(movie.title) + '</a>',
            '    <div class="movie-meta">',
            '        <span>' + escapeHtml(movie.year) + '</span>',
            '        <span>' + escapeHtml(movie.region) + '</span>',
            '    </div>',
            '    <p>' + escapeHtml(movie.oneLine) + '</p>',
            '</div>'
        ].join('');
        return article;
    }

    function escapeHtml(value) {
        return String(value == null ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function readInitialQuery() {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        if (query && searchInput) {
            searchInput.value = query;
        }
    }

    function applySearch() {
        if (!results || !count) {
            return;
        }
        var query = normalize(searchInput ? searchInput.value : '');
        var region = regionFilter ? regionFilter.value : '';
        var type = typeFilter ? typeFilter.value : '';
        var filtered = movies.filter(function (movie) {
            var text = normalize([
                movie.title,
                movie.region,
                movie.type,
                movie.year,
                movie.genreRaw,
                (movie.genres || []).join(' '),
                (movie.tags || []).join(' '),
                movie.oneLine,
                movie.categoryName
            ].join(' '));
            var matchQuery = !query || text.indexOf(query) !== -1;
            var matchRegion = !region || movie.region === region;
            var matchType = !type || movie.type === type;
            return matchQuery && matchRegion && matchType;
        });

        results.innerHTML = '';
        filtered.slice(0, pageSize).forEach(function (movie) {
            results.appendChild(createCard(movie));
        });

        var suffix = filtered.length > pageSize ? '，当前展示前 ' + pageSize + ' 条' : '';
        count.textContent = '共找到 ' + filtered.length + ' 部影片' + suffix + '。';
    }

    fillFilters();
    readInitialQuery();
    applySearch();

    if (searchInput) {
        searchInput.addEventListener('input', applySearch);
    }
    if (regionFilter) {
        regionFilter.addEventListener('change', applySearch);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', applySearch);
    }
    if (resetButton) {
        resetButton.addEventListener('click', function () {
            if (searchInput) {
                searchInput.value = '';
            }
            if (regionFilter) {
                regionFilter.value = '';
            }
            if (typeFilter) {
                typeFilter.value = '';
            }
            applySearch();
        });
    }
})();
