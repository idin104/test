'use strict';

const STORAGE_KEY = 'gv_lang';
const DEFAULT_LANGUAGE = 'fa';
const SUPPORTED_LANGUAGES = new Set(['fa', 'en']);

const PHASE = Object.freeze({
  IDLE: 'idle',
  OPENING: 'opening',
  FOCUSED: 'focused',
  REVEALING: 'revealing',
  REVEALED: 'revealed',
  CLOSING: 'closing',
});

const MOTION = Object.freeze({
  openDuration: 680,
  revealDuration: 780,
  closeDuration: 420,
  swipeThreshold: 34,
});

const translations = {
  fa: {
    brand: 'خزانه بازی',
    eyebrow: 'انتخاب‌های ماندگار',
    title: 'بازی‌هایی که جهان ساختند.',
    intro:
      'مجموعه‌ای دست‌چین‌شده از دنیاهای فراموش‌نشدنی؛ از روایت‌های انسانی تا قلمروهایی که آجر به آجر ساخته می‌شوند.',
    collection: 'مجموعه منتخب',
    dossier: 'پرونده بازی',
    revealCue: 'برای نمایش جزئیات، رو به بالا اسکرول کنید',
    features: 'ویژگی‌های کلیدی',
    back: 'بازگشت به مجموعه',
    close: 'بستن',
    notRated: 'هنوز منتشر نشده',
    switchLanguage: 'Switch language',
    documentTitle: 'خزانه بازی | Game Vault',
    labels: ['سبک', 'سازنده', 'تاریخ انتشار', 'امتیاز متاکریتیک'],
  },
  en: {
    brand: 'Game Vault',
    eyebrow: 'Games that endure',
    title: 'Worlds worth getting lost in.',
    intro:
      'A curated collection of unforgettable worlds—from intimate human stories to realms built one block at a time.',
    collection: 'Selected collection',
    dossier: 'Game dossier',
    revealCue: 'Scroll up to reveal the full story',
    features: 'Key features',
    back: 'Back to collection',
    close: 'Close',
    notRated: 'Not yet rated',
    switchLanguage: 'تغییر زبان',
    documentTitle: 'Game Vault | Premium Showcase',
    labels: ['Genre', 'Developer', 'Release date', 'Metacritic'],
  },
};

const getElement = (id) => document.getElementById(id);

const elements = {
  root: document.documentElement,
  body: document.body,
  grid: getElement('gameGrid'),
  counter: getElement('gameCounter'),
  modal: getElement('gameModal'),
  modalLabel: getElement('modalLabel'),
  languageButton: getElement('languageButton'),
  modalLanguageButton: getElement('modalLanguageButton'),
  closeButton: getElement('closeModal'),
  backButton: getElement('backButton'),
  brandText: getElement('brandText'),
  eyebrow: getElement('eyebrow'),
  pageTitle: getElement('pageTitle'),
  introCopy: getElement('introCopy'),
  collectionTitle: getElement('collectionTitle'),
  hero: getElement('heroFrame'),
  heroImage: getElement('heroImage'),
  heroCaption: getElement('heroCaption'),
  heroGenre: getElement('heroGenre'),
  heroTitle: getElement('heroTitle'),
  revealCue: getElement('revealCue'),
  cueText: getElement('cueText'),
  detailsScroller: getElement('detailsScroller'),
  detailIndex: getElement('detailIndex'),
  detailTitle: getElement('detailTitle'),
  description: getElement('description'),
  facts: getElement('facts'),
  featureTitle: getElement('featureTitle'),
  features: getElement('features'),
};

const rawGames = Array.isArray(window.GAME_DATA) ? window.GAME_DATA : [];

const normalizeGame = (game) => ({
  ...game,
  cover: game.cover ?? game.image,
  developer: game.developer ?? game.en?.developer ?? '',
  release: game.release ?? game.en?.release ?? '',
  tags: game.tags ?? game.en?.genre?.split(' / ') ?? [],
});

const games = rawGames.map(normalizeGame);

const state = {
  language: readStoredLanguage(),
  phase: PHASE.IDLE,
  activeGameIndex: null,
  animationFrameId: null,
  touchStartY: 0,
  triggerElement: null,
};

