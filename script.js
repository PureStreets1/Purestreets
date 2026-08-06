const header = document.querySelector('[data-header]');
const hero = document.querySelector('.hero');
const heroTitle = document.querySelector('#hero-title');
const pageTitle = heroTitle || document.querySelector('.group-hero h1, .challenge-hero h1, .campaign-hero h1, .contact-hero h1, .volunteer-hero h1, .charity-hero h1, .work-hero h1, .team-hero h1');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const samePageNavLinks = navLinks.filter((link) => link.getAttribute('href')?.startsWith('#'));
const counters = [...document.querySelectorAll('[data-count]')];
const revealItems = [...document.querySelectorAll('[data-reveal]')];

function setHeaderState() {
  if (!header) return;
  const isSubpage = document.body.classList.contains('subpage');
  const isOpen = header.classList.contains('is-open');
  const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 0;
  const headlineClearance = header.offsetHeight + 24;
  const headingReachedHeader = pageTitle ? pageTitle.getBoundingClientRect().top <= headlineClearance : false;
  const heroHasPassed = hero ? window.scrollY + header.offsetHeight >= heroBottom : false;
  const shouldHide = !isOpen && (isSubpage ? headingReachedHeader : (headingReachedHeader || heroHasPassed));

  header.classList.toggle('is-scrolled', window.scrollY > 18 || isSubpage);
  header.classList.toggle('is-hidden', shouldHide);
}

if (navToggle && nav && header) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    header.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    setHeaderState();
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    header?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open menu');
    setHeaderState();
  });
});

const comingSoonPages = new Set([]);
const comingSoonLinks = [...document.querySelectorAll('a[href]')].filter((link) => {
  try {
    const url = new URL(link.getAttribute('href'), window.location.href);
    return comingSoonPages.has(url.pathname.split('/').pop());
  } catch {
    return false;
  }
});

let comingSoonTimer;

function showComingSoonMessage() {
  let message = document.querySelector('[data-coming-soon-message]');

  if (!message) {
    message = document.createElement('div');
    message.className = 'coming-soon-message';
    message.dataset.comingSoonMessage = '';
    message.setAttribute('role', 'status');
    message.setAttribute('aria-live', 'polite');
    message.textContent = 'Coming soon';
    document.body.appendChild(message);
  }

  window.clearTimeout(comingSoonTimer);
  message.classList.add('is-visible');
  comingSoonTimer = window.setTimeout(() => {
    message.classList.remove('is-visible');
  }, 2200);
}

comingSoonLinks.forEach((link) => {
  link.setAttribute('aria-label', `${link.textContent.trim() || 'This page'} - coming soon`);
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showComingSoonMessage();
  });
});

function initStickyCta() {
  const stickyCta = document.querySelector('[data-sticky-cta]');
  const trigger = document.querySelector('[data-sticky-cta-trigger]');
  if (!stickyCta || !trigger) return;

  function setStickyVisible(isVisible) {
    stickyCta.classList.toggle('is-visible', isVisible);
    stickyCta.setAttribute('aria-hidden', String(!isVisible));
    stickyCta.tabIndex = isVisible ? 0 : -1;
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setStickyVisible(!entry.isIntersecting);
    }, { threshold: 0.05 });

    observer.observe(trigger);
    return;
  }

  function updateStickyCta() {
    const rect = trigger.getBoundingClientRect();
    setStickyVisible(rect.bottom <= 0 || rect.top >= window.innerHeight);
  }

  updateStickyCta();
  window.addEventListener('scroll', updateStickyCta, { passive: true });
  window.addEventListener('resize', updateStickyCta);
}

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      samePageNavLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-42% 0px -48% 0px', threshold: 0 });

  if (samePageNavLinks.length) {
    document.querySelectorAll('section[id]').forEach((section) => sectionObserver.observe(section));
  }

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      counters.forEach((counter) => {
        const target = Number(counter.dataset.count);
        if (prefersReducedMotion) {
          counter.textContent = `${target}+`;
          return;
        }
        let current = 0;
        const step = Math.max(1, Math.round(target / 34));
        const timer = window.setInterval(() => {
          current = Math.min(target, current + step);
          counter.textContent = `${current}+`;
          if (current === target) window.clearInterval(timer);
        }, 28);
      });

      observer.disconnect();
    });
  }, { threshold: 0.35 });

  const impactSection = document.querySelector('#impact');
  if (impactSection) counterObserver.observe(impactSection);

  const shouldRevealImmediately = window.matchMedia('(max-width: 560px)').matches;

  if (revealItems.length && shouldRevealImmediately) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.16 });

    revealItems.forEach((item) => revealObserver.observe(item));
  }
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

