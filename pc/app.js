/* Crunch & Coffee — PC Application */

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
  initProjectScreen()
  initHireScreen()
  renderStartScreen()
})

function icon(type, size = 20) {
  const d = document.createElement('div')
  d.innerHTML = genIcon(type, size)
  return d.firstElementChild
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'))
  document.getElementById('screen-' + id).classList.add('active')
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'))
  const btn = document.querySelector(`.nav-btn[data-screen="${id}"]`)
  if (btn) btn.classList.add('active')
  renderScreen(id)
}

function initNav() {
  document.getElementById('nav').addEventListener('click', e => {
    const btn = e.target.closest('.nav-btn')
    if (btn) showScreen(btn.dataset.screen)
  })
}

function renderNav() {
  const inRoom = !!room.roomCode
  const navItems = [
    { id: 'dashboard', label: 'Панель', icon: 'chart' },
    { id: 'players', label: 'Игроки', icon: 'users' },
    { id: 'team', label: 'Команда', icon: 'team' },
    { id: 'project', label: 'Проект', icon: 'gamepad' },
    { id: 'hire', label: 'Найм', icon: 'plus' },
    { id: 'history', label: 'История', icon: 'document' }
  ]
  const activeId = document.querySelector('.nav-btn.active')?.dataset?.screen || 'dashboard'
  const nav = document.getElementById('nav')
  nav.innerHTML = navItems.map(n => {
    if (n.id === 'players' && !inRoom) return ''
    return `<button class="nav-btn${n.id === activeId ? ' active' : ''}" data-screen="${n.id}">
      ${genIcon(n.icon, 18)} ${n.label}
    </button>`
  }).join('')
}

