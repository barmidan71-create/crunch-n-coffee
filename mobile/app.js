/* Crunch & Coffee — Mobile Application */

const game = new Game()
let selectedBudget = 50000
let selectedLogo = 0

/* Room system */
const room = new RoomManager()
window._room = room
let _roomState = null
function gs() { return (_roomState && room.roomCode && !room.isHost) ? _roomState : game.getStatus() }
function roomHistory() { return _roomState ? (_roomState.history || []) : game.history }

document.addEventListener('DOMContentLoaded', () => {
  initNav()
  renderStartScreen()
})

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  document.getElementById('screen-' + id).classList.add('active')
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'))
  const btn = document.querySelector(`.nav-item[data-screen="${id}"]`)
  if (btn) btn.classList.add('active')
  renderScreen(id)
  window.scrollTo(0, 0)
}

function initNav() {
  const items = [
    { id: 'dashboard', label: 'Главная', icon: 'chart' },
    { id: 'project', label: 'Проект', icon: 'gamepad' },
    { id: 'team', label: 'Команда', icon: 'users' },
    { id: 'hire', label: 'Найм', icon: 'team' },
    { id: 'history', label: 'История', icon: 'document' }
  ]
  const nav = document.getElementById('bottom-nav')
  nav.innerHTML = items.map(n => `
    <button class="nav-item${n.id === 'dashboard' ? ' active' : ''}" data-screen="${n.id}">
      ${genIcon(n.icon, 22)}
      <span>${n.label}</span>
    </button>
  `).join('')
  nav.addEventListener('click', e => {
    const btn = e.target.closest('.nav-item')
    if (btn) showScreen(btn.dataset.screen)
  })
}

