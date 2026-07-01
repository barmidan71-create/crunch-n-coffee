/* Game data for Crunch & Coffee */

window.GDATA = {
  genres: [
    { id: 'rpg', name: 'RPG', icon: 'star', budgetMult: 1.4, timeMult: 1.3, popularity: 8 },
    { id: 'shooter', name: 'Шутер', icon: 'fire', budgetMult: 1.5, timeMult: 1.2, popularity: 9 },
    { id: 'platformer', name: 'Платформер', icon: 'gamepad', budgetMult: 0.8, timeMult: 0.9, popularity: 7 },
    { id: 'puzzle', name: 'Головоломка', icon: 'pixel', budgetMult: 0.5, timeMult: 0.6, popularity: 6 },
    { id: 'simulator', name: 'Симулятор', icon: 'chart', budgetMult: 1.0, timeMult: 1.0, popularity: 7 },
    { id: 'strategy', name: 'Стратегия', icon: 'users', budgetMult: 1.3, timeMult: 1.4, popularity: 7 },
    { id: 'action', name: 'Экшен', icon: 'fire', budgetMult: 1.2, timeMult: 1.1, popularity: 9 },
    { id: 'racing', name: 'Гонки', icon: 'time', budgetMult: 0.9, timeMult: 0.8, popularity: 8 }
  ],

  graphics: [
    { id: 'pixel', name: 'Пиксель-арт', costMult: 0.5, timeMult: 0.7, appeal: 6 },
    { id: 'lowpoly', name: 'Low Poly', costMult: 0.7, timeMult: 0.8, appeal: 7 },
    { id: 'handdrawn', name: '2D Hand-Drawn', costMult: 1.0, timeMult: 1.1, appeal: 8 },
    { id: 'realistic', name: 'Реалистичная 3D', costMult: 2.0, timeMult: 1.6, appeal: 9 },
    { id: 'stylized', name: 'Стилизованная', costMult: 1.1, timeMult: 1.0, appeal: 8 },
    { id: 'voxel', name: 'Воксельная', costMult: 0.8, timeMult: 0.9, appeal: 7 }
  ],

  platforms: [
    { id: 'pc', name: 'ПК', marketMult: 1.0, devMult: 1.0 },
    { id: 'console', name: 'Консоль', marketMult: 1.3, devMult: 1.4 },
    { id: 'mobile', name: 'Мобильные', marketMult: 1.8, devMult: 0.7 },
    { id: 'vr', name: 'VR', marketMult: 0.4, devMult: 1.8 }
  ],

  scopes: [
    { id: 'small', name: 'Инди-проект', budgetBase: 20000, timeBase: 4, teamMax: 3, riskBonus: 5 },
    { id: 'medium', name: 'Средний проект', budgetBase: 80000, timeBase: 8, teamMax: 8, riskBonus: 3 },
    { id: 'aaa', name: 'AAA-блокбастер', budgetBase: 300000, timeBase: 16, teamMax: 20, riskBonus: 1 }
  ],

  roles: [
    { id: 'programmer', name: 'Программист', icon: 'code', color: '#3498DB' },
    { id: 'artist', name: 'Художник', icon: 'pixel', color: '#E91E63' },
    { id: 'designer', name: 'Геймдизайнер', icon: 'star', color: '#D4A84B' },
    { id: 'sound', name: 'Саунд-дизайнер', icon: 'gamepad', color: '#4CAF50' },
    { id: 'producer', name: 'Продюсер', icon: 'users', color: '#FF5722' },
    { id: 'qa', name: 'QA-тестер', icon: 'document', color: '#9C27B0' }
  ],

  femaleFirstNames: [
    'Екатерина','Мария','Анна','Ольга','Татьяна','Елена','Наталья','Юлия',
    'Ирина','Ксения','София','Анастасия','Дарья','Вероника','Полина','Алёна'
  ],

  maleFirstNames: [
    'Алексей','Дмитрий','Иван','Сергей','Павел','Николай','Максим','Андрей',
    'Кирилл','Артём','Владимир','Евгений','Даниил','Роман','Тимофей','Глеб',
    'Матвей','Степан','Илья','Георгий'
  ],

  maleLastNames: [
    'Волков','Кузнецов','Попов','Соколов','Лебедев','Козлов','Новиков','Морозов',
    'Петров','Володин','Соловьёв','Васильев','Зайцев','Павлов','Семёнов','Голубев',
    'Виноградов','Богданов','Воробьёв','Фёдоров','Михайлов','Белов','Тарасов',
    'Комаров','Орлов','Киселёв','Макаров','Андреев','Ковалёв','Ильин','Гусев',
    'Смирнов','Титов','Громов','Кабанов','Медведев','Никитин','Савельев','Фомин'
  ],

  events: [
    { text: 'Критический баг найден в билде!', effect: 'progress', delta: -8, type: 'bad' },
    { text: 'Команда вдохновилась новым артом!', effect: 'morale', delta: 10, type: 'good' },
    { text: 'Кранч-неделя: все работают сверхурочно', effect: 'progress', delta: 15, type: 'mixed', moraleCost: -5 },
    { text: 'Издатель требует кранч-режим', effect: 'progress', delta: 10, type: 'mixed', moraleCost: -8 },
    { text: 'Художник нарисовал концепт за 2 дня!', effect: 'art', delta: 12, type: 'good' },
    { text: 'Синдром второго проекта: переделываем механику', effect: 'design', delta: -10, type: 'bad' },
    { text: 'Геймджем-идея: команда мотивирована!', effect: 'morale', delta: 15, type: 'good' },
    { text: 'Утечка билда в сеть — срочный патч!', effect: 'progress', delta: -15, type: 'bad' },
    { text: 'Steam одобрил страницу игры', effect: 'morale', delta: 12, type: 'good' },
    { text: 'Выгорание: программист берёт больничный', effect: 'progress', delta: -10, type: 'bad' },
    { text: 'Саундтрек попал в топ Spotify!', effect: 'morale', delta: 8, type: 'good' },
    { text: 'Оптимизация: FPS вырос на 20%', effect: 'progress', delta: 8, type: 'good' },
    { text: 'Спор в команде о дизайне персонажа', effect: 'morale', delta: -8, type: 'bad' },
    { text: 'Инвестор увеличил бюджет!', effect: 'budget', delta: 25000, type: 'good' },
    { text: 'Поломка ПК — потеря данных за день', effect: 'progress', delta: -6, type: 'bad' }
  ],

  gameNameParts: {
    prefixes: ['Dark','Last','Final','Deep','Iron','Crimson','Frozen','Shattered','Lost','Shadow','Star','Cross','Zero','Neon','Ghost','Wolf','Cyber','Pixel','Echo','Void'],
    middles: ['Star','Wave','Blade','Core','Rush','Craft','Bound','Fall','Gate','Light','Pulse','Dawn','Wing','Fist','Storm','Path','Nova','Steel','Flame','Edge'],
    suffixes: ['Chronicles','Legacy','Reckoning','Awakening','Protocol','Syndrome','Evolution','Rebirth',' Odyssey','Conquest','Fracture','Requiem','Genesis','Horizon','Empire','Tactics','Arena','Saga','Endgame','Rising']
  },

  reviews: [
    { min: 90, text: 'ШЕДЕВР! Игра года!', rating: 'S', color: '#D4A84B' },
    { min: 75, text: 'Отличная игра! Хит продаж!', rating: 'A', color: '#4CAF50' },
    { min: 60, text: 'Хорошая игра, но есть нюансы', rating: 'B', color: '#3498DB' },
    { min: 40, text: 'Среднячок. Могло быть лучше', rating: 'C', color: '#F39C12' },
    { min: 20, text: 'Сыровато. Оценки ниже среднего', rating: 'D', color: '#FF5722' },
    { min: 0, text: 'Провал. Игроки в ярости!', rating: 'F', color: '#E74C3C' }
  ]
}