function renderStartScreen() {
  const el = document.getElementById('screen-start')
  el.innerHTML = `
    <div class="start-bg"></div>
    <div class="start-particle start-p1"></div>
    <div class="start-particle start-p2"></div>
    <div class="start-particle start-p3"></div>
    <div class="start-content">
      <div class="start-logo anim-fade-up">${genMug(96)}</div>
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
          <button class="btn-primary" onclick="startScreenCreateRoom()">+ Создать комнату</button>
          <button class="btn-secondary" onclick="startScreenJoinRoom()">Присоединиться</button>
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
    div.innerHTML = genLogo(i, 64)
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
    renderSidebar()
    renderDashboard()
    showScreen('dashboard')
  })
}

/* Nav + Sidebar */
function renderSidebar() {
  renderNav()
  const s = gs()
  const brand = document.getElementById('studio-brand')
  brand.innerHTML = `
    <div class="brand-logo">${genLogo(game.logoSeed, 48)}</div>
    <div class="brand-name">${game.studioName}</div>
  `
  document.getElementById('quick-budget').innerHTML = `<span>Бюджет</span><span class="val">$${s.budget.toLocaleString()}</span>`
  document.getElementById('quick-week').innerHTML = `<span>Неделя</span><span class="val">${s.week}</span>`
}

/* Dashboard */
function renderDashboard() {
  const s = gs()
  const el = document.getElementById('screen-dashboard')
  const isGuest = room.roomCode && !room.isHost

  const avg = s.project ? Math.round((s.project.progress.code + s.project.progress.art + s.project.progress.sound + s.project.progress.design) / 4) : 0
  const projHtml = s.project
    ? `<div style="font-weight:600;font-size:15px;margin-bottom:4px">${s.project.name}</div>
       <div style="font-size:12px;color:var(--text-3);margin-bottom:8px">${s.project.genre.name} · ${s.project.graphics.name} · ${s.project.platform.name}</div>
       <div style="margin-bottom:4px;font-size:12px;color:var(--text-2)">Прогресс: ${avg}%</div>
       <div class="progress-bar"><div class="fill" style="width:${avg}%"></div></div>`
    : `<p class="empty-state">Нет активного проекта</p>
       <button class="btn-secondary" onclick="showScreen('project')">Создать проект</button>`

  const teamHtml = s.teamSize === 0
    ? '<p class="empty-state">В студии пока никого</p>'
    : s.team.map(e => `
      <div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid var(--border)">
        ${genAvatar(e.name, 28)}
        <div style="flex:1"><div style="font-size:13px;font-weight:500">${e.name}</div><div style="font-size:11px;color:var(--text-3)">${e.role.name}</div></div>
        <div style="font-size:12px;font-family:var(--mono);color:${e.mood > 60 ? 'var(--green)' : e.mood > 30 ? 'var(--orange)' : 'var(--red)'}">${e.mood}%</div>
      </div>`).join('')

  const roomHtml = room.roomCode
    ? `<div class="room-bar">
        <span class="room-code">🚪 <strong>${room.roomCode}</strong></span>
        <span class="room-members">${room.members.map(m => m.name).join(', ')}</span>
        <button class="btn-secondary" style="padding:4px 12px;font-size:11px" onclick="leaveRoom()">Выйти</button>
       </div>`
    : `<button class="btn-secondary" style="padding:6px 14px;font-size:12px" onclick="showRoomModal('create')">+ Комната</button>
       <button class="btn-secondary" style="padding:6px 14px;font-size:12px" onclick="showRoomModal('join')">Присоединиться</button>`

  el.innerHTML = `
    <div class="screen-header">
      <h2>Панель управления</h2>
      <div class="header-actions">
        ${roomHtml}
        ${isGuest ? '' : '<button id="btn-end-week" class="btn-primary">Завершить неделю →</button>'}
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-icon" style="background:#D4A84B20">${genIcon('budget', 22)}</div><div class="stat-label">Бюджет</div><div class="stat-value">$${s.budget.toLocaleString()}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#E91E6320">${genIcon('fire', 22)}</div><div class="stat-label">Фанатов</div><div class="stat-value">${s.fans.toLocaleString()}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#4CAF5020">${genIcon('time', 22)}</div><div class="stat-label">Неделя</div><div class="stat-value">${s.week}</div></div>
      <div class="stat-card"><div class="stat-icon" style="background:#3498DB20">${genIcon('star', 22)}</div><div class="stat-label">Игр выпущено</div><div class="stat-value">${s.completedGames.length}</div></div>
    </div>
    <div class="dashboard-grid">
      <div class="card" id="dash-project"><h3>Текущий проект</h3><div id="dash-project-content">${projHtml}</div></div>
      <div class="card" id="dash-team"><h3>Команда</h3><div id="dash-team-list">${teamHtml}</div></div>
      <div class="card" id="dash-finance"><h3>Финансы</h3>
        <div style="display:flex;gap:24px;margin-bottom:16px">
          <div><div style="font-size:11px;color:var(--text-3)">Расходы/нед</div><div style="font-size:16px;font-weight:600;color:var(--red)">$${s.teamCost.toLocaleString()}</div></div>
          <div><div style="font-size:11px;color:var(--text-3)">Прибыль/нед</div><div style="font-size:16px;font-weight:600;color:${s.weeklyHistory.length > 0 && s.weeklyHistory[s.weeklyHistory.length-1].revenue > 0 ? 'var(--green)' : 'var(--text-2)'}">${s.weeklyHistory.length > 0 ? (s.weeklyHistory[s.weeklyHistory.length-1].revenue > 0 ? '+' : '') + '$' + (s.weeklyHistory[s.weeklyHistory.length-1].revenue - s.weeklyHistory[s.weeklyHistory.length-1].expenses).toLocaleString() : '$0'}</div></div>
        </div>
        <div id="dash-chart">${renderChart(s.weeklyHistory)}</div>
      </div>
      <div class="card" id="dash-log"><h3>Лог событий</h3><div id="log-list">${roomHistory().slice(0, 15).map(h => `<div class="log-entry"><span class="log-week">W${h.week}</span><span>${h.text}</span></div>`).join('') || ''}</div></div>
    </div>
  `
}

function renderChart(history) {
  if (history.length < 1) return '<div style="height:100px;display:flex;align-items:center;justify-content:center;color:var(--text-3);font-size:12px">Нет данных</div>'
  const recent = history.slice(-10)
  const maxB = Math.max(...recent.map(h => h.budget), 1)
  const w = 60, h = 80, pad = 4
  const barW = Math.floor((w - pad * 2) / recent.length)
  const bars = recent.map((entry, i) => {
    const bh = Math.max(3, (entry.budget / maxB) * (h - 20))
    const x = pad + i * barW
    const y = h - 10 - bh
    return `<rect x="${x}" y="${y}" width="${Math.max(4, barW - 2)}" height="${bh}" rx="2" fill="${entry.revenue > 0 ? 'var(--green)' : 'var(--accent)'}" opacity="${0.4 + (i / recent.length) * 0.6}"/>`
  }).join('')
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" height="100" style="display:block">
    <text x="${pad}" y="10" font-size="6" fill="var(--text-3)" font-family="var(--mono)">$${(maxB/1000).toFixed(0)}K</text>
    <text x="${w - pad}" y="${h - 2}" font-size="5" fill="var(--text-3)" text-anchor="end" font-family="var(--mono)">W${recent[0].week}</text>
    ${bars}
  </svg>`
}

function renderFullLog() {
  const log = roomHistory().map(h => `
    <div class="log-entry">
      <span class="log-week">W${h.week}</span>
      <span>${h.text}</span>
    </div>
  `).join('')
  return log || '<p class="empty-state">Пока пусто</p>'
}

/* Project Screen */
function initProjectScreen() {
  document.getElementById('screen-project').addEventListener('click', e => {
    const btn = e.target.closest('.option-btn')
    if (!btn) return
    const parent = btn.closest('.form-group')
    if (!parent) return
    parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'))
    btn.classList.add('selected')
    updateEstimate()
  })
}

