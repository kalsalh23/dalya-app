// تحويل لوحة التحكم من كحلي/ذهبي إلى هوية renad1 (plum/lilac)
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DIRS = ['src/pages/admin']

const RULES = [
  ['bg-ink/70', 'bg-plum-dark/70'],
  ['bg-ink/60', 'bg-plum-dark/60'],
  ['hover:bg-royal', 'hover:bg-plum-dark'],
  ['bg-royal', 'bg-plum'],
  ['bg-ink', 'bg-plum'],
  ['coal', 'plum-dark'],
  ['bg-gold/15', 'bg-white/15'],
  ['ring-gold/30', 'ring-white/30'],
  ['bg-gold/10', 'bg-plum/10'],
  ['bg-gold', 'bg-plum'],
  ['fill-gold', 'fill-star'],
  ['accent-gold', 'accent-plum'],
  ['border-champagne-light', 'border-chip'],
  ['border-champagne-dark', 'border-plum/30'],
  ['border-champagne', 'border-lilac-dark'],
  ['bg-cream/60', 'bg-chip/60'],
  ['bg-cream/50', 'bg-chip/50'],
  ['bg-cream/40', 'bg-chip/40'],
  ['bg-cream', 'bg-chip'],
  ['text-gold-light', 'text-white'],
  ['text-gold-dark', 'text-plum'],
  ['#AE8B4F', '#4A1F52'],
  ['#2B4E85', '#6D3B75'],
  ['#93A1BC', '#B98CC7'],
]

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, acc)
    else if (/\.(jsx|js)$/.test(name)) acc.push(full)
  }
  return acc
}

let count = 0
for (const dir of DIRS) {
  for (const file of walk(dir)) {
    let src = readFileSync(file, 'utf8')
    const before = src
    for (const [from, to] of RULES) src = src.split(from).join(to)
    if (src !== before) {
      writeFileSync(file, src)
      console.log('rebranded:', file)
      count++
    }
  }
}
console.log('DONE —', count, 'files updated')