function renderMChart(history) {
  if (history.length < 1) return '<div style="height:60px;display:flex;align-items:center;justify-content:center;color:var(--text-3);font-size:11px">Нет данных</div>'
  const recent = history.slice(-8)
  const maxB = Math.max(...recent.map(h => h.budget), 1)
  const w = 60, h = 60, pad = 4
  const barW = Math.floor((w - pad * 2) / recent.length)
  const bars = recent.map((entry, i) => {
    const bh = Math.max(2, (entry.budget / maxB) * (h - 16))
    const x = pad + i * barW
    const y = h - 8 - bh
    return `<rect x="${x}" y="${y}" width="${Math.max(4, barW - 2)}" height="${bh}" rx="2" fill="${entry.revenue > 0 ? 'var(--green)' : 'var(--accent)'}" opacity="${0.4 + (i / recent.length) * 0.6}"/>`
  }).join('')
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="60" style="display:block">
    <text x="${pad}" y="8" font-size="5" fill="var(--text-3)" font-family="var(--mono)">$${(maxB/1000).toFixed(0)}K</text>
    ${bars}
  </svg>`
}

function renderHeader() {
  const s = gs()
  const headerLogo = document.getElementById('header-logo')
  const info = document.getElementById('header-info')
  const week = document.getElementById('header-week')
  if (s.studio) {
    headerLogo.innerHTML = genLogo(game.logoSeed, 32)
    info.innerHTML = `<div class="studio-name">${game.studioName}</div><div class="budget-label">$${s.budget.toLocaleString()}</div>`
    week.textContent = `W${s.week}`
  }
}

function renderStartScreen() {
  const el = document.getElementById('screen-start')
  el.innerHTML = `
    <div class="start-bg"></div>
    <div class="start-particle start-p1"></div>
    <div class="start-particle start-p2"></div>
    <div class="start-content">
      <div class="start-logo anim-fade-up">${genMug(72)}</div>
      <h1 class="start-title anim-fade-up" style="animation-delay:0.15s">Crunch & Coffee</h1>
      <p class="start-sub anim-fade-up" style="animation-delay:0.3s">Симулятор игровой студии</p>
      <div class="start-form anim-fade-up" style="animation-delay:0.45s">
        <label>Название студии</label>
        <input type="text" id="studio-name-input" placeholder="Введите название..." maxlength="24">
        <label>Стартовый бюджет</label>
        <div class="budget-select">
          <button class="budget-opt" data-budget="25000">$25,000</button>
          <button class="budget-opt active" data-budget="50000">$50,000</button>
          <button class="budget-opt" data-budget="100000">$100,000</button>
          <button class="budget-opt" data-budget="200000">$200,000</button>
        </div>
        <label>Логотип студии</label>
        <div class="logo-select" id="logo-select"></div>
        <button id="btn-start" class="btn-primary anim-glow" disabled>Начать игру</button>
      </div>
      <div class="start-room anim-fade-up" style="animation-delay:0.55s">
        <div class="start-room-divider"><span>или</span></div>
        <div class="start-room-buttons">
          <button class="btn-primary" onclick="mobileStartScreenCreateRoom()" style="width:100%">+ Создать комнату</button>
          <button class="btn-secondary" onclick="mobileStartScreenJoinRoom()" style="width:100%">Присоединиться</button>
        </div>
      </div>
      <div class="start-footer anim-fade-up" style="animation-delay:0.6s">
        <span>made with ☕ & ⌨️</span>
      </div>
    </div>
  `

  const logos = document.getElementById('logo-select')
  for (let i = 0; i < 4; i++) {
    const div = document.createElement('div')
    div.className = 'logo-opt' + (i === 0 ? ' selected' : '')
    div.dataset.logo = i
    div.innerHTML = genLogo(i, 56)
    logos.appendChild(div)
  }

  document.getElementById('logo-select').addEventListener('click', e => {
    const opt = e.target.closest('.logo-opt')
    if (!opt) return
    document.querySelectorAll('.logo-opt').forEach(o => o.classList.remove('selected'))
    opt.classList.add('selected')
    selectedLogo = parseInt(opt.dataset.logo)
  })

  document.querySelectorAll('.budget-opt').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.budget-opt').forEach(x => x.classList.remove('active'))
      b.classList.add('active')
      selectedBudget = parseInt(b.dataset.budget)
    })
  })

  const nameInput = document.getElementById('studio-name-input')
  const startBtn = document.getElementById('btn-start')

  nameInput.addEventListener('input', () => {
    startBtn.disabled = nameInput.value.trim().length < 2
  })

  startBtn.addEventListener('click', () => {
    const name = nameInput.value.trim()
    if (name.length < 2) return
    game.startStudio(name, selectedLogo, selectedBudget)
    renderHeader()
    renderDashboard()
    showScreen('dashboard')
  })
}

function renderDashboard() {
  const el = document.getElementById('screen-dashboard')
  const s = gs()
  const isGuest = room.roomCode && !room.isHost

  const projHtml = s.project
    ? `<div class="card" style="cursor:pointer" onclick="showScreen('project')">
        <h3>Текущий проект</h3>
        <div style="font-weight:600;font-size:16px;margin-bottom:4px">${s.project.name}</div>
        <div style="font-size:12px;color:var(--text-3);margin-bottom:8px">${s.project.genre.name} · ${s.project.graphics.name} · ${s.project.platform.name}</div>
        <div style="font-size:13px;color:var(--text-2);margin-bottom:6px">Прогресс: ${Math.round((s.project.progress.code + s.project.progress.art + s.project.progress.sound + s.project.progress.design) / 4)}%</div>
        <div class="progress-bar"><div class="fill" style="width:${(s.project.progress.code + s.project.progress.art + s.project.progress.sound + s.project.progress.design) / 4}%"></div></div>
      </div>`
    : `<div class="card">
        <h3>Текущий проект</h3>
        <p class="empty-state">Нет активного проекта</p>
        <button class="btn-primary" onclick="showScreen('project')" style="margin-top:8px">Создать проект</button>
      </div>`

  const roomHtml = room.roomCode
    ? `<div class="m-room-bar">
        <span class="room-code">🚪<strong>${room.roomCode}</strong></span>
        <span class="room-members">${room.members.length}</span>
        <button class="btn-secondary" style="padding:2px 8px;font-size:10px" onclick="leaveRoom()">Выйти</button>
       </div>`
    : `<button class="btn-room" onclick="showRoomModal('create')">+</button>
       <button class="btn-room" onclick="showRoomModal('join')">🔗</button>`

  el.innerHTML = `
    <div class="screen-header" style="flex-wrap:wrap;gap:8px">
      <h2 style="flex:1">Панель</h2>
      <div style="display:flex;gap:6px;align-items:center">
        ${roomHtml}
        ${isGuest ? '' : '<button class="btn-secondary" onclick="endWeek()" style="padding:10px 16px;font-size:13px">Неделя →</button>'}
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon" style="background:#D4A84B20">${genIcon('budget', 20)}</div><div class="stat-label">Бюджет</div><div class="stat-value">$${s.budget.toLocaleString()}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#E91E6320">${genIcon('fire', 20)}</div><div class="stat-label">Фанатов</div><div class="stat-value">${s.fans.toLocaleString()}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#4CAF5020">${genIcon('time', 20)}</div><div class="stat-label">Неделя</div><div class="stat-value">${s.week}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#3498DB20">${genIcon('star', 20)}</div><div class="stat-label">Игр выпущено</div><div class="stat-value">${s.completedGames.length}</div></div>
    </div>
    <div class="card">
      <h3>Финансы</h3>
      <div style="display:flex;gap:16px;margin-bottom:12px">
        <div><div style="font-size:10px;color:var(--text-3)">Расходы/нед</div><div style="font-size:15px;font-weight:600;color:var(--red)">$${s.teamCost.toLocaleString()}</div></div>
        <div><div style="font-size:10px;color:var(--text-3)">Прибыль/нед</div><div style="font-size:15px;font-weight:600;color:${s.weeklyHistory.length > 0 && s.weeklyHistory[s.weeklyHistory.length-1].revenue > 0 ? 'var(--green)' : 'var(--text-2)'}">${s.weeklyHistory.length > 0 ? (s.weeklyHistory[s.weeklyHistory.length-1].revenue > 0 ? '+' : '') + '$' + (s.weeklyHistory[s.weeklyHistory.length-1].revenue - s.weeklyHistory[s.weeklyHistory.length-1].expenses).toLocaleString() : '$0'}</div></div>
      </div>
      <div id="m-chart">${renderMChart(s.weeklyHistory)}</div>
    </div>
    ${projHtml}
    <div class="card">
      <h3>Команда (${s.teamSize})</h3>
      ${s.teamSize === 0 ? '<p class="empty-state">В студии никого нет</p>' : s.team.slice(0, 5).map(e => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
          ${genAvatar(e.name, 28)}
          <div style="flex:1;font-size:14px;font-weight:500">${e.name}</div>
          <div style="font-size:13px;color:${e.mood > 60 ? 'var(--green)' : e.mood > 30 ? 'var(--orange)' : 'var(--red)'}">${e.mood}%</div>
        </div>
      `).join('')}
      ${s.teamSize > 5 ? '<div style="text-align:center;padding:8px;font-size:13px;color:var(--text-3)">+ ещё ' + (s.teamSize - 5) + '</div>' : ''}
    </div>
    <div class="card">
      <h3>Лог</h3>
      ${roomHistory().slice(0, 8).map(h => `
        <div class="log-entry"><span class="log-week">W${h.week}</span>${h.text}</div>
      `).join('') || '<p class="empty-state">Пока пусто</p>'}
    </div>
  `
}

function renderProjectScreen() {
  const el = document.getElementById('screen-project')
  const s = gs()
  const isGuest = room.roomCode && !room.isHost

  if (s.project) {
    const p = s.project
    const challenge = s.codingChallenge
    const avg = Math.round((p.progress.code + p.progress.art + p.progress.sound + p.progress.design) / 4)
    const assigned = p.assignedTeam.map(e => {
      const hasChallenge = challenge && challenge.empId === e.id
      const solved = hasChallenge && challenge.solved
      return `
      <div class="assignee-row ${hasChallenge ? 'focused' : ''}" onclick="mSelectTask(${e.id})">
        ${genAvatar(e.name, 28)}
        <div class="assignee-name" style="flex:1">${e.name}</div>
        ${hasChallenge ? (solved ? '<span style="font-size:12px;color:var(--green)">✓</span>' : '<span style="font-size:12px;color:var(--accent)">⌨️</span>') : ''}
        ${isGuest ? '' : '<button class="btn-danger" style="padding:6px 12px;font-size:11px" onclick="event.stopPropagation();game.unassignFromProject(' + e.id + ');renderProjectScreen()">Снять</button>'}
      </div>`
    }).join('')
    const free = s.team.filter(e => !e.assigned).map(e => `
      <div class="assignee-row">
        ${genAvatar(e.name, 28)}
        <div class="assignee-name">${e.name}</div>
        <div class="assignee-role">${e.role.name}</div>
        ${isGuest ? '' : '<button class="btn-secondary" style="padding:6px 12px;font-size:11px" onclick="game.assignToProject(' + e.id + ');renderProjectScreen()">+</button>'}
      </div>
    `).join('')

    const codeHtml = challenge ? `
      <div class="m-code-panel">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:var(--surface-2);border-bottom:1px solid var(--border);border-radius:var(--radius-sm) var(--radius-sm) 0 0">
          <span style="font-family:var(--mono);font-size:12px;color:var(--accent)">${challenge.fileName}</span>
          <span style="font-size:11px;color:var(--text-3)">${challenge.empName}</span>
          ${isGuest ? '' : '<button class="btn-secondary" style="padding:4px 8px;font-size:10px" onclick="mClearCodingSafe()">×</button>'}
        </div>
        ${challenge.solved
          ? `<div style="padding:20px;text-align:center;color:var(--green)">
              <div style="font-size:20px;margin-bottom:6px">✓</div>
              <div style="font-size:13px">Готово!</div>
              ${isGuest ? '' : '<button class="btn-secondary" style="margin-top:10px;padding:8px 16px" onclick="mClearCodingSafe()">Закрыть</button>'}
            </div>`
          : `<div style="background:#0D0D12;padding:12px;overflow-x:auto;font-family:var(--mono);font-size:11px;line-height:1.5;white-space:pre">${challenge.code}</div>
             <div style="padding:12px">
               <label style="font-size:10px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.05em;display:block;margin-bottom:6px">Перепишите код:</label>
               <div id="m-editor-container" class="m-editor-wrap"></div>
               <button class="btn-primary" style="margin-top:8px;padding:12px" onclick="mSubmitCode()">Проверить</button>
             </div>`
        }
      </div>` : ''

  const roomPlayersHtml = room.roomCode ? `
    <div class="card" style="margin-top:8px">
      <h3>🎮 Игроки в комнате (${room.members.length})</h3>
      <div class="room-players">
        ${room.members.map(m => `
          <div class="room-player-row">
            <span class="room-player-dot ${m.id === room.playerId ? 'room-dot-you' : 'room-dot-other'}"></span>
            <span class="room-player-name">${m.name}</span>
            <span class="room-player-tag">${m.isHost ? 'Хост' : 'Игрок'}</span>
          </div>
        `).join('')}
      </div>
    </div>` : ''

    el.innerHTML = `
      <div class="screen-header">
        <h2>Разработка</h2>
        ${isGuest ? '' : '<button class="btn-danger" style="padding:8px 14px;font-size:12px" onclick="mCancelProject()">×</button>'}
      </div>
      <div class="card">
        <div style="font-weight:700;font-size:18px;margin-bottom:10px">${p.name}</div>
        <div class="project-meta-row">
          <span class="meta-chip">${p.genre.name}</span>
          <span class="meta-chip">${p.graphics.name}</span>
          <span class="meta-chip">${p.platform.name}</span>
          <span class="meta-chip">${p.scope.name}</span>
        </div>
        <div class="progress-group">
          <div class="progress-item"><div class="progress-label"><span>Код</span><span>${Math.round(p.progress.code)}%</span></div><div class="progress-bar"><div class="fill blue" style="width:${p.progress.code}%"></div></div></div>
          <div class="progress-item"><div class="progress-label"><span>Арт</span><span>${Math.round(p.progress.art)}%</span></div><div class="progress-bar"><div class="fill purple" style="width:${p.progress.art}%"></div></div></div>
          <div class="progress-item"><div class="progress-label"><span>Саунд</span><span>${Math.round(p.progress.sound)}%</span></div><div class="progress-bar"><div class="fill green" style="width:${p.progress.sound}%"></div></div></div>
          <div class="progress-item"><div class="progress-label"><span>Дизайн</span><span>${Math.round(p.progress.design)}%</span></div><div class="progress-bar"><div class="fill" style="width:${p.progress.design}%"></div></div></div>
          <div class="progress-item"><div class="progress-label"><span><strong>Общий</strong></span><span><strong>${avg}%</strong></span></div><div class="progress-bar"><div class="fill" style="width:${avg}%"></div></div></div>
        </div>
        <div class="project-meta-row">
          <span class="meta-chip">Бюджет: $${p.budgetNeeded.toLocaleString()}</span>
          <span class="meta-chip">Потрачено: $${Math.round(p.spent).toLocaleString()}</span>
          <span class="meta-chip">Качество: ${Math.round(p.quality)}%</span>
        </div>
      </div>
      <div class="card">
        <h3>На проекте</h3>
        <div style="font-size:11px;color:var(--text-3);margin-bottom:8px">Нажмите на сотрудника чтобы взять его задачу</div>
        ${assigned || '<p class="empty-state">Никто не назначен</p>'}
        ${free ? '<h3 style="font-size:13px;color:var(--text-2);margin:12px 0 8px">Свободны</h3>' + free : ''}
      </div>
      ${roomPlayersHtml}
      ${codeHtml}
      ${isGuest ? '' : '<button class="btn-secondary" onclick="endWeek()" style="width:100%;padding:16px;margin-top:4px">Завершить неделю</button>'}
    `
  } else {
    const d = window.GDATA
    el.innerHTML = `
      <div class="screen-header"><h2>Создать проект</h2></div>
      <div class="form-group">
        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-2);display:block;margin-bottom:6px">Жанр</label>
        <div class="option-grid" id="m-genre-options">${d.genres.map(g => `<button class="option-btn" data-type="genre" data-id="${g.id}">${g.name}</button>`).join('')}</div>
      </div>
      <div class="form-group">
        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-2);display:block;margin-bottom:6px;margin-top:12px">Графика</label>
        <div class="option-grid" id="m-graphics-options">${d.graphics.map(g => `<button class="option-btn" data-type="graphics" data-id="${g.id}">${g.name}</button>`).join('')}</div>
      </div>
      <div class="form-group">
        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-2);display:block;margin-bottom:6px;margin-top:12px">Платформа</label>
        <div class="option-grid" id="m-platform-options">${d.platforms.map(p => `<button class="option-btn" data-type="platform" data-id="${p.id}">${p.name}</button>`).join('')}</div>
      </div>
      <div class="form-group">
        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-2);display:block;margin-bottom:6px;margin-top:12px">Масштаб</label>
        <div class="option-grid" id="m-scope-options">${d.scopes.map(s => `<button class="option-btn" data-type="scope" data-id="${s.id}">${s.name}</button>`).join('')}</div>
      </div>
      <div id="m-project-estimate" style="display:none"></div>
      <button id="m-btn-create" class="btn-primary" disabled style="margin-top:12px">Начать разработку</button>
    `
    document.querySelectorAll('#screen-project .option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const parent = btn.closest('.form-group')
        parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'))
        btn.classList.add('selected')
        updateMobileEstimate()
      })
    })
  }
  if (s.project && s.codingChallenge && !s.codingChallenge.solved) {
    mDisposeEditor()
    setTimeout(() => mInitEditor(), 50)
  }
}