function renderProjectScreen() {
  const el = document.getElementById('screen-project')
  const s = gs()

  if (s.project) {
    renderProjectStatus(el, s.project)
    disposeEditor()
    if (s.codingChallenge && !s.codingChallenge.solved) {
      setTimeout(() => initEditor(), 50)
    }
  } else {
    renderProjectCreation(el)
  }
}

function renderProjectCreation(el) {
  const d = window.GDATA
  el.innerHTML = `
    <div class="screen-header"><h2>Создать проект</h2></div>
    <div id="project-content">
      <div class="form-group">
        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-2);display:block;margin-bottom:8px">Жанр</label>
        <div class="option-grid" id="genre-options">
          ${d.genres.map(g => `<button class="option-btn" data-type="genre" data-id="${g.id}">${g.name}</button>`).join('')}
        </div>
      </div>
      <div class="form-group">
        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-2);display:block;margin-bottom:8px;margin-top:16px">Графика</label>
        <div class="option-grid" id="graphics-options">
          ${d.graphics.map(g => `<button class="option-btn" data-type="graphics" data-id="${g.id}">${g.name}</button>`).join('')}
        </div>
      </div>
      <div class="form-group">
        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-2);display:block;margin-bottom:8px;margin-top:16px">Платформа</label>
        <div class="option-grid" id="platform-options">
          ${d.platforms.map(p => `<button class="option-btn" data-type="platform" data-id="${p.id}">${p.name}</button>`).join('')}
        </div>
      </div>
      <div class="form-group">
        <label style="font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-2);display:block;margin-bottom:8px;margin-top:16px">Масштаб</label>
        <div class="option-grid scope-grid" id="scope-options">
          ${d.scopes.map(s => `<button class="option-btn" data-type="scope" data-id="${s.id}">${s.name}</button>`).join('')}
        </div>
      </div>
      <div id="project-estimate" class="estimate-box" style="display:none"></div>
      <button id="btn-create-project" class="btn-primary" disabled style="margin-top:12px">Начать разработку</button>
    </div>
  `

  document.querySelectorAll('#project-content .option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.form-group')
      parent.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'))
      btn.classList.add('selected')
      updateEstimate()
    })
  })
}