window.genGameName = function() {
  const p = window.GDATA.gameNameParts
  const r = () => Math.floor(Math.random() * 20)
  const fmt = Math.floor(Math.random() * 4)
  if (fmt === 0) return p.prefixes[r()] + ' ' + p.middles[r()]
  if (fmt === 1) return p.prefixes[r()] + ' ' + p.suffixes[r()]
  if (fmt === 2) return 'The ' + p.prefixes[r()] + ' of ' + p.middles[r()]
  return p.middles[r()] + ' ' + p.suffixes[r()]
}

function feminizeLast(name) {
  const r = name
  if (r.endsWith('ов')) return r.slice(0, -2) + 'ова'
  if (r.endsWith('ев')) return r.slice(0, -2) + 'ева'
  if (r.endsWith('ёв')) return r.slice(0, -2) + 'ёва'
  if (r.endsWith('ин')) return r.slice(0, -2) + 'ина'
  if (r.endsWith('ский')) return r.slice(0, -4) + 'ская'
  if (r.endsWith('цкий')) return r.slice(0, -4) + 'цкая'
  if (r.endsWith('ой')) return r.slice(0, -2) + 'ая'
  return r + 'а'
}

window.randomEmployee = function() {
  const d = window.GDATA
  const isFemale = Math.random() > 0.5
  const names = isFemale ? d.femaleFirstNames : d.maleFirstNames
  const fn = names[Math.floor(Math.random() * names.length)]
  const lnRaw = d.maleLastNames[Math.floor(Math.random() * d.maleLastNames.length)]
  const ln = isFemale ? feminizeLast(lnRaw) : lnRaw
  const role = d.roles[Math.floor(Math.random() * d.roles.length)]
  const skill = 3 + Math.floor(Math.random() * 7)
  return {
    name: fn + ' ' + ln,
    role: role,
    skill: skill,
    salary: 1500 + skill * 400 + Math.floor(Math.random() * 1000),
    mood: 70 + Math.floor(Math.random() * 30),
    productivity: 0.7 + Math.random() * 0.3
  }
}