function updateMobileEstimate() {
  const genreId = document.querySelector('#m-genre-options .selected')?.dataset.id
  const gfxId = document.querySelector('#m-graphics-options .selected')?.dataset.id
  const platId = document.querySelector('#m-platform-options .selected')?.dataset.id
  const scopeId = document.querySelector('#m-scope-options .selected')?.dataset.id
  const btn = document.getElementById('m-btn-create')
  const est = document.getElementById('m-project-estimate')

  if (!genreId || !gfxId || !platId || !scopeId) { est.style.display = 'none'; btn.disabled = true; return }

  const d = window.GDATA
  const genre = d.genres.find(g => g.id === genreId)
  const gfx = d.graphics.find(g => g.id === gfxId)
  const plat = d.platforms.find(p => p.id === platId)
  const scope = d.scopes.find(s => s.id === scopeId)

  const budget = Math.round(scope.budgetBase * genre.budgetMult * gfx.costMult * plat.devMult)
  const time = Math.round(scope.timeBase * genre.timeMult * gfx.timeMult * plat.devMult)
  const name = window.genGameName()

  est.style.display = 'block'
  est.innerHTML = `
    <div class="estimate-box">
      <div class="est-row"><span class="est-label">Название</span><span class="est-value" style="font-family:var(--font);font-size:14px">${name}</span></div>
      <div class="est-row"><span class="est-label">Бюджет</span><span class="est-value" style="color:${budget > game.budget ? 'var(--red)' : 'var(--green)'}">${budget > game.budget ? '⚠ ' : ''}$${budget.toLocaleString()}</span></div>
      <div class="est-row"><span class="est-label">Срок</span><span class="est-value">${time} нед</span></div>
    </div>
  `

  btn.disabled = budget > game.budget
  btn.onclick = () => {
    if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост может создавать проекты'); return }
    game.createProject(genreId, gfxId, platId, scopeId)
    renderHeader()
    renderProjectScreen()
    renderDashboard()
  }
}