function initPureBot() {
  const bot = document.querySelector('[data-purebot]');
  if (!bot) return;

  const toggle = bot.querySelector('[data-purebot-toggle]');
  const close = bot.querySelector('[data-purebot-close]');
  const panel = bot.querySelector('[data-purebot-panel]');
  const messages = bot.querySelector('[data-purebot-messages]');
  const form = bot.querySelector('[data-purebot-form]');
  const input = bot.querySelector('[data-purebot-input]');
  const prompts = [...bot.querySelectorAll('[data-purebot-prompt]')];

  // Panel ships closed: keep it out of the tab order until opened (setOpen syncs this with aria-hidden).
  panel.inert = true;

  function linkFor(pattern, fallback = '') {
    const links = [...document.querySelectorAll('a[href]')];
    const match = links.find((link) => pattern.test(link.textContent.trim()) || pattern.test(link.getAttribute('href')));
    return match?.getAttribute('href') || fallback;
  }

  function navSummary() {
    const items = navLinks.map((link) => link.textContent.trim()).filter(Boolean);
    return items.length ? items.join(', ') : 'Get involved, Our team, Contact';
  }

  function upcomingSessionsReply() {
    const cards = [...document.querySelectorAll('.pickup-card')];
    if (!cards.length) return 'There are no upcoming event cards on the page at the moment. Check back soon or email purestreets0@gmail.com for the latest sessions.';

    const sessions = cards.map((card) => {
      const date = card.querySelector('time')?.textContent.trim();
      const title = card.querySelector('h3')?.textContent.trim();
      const detail = card.querySelector('p')?.textContent.trim();
      return [date, title, detail].filter(Boolean).join(' - ');
    });

    return `Current pickup cards: ${sessions.join('; ')}.`;
  }

  function contactReply() {
    const email = linkFor(/^mailto:/i, 'mailto:purestreets0@gmail.com').replace('mailto:', '');
    const work = linkFor(/work with us/i, 'get-involved.html#work-with-us');
    const partner = linkFor(/partner form|MeP2jX/i, 'https://tally.so/r/MeP2jX');
    return `Contact PureStreets at ${email}. Work with us: ${work}. Partner form: ${partner}.`;
  }

  function guideReply() {
    const guide = linkFor(/community-litter-pick-guide|open the guide|pdf/i, 'get-involved.html');
    return `The free litter pick guide is available here: ${guide}.`;
  }

  function volunteerReply() {
    const volunteer = linkFor(/volunteer|get involved/i, 'get-involved.html');
    return `Volunteer information is on: ${volunteer}.`;
  }

  function charityReply() {
    const charities = linkFor(/charit|get involved/i, 'get-involved.html');
    const partner = linkFor(/partner form|MeP2jX/i, 'https://tally.so/r/MeP2jX');
    return `Charity partnership information is on: ${charities}. The partner form is here: ${partner}.`;
  }

  function workReply() {
    const work = linkFor(/work with us/i, 'get-involved.html#work-with-us');
    const form = linkFor(/MeP2jX|work with us form/i, 'https://tally.so/r/MeP2jX');
    return `The Work with us page is here: ${work}. Register your interest with this form: ${form}.`;
  }

  const replies = {
    events: upcomingSessionsReply,
    contact: contactReply,
    guide: guideReply,
    navigate: () => `Use the top menu to visit: ${navSummary()}.`,
    volunteer: volunteerReply,
    charity: charityReply,
    work: workReply,
    partner: () => `Partner with PureStreets here: ${linkFor(/partner form|MeP2jX/i, 'https://tally.so/r/MeP2jX')}`
  };

  function replyFor(key) {
    const reply = replies[key];
    return typeof reply === 'function' ? reply() : reply;
  }

  function setOpen(isOpen) {
    bot.classList.toggle('is-open', isOpen);
    panel.setAttribute('aria-hidden', String(!isOpen));
    panel.inert = !isOpen;
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Close PureBot' : 'Open PureBot');
    if (isOpen) input.focus();
  }

  function addMessage(text, type = 'bot') {
    const message = document.createElement('p');
    message.className = `purebot-message purebot-message--${type}`;

    const linkPattern = /(https?:\/\/[^\s.]+(?:\.[^\s.]+)*|[\w-]+\.html(?:#[\w-]+)?)/g;
    const parts = String(text).split(linkPattern).filter(Boolean);

    parts.forEach((part) => {
      if (linkPattern.test(part)) {
        linkPattern.lastIndex = 0;
        const link = document.createElement('a');
        link.href = part;
        link.textContent = part.includes('get-involved.html') ? 'Get involved page' : part;
        if (/^https?:\/\//.test(part)) {
          link.target = '_blank';
          link.rel = 'noreferrer';
        }
        message.appendChild(link);
        return;
      }

      linkPattern.lastIndex = 0;
      message.appendChild(document.createTextNode(part));
    });

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function getReply(question) {
    const text = question.toLowerCase();
    if (/date|event|upcoming|when|pickup|pick up|session/.test(text)) return replyFor('events');
    if (/contact|email|social|instagram|facebook|linkedin|tiktok|phone/.test(text)) return replyFor('contact');
    if (/volunteer|points|point|leaderboard|month|nomination|nominate|application|apply/.test(text)) return replyFor('volunteer');
    if (/charity|charities|islamic relief|muslim council|mcb|campaign partner/.test(text)) return replyFor('charity');
    if (/guide|pdf|resource|mosque|organisation|organization/.test(text)) return replyFor('guide');
    if (/work with us|work|team|environment|tech|design/.test(text)) return replyFor('work');
    if (/where|navigate|page|link|menu|find/.test(text)) return replyFor('navigate');
    if (/partner|form|tally|collab|collaborate/.test(text)) return replyFor('partner');
    return `I can help with the latest pickup cards, contact links, forms, the guide, volunteering, charities, Work with us, or navigation. Current menu: ${navSummary()}.`;
  }

  toggle.addEventListener('click', () => setOpen(!bot.classList.contains('is-open')));
  close.addEventListener('click', () => setOpen(false));

  prompts.forEach((prompt) => {
    prompt.addEventListener('click', () => {
      const key = prompt.dataset.purebotPrompt;
      addMessage(prompt.textContent, 'user');
      addMessage(replyFor(key) || replyFor('navigate'));
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;
    addMessage(question, 'user');
    input.value = '';
    window.setTimeout(() => addMessage(getReply(question)), 180);
  });
}


function initRippleEffect() {
  document.querySelectorAll('.hero-cta').forEach((button) => {
    button.addEventListener('click', (event) => {
      const ripple = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = event.clientX || rect.left + rect.width / 2;
      const y = event.clientY || rect.top + rect.height / 2;

      ripple.className = 'ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x - rect.left - size / 2}px`;
      ripple.style.top = `${y - rect.top - size / 2}px`;

      button.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    });
  });
}


function initVolunteerTracker() {
  const form = document.querySelector('[data-volunteer-form]');
  const rowsTarget = document.querySelector('[data-volunteer-rows]');
  const emptyState = document.querySelector('[data-volunteer-empty]');
  const resetButton = document.querySelector('[data-reset-volunteers]');
  const leaderNameTarget = document.querySelector('[data-volunteer-leader-name]');
  const leaderDetailTarget = document.querySelector('[data-volunteer-leader-detail]');
  const key = 'purestreets-volunteer-month';

  if (!rowsTarget) return;

  const monthInput = form?.querySelector('input[name="month"]');
  if (monthInput && !monthInput.value) {
    monthInput.value = new Date().toISOString().slice(0, 7);
  }

  function readEntries() {
    try {
      return JSON.parse(window.localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }

  function writeEntries(entries) {
    window.localStorage.setItem(key, JSON.stringify(entries));
  }

  function pointsFor(entry) {
    return 20 + (entry.bags * 5) + (entry.hours * 10) + entry.bonus;
  }

  function getBoard(entries) {
    const board = new Map();

    entries.forEach((entry) => {
      const id = `${entry.month}::${entry.name.toLowerCase()}`;
      const current = board.get(id) || {
        name: entry.name,
        month: entry.month,
        school: entry.school || '',
        sessions: 0,
        bags: 0,
        hours: 0,
        points: 0,
        latestRoute: entry.route,
        latestNote: entry.note
      };

      current.sessions += 1;
      current.bags += entry.bags;
      current.hours += entry.hours;
      current.points += pointsFor(entry);
      current.latestRoute = entry.route || current.latestRoute;
      current.latestNote = entry.note || current.latestNote;
      if (entry.school) current.school = entry.school;
      board.set(id, current);
    });

    return [...board.values()].sort((a, b) => b.points - a.points || b.bags - a.bags || a.name.localeCompare(b.name));
  }

  function getOrgBoard(entries) {
    const orgs = new Map();
    entries.forEach((entry) => {
      const school = entry.school || '';
      if (!school) return;
      const current = orgs.get(school) || { name: school, volunteers: new Set(), sessions: 0, bags: 0, hours: 0, points: 0 };
      current.volunteers.add(entry.name.toLowerCase());
      current.sessions += 1;
      current.bags += entry.bags;
      current.hours += entry.hours;
      current.points += pointsFor(entry);
      orgs.set(school, current);
    });
    return [...orgs.values()]
      .map((org) => ({ ...org, volunteerCount: org.volunteers.size }))
      .sort((a, b) => b.points - a.points || b.bags - a.bags || a.name.localeCompare(b.name));
  }

  const orgRows = document.querySelector('[data-org-rows]');
  const orgEmpty = document.querySelector('[data-org-empty]');

  function renderOrgBoard() {
    if (!orgRows) return;
    const orgs = getOrgBoard(readEntries());
    orgRows.innerHTML = '';
    if (orgEmpty) orgEmpty.hidden = orgs.length > 0;

    orgs.forEach((org, index) => {
      const row = document.createElement('article');
      row.className = `org-row${index === 0 ? ' is-leading' : ''}`;
      row.innerHTML = `
        <div class="org-row__name"><strong></strong><small></small></div>
        <span class="org-row__stat">${org.bags} bags</span>
        <span class="org-row__stat">${org.hours} hrs</span>
        <strong class="org-row__points">${org.points}</strong>
      `;
      row.querySelector('strong').textContent = org.name;
      row.querySelector('small').textContent = `${org.volunteerCount} volunteer${org.volunteerCount === 1 ? '' : 's'} · ${org.sessions} clean-up${org.sessions === 1 ? '' : 's'}`;
      orgRows.appendChild(row);
    });
  }

  function renderBoard() {
    const board = getBoard(readEntries());
    rowsTarget.innerHTML = '';
    if (emptyState) emptyState.hidden = board.length > 0;

    if (!board.length) {
      if (leaderNameTarget) leaderNameTarget.textContent = 'Waiting for entries';
      leaderNameTarget?.closest('.volunteer-leader')?.classList.remove('is-celebrating');
      if (leaderDetailTarget) leaderDetailTarget.textContent = 'Add a nomination to begin.';
      renderOrgBoard();
      return;
    }

    const leader = board[0];
    const leaderCard = leaderNameTarget?.closest('.volunteer-leader');
    if (leaderNameTarget) leaderNameTarget.textContent = leader.name;
    if (leaderCard) {
      leaderCard.classList.remove('is-celebrating');
      void leaderCard.offsetWidth;
      leaderCard.classList.add('is-celebrating');
    }
    if (leaderDetailTarget) {
      leaderDetailTarget.textContent = `${leader.points} points in ${leader.month}: ${leader.sessions} clean-ups, ${leader.bags} bags, ${leader.hours} hours.`;
    }

    board.forEach((person, index) => {
      const row = document.createElement('article');
      row.className = `volunteer-row${index === 0 ? ' is-leading' : ''}`;
      row.setAttribute('role', 'row');
      row.innerHTML = `
        <div class="volunteer-person" role="cell">
          <strong></strong>
          <small></small>
        </div>
        <span role="cell">${person.sessions}</span>
        <span role="cell">${person.bags}</span>
        <span role="cell">${person.hours}</span>
        <strong class="volunteer-points" role="cell">${person.points}</strong>
      `;
      row.querySelector('strong').textContent = person.name;
      row.querySelector('small').textContent = `${person.month} - ${person.latestRoute || 'PureStreets route'}${person.school ? ' (' + person.school + ')' : ''}`;
      rowsTarget.appendChild(row);
    });

    renderOrgBoard();
  }

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const entry = {
        name: String(data.get('name') || '').trim(),
        month: String(data.get('month') || '').trim(),
        route: String(data.get('route') || '').trim(),
        bags: Math.max(0, Number(data.get('bags')) || 0),
        hours: Math.max(0, Number(data.get('hours')) || 0),
        bonus: Math.max(0, Number(data.get('bonus')) || 0),
        note: String(data.get('note') || '').trim()
      };

      if (!entry.name || !entry.month || !entry.route) return;

      const entries = readEntries();
      entries.push(entry);
      writeEntries(entries);
      form.reset();
      if (monthInput) monthInput.value = entry.month;
      renderBoard();
    });
  }

  resetButton?.addEventListener('click', () => {
    window.localStorage.removeItem(key);
    renderBoard();
  });

  renderBoard();
}

function initMosqueCarouselForm() {
  const form = document.querySelector('[data-mosque-form]');
  if (!form) return;

  const slides = [...form.querySelectorAll('[data-mosque-slide]')];
  const track = form.querySelector('[data-mosque-track]');
  const stepLabel = form.querySelector('[data-mosque-step-label]');
  const progress = form.querySelector('[data-mosque-progress]');
  const error = form.querySelector('[data-mosque-error]');
  const backButton = form.querySelector('[data-mosque-back]');
  const nextButton = form.querySelector('[data-mosque-next]');
  const submitButton = form.querySelector('[data-mosque-submit]');
  const success = form.querySelector('[data-mosque-success]');
  const optionInputs = [...form.querySelectorAll('input[name="Support requested"]')];
  const frequencyInputs = [...form.querySelectorAll('input[name="Pick frequency"]')];
  const allSupportInput = form.querySelector('[data-all-support]');
  const mosqueNameInput = form.querySelector('[data-mosque-name-input]');
  const mosqueNameList = form.querySelector('[data-mosque-name-list]');
  const mosqueAddressInput = form.querySelector('[data-mosque-address-input]');
  const mosqueAddressPanel = form.querySelector('[data-mosque-address-panel]');
  const mosqueAddressMessage = form.querySelector('[data-mosque-address-message]');
  const mosqueAddressSelectWrap = form.querySelector('[data-mosque-address-select-wrap]');
  const mosqueAddressSelect = form.querySelector('[data-mosque-address-select]');

  let currentStep = 0;
  let submitPending = false;
  let successTimer;
  let mosqueNamesLoaded = false;
  let mosqueNamesLoading = false;
  let mosqueNamesLoadPromise = null;
  let mosqueDirectory = new Map();
  let mosqueEntries = [];
  let selectedMosqueEntry = null;

  function setError(message = '') {
    error.textContent = message;
  }

  function markOptions() {
    [...optionInputs, ...frequencyInputs].forEach((input) => {
      input.closest('.mosque-option-card')?.classList.toggle('is-selected', input.checked);
    });
  }

  function normaliseMosqueName(name) {
    return String(name || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .replace(/\s+/g, ' ');
  }

  function compactMosqueSearchText(value) {
    return normaliseMosqueName(value).replace(/\s+/g, '');
  }

  function setMosqueSuggestionsOpen(isOpen) {
    if (!mosqueNameInput || !mosqueNameList) return;
    mosqueNameInput.setAttribute('aria-expanded', String(isOpen));
    mosqueNameList.hidden = !isOpen;
  }

  function hideMosqueSuggestions() {
    setMosqueSuggestionsOpen(false);
    mosqueNameList?.replaceChildren();
    updateCarouselHeight();
  }

  function updateCarouselHeight() {
    const activeSlide = slides[currentStep];
    if (!activeSlide) return;

    window.requestAnimationFrame(() => {
      form.style.setProperty('--mosque-form-active-height', `${activeSlide.scrollHeight}px`);
    });
  }

  function setCarouselButtonVisible(button, isVisible) {
    if (!button) return;

    button.hidden = !isVisible;
    button.classList.toggle('is-hidden', !isVisible);
    button.style.display = isVisible ? '' : 'none';
  }

  function parseCsvRows(csv) {
    const rows = [];
    let row = [];
    let cell = '';
    let inQuotes = false;

    for (let index = 0; index < csv.length; index += 1) {
      const char = csv[index];
      const nextChar = csv[index + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          cell += '"';
          index += 1;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          cell += char;
        }
        continue;
      }

      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cell);
        cell = '';
      } else if (char === '\n') {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      } else if (char !== '\r') {
        cell += char;
      }
    }

    if (cell || row.length) {
      row.push(cell);
      rows.push(row);
    }

    return rows;
  }

  async function loadMosqueNameSuggestions() {
    if (!mosqueNameInput || mosqueNamesLoaded) return true;
    if (mosqueNamesLoading && mosqueNamesLoadPromise) return mosqueNamesLoadPromise;

    const csvPath = mosqueNameInput.dataset.mosqueCsv;
    if (!csvPath) return false;

    mosqueNamesLoading = true;

    mosqueNamesLoadPromise = (async () => {
      const response = await fetch(csvPath);
      if (!response.ok) {
        throw new Error(`CSV request failed with ${response.status}`);
      }

      const rows = parseCsvRows(await response.text());
      const directory = new Map();
      const entries = [];

      rows.forEach((row) => {
        const name = String(row[16] || '').trim();
        if (!name) return;

        const key = normaliseMosqueName(name);
        const address = String(row[21] || '').trim();
        const entry = directory.get(key) || { name, addresses: new Set() };

        if (address) entry.addresses.add(address);
        directory.set(key, entry);
        entries.push({
          name,
          address,
          key,
          searchText: normaliseMosqueName(`${name} ${address}`),
          compactSearchText: compactMosqueSearchText(`${name} ${address}`)
        });
      });

      mosqueDirectory = directory;
      mosqueEntries = entries.sort((a, b) => a.name.localeCompare(b.name) || a.address.localeCompare(b.address));
      mosqueNamesLoaded = true;
      return true;
    })();

    try {
      return await mosqueNamesLoadPromise;
    } catch (error) {
      console.error('Mosque name suggestions failed to load:', error);
      return false;
    } finally {
      mosqueNamesLoading = false;
      mosqueNamesLoadPromise = null;
    }
  }

  function setSelectedMosqueAddress(address = '') {
    if (mosqueAddressInput) mosqueAddressInput.value = address;
  }

  function showSingleMosqueAddress(address) {
    if (!address || !mosqueAddressPanel) return;

    mosqueAddressPanel.hidden = false;
    if (mosqueAddressMessage) mosqueAddressMessage.textContent = `Address: ${address}`;
    if (mosqueAddressSelectWrap) mosqueAddressSelectWrap.hidden = true;
    if (mosqueAddressSelect) {
      mosqueAddressSelect.required = false;
      mosqueAddressSelect.removeAttribute('aria-invalid');
      mosqueAddressSelect.value = '';
    }
    setSelectedMosqueAddress(address);
    updateCarouselHeight();
  }

  function clearMosqueAddressMatch() {
    setSelectedMosqueAddress();
    if (mosqueAddressPanel) mosqueAddressPanel.hidden = true;
    if (mosqueAddressMessage) mosqueAddressMessage.textContent = '';
    if (mosqueAddressSelectWrap) mosqueAddressSelectWrap.hidden = true;
    if (mosqueAddressSelect) {
      mosqueAddressSelect.required = false;
      mosqueAddressSelect.removeAttribute('aria-invalid');
      mosqueAddressSelect.value = '';
    }
    updateCarouselHeight();
  }

  function renderAddressChoices(addresses) {
    if (!mosqueAddressSelect) return;

    const currentValue = mosqueAddressSelect.value;
    const fragment = document.createDocumentFragment();
    const placeholder = document.createElement('option');

    placeholder.value = '';
    placeholder.textContent = 'Select an address';
    fragment.append(placeholder);

    addresses.forEach((address) => {
      const option = document.createElement('option');
      option.value = address;
      option.textContent = address;
      fragment.append(option);
    });

    mosqueAddressSelect.replaceChildren(fragment);

    if (addresses.includes(currentValue)) {
      mosqueAddressSelect.value = currentValue;
      setSelectedMosqueAddress(currentValue);
    } else {
      mosqueAddressSelect.value = '';
      setSelectedMosqueAddress();
    }
  }

  function syncMosqueAddressMatch() {
    if (!mosqueNameInput || !mosqueAddressPanel) return;

    if (selectedMosqueEntry && normaliseMosqueName(mosqueNameInput.value) === selectedMosqueEntry.key) {
      if (selectedMosqueEntry.address) {
        showSingleMosqueAddress(selectedMosqueEntry.address);
      } else {
        clearMosqueAddressMatch();
      }
      return;
    }

    const entry = mosqueDirectory.get(normaliseMosqueName(mosqueNameInput.value));
    if (!entry) {
      clearMosqueAddressMatch();
      return;
    }

    const addresses = [...entry.addresses].sort((a, b) => a.localeCompare(b));
    if (!addresses.length) {
      clearMosqueAddressMatch();
      return;
    }

    mosqueAddressPanel.hidden = false;
    mosqueAddressSelect?.removeAttribute('aria-invalid');

    if (addresses.length === 1) {
      showSingleMosqueAddress(addresses[0]);
      return;
    }

    if (mosqueAddressMessage) {
      mosqueAddressMessage.textContent = 'We found more than one mosque with this name. Please choose the correct address.';
    }

    if (mosqueAddressSelectWrap) mosqueAddressSelectWrap.hidden = false;
    if (mosqueAddressSelect) mosqueAddressSelect.required = true;
    renderAddressChoices(addresses);
    updateCarouselHeight();
  }

  function chooseMosqueSuggestion(entry) {
    if (!mosqueNameInput) return;

    selectedMosqueEntry = entry;
    mosqueNameInput.value = entry.name;
    hideMosqueSuggestions();

    if (entry.address) {
      showSingleMosqueAddress(entry.address);
    } else {
      clearMosqueAddressMatch();
    }

    setError();
  }

  function renderMosqueSuggestions() {
    if (!mosqueNameInput || !mosqueNameList || !mosqueNamesLoaded) return;

    const query = normaliseMosqueName(mosqueNameInput.value);
    const compactQuery = compactMosqueSearchText(mosqueNameInput.value);
    if (compactQuery.length < 2) {
      hideMosqueSuggestions();
      return;
    }

    const matches = mosqueEntries
      .filter((entry) => entry.searchText.includes(query) || entry.compactSearchText.includes(compactQuery))
      .sort((a, b) => {
        const aStarts = a.searchText.startsWith(query) || a.compactSearchText.startsWith(compactQuery);
        const bStarts = b.searchText.startsWith(query) || b.compactSearchText.startsWith(compactQuery);
        return Number(bStarts) - Number(aStarts) || a.name.localeCompare(b.name) || a.address.localeCompare(b.address);
      })
      .slice(0, 8);

    if (!matches.length) {
      hideMosqueSuggestions();
      return;
    }

    const fragment = document.createDocumentFragment();

    matches.forEach((entry) => {
      const button = document.createElement('button');
      const name = document.createElement('span');
      const address = document.createElement('small');

      button.type = 'button';
      button.className = 'mosque-name-suggestions__item';
      button.setAttribute('role', 'option');
      button.addEventListener('click', () => chooseMosqueSuggestion(entry));

      name.textContent = entry.name;
      address.textContent = entry.address || 'Address not listed';
      button.append(name, address);
      fragment.append(button);
    });

    mosqueNameList.replaceChildren(fragment);
    setMosqueSuggestionsOpen(true);
    updateCarouselHeight();
  }

  function setStep(index) {
    currentStep = Math.max(0, Math.min(index, slides.length - 1));
    form.style.setProperty('--mosque-form-offset', `-${currentStep * 100}%`);
    form.style.setProperty('--mosque-form-progress', `${((currentStep + 1) / slides.length) * 100}%`);
    if (stepLabel) stepLabel.textContent = `Step ${currentStep + 1} of ${slides.length}`;

    slides.forEach((slide, slideIndex) => {
      slide.toggleAttribute('inert', slideIndex !== currentStep);
      slide.setAttribute('aria-hidden', String(slideIndex !== currentStep));
    });

    setCarouselButtonVisible(backButton, currentStep > 0);
    setCarouselButtonVisible(nextButton, currentStep < slides.length - 1);
    setCarouselButtonVisible(submitButton, currentStep === slides.length - 1);
    setError();
    updateCarouselHeight();
  }

  function currentInput() {
    return slides[currentStep]?.querySelector('input[required]');
  }

  function validateStep() {
    setError();
    form.querySelectorAll('[aria-invalid="true"]').forEach((input) => input.removeAttribute('aria-invalid'));

    if (currentStep === 1) {
      const hasSelection = optionInputs.some((input) => input.checked);
      if (!hasSelection) {
        setError('Please choose at least one option.');
        optionInputs[0]?.focus();
      }
      return hasSelection;
    }

    if (currentStep === 2) {
      const hasFrequency = frequencyInputs.some((input) => input.checked);
      if (!hasFrequency) {
        setError('Please choose how often your mosque would like to do litter picks.');
        frequencyInputs[0]?.focus();
      }
      return hasFrequency;
    }

    const input = currentInput();
    if (!input) return true;

    const value = input.value.trim();
    const isPhone = input.type === 'tel';
    const isEmail = input.type === 'email';
    const phoneIsValid = /^[+()0-9\s-]{7,20}$/.test(value);
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isValid = value.length > 0 && (!isPhone || phoneIsValid) && (!isEmail || emailIsValid);

    if (!isValid) {
      input.setAttribute('aria-invalid', 'true');
      setError(isPhone ? 'Please enter a valid phone number.' : isEmail ? 'Please enter a valid email address.' : 'Please complete this field.');
      input.focus();
    }

    if (!isValid) return false;

    if (input === mosqueNameInput && mosqueAddressSelect && mosqueAddressSelect.required && !mosqueAddressInput?.value.trim()) {
      mosqueAddressSelect.setAttribute('aria-invalid', 'true');
      setError('Please choose the correct mosque address.');
      mosqueAddressSelect.focus();
      return false;
    }

    return true;
  }

  function showSuccess() {
    if (!submitPending) return;
    submitPending = false;
    window.clearTimeout(successTimer);
    form.classList.add('is-complete');
    success.hidden = false;
    success.focus?.();
  }

  function showReturnedSuccess() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mosque-request') !== 'sent') return false;

    submitPending = true;
    slides.forEach((slide) => {
      slide.hidden = true;
      slide.setAttribute('aria-hidden', 'true');
      slide.toggleAttribute('inert', true);
    });
    setCarouselButtonVisible(backButton, false);
    setCarouselButtonVisible(nextButton, false);
    setCarouselButtonVisible(submitButton, false);
    setError();
    showSuccess();
    form.scrollIntoView({ block: 'center' });
    return true;
  }

  function buildMosquePayload() {
    const data = new FormData(form);
    const supportRequested = data.getAll('Support requested').map((item) => String(item).trim()).filter(Boolean);

    return {
      mosqueName: String(data.get('Mosque name') || '').trim(),
      mosqueAddress: String(data.get('Mosque address') || '').trim(),
      supportRequested,
      contactName: String(data.get('Contact name') || '').trim(),
      contactEmail: String(data.get('email') || '').trim(),
      phoneNumber: String(data.get('Phone number') || '').trim(),
      pickFrequency: String(data.get('Pick frequency') || '').trim(),
      additionalDetails: String(data.get('Additional details') || '').trim(),
      submittedFrom: 'Mosque page'
    };
  }

  function buildEmailFallbackData(payload) {
    const message = [
      'New Mosque Enquiry',
      '',
      `Mosque: ${payload.mosqueName}`,
      `Address: ${payload.mosqueAddress || 'Not selected'}`,
      `Support requested: ${payload.supportRequested.join(', ')}`,
      `Contact name: ${payload.contactName || 'Not provided'}`,
      `Email: ${payload.contactEmail || 'Not provided'}`,
      `Mobile: ${payload.phoneNumber || 'Not provided'}`,
      `Long-term pick frequency: ${payload.pickFrequency || 'Not provided'}`,
      `Additional details: ${payload.additionalDetails || 'None provided'}`,
      '',
      'Submitted from: Mosque page'
    ].join('\n');

    const fallbackData = new FormData();
    fallbackData.append('_subject', 'New mosque support pack request');
    fallbackData.append('_template', 'table');
    fallbackData.append('_captcha', 'false');
    fallbackData.append('_next', `${window.location.origin}${window.location.pathname}?mosque-request=sent#mosque-support-steps`);
    if (payload.contactEmail) {
      fallbackData.append('email', payload.contactEmail);
      fallbackData.append('_replyto', payload.contactEmail);
      fallbackData.append('_cc', payload.contactEmail);
    }
    fallbackData.append('message', message);
    return fallbackData;
  }

  async function sendEmailFallback(payload) {
    const fallbackEndpoint = form.dataset.emailFallback;
    if (!fallbackEndpoint) return false;

    const directEndpoint = fallbackEndpoint.replace('/ajax/', '/');
    const fallbackForm = document.createElement('form');
    fallbackForm.method = 'POST';
    fallbackForm.action = directEndpoint;
    fallbackForm.hidden = true;

    buildEmailFallbackData(payload).forEach((value, key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      fallbackForm.append(input);
    });

    document.body.append(fallbackForm);
    fallbackForm.submit();
    return true;
  }

  async function submitMosqueEnquiry() {
    const payload = buildMosquePayload();
    let sent = false;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('Mosque enquiry API failed:', response.status, await response.text().catch(() => ''));
        sent = await sendEmailFallback(payload);
      } else {
        const result = await response.json().catch(() => ({ ok: true, emailOk: true }));
        sent = result.emailOk !== false;

        if (!sent) {
          sent = await sendEmailFallback(payload);
        }
      }
    } catch (error) {
      console.error('Mosque enquiry API error:', error);
      sent = await sendEmailFallback(payload);
    } finally {
      if (sent) {
        showSuccess();
      } else {
        submitPending = false;
        window.clearTimeout(successTimer);
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
        setError('Sorry, we could not send your request. Please email purestreets0@gmail.com directly.');
      }
    }
  }

  optionInputs.forEach((input) => {
    input.addEventListener('change', () => {
      if (input === allSupportInput && input.checked) {
        optionInputs.forEach((option) => {
          option.checked = true;
        });
      }

      if (input !== allSupportInput && !input.checked && allSupportInput) {
        allSupportInput.checked = false;
      }

      const standardOptions = optionInputs.filter((option) => option !== allSupportInput);
      if (standardOptions.length && standardOptions.every((option) => option.checked) && allSupportInput) {
        allSupportInput.checked = true;
      }

      markOptions();
      setError();
    });
  });

  frequencyInputs.forEach((input) => {
    input.addEventListener('change', () => {
      markOptions();
      setError();
    });
  });

  mosqueNameInput?.addEventListener('focus', () => {
    loadMosqueNameSuggestions().then(() => {
      renderMosqueSuggestions();
      syncMosqueAddressMatch();
    });
  });

  mosqueNameInput?.addEventListener('input', () => {
    selectedMosqueEntry = null;
    setSelectedMosqueAddress();
    loadMosqueNameSuggestions().then(() => {
      renderMosqueSuggestions();
      syncMosqueAddressMatch();
    });
  });

  mosqueNameInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideMosqueSuggestions();
    }
  });

  document.addEventListener('click', (event) => {
    if (!mosqueNameInput?.contains(event.target) && !mosqueNameList?.contains(event.target)) {
      hideMosqueSuggestions();
    }
  });

  mosqueAddressSelect?.addEventListener('change', () => {
    setSelectedMosqueAddress(mosqueAddressSelect.value);
    mosqueAddressSelect.removeAttribute('aria-invalid');
    setError();
  });

  nextButton.addEventListener('click', () => {
    if (!validateStep()) return;
    setStep(currentStep + 1);
  });

  backButton.addEventListener('click', () => {
    setStep(currentStep - 1);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (currentStep !== slides.length - 1) {
      if (validateStep()) setStep(currentStep + 1);
      return;
    }

    if (!validateStep()) {
      return;
    }

    submitPending = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    submitMosqueEnquiry();
  });

  markOptions();
  setStep(0);
  showReturnedSuccess();
}