window.GDATA.codingTasks = [
  { roleId: 'programmer', fileName: 'player_move.js', code: `function updatePlayer(dt) {
  const speed = 5.0;
  let dx = 0, dy = 0;
  if (keys.Left) dx -= speed * dt;
  if (keys.Right) dx += speed * dt;
  if (keys.Up) dy -= speed * dt;
  if (keys.Down) dy += speed * dt;
  player.x += dx;
  player.y += dy;
}` },
  { roleId: 'programmer', fileName: 'enemy_ai.cs', code: `class EnemyAI : MonoBehaviour {
  float detectRange = 10f;
  void Update() {
    float dist = Vector3.Distance(transform.position, player.position);
    if (dist < detectRange) {
      Vector3 dir = (player.position - transform.position).normalized;
      transform.position += dir * speed * Time.deltaTime;
    }
  }
}` },
  { roleId: 'programmer', fileName: 'inventory.py', code: `class Inventory:
  def __init__(self, slots=20):
    self.slots = [None] * slots
    self.gold = 0

  def add_item(self, item):
    for i in range(len(self.slots)):
      if self.slots[i] is None:
        self.slots[i] = item
        return True
    return False` },
  { roleId: 'artist', fileName: 'character_sprite.svg', code: `<svg viewBox="0 0 32 32">
  <rect x="12" y="0" width="8" height="10" rx="2" fill="#E8B88A"/>
  <rect x="8" y="10" width="16" height="12" rx="3" fill="#3498DB"/>
  <rect x="10" y="22" width="4" height="8" fill="#2C3E50"/>
  <rect x="18" y="22" width="4" height="8" fill="#2C3E50"/>
</svg>` },
  { roleId: 'artist', fileName: 'bg_tileset.css', code: `.tile-grass { background: #4CAF50; }
.tile-water { background: #2196F3; }
.tile-stone { background: #607D8B; }
.tile-sand { background: #FFC107; }
.tile-snow { background: #ECEFF1; }
.tile-lava { background: #F44336; }` },
  { roleId: 'artist', fileName: 'ui_theme.json', code: `{
  "colors": {
    "primary": "#D4A84B",
    "bg": "#0B0B0F",
    "surface": "#14141C",
    "text": "#F0EDE8"
  },
  "radius": { "sm": 8, "md": 12, "lg": 16 },
  "fonts": {
    "body": "Space Grotesk",
    "mono": "JetBrains Mono"
  }
}` },
  { roleId: 'designer', fileName: 'gdd_v1.md', code: `# GDD: Project Aurora
## Core Loop
1. Player explores procedurally generated dungeons
2. Encounters enemies with unique attack patterns
3. Collects loot and upgrades abilities
4. Returns to hub to craft and trade

## Progression
- Level 1-5: Tutorial area
- Level 5-15: Forest dungeons
- Level 15-25: Desert temples
- Level 25+: Void rifts` },
  { roleId: 'designer', fileName: 'level_layout.json', code: `{
  "rooms": [
    { "type": "start", "x": 0, "y": 0, "size": "large" },
    { "type": "combat", "x": 1, "y": 0, "enemies": ["skeleton"] },
    { "type": "puzzle", "x": 0, "y": 1, "solution": "pressure_plate" },
    { "type": "treasure", "x": 1, "y": 1, "loot": ["sword", "potion"] },
    { "type": "boss", "x": 2, "y": 1, "enemy": "necromancer" }
  ]
}` },
  { roleId: 'designer', fileName: 'game_balance.ods', code: `=== Balance Sheet ===
Player HP: 100
Player ATK: 10 base + weapon
Enemy HP: 30 + level * 10
Enemy ATK: 5 + level * 2
EXP to level: 100 * level^1.5
Weapon damage: sword=15, axe=20, dagger=8` },
  { roleId: 'sound', fileName: 'main_theme.pat', code: `Tempo: 120 BPM
Key: E minor
Track 1 (Piano): Am F C G | Am F E7 Am
Track 2 (Pad): Sustained strings on I-IV-VII
Track 3 (Bass): Root notes on 1 and 3
Track 4 (Drums): 4-on-the-floor, open hat on 8ths` },
  { roleId: 'sound', fileName: 'sfx_list.csv', code: `name,type,duration,pitch
step_stone,footstep,0.15s,200Hz
step_wood,footstep,0.12s,300Hz
sword_swing,weapon,0.3s,100-400Hz
hit_confirm,impact,0.1s,500Hz
menu_click,ui,0.05s,800Hz
explosion,sfx,0.8s,50-150Hz` },
  { roleId: 'sound', fileName: 'mix_settings.json', code: `{
  "master": -6,
  "music": -10,
  "sfx": -4,
  "ambient": -12,
  "voice": -8,
  "compressor": {
    "threshold": -18,
    "ratio": 4,
    "attack": 5,
    "release": 50
  }
}` },
  { roleId: 'qa', fileName: 'test_suite.js', code: `describe('PlayerMovement', () => {
  it('moves right on D key', () => {
    const p = new Player(0, 0);
    simulateKeyPress('D', 1.0);
    assert(p.x > 0);
  });
  it('does not move when frozen', () => {
    const p = new Player(0, 0);
    p.freeze();
    simulateKeyPress('D', 1.0);
    assert(p.x === 0);
  });
});` },
  { roleId: 'qa', fileName: 'bug_report.md', code: `# Bug Report BLD-042
## Title: Player clips through wall at x=120, y=45
## Steps:
1. Walk to x=120, y=45
2. Press jump + right simultaneously
3. Observe player inside wall geometry

## Expected: Collision stops player
## Actual: Player passes through collider
## Priority: Critical
## Build: 0.4.2-alpha` },
  { roleId: 'qa', fileName: 'perf_benchmark.py', code: `import time
def benchmark():
  fps = []
  for i in range(100):
    start = time.time()
    render_frame()
    elapsed = time.time() - start
    fps.append(1.0 / elapsed)
  avg = sum(fps) / len(fps)
  p95 = sorted(fps)[int(len(fps)*0.95)]
  print(f"Avg FPS: {avg:.1f}, P95: {p95:.1f}")` },
]

window.genPrice = function(baseQuality, genrePopularity, scopeMult) {
  const base = 5 + baseQuality * 0.5
  const pop = genrePopularity * 0.8
  const scope = scopeMult || 1
  return Math.round((base + pop) * scope)
}