function renderProjectStatus(el, proj) {
  const avg = Math.round((proj.progress.code + proj.progress.art + proj.progress.sound + proj.progress.design) / 4)
  const s = gs()
  const challenge = s.codingChallenge

  const isGuest = room.roomCode && !room.isHost

  const assignedEl = proj.assignedTeam.map(e => {
    const hasChallenge = challenge && challenge.empId === e.id
    const solved = hasChallenge && challenge.solved
    return `
    <div class="assignee-row ${hasChallenge ? 'focused' : ''} ${solved ? 'solved' : ''}" onclick="selectEmployeeForTask(${e.id})">
      <div class="assignee-info">
        ${genAvatar(e.name, 24)}
        <div><div class="assignee-name">${e.name}</div><div class="assignee-role">${e.role.name} · Ур.${e.skill}</div></div>
      </div>
      <div style="display:flex;align-items:center;gap:8px">
        ${hasChallenge ? (solved ? '<span style="font-size:11px;color:var(--green)">✓</span>' : '<span style="font-size:11px;color:var(--accent)">⌨️</span>') : ''}
        ${isGuest ? '' : '<button class="btn-danger" style="padding:4px 10px;font-size:11px" onclick="event.stopPropagation();game.unassignFromProject(' + e.id + ');renderProjectScreen()">Снять</button>'}
      </div>
    </div>`
  }).join('')

  const unassigned = s.team.filter(e => !e.assigned)
  const unassignedEl = unassigned.map(e => `
    <div class="assignee-row">
      <div class="assignee-info">
        ${genAvatar(e.name, 24)}
        <div><div class="assignee-name">${e.name}</div><div class="assignee-role">${e.role.name} · Ур.${e.skill}</div></div>
      </div>
      ${isGuest ? '' : '<button class="btn-secondary" style="padding:4px 10px;font-size:11px" onclick="game.assignToProject(' + e.id + ');renderProjectScreen()">Назначить</button>'}
    </div>
  `).join('')

  const codePanel = challenge ? `
    <div class="coding-panel">
      <div class="coding-header">
        <span class="coding-file">${challenge.fileName}</span>
        <span class="coding-emp">${challenge.empName}</span>
        ${isGuest ? '' : '<button class="btn-secondary" style="padding:4px 8px;font-size:10px" onclick="clearCodingChallengeSafe()">×</button>'}
      </div>
      ${challenge.solved
        ? `<div style="padding:20px;text-align:center;color:var(--green)">
            <div style="font-size:24px;margin-bottom:8px">✓</div>
            <div style="font-size:14px">Задача выполнена! Бонус к продуктивности на этой неделе.</div>
            ${isGuest ? '' : '<button class="btn-secondary" style="margin-top:12px" onclick="clearCodingChallengeSafe()">Закрыть</button>'}
          </div>`
        : `<div class="code-display"><pre><code>${challenge.code}</code></pre></div>
           <div class="code-input-wrap">
             <label class="code-input-label">Перепишите код в точности:</label>
             <div id="editor-container" class="editor-wrap"></div>
             <button class="btn-primary" onclick="submitCodeAttempt()">Проверить</button>
           </div>`
      }
    </div>` : ''

  const roomPlayersHtml = room.roomCode ? `
    <div class="card" style="margin-top:12px">
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
      <div class="header-actions">
        ${isGuest ? '' : '<button class="btn-danger" onclick="cancelProjectConfirm()">Отменить</button>'}
      </div>
    </div>
    <div id="project-status">
      <div class="project-name">${proj.name}</div>
      <div class="project-meta-grid">
        <div class="project-meta-item"><div class="meta-label">Жанр</div><div class="meta-value">${proj.genre.name}</div></div>
        <div class="project-meta-item"><div class="meta-label">Графика</div><div class="meta-value">${proj.graphics.name}</div></div>
        <div class="project-meta-item"><div class="meta-label">Платформа</div><div class="meta-value">${proj.platform.name}</div></div>
        <div class="project-meta-item"><div class="meta-label">Масштаб</div><div class="meta-value">${proj.scope.name}</div></div>
      </div>

      <div class="progress-group">
        <div class="progress-item">
          <div class="progress-label"><span>Программирование</span><span>${Math.round(proj.progress.code)}%</span></div>
          <div class="progress-bar"><div class="fill blue" style="width:${proj.progress.code}%"></div></div>
        </div>
        <div class="progress-item">
          <div class="progress-label"><span>Арт</span><span>${Math.round(proj.progress.art)}%</span></div>
          <div class="progress-bar"><div class="fill purple" style="width:${proj.progress.art}%"></div></div>
        </div>
        <div class="progress-item">
          <div class="progress-label"><span>Саунд</span><span>${Math.round(proj.progress.sound)}%</span></div>
          <div class="progress-bar"><div class="fill green" style="width:${proj.progress.sound}%"></div></div>
        </div>
        <div class="progress-item">
          <div class="progress-label"><span>Дизайн</span><span>${Math.round(proj.progress.design)}%</span></div>
          <div class="progress-bar"><div class="fill" style="width:${proj.progress.design}%"></div></div>
        </div>
        <div class="progress-item">
          <div class="progress-label"><span><strong>Общий прогресс</strong></span><span><strong>${avg}%</strong></span></div>
          <div class="progress-bar"><div class="fill" style="width:${avg}%"></div></div>
        </div>
      </div>

      <div class="project-meta-grid" style="margin-top:8px">
        <div class="project-meta-item"><div class="meta-label">Бюджет проекта</div><div class="meta-value">$${proj.budgetNeeded.toLocaleString()}</div></div>
        <div class="project-meta-item"><div class="meta-label">Потрачено</div><div class="meta-value">$${Math.round(proj.spent).toLocaleString()}</div></div>
        <div class="project-meta-item"><div class="meta-label">Качество</div><div class="meta-value">${Math.round(proj.quality)}%</div></div>
        <div class="project-meta-item"><div class="meta-label">Команда</div><div class="meta-value">${proj.assignedTeam.length} чел</div></div>
      </div>
    </div>

    <div class="card">
      <h3>Команда на проекте</h3>
      <div style="font-size:11px;color:var(--text-3);margin-bottom:10px">Нажмите на сотрудника чтобы взять его задачу</div>
      ${assignedEl || '<p class="empty-state">Никто не назначен</p>'}
      ${unassignedEl ? '<h3 style="font-size:13px;color:var(--text-2);margin:12px 0 8px">Свободные сотрудники</h3>' + unassignedEl : ''}
    </div>
    ${roomPlayersHtml}
    ${codePanel}
  `
}

function selectEmployeeForTask(empId) {
  const s = gs()
  const emp = s.team.find(e => e.id === empId)
  if (!emp || !emp.assigned) return
  if (s.codingChallenge && s.codingChallenge.empId === empId && !s.codingChallenge.solved) return
  disposeEditor()
  if (!room.isHost && room.roomCode) {
    room.requestChallenge(empId)
    return
  }
  game.generateCodingChallenge(emp)
  renderProjectScreen()
  setTimeout(() => initEditor(), 50)
}

function initEditor() {
  disposeEditor()
  const container = document.getElementById('editor-container')
  if (!container) return
  const challenge = gs().codingChallenge
  if (!challenge) return
  window._editor = new CustomEditor(container, {
    value: '',
    onInput: () => {}
  })
  setTimeout(() => window._editor?.focus(), 50)
}

function disposeEditor() {
  if (window._editor) {
    window._editor.dispose()
    window._editor = null
  }
}

function submitCodeAttempt() {
  if (window._editor) {
    const code = window._editor.getValue()
    if (!room.isHost && room.roomCode) {
      room.submitChallenge(code)
      disposeEditor()
      return
    }
    const ok = game.submitCodingAttempt(code)
    if (ok) {
      disposeEditor()
      renderProjectScreen()
    } else {
      const el = document.getElementById('editor-container')
      if (el) { el.style.borderColor = 'var(--red)'; setTimeout(() => { el.style.borderColor = '' }, 1000) }
    }
  }
}