function renderTeamScreen() {
  const el = document.getElementById('screen-team')
  const s = gs()
  const isGuest = room.roomCode && !room.isHost
  if (s.teamSize === 0) {
    el.innerHTML = '<div class="screen-header"><h2>Команда</h2></div><p class="empty-state">В студии пока нет сотрудников</p>'
    return
  }
  const roles = window.GDATA.roles
  let html = ''
  roles.forEach(role => {
    const members = s.team.filter(e => e.role.id === role.id)
    if (members.length === 0) return
    html += `
      <div class="m-role-group">
        <div class="m-role-header" style="border-left:3px solid ${role.color}">
          <span style="color:${role.color};font-weight:600;font-size:13px">${role.name}</span>
          <span style="font-size:11px;color:var(--text-3);font-family:var(--mono)">${members.length}</span>
        </div>
          ${members.map(e => `
            <div class="m-emp-row">
              ${genAvatar(e.name, 36)}
              <div style="flex:1">
                <div style="font-weight:600;font-size:14px">${e.name}</div>
                <div style="font-size:11px;color:var(--text-3)">Ур.${e.skill} · $${e.salary}/нед</div>
              </div>
              <div style="text-align:right">
                <div class="emp-mood" style="font-size:12px;color:${e.mood > 60 ? 'var(--green)' : e.mood > 30 ? 'var(--orange)' : 'var(--red)'}">${e.mood}%</div>
                ${isGuest ? '' : '<button class="btn-danger" style="padding:4px 8px;font-size:10px;margin-top:4px" onclick="if(confirm(\'Уволить?\')){game.fireEmployee(' + e.id + ');renderHeader();renderTeamScreen();renderDashboard()}">Уволить</button>'}
              </div>
            </div>
          `).join('')}
      </div>`
  })
  el.innerHTML = `
    <div class="screen-header">
      <h2>Команда</h2>
      ${isGuest ? '' : '<button class="btn-secondary" style="padding:8px 14px;font-size:12px" onclick="showScreen(\'hire\')">+ Нанять</button>'}
    </div>
    ${html}
  `
}

