const header = document.querySelector('[data-header]');
const nav = document.querySelector('[data-nav]');
const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = [...document.querySelectorAll('.site-nav a')];
const samePageNavLinks = navLinks.filter((link) => link.getAttribute('href')?.startsWith('#'));
const counters = [...document.querySelectorAll('[data-count]')];
const revealItems = [...document.querySelectorAll('[data-reveal]')];

function setHeaderState() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 18 || document.body.classList.contains('subpage'));
}

if (navToggle && nav && header) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    header.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    nav?.classList.remove('is-open');
    header?.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navToggle?.setAttribute('aria-label', 'Open menu');
  });
});

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

  if (revealItems.length) {
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
initPureBot();
initVolunteerTracker();
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

