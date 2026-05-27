(function () {
  const toggle = document.querySelector('.menu-toggle');
  const mobile = document.querySelector('.mobile-menu');
  if (toggle && mobile) {
    toggle.addEventListener('click', function () {
      mobile.classList.toggle('open');
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.hero-dot'));
  if (slides.length > 1) {
    let current = 0;
    const show = function (index) {
      current = index;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    };
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });
    setInterval(function () {
      show((current + 1) % slides.length);
    }, 5200);
  }

  const searchInputs = Array.from(document.querySelectorAll('[data-search-input]'));
  searchInputs.forEach(function (input) {
    const target = input.getAttribute('data-search-input');
    const cards = Array.from(document.querySelectorAll('[data-search-area="' + target + '"] .movie-card, [data-search-area="' + target + '"] .rank-item'));
    input.addEventListener('input', function () {
      const keyword = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const text = (card.getAttribute('data-search-text') || card.textContent || '').toLowerCase();
        card.style.display = text.indexOf(keyword) === -1 ? 'none' : '';
      });
    });
  });
})();