function renderHireScreen() {
  const el = document.getElementById('screen-hire')
  const s = gs()
  const isGuest = room.roomCode && !room.isHost
  el.innerHTML = `
    <div class="screen-header">
      <h2>Найм</h2>
      ${isGuest ? '' : '<button class="btn-secondary" style="padding:8px 14px;font-size:12px" onclick="refreshCandidates()">Обновить</button>'}
    </div>
    <div style="font-size:13px;color:var(--text-3);margin-bottom:12px">Бюджет: <strong>$${s.budget.toLocaleString()}</strong> · Расходы: <strong>$${s.teamCost.toLocaleString()}</strong>/нед</div>
    <div id="m-candidates"></div>
  `
  if (!window._candidates) refreshCandidates()
  else renderMCandidates()
}

function refreshCandidates() {
  if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост может обновлять кандидатов'); return }
  window._candidates = []
  for (let i = 0; i < 5; i++) window._candidates.push(window.randomEmployee())
  renderMCandidates()
}

function renderMCandidates() {
  const el = document.getElementById('m-candidates')
  if (!el) return
  const s = gs()
  const isGuest = room.roomCode && !room.isHost
  const esc = s => s.replace(/'/g, "\\'")
  el.innerHTML = window._candidates.map(c => `
    <div class="candidate-card">
      ${genAvatar(c.name, 40)}
      <div class="cand-info">
        <div class="cand-name">${c.name}</div>
        <div class="cand-details">
          <span style="color:${c.role.color}">${c.role.name}</span>
          <span>$${c.salary}/нед</span>
        </div>
      </div>
      ${isGuest ? '<span style="font-size:11px;color:var(--text-3);padding:0 8px">Только хост</span>' :
        `<button class="btn-primary" style="padding:10px 16px;font-size:12px;width:auto;flex-shrink:0"
          onclick="hireCandidate('${esc(c.name)}','${c.role.id}',${c.skill},${c.salary})"
          ${s.budget < c.salary * 4 ? 'disabled' : ''}>Нанять</button>`}
    </div>
  `).join('')
}

function hireCandidate(name, roleId, skill, salary) {
  if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост может нанимать'); return }
  game.hireEmployee(name, roleId, skill, salary)
  renderHeader()
  renderDashboard()
  renderHireScreen()
}

function mDisposeEditor() {
  if (window._mEditor) {
    window._mEditor.dispose()
    window._mEditor = null
  }
}

function mInitEditor() {
  mDisposeEditor()
  const container = document.getElementById('m-editor-container')
  if (!container) return
  const challenge = gs().codingChallenge
  if (!challenge) return
  window._mEditor = new CustomEditor(container, {
    value: '',
    onInput: () => {}
  })
  setTimeout(() => window._mEditor?.focus(), 50)
}

function mSelectTask(empId) {
  const s = gs()
  const emp = s.team.find(e => e.id === empId)
  if (!emp || !emp.assigned) return
  if (s.codingChallenge && s.codingChallenge.empId === empId && !s.codingChallenge.solved) return
  mDisposeEditor()
  if (!room.isHost && room.roomCode) {
    room.requestChallenge(empId)
    return
  }
  game.generateCodingChallenge(emp)
  renderProjectScreen()
  setTimeout(() => mInitEditor(), 50)
}

function mSubmitCode() {
  if (window._mEditor) {
    const code = window._mEditor.getValue()
    if (!room.isHost && room.roomCode) {
      room.submitChallenge(code)
      mDisposeEditor()
      return
    }
    const ok = game.submitCodingAttempt(code)
    if (ok) {
      mDisposeEditor()
      renderProjectScreen()
    } else {
      const el = document.getElementById('m-editor-container')
      if (el) { el.style.borderColor = 'var(--red)'; setTimeout(() => { el.style.borderColor = '' }, 1000) }
    }
  }
}

function renderHistoryScreen() {
  const el = document.getElementById('screen-history')
  const s = gs()
  let gamesHtml = ''
  if (s.completedGames.length === 0) {
    gamesHtml = '<p class="empty-state">Пока нет выпущенных игр</p>'
  } else {
    gamesHtml = s.completedGames.map(g => `
      <div class="completed-card">
        <div class="game-header">
          <div class="game-rating" style="background:${g.review.color}20;color:${g.review.color}">${g.rating}</div>
          <div>
            <div class="game-name">${g.name}</div>
            <div class="game-meta">${g.genre} · ${g.weeks} нед · ${g.quality}/100</div>
          </div>
          <div class="game-profit" style="color:${g.profit > 0 ? 'var(--green)' : 'var(--red)'}">${g.profit > 0 ? '+' : ''}$${g.profit.toLocaleString()}</div>
        </div>
        <div class="game-meta">${g.review.text}</div>
      </div>
    `).join('')
  }

  el.innerHTML = `
    <div class="screen-header"><h2>История</h2></div>
    ${gamesHtml}
    <div class="card">
      <h3>Лог событий</h3>
      ${roomHistory().map(h => `<div class="log-entry"><span class="log-week">W${h.week}</span>${h.text}</div>`).join('') || '<p class="empty-state">Пусто</p>'}
    </div>
  `
}

function endWeek() {
  if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост может завершать неделю'); return }
  if (!game.currentProject) {
    showModal('Нет проекта', 'Сначала создайте проект')
    return
  }
  if (game.currentProject.assignedTeam.length === 0 && !confirm('Команда не назначена! Продолжить?')) return

  const result = game.processWeek()
  renderHeader()
  if (room.isHost) room.broadcastState(game.getStatus())

  if (result.event) showModal('Событие', result.event.text)

  if (result.gameOver) {
    renderDashboard()
    setTimeout(() => showGameOver(), 300)
    return
  }

  if (result.finished && game.completedGames.length > 0) {
    const last = game.completedGames[game.completedGames.length - 1]
    showModal('Релиз!', `
      <p><strong>${last.name}</strong> выпущен!</p>
      <p>Оценка: <strong style="color:${last.review.color}">${last.rating}</strong> (${last.quality}/100)</p>
      <p>${last.review.text}</p>
      <p>Доход: <strong style="color:var(--green)">+$${last.revenue.toLocaleString()}</strong></p>
    `)
  }

  renderDashboard()
  renderProjectScreen()
}

function showModal(title, body) {
  const modal = document.getElementById('modal-overlay')
  const content = document.getElementById('modal-content')
  content.innerHTML = `
    <h2>${title}</h2>
    ${body || ''}
    <button class="btn-primary" onclick="document.getElementById('modal-overlay').classList.add('modal-hidden')">OK</button>
  `
  modal.classList.remove('modal-hidden')
}

function showGameOver() {
  const reason = game.gameOverReason || 'Студия обанкротилась'
  showModal('Game Over', `
    <p>${reason}</p>
    <p style="font-size:13px;color:var(--text-3)">Студия «${game.studioName}» — ${game.week} недель</p>
    <p style="font-size:13px;color:var(--text-3)">Выпущено игр: ${game.completedGames.length}</p>
    <button class="btn-primary" onclick="location.reload()">Начать заново</button>
  `)
}

function renderScreen(id) {
  switch(id) {
    case 'dashboard': renderDashboard(); break
    case 'project': renderProjectScreen(); break
    case 'team': renderTeamScreen(); break
    case 'hire': renderHireScreen(); break
    case 'history': renderHistoryScreen(); break
  }
}

document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) e.currentTarget.classList.add('modal-hidden')
})