/* Project creation helpers */
function clearCodingChallengeSafe() {
  if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост может закрывать задачи'); return }
  game.clearCodingChallenge(); renderProjectScreen()
}

function cancelProjectConfirm() {
  if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост может отменять проекты'); return }
  if (confirm('Отменить проект?')) { game.cancelProject(); renderProjectScreen() }
}

function updateEstimate() {
  const genreId = document.querySelector('#genre-options .selected')?.dataset.id
  const gfxId = document.querySelector('#graphics-options .selected')?.dataset.id
  const platId = document.querySelector('#platform-options .selected')?.dataset.id
  const scopeId = document.querySelector('#scope-options .selected')?.dataset.id
  const btn = document.getElementById('btn-create-project')

  if (!genreId || !gfxId || !platId || !scopeId) {
    document.getElementById('project-estimate').style.display = 'none'
    btn.disabled = true
    return
  }

  const d = window.GDATA
  const genre = d.genres.find(g => g.id === genreId)
  const gfx = d.graphics.find(g => g.id === gfxId)
  const plat = d.platforms.find(p => p.id === platId)
  const scope = d.scopes.find(s => s.id === scopeId)

  const budget = Math.round(scope.budgetBase * genre.budgetMult * gfx.costMult * plat.devMult)
  const time = Math.round(scope.timeBase * genre.timeMult * gfx.timeMult * plat.devMult)

  const name = window.genGameName()

  document.getElementById('project-estimate').style.display = 'grid'
  document.getElementById('project-estimate').innerHTML = `
    <div class="est-item"><div class="est-label">Название</div><div class="est-value" style="font-size:14px;font-family:var(--font)">${name}</div></div>
    <div class="est-item"><div class="est-label">Бюджет</div><div class="est-value" style="color:${budget > game.budget ? 'var(--red)' : 'var(--green)'}">${budget > game.budget ? '⚠ ' : ''}$${budget.toLocaleString()}</div></div>
    <div class="est-item"><div class="est-label">Срок</div><div class="est-value">${time} нед</div></div>
  `

  btn.disabled = budget > game.budget
  btn.dataset.genre = genreId
  btn.dataset.graphics = gfxId
  btn.dataset.platform = platId
  btn.dataset.scope = scopeId

  btn.onclick = () => {
    if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост может создавать проекты'); return }
    game.createProject(genreId, gfxId, platId, scopeId)
    if (room.isHost) room.broadcastState(game.getStatus())
    renderSidebar()
    renderProjectScreen()
    renderDashboard()
  }
}

