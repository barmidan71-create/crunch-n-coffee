/* SVG-graphics for Crunch & Coffee */

const AVATAR_COLORS = [
  ['#D4A84B','#F5E6C8'], ['#6C5CE7','#D5CCF7'], ['#E74C3C','#FAD5D0'],
  ['#4CAF50','#C8E6C9'], ['#F39C12','#FDE8C8'], ['#3498DB','#C5E5F7'],
  ['#E91E63','#FAD0D8'], ['#00BCD4','#B2EBF2'], ['#FF5722','#FFCCBC'],
  ['#9C27B0','#E1BEE7'], ['#607D8B','#CFD8DC'], ['#795548','#D7CCC8']
]

function hashColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

window.genAvatar = function(name, size = 64) {
  const c = hashColor(name)
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="12" fill="${c[0]}"/>
    <text x="32" y="32" text-anchor="middle" dominant-baseline="central" font-family="system-ui,sans-serif" font-weight="700" font-size="24" fill="${c[1]}" letter-spacing="1">${initials}</text>
    <circle cx="20" cy="22" r="3" fill="${c[1]}" opacity="0.6"/>
    <circle cx="44" cy="22" r="3" fill="${c[1]}" opacity="0.6"/>
    <path d="M20 40 Q32 50 44 40" stroke="${c[1]}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
  </svg>`
}

window.genLogo = function(seed, size = 80) {
  const colors = [['#D4A84B','#1A1614'],['#6C5CE7','#0D0D12'],['#E74C3C','#1A0D0D'],['#4CAF50','#0D1A10']]
  const c = colors[seed % colors.length]
  const icons = [
    `<circle cx="40" cy="30" r="18" fill="${c[0]}" opacity="0.2"/><path d="M30 38 L40 20 L50 38Z" fill="${c[0]}"/><rect x="34" y="48" width="12" height="8" rx="2" fill="${c[0]}" opacity="0.6"/>`,
    `<rect x="24" y="20" width="32" height="24" rx="4" stroke="${c[0]}" stroke-width="2" fill="none"/><circle cx="40" cy="32" r="6" fill="${c[0]}"/><path d="M20 20 L28 28 M20 44 L28 36 M60 20 L52 28 M60 44 L52 36" stroke="${c[0]}" stroke-width="1.5" opacity="0.4"/>`,
    `<path d="M30 20 L50 20 L50 44 L30 44Z" stroke="${c[0]}" stroke-width="2" fill="none"/><path d="M50 28 L56 28 L56 48 L34 48 L34 44" stroke="${c[0]}" stroke-width="2" fill="none"/><circle cx="40" cy="32" r="3" fill="${c[0]}"/><circle cx="40" cy="40" r="3" fill="${c[0]}"/>`,
    `<circle cx="40" cy="30" r="16" fill="none" stroke="${c[0]}" stroke-width="2"/><path d="M40 14 L40 30 L50 38" stroke="${c[0]}" stroke-width="2" stroke-linecap="round"/><path d="M28 52 L52 52" stroke="${c[0]}" stroke-width="4" stroke-linecap="round"/>`
  ]
  return `<svg viewBox="0 0 80 80" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" rx="18" fill="${c[1]}"/>
    ${icons[seed % icons.length]}
  </svg>`
}

window.genIcon = function(type, size = 24) {
  const icons = {
    budget: `<path d="M12 2v20M5 8h14M7 14h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    team: `<circle cx="9" cy="8" r="4" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="21" cy="8" r="4" stroke="currentColor" stroke-width="2" fill="none"/><path d="M3 20v-2a6 6 0 0 1 6-6h1M21 12a6 6 0 0 1 6 6v2M13 18a4 4 0 1 0-8 0" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>`,
    gamepad: `<path d="M6 18V14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4z" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="10" cy="16" r="1" fill="currentColor"/><circle cx="18" cy="16" r="1" fill="currentColor"/><circle cx="14" cy="12" r="1" fill="currentColor"/>`,
    time: `<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    code: `<polyline points="8 8 2 12 8 16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><polyline points="16 8 22 12 16 16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/><line x1="14" y1="6" x2="10" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    star: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`,
    users: `<path d="M17 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M21 12V4M18 8h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/><circle cx="10" cy="6" r="3" stroke="currentColor" stroke-width="2" fill="none"/>`,
    chart: `<path d="M3 21h18M5 14l4-6 4 4 4-8 4 6" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    coffee: `<path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    pixel: `<rect x="4" y="4" width="4" height="4" fill="currentColor"/><rect x="12" y="4" width="4" height="4" fill="currentColor"/><rect x="20" y="4" width="4" height="4" fill="currentColor"/><rect x="4" y="12" width="4" height="4" fill="currentColor"/><rect x="12" y="12" width="4" height="4" fill="currentColor"/><rect x="20" y="12" width="4" height="4" fill="currentColor"/><rect x="4" y="20" width="4" height="4" fill="currentColor"/><rect x="12" y="20" width="4" height="4" fill="currentColor"/><rect x="20" y="20" width="4" height="4" fill="currentColor"/>`,
    document: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`,
    fire: `<path d="M12 22c4 0 6-2 6-6 0-4-3-7-6-10-3 3-6 6-6 10 0 4 2 6 6 6z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 16c1.5 0 2-1 2-2 0-1.5-1-2.5-2-4-1 1.5-2 2.5-2 4 0 1 .5 2 2 2z" stroke="currentColor" stroke-width="2" fill="none"/>`
  }
  const d = icons[type] || icons.gamepad
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">${d}</svg>`
}

window.genMug = function(size = 40) {
  return `<svg viewBox="0 0 40 40" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="10" width="20" height="18" rx="2" stroke="#D4A84B" stroke-width="1.5" fill="none"/>
    <path d="M26 16h3a3 3 0 0 1 0 6h-3" stroke="#D4A84B" stroke-width="1.5" fill="none"/>
    <path d="M8 14 Q12 18 8 22" stroke="#D4A84B" stroke-width="1" opacity="0.4"/>
    <line x1="9" y1="34" x2="23" y2="34" stroke="#D4A84B" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  </svg>`
}