/* Room functions */
function mobileStartScreenCreateRoom() {
  const modal = document.getElementById('modal-overlay')
  const content = document.getElementById('modal-content')
  content.innerHTML = `
    <h2>Создать комнату</h2>
    <p style="font-size:13px;color:var(--text-3);margin-bottom:12px">Игра начнётся автоматически</p>
    <label style="display:block;margin-bottom:6px;font-size:12px;color:var(--text-2)">Ваше имя</label>
    <input type="text" id="room-name-input" class="room-name-input" value="Хост" maxlength="20" placeholder="Хост">
    <button class="btn-primary" onclick="mobileStartScreenCreateRoomSubmit()" style="margin-top:12px">Создать и играть</button>
  `
  modal.classList.remove('modal-hidden')
}

function mobileStartScreenCreateRoomSubmit() {
  const name = (document.getElementById('room-name-input')?.value || '').trim() || 'Хост'
  if (!game.studioName) {
    game.startStudio('Студия ' + name, Math.floor(Math.random() * 4), 50000)
  }
  room.createRoom(name)
  document.getElementById('modal-overlay').classList.add('modal-hidden')
  renderHeader()
  renderDashboard()
  showScreen('dashboard')
  setupRoomSync()
}

function mobileStartScreenJoinRoom() {
  const modal = document.getElementById('modal-overlay')
  const content = document.getElementById('modal-content')
  content.innerHTML = `
    <h2>Присоединиться к комнате</h2>
    <label style="display:block;margin-bottom:6px;font-size:12px;color:var(--text-2)">Код комнаты</label>
    <input type="text" id="room-code-input" class="room-name-input room-code-input" placeholder="ABC123" maxlength="6" style="text-transform:uppercase;letter-spacing:0.15em;font-size:20px;text-align:center;padding:14px">
    <label style="display:block;margin:12px 0 6px;font-size:12px;color:var(--text-2)">Ваше имя (необязательно)</label>
    <input type="text" id="room-name-input" class="room-name-input" value="" maxlength="20" placeholder="user_...">
    <button class="btn-primary" onclick="mobileStartScreenJoinRoomSubmit()" style="margin-top:12px">Присоединиться</button>
    <p style="font-size:11px;color:var(--text-3);margin-top:8px">Без имени — user_1, user_2...</p>
  `
  modal.classList.remove('modal-hidden')
}