function readStoredLanguage() {
  try {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);
    return SUPPORTED_LANGUAGES.has(savedLanguage)
      ? savedLanguage
      : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

function saveLanguage(language) {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // The interface still works when storage is blocked or unavailable.
  }
}

function getLocalizedGame(game) {
  return game[state.language];
}

function getDisplayScore(game) {
  const rawScore =
    game.score && typeof game.score === 'object'
      ? game.score[state.language]
      : game.score;

  if (rawScore === null || rawScore === undefined) {
    return translations[state.language].notRated;
  }

  return typeof rawScore === 'number' ? `${rawScore}/100` : rawScore;
}

function getHeroRect() {
  const width = Math.min(window.innerWidth * 0.78, 620);
  const height = Math.min(window.innerHeight * 0.72, width * 1.22);

  return {
    left: (window.innerWidth - width) / 2,
    top: (window.innerHeight - height) / 2,
    width,
    height,
  };
}

function easeOutQuart(progress) {
  return 1 - (1 - progress) ** 4;
}

function animateWithRaf(duration, drawFrame, onComplete) {
  cancelAnimationFrame(state.animationFrameId);
  const startedAt = performance.now();

  function frame(timestamp) {
    const rawProgress = Math.min(1, (timestamp - startedAt) / duration);
    drawFrame(easeOutQuart(rawProgress), rawProgress);

    if (rawProgress < 1) {
      state.animationFrameId = requestAnimationFrame(frame);
      return;
    }

    onComplete?.();
  }

  state.animationFrameId = requestAnimationFrame(frame);
}

function renderGameGrid() {
  const fragment = document.createDocumentFragment();

  games.forEach((game, index) => {
    const localizedGame = getLocalizedGame(game);
    const card = document.createElement('button');
    const image = document.createElement('img');
    const arrow = document.createElement('span');
    const content = document.createElement('span');
    const meta = document.createElement('span');
    const title = document.createElement('h3');

    card.className = 'game-card';
    card.type = 'button';
    card.dataset.index = String(index);
    card.setAttribute('aria-label', localizedGame.title);

    image.src = game.cover;
    image.alt = localizedGame.title;
    image.loading = index < 4 ? 'eager' : 'lazy';
    image.decoding = 'async';
    image.dataset.fallback = game.fallback ?? '';

    arrow.className = 'card-arrow';
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');

    content.className = 'card-copy';
    meta.className = 'card-meta';
    meta.textContent = `${String(index + 1).padStart(2, '0')} · ${localizedGame.genre}`;
    title.textContent = localizedGame.title;

    content.append(meta, title);
    card.append(image, arrow, content);
    fragment.append(card);
  });

  elements.grid.replaceChildren(fragment);
  elements.counter.textContent = `${String(games.length).padStart(2, '0')} — 2026`;
}

function renderGameDetails(index) {
  const game = games[index];
  const localizedGame = getLocalizedGame(game);
  const labels = translations[state.language].labels;
  const values = [
    localizedGame.genre,
    localizedGame.developer,
    localizedGame.release,
    getDisplayScore(game),
  ];

  elements.heroImage.src = game.cover;
  elements.heroImage.alt = localizedGame.title;
  elements.heroImage.dataset.fallback = game.fallback ?? '';
  elements.heroGenre.textContent = localizedGame.genre;
  elements.heroTitle.textContent = localizedGame.title;
  elements.detailIndex.textContent =
    `${String(index + 1).padStart(2, '0')} / ${String(games.length).padStart(2, '0')}`;
  elements.detailTitle.textContent = localizedGame.title;
  elements.description.textContent = localizedGame.description;

  const factsFragment = document.createDocumentFragment();
  values.forEach((value, factIndex) => {
    const fact = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');

    fact.className = 'fact';
    term.textContent = labels[factIndex];
    description.textContent = value;

    if (factIndex === values.length - 1) {
      description.classList.add('score');
    }

    fact.append(term, description);
    factsFragment.append(fact);
  });
  elements.facts.replaceChildren(factsFragment);

  const featuresFragment = document.createDocumentFragment();
  localizedGame.features.forEach((featureText) => {
    const feature = document.createElement('li');
    feature.className = 'feature';
    feature.textContent = featureText;
    featuresFragment.append(feature);
  });
  elements.features.replaceChildren(featuresFragment);
}

