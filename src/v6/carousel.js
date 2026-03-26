/**
 * Portfolio carousel for WQF-inspired DosCode landing page.
 * Vanilla JS, no dependencies.
 */

export function initCarousel() {
  const carousel = document.getElementById('portfolioCarousel');
  if (!carousel) return;

  const track = carousel.querySelector('.v6-carousel-track');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.v6-carousel-card'));
  const counter = document.querySelector('.v6-carousel-counter');
  const prevBtn = document.querySelector('.v6-carousel-arrow--prev');
  const nextBtn = document.querySelector('.v6-carousel-arrow--next');
  const total = cards.length;

  if (total === 0) return;

  // --- ARIA setup ---
  carousel.setAttribute('aria-label', 'Portfolio');
  cards.forEach((card, i) => {
    card.setAttribute('role', 'group');
    card.setAttribute('aria-roledescription', 'slide');
    card.setAttribute('aria-label', `Project ${i + 1} of ${total}`);
    card.setAttribute('tabindex', '0');
  });

  // --- State ---
  let activeIndex = 0;

  // --- Helpers ---
  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function updateCounter() {
    if (!counter) return;
    counter.textContent = `${pad(activeIndex + 1)} / ${pad(total)}`;
  }

  function setActiveCard(index) {
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('active');
        const color = card.dataset.color;
        if (color) {
          card.style.backgroundColor = color;
        }
      } else {
        card.classList.remove('active');
        card.style.backgroundColor = '';
      }
    });
    activeIndex = index;
    updateCounter();
  }

  // --- Programmatic navigation (index-based, not scroll-based) ---
  function goTo(index) {
    const clamped = Math.max(0, Math.min(total - 1, index));
    setActiveCard(clamped);
    // Scroll the active card into view within the track
    cards[clamped].scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }

  function goPrev() {
    goTo(activeIndex - 1);
  }

  function goNext() {
    goTo(activeIndex + 1);
  }

  // --- Arrow navigation ---
  if (prevBtn) {
    prevBtn.addEventListener('click', goPrev);
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', goNext);
  }

  // --- Scroll-based detection for manual drag/swipe ---
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Find which card is closest to center of track
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let closestIndex = 0;
      let closestDist = Infinity;

      cards.forEach((card, i) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const dist = Math.abs(cardCenter - trackCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveCard(closestIndex);
      }
    }, 300);
  }, { passive: true });

  // --- Keyboard navigation ---
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
      cards[activeIndex].focus();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
      cards[activeIndex].focus();
    }
  });

  // --- Click on card to select ---
  cards.forEach((card, i) => {
    card.addEventListener('click', () => {
      if (i !== activeIndex) {
        goTo(i);
      }
    });
  });

  // --- Initial state ---
  track.scrollLeft = 0;
  setActiveCard(0);
  updateCounter();
}