function mobileStartScreenJoinRoomSubmit() {
  const code = (document.getElementById('room-code-input')?.value || '').trim().toUpperCase()
  const name = (document.getElementById('room-name-input')?.value || '').trim()
  if (code.length < 4) { showModal('Ошибка', 'Код от 4 символов'); return }
  if (!game.studioName) {
    game.startStudio('Гость', Math.floor(Math.random() * 4), 50000)
  }
  room.joinRoom(code, name)
  document.getElementById('modal-overlay').classList.add('modal-hidden')
  renderHeader()
  renderDashboard()
  showScreen('dashboard')
  setupRoomSync()
}

function showRoomModal(type) {
  const modal = document.getElementById('modal-overlay')
  const content = document.getElementById('modal-content')
  if (type === 'create') {
    content.innerHTML = `
      <h2>Создать комнату</h2>
      <p style="font-size:13px;color:var(--text-3);margin-bottom:12px">Другие вкладки браузера смогут присоединиться</p>
      <label style="display:block;margin-bottom:6px;font-size:12px;color:var(--text-2)">Ваше имя</label>
      <input type="text" id="room-name-input" class="room-name-input" value="${game.studioName || 'Хост'}" maxlength="20">
      <button class="btn-primary" onclick="createRoom()" style="margin-top:12px">Создать</button>
    `
  } else {
    content.innerHTML = `
      <h2>Присоединиться</h2>
      <label style="display:block;margin-bottom:6px;font-size:12px;color:var(--text-2)">Код комнаты</label>
      <input type="text" id="room-code-input" class="room-name-input room-code-input" placeholder="ABC123" maxlength="6">
      <label style="display:block;margin:12px 0 6px;font-size:12px;color:var(--text-2)">Ваше имя</label>
      <input type="text" id="room-name-input" class="room-name-input" value="Игрок" maxlength="20">
      <button class="btn-primary" onclick="joinRoomByCode()" style="margin-top:12px">Присоединиться</button>
    `
  }
  modal.classList.remove('modal-hidden')
}