function applyLanguage() {
  const copy = translations[state.language];
  const switchText = state.language === 'fa' ? 'EN' : 'فا';

  document.title = copy.documentTitle;
  elements.root.lang = state.language;
  elements.root.dir = state.language === 'fa' ? 'rtl' : 'ltr';
  elements.languageButton.textContent = switchText;
  elements.modalLanguageButton.textContent = switchText;
  elements.languageButton.setAttribute('aria-label', copy.switchLanguage);
  elements.modalLanguageButton.setAttribute('aria-label', copy.switchLanguage);
  elements.brandText.textContent = copy.brand;
  elements.eyebrow.textContent = copy.eyebrow;
  elements.pageTitle.textContent = copy.title;
  elements.introCopy.textContent = copy.intro;
  elements.collectionTitle.textContent = copy.collection;
  elements.modalLabel.textContent = copy.dossier;
  elements.cueText.textContent = copy.revealCue;
  elements.featureTitle.textContent = copy.features;
  elements.backButton.textContent = copy.back;
  elements.closeButton.setAttribute('aria-label', copy.close);

  renderGameGrid();

  if (state.activeGameIndex !== null) {
    state.triggerElement = elements.grid.querySelector(
      `[data-index="${state.activeGameIndex}"]`,
    );
    renderGameDetails(state.activeGameIndex);
  }
}

function toggleLanguage() {
  state.language = state.language === 'fa' ? 'en' : 'fa';
  saveLanguage(state.language);
  applyLanguage();
}

function setHeroGeometry(rect) {
  Object.assign(elements.hero.style, {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    transformOrigin: 'center center',
  });
}

function openGame(card, index) {
  if (state.phase !== PHASE.IDLE) return;

  state.phase = PHASE.OPENING;
  state.activeGameIndex = index;
  state.triggerElement = card;
  renderGameDetails(index);

  const sourceRect = card.getBoundingClientRect();
  const targetRect = getHeroRect();
  setHeroGeometry(targetRect);

  elements.heroCaption.classList.remove('is-visible');
  elements.revealCue.classList.remove('is-visible');
  elements.modal.classList.remove('is-revealed');
  elements.modal.classList.add('is-open');
  elements.modal.setAttribute('aria-hidden', 'false');
  elements.body.classList.add('is-locked');

  const sourceCenterX = sourceRect.left + sourceRect.width / 2;
  const sourceCenterY = sourceRect.top + sourceRect.height / 2;
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;
  const deltaX = sourceCenterX - targetCenterX;
  const deltaY = sourceCenterY - targetCenterY;
  const scaleX = sourceRect.width / targetRect.width;
  const scaleY = sourceRect.height / targetRect.height;

  animateWithRaf(
    MOTION.openDuration,
    (progress) => {
      const x = deltaX * (1 - progress);
      const y = deltaY * (1 - progress);
      const currentScaleX = scaleX + (1 - scaleX) * progress;
      const currentScaleY = scaleY + (1 - scaleY) * progress;

      elements.hero.style.transform =
        `translate3d(${x}px, ${y}px, 0) ` +
        `scale(${currentScaleX}, ${currentScaleY})`;
    },
    () => {
      state.phase = PHASE.FOCUSED;
      elements.hero.style.transform = 'translate3d(0, 0, 0) scale(1)';
      elements.heroCaption.classList.add('is-visible');
      elements.revealCue.classList.add('is-visible');
      elements.closeButton.focus({ preventScroll: true });
    },
  );
}

function revealDetails() {
  if (state.phase !== PHASE.FOCUSED) return;

  state.phase = PHASE.REVEALING;
  elements.revealCue.classList.remove('is-visible');
  elements.heroCaption.classList.remove('is-visible');

  const heroRect = elements.hero.getBoundingClientRect();
  const exitDistance = heroRect.bottom + 50;

  animateWithRaf(
    MOTION.revealDuration,
    (progress) => {
      const translateY = -exitDistance * progress;
      const scale = 1 - 0.035 * progress;
      elements.hero.style.transform =
        `translate3d(0, ${translateY}px, 0) scale(${scale})`;
    },
    () => {
      state.phase = PHASE.REVEALED;
      elements.modal.classList.add('is-revealed');
      elements.detailsScroller.scrollTop = 0;
      elements.backButton.focus({ preventScroll: true });
    },
  );
}