function initGroupCarouselForms() {
  const forms = [...document.querySelectorAll('[data-group-form]')];
  if (!forms.length) return;

  const UNIVERSITY_OTHER_VALUE = 'Other institution not listed';
  const universityDataCache = new Map();

  function normaliseUniversitySearch(value) {
    return String(value || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function universitySearchText(university) {
    return normaliseUniversitySearch([
      university.name,
      university.nation,
      ...(Array.isArray(university.aliases) ? university.aliases : [])
    ].join(' '));
  }

  async function loadUniversityData(src) {
    if (!src) return [];
    if (!universityDataCache.has(src)) {
      universityDataCache.set(src, fetch(src).then((response) => {
        if (!response.ok) throw new Error(`Unable to load universities: ${response.status}`);
        return response.json();
      }).catch((error) => {
        console.error(error);
        return [];
      }));
    }

    const universities = await universityDataCache.get(src);
    return universities.map((university) => ({
      ...university,
      searchText: university.searchText || universitySearchText(university)
    }));
  }

  forms.forEach((form) => {
    const slides = [...form.querySelectorAll('[data-group-slide]')];
    const stepLabel = form.querySelector('[data-group-step-label]');
    const backButton = form.querySelector('[data-group-back]');
    const nextButton = form.querySelector('[data-group-next]');
    const submitButton = form.querySelector('[data-group-submit]');
    const success = form.querySelector('[data-group-success]');
    const error = form.querySelector('[data-group-error]');
    const optionInputs = [...form.querySelectorAll('.mosque-option-card input')];
    const universityComboboxes = [...form.querySelectorAll('[data-university-combobox]')];
    let currentStep = 0;
    let submitPending = false;
    let successTimer;

    function setError(message = '') {
      if (error) error.textContent = message;
    }

    function markOptions() {
      optionInputs.forEach((input) => {
        input.closest('.mosque-option-card')?.classList.toggle('is-selected', input.checked);
      });
    }

    function setButtonVisible(button, isVisible) {
      if (!button) return;
      button.hidden = !isVisible;
      button.classList.toggle('is-hidden', !isVisible);
      button.style.display = isVisible ? '' : 'none';
    }

    function updateHeight() {
      const activeSlide = slides[currentStep];
      if (!activeSlide) return;
      window.requestAnimationFrame(() => {
        form.style.setProperty('--mosque-form-active-height', `${activeSlide.scrollHeight}px`);
      });
    }

    function setupUniversityCombobox(root) {
      const input = root.querySelector('[data-university-input]');
      const hiddenValue = root.querySelector('[data-university-value]');
      const list = root.querySelector('[data-university-list]');
      const otherWrap = root.querySelector('[data-university-other-wrap]');
      const otherInput = root.querySelector('[data-university-other]');
      const src = root.dataset.universitiesSrc;
      let universities = [];
      let visibleOptions = [];
      let activeIndex = -1;
      let selectedUniversity = '';
      let optionsOpen = false;

      if (!input || !list) return null;

      function setOpen(isOpen) {
        optionsOpen = isOpen;
        list.hidden = !isOpen;
        input.setAttribute('aria-expanded', String(isOpen));
        if (!isOpen) {
          activeIndex = -1;
          input.removeAttribute('aria-activedescendant');
        }
        updateHeight();
      }

      function setActiveOption(index) {
        activeIndex = Math.max(-1, Math.min(index, visibleOptions.length - 1));
        list.querySelectorAll('[role="option"]').forEach((option, optionIndex) => {
          const isActive = optionIndex === activeIndex;
          option.classList.toggle('is-active', isActive);
          option.setAttribute('aria-selected', String(isActive));
          if (isActive) {
            input.setAttribute('aria-activedescendant', option.id);
            option.scrollIntoView({ block: 'nearest' });
          }
        });

        if (activeIndex < 0) input.removeAttribute('aria-activedescendant');
      }

      function syncOtherField() {
        const isOther = selectedUniversity === UNIVERSITY_OTHER_VALUE;
        if (otherWrap) otherWrap.hidden = !isOther;
        if (otherInput) {
          otherInput.disabled = !isOther;
          otherInput.required = isOther;
          if (!isOther) otherInput.value = '';
        }
        updateHeight();
      }

      function chooseUniversity(university) {
        selectedUniversity = university.name;
        input.value = university.name;
        if (hiddenValue) hiddenValue.value = university.name;
        input.removeAttribute('aria-invalid');
        hiddenValue?.removeAttribute('aria-invalid');
        setError();
        setOpen(false);
        syncOtherField();
      }

      function renderOptions(query = input.value) {
        const normalisedQuery = normaliseUniversitySearch(query);
        if (!normalisedQuery) {
          visibleOptions = [];
          list.innerHTML = '';
          setOpen(false);
          return;
        }

        const matches = universities
          .filter((university) => university.name !== UNIVERSITY_OTHER_VALUE && university.searchText.includes(normalisedQuery))
          .slice(0, 10);

        visibleOptions = matches;
        list.innerHTML = '';

        if (!matches.length) {
          const empty = document.createElement('p');
          empty.className = 'university-combobox__empty';
          empty.textContent = 'No matching university found';
          list.append(empty);
          setOpen(true);
          return;
        }

        const fragment = document.createDocumentFragment();
        matches.forEach((university, index) => {
          const option = document.createElement('button');
          const name = document.createElement('strong');
          const detail = document.createElement('small');
          option.type = 'button';
          option.id = `${input.id || 'university-option'}-${index}`;
          option.className = 'university-combobox__option';
          option.setAttribute('role', 'option');
          option.setAttribute('aria-selected', 'false');
          option.addEventListener('click', () => chooseUniversity(university));
          name.textContent = university.name;
          detail.textContent = university.aliases?.length ? `${university.nation} - ${university.aliases.join(', ')}` : university.nation;
          option.append(name, detail);
          fragment.append(option);
        });

        list.append(fragment);
        setOpen(true);
        setActiveOption(-1);
      }

      function validate() {
        input.removeAttribute('aria-invalid');
        hiddenValue?.removeAttribute('aria-invalid');
        otherInput?.removeAttribute('aria-invalid');

        const typedValue = input.value.trim();
        if (!typedValue) {
          input.setAttribute('aria-invalid', 'true');
          setError('Please enter your university name.');
          input.focus();
          renderOptions(input.value);
          return false;
        }

        if (hiddenValue) hiddenValue.value = typedValue;

        if (selectedUniversity === UNIVERSITY_OTHER_VALUE) {
          const otherValue = otherInput?.value.trim() || '';
          if (!otherValue) {
            otherInput?.setAttribute('aria-invalid', 'true');
            setError('Please enter your university or institution name.');
            otherInput?.focus();
            return false;
          }
          hiddenValue.value = otherValue;
        }

        return true;
      }

      loadUniversityData(src).then((items) => {
        universities = items;
        renderOptions('');
        setOpen(false);
      });

      input.addEventListener('focus', () => {
        if (!universities.length) {
          loadUniversityData(src).then((items) => {
            universities = items;
            renderOptions(input.value);
          });
          return;
        }
        renderOptions(input.value);
      });

      input.addEventListener('input', () => {
        selectedUniversity = '';
        if (hiddenValue) hiddenValue.value = '';
        syncOtherField();
        renderOptions(input.value);
      });

      input.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          if (!optionsOpen) renderOptions(input.value);
          setActiveOption(activeIndex + 1);
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          if (!optionsOpen) renderOptions(input.value);
          setActiveOption(activeIndex <= 0 ? visibleOptions.length - 1 : activeIndex - 1);
        } else if (event.key === 'Enter') {
          if (optionsOpen && activeIndex >= 0 && visibleOptions[activeIndex]) {
            event.preventDefault();
            chooseUniversity(visibleOptions[activeIndex]);
          }
        } else if (event.key === 'Escape') {
          setOpen(false);
        }
      });

      document.addEventListener('click', (event) => {
        if (!root.contains(event.target)) setOpen(false);
      });

      return { root, validate };
    }

    const universityControls = universityComboboxes.map(setupUniversityCombobox).filter(Boolean);

    function setStep(index) {
      currentStep = Math.max(0, Math.min(index, slides.length - 1));
      form.style.setProperty('--mosque-form-offset', `-${currentStep * 100}%`);
      form.style.setProperty('--mosque-form-progress', `${((currentStep + 1) / slides.length) * 100}%`);
      if (stepLabel) stepLabel.textContent = `Step ${currentStep + 1} of ${slides.length}`;

      slides.forEach((slide, slideIndex) => {
        slide.toggleAttribute('inert', slideIndex !== currentStep);
        slide.setAttribute('aria-hidden', String(slideIndex !== currentStep));
      });

      setButtonVisible(backButton, currentStep > 0);
      setButtonVisible(nextButton, currentStep < slides.length - 1);
      setButtonVisible(submitButton, currentStep === slides.length - 1);
      setError();
      updateHeight();
    }

    function validateStep() {
      const slide = slides[currentStep];
      if (!slide) return true;

      setError();
      slide.querySelectorAll('[aria-invalid="true"]').forEach((input) => input.removeAttribute('aria-invalid'));

      const requiredGroup = slide.querySelector('[data-required-group]');
      if (requiredGroup) {
        const groupInputs = [...requiredGroup.querySelectorAll('input[type="checkbox"], input[type="radio"]')];
        const hasSelection = groupInputs.some((input) => input.checked);
        if (!hasSelection) {
          setError('Please choose at least one option.');
          groupInputs[0]?.focus();
        }
        return hasSelection;
      }

      const universityControl = universityControls.find((control) => slide.contains(control.root));
      if (universityControl && !universityControl.validate()) {
        return false;
      }

      const requiredInputs = [...slide.querySelectorAll('input[required], textarea[required], select[required]')];
      for (const input of requiredInputs) {
        const value = input.value.trim();
        const isPhone = input.type === 'tel';
        const isEmail = input.type === 'email';
        const isValid = value.length > 0 && (!isPhone || /^[+()0-9\s-]{7,20}$/.test(value)) && (!isEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

        if (!isValid) {
          input.setAttribute('aria-invalid', 'true');
          setError(isPhone ? 'Please enter a valid mobile number.' : isEmail ? 'Please enter a valid email address.' : 'Please complete this field.');
          input.focus();
          return false;
        }
      }

      return true;
    }

    function buildPayload() {
      const data = new FormData(form);
      return {
        groupType: String(data.get('Group type') || form.dataset.groupType || 'General').trim(),
        organisationName: String(data.get('Organisation name') || '').trim(),
        isocName: String(data.get('ISoc name') || '').trim(),
        location: String(data.get('Location') || '').trim(),
        supportRequested: data.getAll('Support requested').map((item) => String(item).trim()).filter(Boolean),
        pickFrequency: String(data.get('Pick frequency') || '').trim(),
        additionalDetails: String(data.get('Additional details') || '').trim(),
        contactName: String(data.get('Contact name') || '').trim(),
        contactEmail: String(data.get('email') || '').trim(),
        phoneNumber: String(data.get('Phone number') || '').trim(),
        submittedFrom: `${String(data.get('Group type') || form.dataset.groupType || 'Group').trim()} page`
      };
    }

    function showSuccess() {
      if (!submitPending) return;
      submitPending = false;
      window.clearTimeout(successTimer);
      form.classList.add('is-complete');
      if (success) {
        success.hidden = false;
        success.focus?.();
      }
    }

    async function submitGroupEnquiry() {
      const payload = buildPayload();

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.error('Group enquiry API failed:', response.status, await response.text().catch(() => ''));
        }
      } catch (error) {
        console.error('Group enquiry API error:', error);
      } finally {
        showSuccess();
      }
    }

    optionInputs.forEach((input) => {
      input.addEventListener('change', () => {
        markOptions();
        setError();
      });
    });

    nextButton?.addEventListener('click', () => {
      if (!validateStep()) return;
      setStep(currentStep + 1);
    });

    backButton?.addEventListener('click', () => {
      setStep(currentStep - 1);
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (currentStep !== slides.length - 1) {
        if (validateStep()) setStep(currentStep + 1);
        return;
      }

      if (!validateStep()) return;

      submitPending = true;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
      }
      successTimer = window.setTimeout(showSuccess, 3000);
      submitGroupEnquiry();
    });

    markOptions();
    setStep(0);
  });
}
initRippleEffect();
initStickyCta();
initPureBot();
initVolunteerTracker();
initMosqueCarouselForm();
initGroupCarouselForms();
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });
window.addEventListener('resize', setHeaderState);
