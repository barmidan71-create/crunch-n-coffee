/* Game engine for Crunch & Coffee */

window.Game = class Game {
  constructor() {
    this.reset()
  }

  reset() {
    this.studioName = ''
    this.logoSeed = 0
    this.budget = 50000
    this.week = 0
    this.fans = 0
    this.team = []
    this.projects = []
    this.history = []
    this.completedGames = []
    this.currentProject = null
    this.gameOver = false
    this.gameOverReason = ''
    this.weeklyHistory = []
    this.codingChallenge = null
  }

  startStudio(name, logoSeed, budget) {
    this.studioName = name
    this.logoSeed = logoSeed || 0
    this.budget = budget || 50000
    this.week = 0
    this.fans = 0
    this.team = []
    this.projects = []
    this.history = []
    this.completedGames = []
    this.currentProject = null
    this.gameOver = false
    this.gameOverReason = ''
    this.weeklyHistory = []
    this.codingChallenge = null
    this.addLog('Студия «' + name + '» основана! Бюджет: $' + this.budget.toLocaleString())
  }

  addLog(msg) {
    this.history.unshift({ week: this.week, text: msg })
  }

  createProject(genreId, graphicsId, platformId, scopeId) {
    const d = window.GDATA
    const genre = d.genres.find(g => g.id === genreId)
    const gfx = d.graphics.find(g => g.id === graphicsId)
    const plat = d.platforms.find(p => p.id === platformId)
    const scope = d.scopes.find(s => s.id === scopeId)

    const budgetNeeded = Math.round(scope.budgetBase * genre.budgetMult * gfx.costMult * plat.devMult)
    const timeNeeded = Math.round(scope.timeBase * genre.timeMult * gfx.timeMult * plat.devMult)

    const name = window.genGameName()

    this.currentProject = {
      name: name,
      genre: genre,
      graphics: gfx,
      platform: plat,
      scope: scope,
      budgetNeeded: budgetNeeded,
      timeNeeded: timeNeeded,
      week: this.week,
      progress: { code: 0, art: 0, sound: 0, design: 0 },
      quality: 50,
      spent: 0,
      assignedTeam: [],
      finished: false,
      cancelled: false
    }

    this.addLog('Начат проект «' + name + '». Бюджет: $' + budgetNeeded.toLocaleString() + ', срок: ' + timeNeeded + ' недель')

    return this.currentProject
  }

  assignToProject(employeeId) {
    if (!this.currentProject) return false
    const emp = this.team.find(e => e.id === employeeId)
    if (!emp || emp.assigned) return false
    emp.assigned = true
    this.currentProject.assignedTeam.push(emp)
    this.addLog(emp.name + ' назначен на проект «' + this.currentProject.name + '»')
    return true
  }

  unassignFromProject(employeeId) {
    if (!this.currentProject) return false
    const idx = this.currentProject.assignedTeam.findIndex(e => e.id === employeeId)
    if (idx === -1) return false
    const emp = this.currentProject.assignedTeam[idx]
    emp.assigned = false
    this.currentProject.assignedTeam.splice(idx, 1)
    this.addLog(emp.name + ' снят с проекта')
    return true
  }

  hireEmployee(name, roleId, skill, salary) {
    const role = window.GDATA.roles.find(r => r.id === roleId)
    if (!role) return null
    if (this.team.some(e => e.name === name)) return null
    const id = Date.now() + Math.random()
    const emp = {
      id: id,
      name: name || 'Сотрудник',
      role: role,
      skill: skill || 5,
      salary: salary || 3000,
      mood: 80,
      productivity: 0.7 + Math.random() * 0.3,
      assigned: false,
      weeksEmployed: 0
    }
    this.team.push(emp)
    this.addLog('Нанят ' + role.name + ' — ' + emp.name + ' ($' + emp.salary + '/нед)')
    return emp
  }

  fireEmployee(employeeId) {
    const idx = this.team.findIndex(e => e.id === employeeId)
    if (idx === -1) return false
    const emp = this.team[idx]
    this.addLog('Уволен ' + emp.role.name + ' — ' + emp.name)
    if (emp.assigned && this.currentProject) {
      const aidx = this.currentProject.assignedTeam.indexOf(emp)
      if (aidx !== -1) this.currentProject.assignedTeam.splice(aidx, 1)
    }
    this.team.splice(idx, 1)
    return true
  }

  processWeek() {
    if (!this.currentProject || this.currentProject.finished) return { event: null, finished: false }

    const proj = this.currentProject
    this.week++

    // Pay salaries
    const salaryCost = this.team.reduce((s, e) => s + e.salary, 0)
    this.budget -= salaryCost

    // Advance progress
    const totalProductivity = proj.assignedTeam.reduce((s, e) => {
      const moodFactor = e.mood / 100
      return s + e.skill * moodFactor * e.productivity
    }, 0)

    const progressRoles = { code: 0, art: 0, sound: 0, design: 0 }
    proj.assignedTeam.forEach(e => {
      const roleId = e.role.id
      const bonus = this.codingChallenge && this.codingChallenge.solved && this.codingChallenge.empId === e.id ? 1.5 : 1.0
      const eff = e.skill * (e.mood / 100) * e.productivity * 0.08 * bonus
      if (roleId === 'programmer') progressRoles.code += eff
      else if (roleId === 'artist') progressRoles.art += eff
      else if (roleId === 'designer') progressRoles.design += eff
      else if (roleId === 'sound') progressRoles.sound += eff
      else {
        progressRoles.code += eff * 0.3
        progressRoles.art += eff * 0.3
        progressRoles.sound += eff * 0.2
        progressRoles.design += eff * 0.2
      }
    })

    proj.progress.code = Math.min(100, proj.progress.code + progressRoles.code)
    proj.progress.art = Math.min(100, proj.progress.art + progressRoles.art)
    proj.progress.sound = Math.min(100, proj.progress.sound + progressRoles.sound)
    proj.progress.design = Math.min(100, proj.progress.design + progressRoles.design)

    // Update quality based on progress
    const avgProgress = (proj.progress.code + proj.progress.art + proj.progress.sound + proj.progress.design) / 4
    proj.quality = Math.min(100, 30 + avgProgress * 0.6)

    // Update mood
    proj.assignedTeam.forEach(e => {
      e.mood = Math.max(10, Math.min(100, e.mood + (Math.random() > 0.5 ? 2 : -3)))
      e.weeksEmployed++
    })

    proj.spent += salaryCost + 2000 + Math.random() * 3000

    this.weeklyHistory.push({
      week: this.week,
      budget: this.budget,
      fans: this.fans,
      expenses: salaryCost,
      revenue: 0
    })

    // Random event
    let event = null
    if (Math.random() < 0.35) {
      event = this.triggerRandomEvent(proj)
    }

    // Check completion
    const allDone = proj.progress.code >= 100 && proj.progress.art >= 100 &&
                    proj.progress.sound >= 100 && proj.progress.design >= 100

    // Check bankruptcy
    if (this.budget <= 0 && proj.spent > proj.budgetNeeded * 0.5) {
      this.gameOver = true
      this.gameOverReason = 'Банкротство! Деньги закончились.'
      this.codingChallenge = null
      return { event: null, finished: true, gameOver: true }
    }

    this.codingChallenge = null

    if (allDone) {
      proj.finished = true
      this.finishProject(proj)
      return { event: event, finished: true, gameOver: false }
    }

    return { event: event, finished: false, gameOver: false }
  }

  triggerRandomEvent(proj) {
    const events = window.GDATA.events
    const evt = events[Math.floor(Math.random() * events.length)]
    this.addLog('Событие: ' + evt.text)

    if (evt.effect === 'progress') {
      const mult = evt.type === 'bad' ? -1 : 1
      const delta = evt.delta * mult
      proj.progress.code = Math.max(0, Math.min(100, proj.progress.code + delta * 0.3))
      proj.progress.art = Math.max(0, Math.min(100, proj.progress.art + delta * 0.3))
      proj.progress.sound = Math.max(0, Math.min(100, proj.progress.sound + delta * 0.2))
      proj.progress.design = Math.max(0, Math.min(100, proj.progress.design + delta * 0.2))
    } else if (evt.effect === 'morale') {
      const delta = evt.type === 'bad' ? -evt.delta : evt.delta
      proj.assignedTeam.forEach(e => {
        e.mood = Math.max(10, Math.min(100, e.mood + delta))
      })
    } else if (evt.effect === 'art') {
      proj.progress.art = Math.min(100, proj.progress.art + evt.delta)
    } else if (evt.effect === 'design') {
      proj.progress.design = Math.min(100, proj.progress.design + (evt.type === 'bad' ? -Math.abs(evt.delta) : evt.delta))
    } else if (evt.effect === 'budget') {
      this.budget += evt.delta
    }

    if (evt.type === 'mixed' && evt.moraleCost) {
      proj.assignedTeam.forEach(e => {
        e.mood = Math.max(10, e.mood - evt.moraleCost)
      })
    }

    return evt
  }

  finishProject(proj) {
    // Calculate final quality
    const avgSkill = proj.assignedTeam.length > 0
      ? proj.assignedTeam.reduce((s, e) => s + e.skill, 0) / proj.assignedTeam.length
      : 1
    const timeBonus = Math.max(0, proj.timeNeeded - (this.week - proj.week)) * 2
    const finalQuality = Math.min(100, Math.round(proj.quality + timeBonus + avgSkill * 2))

    const review = window.GDATA.reviews.find(r => finalQuality >= r.min) || window.GDATA.reviews[window.GDATA.reviews.length - 1]

    // Calculate revenue
    const baseRevenue = 5000 + finalQuality * 300
    const genrePopularity = proj.genre.popularity * 1000
    const platformMult = proj.platform.marketMult
    const scopeMult = proj.scope.id === 'small' ? 0.5 : proj.scope.id === 'medium' ? 1.0 : 2.5
    const revenue = Math.round((baseRevenue + genrePopularity) * platformMult * scopeMult)

    this.budget += revenue
    this.fans += finalQuality * 10 + review.rating.length * 50
    if (this.weeklyHistory.length > 0) {
      this.weeklyHistory[this.weeklyHistory.length - 1].revenue = revenue
      this.weeklyHistory[this.weeklyHistory.length - 1].budget = this.budget
      this.weeklyHistory[this.weeklyHistory.length - 1].fans = this.fans
    }

    const gameResult = {
      name: proj.name,
      genre: proj.genre.name,
      quality: finalQuality,
      review: review,
      revenue: revenue,
      cost: Math.round(proj.spent),
      weeks: this.week - proj.week,
      profit: revenue - Math.round(proj.spent)
    }

    this.completedGames.push(gameResult)
    this.currentProject = null

    this.addLog('Релиз «' + gameResult.name + '»! Оценка: ' + review.rating + ' (' + finalQuality + '/100), доход: $' + revenue.toLocaleString())

    // Reset team assignment
    this.team.forEach(e => { e.assigned = false })

    return gameResult
  }

  cancelProject() {
    if (!this.currentProject) return
    this.currentProject.cancelled = true
    this.addLog('Проект «' + this.currentProject.name + '» отменён')
    this.team.forEach(e => { e.assigned = false })
    this.currentProject = null
  }

  getFullTeamCost() {
    return this.team.reduce((s, e) => s + e.salary, 0)
  }

  generateCodingChallenge(emp) {
    const tasks = window.GDATA.codingTasks
    const roleTasks = tasks.filter(t => t.roleId === emp.role.id)
    if (roleTasks.length === 0) return null
    const task = roleTasks[Math.floor(Math.random() * roleTasks.length)]
    this.codingChallenge = {
      empId: emp.id,
      empName: emp.name,
      roleId: emp.role.id,
      fileName: task.fileName,
      code: task.code,
      attempt: '',
      solved: false
    }
    return this.codingChallenge
  }

  submitCodingAttempt(code) {
    if (!this.codingChallenge || this.codingChallenge.solved) return false
    if (code.trim() === this.codingChallenge.code.trim()) {
      this.codingChallenge.solved = true
      return true
    }
    return false
  }

  clearCodingChallenge() {
    this.codingChallenge = null
  }

  getStatus() {
    return {
      studio: this.studioName,
      budget: this.budget,
      week: this.week,
      fans: this.fans,
      team: this.team,
      teamSize: this.team.length,
      teamCost: this.getFullTeamCost(),
      project: this.currentProject,
      completedGames: this.completedGames,
      gameOver: this.gameOver,
      gameOverReason: this.gameOverReason,
      weeklyHistory: this.weeklyHistory,
      codingChallenge: this.codingChallenge
    }
  }
}