function closeGame() {
  if (state.phase === PHASE.IDLE || state.phase === PHASE.CLOSING) return;

  state.phase = PHASE.CLOSING;
  cancelAnimationFrame(state.animationFrameId);
  elements.modal.classList.remove('is-open', 'is-revealed');
  elements.modal.setAttribute('aria-hidden', 'true');
  elements.body.classList.remove('is-locked');
  elements.hero.style.transform = '';
  elements.heroCaption.classList.remove('is-visible');
  elements.revealCue.classList.remove('is-visible');

  const triggerElement = state.triggerElement;

  window.setTimeout(() => {
    state.phase = PHASE.IDLE;
    state.activeGameIndex = null;
    state.triggerElement = null;
    triggerElement?.focus({ preventScroll: true });
  }, MOTION.closeDuration);
}

function escapeXml(value) {
  return value.replace(/[&<>]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  })[character]);
}

function createPlaceholderCover(label) {
  const safeLabel = escapeXml(label);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="1200">
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
          <stop stop-color="#242a35" />
          <stop offset="1" stop-color="#08090d" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#gradient)" />
      <text x="50%" y="48%" fill="#d9ff52" font-family="Arial, sans-serif"
            font-size="48" font-weight="700" text-anchor="middle">GAME VAULT</text>
      <text x="50%" y="55%" fill="#f6f3ea" font-family="Arial, sans-serif"
            font-size="34" text-anchor="middle">${safeLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function useImageFallback(image) {
  const fallbackUrl = image.dataset.fallback;

  if (fallbackUrl && image.src !== fallbackUrl) {
    image.dataset.fallback = '';
    image.src = fallbackUrl;
    return;
  }

  image.onerror = null;
  image.src = createPlaceholderCover(image.alt || 'Game Vault');
}

function handleGridClick(event) {
  const card = event.target.closest('.game-card');
  if (!card) return;

  openGame(card, Number(card.dataset.index));
}

function handleGridImageError(event) {
  if (event.target.matches('.game-card img')) {
    useImageFallback(event.target);
  }
}

function handleWheel(event) {
  if (state.phase === PHASE.FOCUSED) {
    event.preventDefault();
    if (event.deltaY < 0) revealDetails();
    return;
  }

  if (state.phase === PHASE.OPENING || state.phase === PHASE.REVEALING) {
    event.preventDefault();
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    closeGame();
    return;
  }

  const isRevealKey = event.key === 'ArrowUp' || event.key === 'PageUp';
  if (state.phase === PHASE.FOCUSED && isRevealKey) {
    event.preventDefault();
    revealDetails();
  }
}

function handleTouchStart(event) {
  if (state.phase === PHASE.FOCUSED) {
    state.touchStartY = event.touches[0].clientY;
  }
}

function handleTouchMove(event) {
  if (state.phase === PHASE.FOCUSED) {
    event.preventDefault();
    const currentY = event.touches[0].clientY;

    if (state.touchStartY - currentY > MOTION.swipeThreshold) {
      revealDetails();
    }
    return;
  }

  if (state.phase === PHASE.OPENING || state.phase === PHASE.REVEALING) {
    event.preventDefault();
  }
}

function handleResize() {
  if (state.phase === PHASE.FOCUSED) {
    setHeroGeometry(getHeroRect());
  }
}

function bindEvents() {
  elements.grid.addEventListener('click', handleGridClick);
  elements.grid.addEventListener('error', handleGridImageError, true);
  elements.heroImage.addEventListener('error', () => {
    useImageFallback(elements.heroImage);
  });
  elements.languageButton.addEventListener('click', toggleLanguage);
  elements.modalLanguageButton.addEventListener('click', toggleLanguage);
  elements.closeButton.addEventListener('click', closeGame);
  elements.backButton.addEventListener('click', closeGame);
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  window.addEventListener('resize', handleResize);
}

function initializeApp() {
  if (!games.length) {
    console.error('Game Vault could not load the game dataset.');
    return;
  }

  bindEvents();
  applyLanguage();
}

initializeApp();