/* Team Screen */
function renderTeamScreen() {
  const el = document.getElementById('screen-team')
  const s = gs()

  if (s.teamSize === 0) {
    el.innerHTML = '<div class="screen-header"><h2>Команда</h2></div><div class="empty-state" style="text-align:center;padding:40px">В студии пока нет сотрудников. Перейдите в раздел «Найм».</div>'
    return
  }

  const roles = window.GDATA.roles
  let html = ''
  roles.forEach(role => {
    const members = s.team.filter(e => e.role.id === role.id)
    if (members.length === 0) return
    html += `
      <div class="role-group">
        <div class="role-group-header" style="border-left:3px solid ${role.color}">
          <span style="color:${role.color}">${role.name}</span>
          <span class="role-count">${members.length} чел</span>
        </div>
        <div class="role-members">
          ${members.map(e => `
            <div class="team-card">
              <div class="avatar">${genAvatar(e.name, 44)}</div>
              <div class="emp-name">${e.name}</div>
              <div class="emp-role" style="color:${e.role.color}">${e.role.name}</div>
              <div class="emp-skill">Ур. ${e.skill}/10</div>
              <div class="emp-mood">
                <span style="color:${e.mood > 60 ? 'var(--green)' : e.mood > 30 ? 'var(--orange)' : 'var(--red)'}">${e.mood}%</span>
              </div>
              <div class="emp-salary">$${e.salary}/нед</div>
              <div class="emp-actions">
                <button class="btn-danger" style="padding:4px 10px;font-size:11px" onclick="fireEmp(${e.id})">Уволить</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`
  })
  el.innerHTML = `
    <div class="screen-header"><h2>Команда</h2></div>
    ${html || '<div class="empty-state" style="text-align:center;padding:40px">В студии пока нет сотрудников</div>'}`
}

function fireEmp(id) {
  if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост может увольнять'); return }
  if (confirm('Уволить этого сотрудника?')) {
    game.fireEmployee(id)
    renderSidebar()
    renderTeamScreen()
    renderDashboard()
  }
}

/* Hire Screen */
function hireCandidate(name, roleId, skill, salary) {
  if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост может нанимать'); return }
  game.hireEmployee(name, roleId, skill, salary)
  renderSidebar()
  renderDashboard()
  renderHireScreen()
}

function initHireScreen() {}

function renderHireScreen() {
  const el = document.getElementById('screen-hire')
  const s = gs()
  el.innerHTML = `
    <div class="screen-header">
      <h2>Найм сотрудников</h2>
      <div class="header-actions">
        <button class="btn-secondary" onclick="refreshCandidates()">Обновить кандидатов</button>
      </div>
    </div>
    <div style="margin-bottom:16px;font-size:13px;color:var(--text-3)">Бюджет: <strong style="color:var(--text)">$${s.budget.toLocaleString()}</strong> · Еженедельные расходы: <strong style="color:var(--text)">$${s.teamCost.toLocaleString()}</strong></div>
    <div id="candidates-list"></div>
  `
  if (!window._candidates) refreshCandidates()
  else renderCandidates()
}

function refreshCandidates() {
  if (room.roomCode && !room.isHost) { showModal('Доступ запрещён', 'Только хост может обновлять кандидатов'); return }
  window._candidates = []
  for (let i = 0; i < 6; i++) {
    window._candidates.push(window.randomEmployee())
  }
  renderCandidates()
}

function escQ(s) { return s.replace(/'/g, "\\'") }

function renderCandidates() {
  const el = document.getElementById('candidates-list')
  if (!el) return
  const s = gs()
  const isGuest = room.roomCode && !room.isHost
  el.innerHTML = window._candidates.map(c => `
    <div class="candidate-card">
      <div>${genAvatar(c.name, 44)}</div>
      <div class="cand-info">
        <div class="cand-name">${c.name}</div>
        <div class="cand-details">
          <span style="color:${c.role.color}">${c.role.name}</span>
          <span>З/п: $${c.salary}/нед</span>
        </div>
      </div>
      <div class="cand-skill">${'★'.repeat(Math.ceil(c.skill/2))}${'☆'.repeat(5-Math.ceil(c.skill/2))}</div>
      ${isGuest ? '<span style="font-size:11px;color:var(--text-3)">Нанимает хост</span>' :
        `<button class="btn-primary" style="padding:8px 16px;font-size:12px"
          onclick="hireCandidate('${escQ(c.name)}','${c.role.id}',${c.skill},${c.salary})"
          ${s.budget < c.salary * 4 ? 'disabled' : ''}>Нанять</button>`}
    </div>
  `).join('')
}

/* History Screen */
function renderHistoryScreen() {
  const el = document.getElementById('screen-history')
  const s = gs()

  let gamesHtml = ''
  if (s.completedGames.length === 0) {
    gamesHtml = '<p class="empty-state">Пока нет выпущенных игр</p>'
  } else {
    gamesHtml = s.completedGames.map(g => `
      <div class="completed-card">
        <div class="game-rating" style="background:${g.review.color}20;color:${g.review.color}">${g.rating}</div>
        <div class="game-info">
          <div class="game-name">${g.name}</div>
          <div class="game-meta">${g.genre} · ${g.weeks} нед · Качество: ${g.quality}/100</div>
          <div class="game-meta" style="color:${g.profit > 0 ? 'var(--green)' : 'var(--red)'}">${g.review.text}</div>
        </div>
        <div style="text-align:right">
          <div class="game-revenue" style="color:${g.profit > 0 ? 'var(--green)' : 'var(--red)'}">${g.profit > 0 ? '+' : ''}$${g.profit.toLocaleString()}</div>
          <div style="font-size:11px;color:var(--text-3)">от ${g.revenue.toLocaleString()}</div>
        </div>
      </div>
    `).join('')
  }

  el.innerHTML = `
    <div class="screen-header"><h2>История</h2></div>
    ${gamesHtml}
    <div class="card">
      <h3>Лог событий</h3>
      ${renderFullLog()}
    </div>
  `
}

/* Game Over */
function showGameOver(reason) {
  const modal = document.getElementById('modal-overlay')
  const content = document.getElementById('modal-content')
  content.innerHTML = `
    <div class="game-over">
      <h2>💀 Game Over</h2>
      <p>${reason}</p>
      <p style="font-size:13px;color:var(--text-3)">Студия «${game.studioName}» просуществовала ${game.week} недель</p>
      <p style="font-size:13px;color:var(--text-3)">Выпущено игр: ${game.completedGames.length}</p>
      <button class="btn-primary" onclick="location.reload()">Начать заново</button>
    </div>
  `
  modal.classList.remove('modal-hidden')
}

/* Week processing */
document.addEventListener('click', e => {
  if (e.target.id === 'btn-end-week') endWeek()
})

function endWeek() {
  if (room.roomCode && !room.isHost) {
    showModal('Доступ запрещён', 'Только хост может завершать неделю')
    return
  }
  if (!game.currentProject) {
    showModal('Нет проекта', 'Сначала создайте проект в разделе «Проект»')
    return
  }

  if (game.currentProject.assignedTeam.length === 0) {
    if (!confirm('На проект не назначена команда! Всё равно продолжить?')) return
  }

  const result = game.processWeek()
  const s = gs()

  if (room.isHost) {
    room.broadcastState(game.getStatus())
  }

  if (result.event) {
    showModal('Событие недели', result.event.text)
  }

  if (result.gameOver) {
    renderSidebar()
    renderDashboard()
    showGameOver(game.gameOverReason || 'Студия обанкротилась')
    return
  }

  if (result.finished && s.completedGames.length > 0) {
    const last = s.completedGames[s.completedGames.length - 1]
    showModal('Релиз!', `
      <p><strong>${last.name}</strong> выпущен!</p>
      <p>Оценка: <strong style="color:${last.review.color}">${last.rating}</strong> (${last.quality}/100)</p>
      <p>${last.review.text}</p>
      <p>Доход: <strong style="color:var(--green)">+$${last.revenue.toLocaleString()}</strong></p>
      <p style="font-size:13px;color:var(--text-3)">Затраты на разработку: $${last.cost.toLocaleString()}</p>
    `)
  }

  renderSidebar()
  renderDashboard()
  renderProjectScreen()
}

function showModal(title, bodyHtml) {
  const modal = document.getElementById('modal-overlay')
  const content = document.getElementById('modal-content')
  content.innerHTML = `
    <h2>${title}</h2>
    ${bodyHtml}
    <button class="btn-primary" onclick="document.getElementById('modal-overlay').classList.add('modal-hidden')">OK</button>
  `
  modal.classList.remove('modal-hidden')
}

/* Screen routing */
function renderPlayersScreen() {
  const el = document.getElementById('screen-players')
  if (!room.roomCode) {
    el.innerHTML = '<div class="screen-header"><h2>Игроки</h2></div><div class="card"><p class="empty-state">Вы не в комнате</p><div style="display:flex;gap:10px;margin-top:12px"><button class="btn-primary" onclick="showRoomModal(\'create\')">+ Создать комнату</button><button class="btn-secondary" onclick="showRoomModal(\'join\')">Присоединиться</button></div></div>'
    return
  }
  el.innerHTML = `
    <div class="screen-header">
      <h2>🎮 Игроки в комнате</h2>
      <div class="header-actions">
        <button class="btn-secondary" onclick="copyRoomCode()">📋 Копировать код</button>
        <button class="btn-danger" onclick="leaveRoom()">Выйти</button>
      </div>
    </div>
    <div class="card" style="text-align:center;margin-bottom:16px">
      <div style="font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px">Код комнаты</div>
      <div style="font-family:var(--mono);font-size:32px;font-weight:700;color:var(--accent);letter-spacing:6px">${room.roomCode}</div>
    </div>
    <div class="card">
      <h3>Участники (${room.members.length})</h3>
      <div class="room-players" style="margin-top:8px">
        ${room.members.map(m => `
          <div class="room-player-row">
            <span class="room-player-dot ${m.id === room.playerId ? 'room-dot-you' : 'room-dot-other'}"></span>
            ${genAvatar(m.name, 32)}
            <span class="room-player-name">${m.name}</span>
            <span class="room-player-tag" style="background:${m.isHost ? 'var(--accent-dim)' : 'var(--surface-3)'};color:${m.isHost ? 'var(--accent)' : 'var(--text-2)'};padding:2px 10px;border-radius:99px">${m.isHost ? 'Хост' : 'Игрок'}</span>
            ${m.id === room.playerId ? '<span style="font-size:10px;color:var(--green)">это вы</span>' : ''}
          </div>
        `).join('')}
      </div>
    </div>
    <div class="card">
      <h3>Как играть</h3>
      <ol style="font-size:13px;color:var(--text-2);line-height:1.8;padding-left:18px">
        <li>Хост управляет игрой: создаёт проект, нанимает, завершает недели</li>
        <li>Гости открывают <strong>Проект</strong> и кликают по сотрудникам — появляется задача с кодом</li>
        <li>Гости перепечатывают код в редакторе — это помогает команде</li>
        <li>Все изменения синхронизируются между вкладками</li>
      </ol>
    </div>
  `
}

function copyRoomCode() {
  navigator.clipboard?.writeText(room.roomCode)
  showModal('Скопировано', 'Код комнаты: <strong>' + room.roomCode + '</strong>')
}

function renderScreen(id) {
  switch(id) {
    case 'dashboard': renderDashboard(); break
    case 'project': renderProjectScreen(); break
    case 'team': renderTeamScreen(); break
    case 'players': renderPlayersScreen(); break
    case 'hire': renderHireScreen(); break
    case 'history': renderHistoryScreen(); break
  }
}

/* Modal close on overlay click */
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) {
    e.currentTarget.classList.add('modal-hidden')
  }
})

/* Room functions */
function startScreenCreateRoom() {
  const modal = document.getElementById('modal-overlay')
  const content = document.getElementById('modal-content')
  content.innerHTML = `
    <h2>Создать комнату</h2>
    <p style="font-size:13px;color:var(--text-3);margin-bottom:12px">Игра начнётся автоматически, игроки смогут присоединиться через ту же вкладку браузера</p>
    <label style="display:block;margin-bottom:6px;font-size:12px;color:var(--text-2)">Ваше имя</label>
    <input type="text" id="room-name-input" class="room-name-input" value="Хост" maxlength="20" placeholder="Хост">
    <button class="btn-primary" onclick="startScreenCreateRoomSubmit()" style="margin-top:12px">Создать и играть</button>
  `
  modal.classList.remove('modal-hidden')
}

function startScreenCreateRoomSubmit() {
  const name = (document.getElementById('room-name-input')?.value || '').trim() || 'Хост'
  if (!game.studioName) {
    game.startStudio('Студия ' + name, Math.floor(Math.random() * 4), 50000)
  }
  room.createRoom(name)
  document.getElementById('modal-overlay').classList.add('modal-hidden')
  renderSidebar()
  renderDashboard()
  showScreen('dashboard')
  setupRoomSync()
}

function startScreenJoinRoom() {
  const modal = document.getElementById('modal-overlay')
  const content = document.getElementById('modal-content')
  content.innerHTML = `
    <h2>Присоединиться к комнате</h2>
    <label style="display:block;margin-bottom:6px;font-size:12px;color:var(--text-2)">Код комнаты</label>
    <input type="text" id="room-code-input" class="room-name-input room-code-input" placeholder="ABC123" maxlength="6" style="text-transform:uppercase;letter-spacing:0.15em;font-size:20px;text-align:center;padding:14px">
    <label style="display:block;margin:12px 0 6px;font-size:12px;color:var(--text-2)">Ваше имя (необязательно)</label>
    <input type="text" id="room-name-input" class="room-name-input" value="" maxlength="20" placeholder="user_...">
    <button class="btn-primary" onclick="startScreenJoinRoomSubmit()" style="margin-top:12px">Присоединиться</button>
    <p style="font-size:11px;color:var(--text-3);margin-top:8px">Если не указать имя, будет автоматически сгенерировано (user_1, user_2...)</p>
  `
  modal.classList.remove('modal-hidden')
}

function startScreenJoinRoomSubmit() {
  const code = (document.getElementById('room-code-input')?.value || '').trim().toUpperCase()
  const name = (document.getElementById('room-name-input')?.value || '').trim()
  if (code.length < 4) { showModal('Ошибка', 'Код должен содержать минимум 4 символа'); return }
  if (!game.studioName) {
    game.startStudio('Гость', Math.floor(Math.random() * 4), 50000)
  }
  room.joinRoom(code, name)
  document.getElementById('modal-overlay').classList.add('modal-hidden')
  renderSidebar()
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
      <p style="font-size:13px">Игроки смогут присоединиться к вашей игре через ту же вкладку браузера (BroadcastChannel)</p>
      <label style="display:block;margin-bottom:6px;font-size:12px;color:var(--text-2)">Ваше имя</label>
      <input type="text" id="room-name-input" class="room-name-input" value="${game.studioName || 'Хост'}" maxlength="20" placeholder="Хост">
      <button class="btn-primary" onclick="createRoom()" style="margin-top:12px">Создать</button>
    `
  } else {
    content.innerHTML = `
      <h2>Присоединиться к комнате</h2>
      <label style="display:block;margin-bottom:6px;font-size:12px;color:var(--text-2)">Код комнаты</label>
      <input type="text" id="room-code-input" class="room-name-input room-code-input" placeholder="ABC123" maxlength="6">
      <label style="display:block;margin:12px 0 6px;font-size:12px;color:var(--text-2)">Ваше имя</label>
      <input type="text" id="room-name-input" class="room-name-input" value="Игрок" maxlength="20" placeholder="Игрок">
      <button class="btn-primary" onclick="joinRoomByCode()" style="margin-top:12px">Присоединиться</button>
    `
  }
  modal.classList.remove('modal-hidden')
}

function createRoom() {
  const nameInput = document.getElementById('room-name-input')
  const name = nameInput ? nameInput.value.trim() || 'Хост' : 'Хост'
  room.createRoom(name)
  document.getElementById('modal-overlay').classList.add('modal-hidden')
  renderDashboard()
  setupRoomSync()
}

function joinRoomByCode() {
  const codeInput = document.getElementById('room-code-input')
  const nameInput = document.getElementById('room-name-input')
  const code = codeInput ? codeInput.value.trim().toUpperCase() : ''
  const name = nameInput ? nameInput.value.trim() || 'Игрок' : 'Игрок'
  if (code.length < 4) { showModal('Ошибка', 'Код должен содержать минимум 4 символа'); return }
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
    if (_roomState && _roomState.codingChallenge) {
      _roomState.codingChallenge.solved = solved
    }
    game.codingChallenge = _roomState ? _roomState.codingChallenge : null
    renderProjectScreen()
  }
  if (room.isHost) {
    room.__syncState = game.getStatus()
    room.broadcastState(game.getStatus())
  }
}
