(function () {
  const CREDENTIALS = { username: 'purestreets', password: 'CleanStreets2026!' };
  const SESSION_KEY = 'purestreets-admin-session';
  const VOLUNTEER_KEY = 'purestreets-volunteer-month';
  const SCHOOLS_KEY = 'purestreets-schools';

  const loginSection = document.querySelector('[data-admin-login]');
  const loginForm = document.querySelector('[data-admin-login-form]');
  const loginError = document.querySelector('[data-admin-error]');
  const dashboard = document.querySelector('[data-admin-dashboard]');
  const logoutBtn = document.querySelector('[data-admin-logout]');

  const volunteerForm = document.querySelector('[data-admin-volunteer-form]');
  const schoolInput = document.querySelector('[data-admin-school-input]');
  const addSchoolBtn = document.querySelector('[data-admin-add-school]');
  const schoolTags = document.querySelector('[data-admin-school-tags]');
  const schoolDatalist = document.querySelector('[data-school-list]');
  const resetBtn = document.querySelector('[data-admin-reset]');

  const adminRows = document.querySelector('[data-admin-rows]');
  const adminEmpty = document.querySelector('[data-admin-empty]');
  const adminEntries = document.querySelector('[data-admin-entries]');
  const leaderName = document.querySelector('[data-admin-leader-name]');
  const leaderDetail = document.querySelector('[data-admin-leader-detail]');

  function isAuthenticated() {
    try {
      const session = JSON.parse(sessionStorage.getItem(SESSION_KEY));
      return session && session.authenticated === true;
    } catch {
      return false;
    }
  }

  function setAuthenticated(value) {
    if (value) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ authenticated: true }));
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  }

  function showDashboard() {
    loginSection.hidden = true;
    dashboard.hidden = false;
    const monthInput = volunteerForm.querySelector('input[name="month"]');
    if (monthInput && !monthInput.value) {
      monthInput.value = new Date().toISOString().slice(0, 7);
    }
    renderAll();
  }

  function showLogin() {
    loginSection.hidden = false;
    dashboard.hidden = true;
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = new FormData(loginForm);
    const user = String(data.get('username') || '').trim();
    const pass = String(data.get('password') || '').trim();

    if (user === CREDENTIALS.username && pass === CREDENTIALS.password) {
      loginError.hidden = true;
      setAuthenticated(true);
      showDashboard();
    } else {
      loginError.hidden = false;
    }
  });

  logoutBtn.addEventListener('click', function () {
    setAuthenticated(false);
    showLogin();
  });

  function readEntries() {
    try {
      return JSON.parse(localStorage.getItem(VOLUNTEER_KEY)) || [];
    } catch {
      return [];
    }
  }

  function writeEntries(entries) {
    localStorage.setItem(VOLUNTEER_KEY, JSON.stringify(entries));
  }

  function readSchools() {
    try {
      return JSON.parse(localStorage.getItem(SCHOOLS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function writeSchools(schools) {
    localStorage.setItem(SCHOOLS_KEY, JSON.stringify(schools));
  }

  function pointsFor(entry) {
    return 20 + (entry.bags * 5) + (entry.hours * 10) + entry.bonus;
  }

  function getBoard(entries) {
    var board = new Map();
    entries.forEach(function (entry) {
      var id = entry.month + '::' + entry.name.toLowerCase();
      var current = board.get(id) || {
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
    return Array.from(board.values()).sort(function (a, b) {
      return b.points - a.points || b.bags - a.bags || a.name.localeCompare(b.name);
    });
  }

  function renderBoard() {
    var board = getBoard(readEntries());
    adminRows.innerHTML = '';
    if (adminEmpty) adminEmpty.hidden = board.length > 0;

    if (!board.length) {
      if (leaderName) leaderName.textContent = 'Waiting for entries';
      if (leaderDetail) leaderDetail.textContent = 'Add an entry to begin.';
      leaderName?.closest('.volunteer-leader')?.classList.remove('is-celebrating');
      return;
    }

    var leader = board[0];
    var leaderCard = leaderName?.closest('.volunteer-leader');
    if (leaderName) leaderName.textContent = leader.name;
    if (leaderCard) {
      leaderCard.classList.remove('is-celebrating');
      void leaderCard.offsetWidth;
      leaderCard.classList.add('is-celebrating');
    }
    if (leaderDetail) {
      leaderDetail.textContent = leader.points + ' points in ' + leader.month + ': ' + leader.sessions + ' clean-ups, ' + leader.bags + ' bags, ' + leader.hours + ' hours.' + (leader.school ? ' (' + leader.school + ')' : '');
    }

    board.forEach(function (person, index) {
      var row = document.createElement('article');
      row.className = 'volunteer-row' + (index === 0 ? ' is-leading' : '');
      row.setAttribute('role', 'row');
      row.innerHTML =
        '<div class="volunteer-person" role="cell"><strong></strong><small></small></div>' +
        '<span role="cell">' + person.sessions + '</span>' +
        '<span role="cell">' + person.bags + '</span>' +
        '<span role="cell">' + person.hours + '</span>' +
        '<strong class="volunteer-points" role="cell">' + person.points + '</strong>' +
        '<span role="cell" class="admin-row-actions"><button class="btn-icon" type="button" data-delete-person="' + person.month + '::' + person.name.toLowerCase() + '" title="Delete all entries for this volunteer">&#x2715;</button></span>';
      row.querySelector('.volunteer-person strong').textContent = person.name;
      row.querySelector('.volunteer-person small').textContent = person.month + ' - ' + (person.latestRoute || 'route') + (person.school ? ' (' + person.school + ')' : '');
      adminRows.appendChild(row);
    });

    adminRows.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-delete-person]');
      if (!btn) return;
      var personId = btn.dataset.deletePerson;
      if (!confirm('Delete ALL entries for this volunteer?')) return;
      var entries = readEntries().filter(function (entry) {
        return (entry.month + '::' + entry.name.toLowerCase()) !== personId;
      });
      writeEntries(entries);
      renderAll();
    });
  }

  function renderEntries() {
    var entries = readEntries();
    adminEntries.innerHTML = '';

    if (!entries.length) {
      adminEntries.innerHTML = '<p class="admin-hint">No raw entries.</p>';
      return;
    }

    entries.forEach(function (entry, idx) {
      var el = document.createElement('div');
      el.className = 'admin-entry';
      el.innerHTML =
        '<div class="admin-entry__info">' +
          '<strong>' + escapeHtml(entry.name) + '</strong>' +
          '<span>' + escapeHtml(entry.month) + ' &middot; ' + escapeHtml(entry.route) + (entry.school ? ' &middot; ' + escapeHtml(entry.school) : '') + '</span>' +
          '<small>Bags: ' + entry.bags + ' | Hours: ' + entry.hours + ' | Bonus: ' + entry.bonus + ' | Points: ' + pointsFor(entry) + '</small>' +
          (entry.note ? '<em>' + escapeHtml(entry.note) + '</em>' : '') +
        '</div>' +
        '<div class="admin-entry__actions">' +
          '<button class="btn-icon btn-icon--edit" type="button" data-edit-entry="' + idx + '" title="Edit">&#x270E;</button>' +
          '<button class="btn-icon btn-icon--delete" type="button" data-delete-entry="' + idx + '" title="Delete">&#x2715;</button>' +
        '</div>';
      adminEntries.appendChild(el);
    });

    adminEntries.addEventListener('click', function (e) {
      var deleteBtn = e.target.closest('[data-delete-entry]');
      if (deleteBtn) {
        var idx = Number(deleteBtn.dataset.deleteEntry);
        if (!confirm('Delete this entry?')) return;
        var entries = readEntries();
        entries.splice(idx, 1);
        writeEntries(entries);
        renderAll();
        return;
      }

      var editBtn = e.target.closest('[data-edit-entry]');
      if (editBtn) {
        var idx = Number(editBtn.dataset.editEntry);
        var entries = readEntries();
        var entry = entries[idx];
        if (!entry) return;

        var name = prompt('Volunteer name:', entry.name);
        if (name === null) return;
        var school = prompt('School / ISOC:', entry.school || '');
        if (school === null) return;
        var bags = prompt('Bags collected:', entry.bags);
        if (bags === null) return;
        var hours = prompt('Hours served:', entry.hours);
        if (hours === null) return;
        var bonus = prompt('Bonus points:', entry.bonus);
        if (bonus === null) return;

        entry.name = name.trim() || entry.name;
        entry.school = school.trim();
        entry.bags = Math.max(0, Number(bags) || 0);
        entry.hours = Math.max(0, Number(hours) || 0);
        entry.bonus = Math.max(0, Number(bonus) || 0);
        entries[idx] = entry;
        writeEntries(entries);
        renderAll();
      }
    });
  }

  function renderSchools() {
    var schools = readSchools();
    schoolTags.innerHTML = '';
    schoolDatalist.innerHTML = '';

    schools.forEach(function (school) {
      var tag = document.createElement('span');
      tag.className = 'admin-tag';
      tag.innerHTML = escapeHtml(school) + ' <button type="button" data-remove-school="' + escapeHtml(school) + '" title="Remove">&times;</button>';
      schoolTags.appendChild(tag);

      var option = document.createElement('option');
      option.value = school;
      schoolDatalist.appendChild(option);
    });

    schoolTags.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-remove-school]');
      if (!btn) return;
      var toRemove = btn.dataset.removeSchool;
      var schools = readSchools().filter(function (s) { return s !== toRemove; });
      writeSchools(schools);
      renderSchools();
    });
  }

  function renderAll() {
    renderBoard();
    renderEntries();
    renderSchools();
  }

  volunteerForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = new FormData(volunteerForm);
    var entry = {
      name: String(data.get('name') || '').trim(),
      school: String(data.get('school') || '').trim(),
      month: String(data.get('month') || '').trim(),
      route: String(data.get('route') || '').trim(),
      bags: Math.max(0, Number(data.get('bags')) || 0),
      hours: Math.max(0, Number(data.get('hours')) || 0),
      bonus: Math.max(0, Number(data.get('bonus')) || 0),
      note: String(data.get('note') || '').trim()
    };

    if (!entry.name || !entry.month || !entry.route) return;

    var entries = readEntries();
    entries.push(entry);
    writeEntries(entries);

    if (entry.school) {
      var schools = readSchools();
      if (schools.indexOf(entry.school) === -1) {
        schools.push(entry.school);
        writeSchools(schools);
      }
    }

    volunteerForm.reset();
    var monthInput = volunteerForm.querySelector('input[name="month"]');
    if (monthInput) monthInput.value = entry.month;
    renderAll();
  });

  addSchoolBtn.addEventListener('click', function () {
    var name = schoolInput.value.trim();
    if (!name) return;
    var schools = readSchools();
    if (schools.indexOf(name) === -1) {
      schools.push(name);
      writeSchools(schools);
    }
    schoolInput.value = '';
    renderSchools();
  });

  resetBtn.addEventListener('click', function () {
    if (!confirm('This will delete ALL volunteer entries. Are you sure?')) return;
    localStorage.removeItem(VOLUNTEER_KEY);
    renderAll();
  });

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  if (isAuthenticated()) {
    showDashboard();
  } else {
    showLogin();
  }
})();