function createRoom() {
  const name = (document.getElementById('room-name-input')?.value || '').trim() || 'Хост'
  room.createRoom(name)
  document.getElementById('modal-overlay').classList.add('modal-hidden')
  renderDashboard()
  setupRoomSync()
}

function joinRoomByCode() {
  const code = (document.getElementById('room-code-input')?.value || '').trim().toUpperCase()
  const name = (document.getElementById('room-name-input')?.value || '').trim() || 'Игрок'
  if (code.length < 4) { showModal('Ошибка', 'Код от 4 символов'); return }
  room.joinRoom(code, name)
  document.getElementById('modal-overlay').classList.add('modal-hidden')
  renderDashboard()
  setupRoomSync()
}

function leaveRoom() {
  room.leaveRoom()
  _roomState = null
  renderDashboard()
}

function mCancelProject() {
  if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост'); return }
  if (confirm('Отменить?')) { game.cancelProject(); renderProjectScreen() }
}

function mClearCodingSafe() {
  if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост'); return }
  game.clearCodingChallenge(); renderProjectScreen()
}

function setupRoomSync() {
  room.onStateUpdate = (state) => {
    _roomState = state
    const active = document.querySelector('.screen.active')
    if (active) {
      const id = active.id.replace('screen-', '')
      renderScreen(id)
    }
  }
  room.onMembersChange = () => {
    const active = document.querySelector('.screen.active')
    if (active) {
      const id = active.id.replace('screen-', '')
      renderScreen(id)
    }
  }
  room.onHostLeave = () => {
    _roomState = null
    showModal('Комната', 'Хост покинул комнату')
    renderDashboard()
  }
  room.onChallengeRequest = (empId) => {
    const emp = game.team.find(e => e.id === empId)
    if (emp && emp.assigned) {
      game.generateCodingChallenge(emp)
      const s = game.getStatus()
      room._broadcast({ type: 'challenge-data', challenge: s.codingChallenge })
      room.broadcastState(s)
      renderProjectScreen()
    }
  }
  room.onChallengeData = (challenge) => {
    game.codingChallenge = challenge
    if (_roomState) _roomState.codingChallenge = challenge
    renderProjectScreen()
  }
  room.onChallengeSubmit = (code) => {
    const ok = game.submitCodingAttempt(code)
    room._broadcast({ type: 'challenge-result', solved: ok })
    room.broadcastState(game.getStatus())
    renderProjectScreen()
  }
  room.onChallengeResult = (solved) => {
    if (_roomState && _roomState.codingChallenge) _roomState.codingChallenge.solved = solved
    game.codingChallenge = _roomState ? _roomState.codingChallenge : null
    renderProjectScreen()
  }
  if (room.isHost) {
    room.__syncState = game.getStatus()
    room.broadcastState(game.getStatus())
  }
}
