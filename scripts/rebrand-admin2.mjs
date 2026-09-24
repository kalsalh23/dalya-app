// تحويل لوحة التحكم من الثيم البنفسجي إلى هوية ديالا (عاجي/كحلي/ذهبي)
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DIRS = ['src/pages/admin']

const RULES = [
  ['brand-bg', 'bg-ink'],
  ['shadow-brand', 'shadow-sm'],
  ['text-brand-600', 'text-gold-dark'],
  ['text-brand-700', 'text-gold-dark'],
  ['text-brand-300', 'text-gold-light'],
  ['bg-brand-500/10', 'bg-gold/10'],
  ['bg-brand-500/15', 'bg-gold/15'],
  ['bg-brand-50', 'bg-cream'],
  ['bg-brand-100', 'bg-cream'],
  ['bg-brand-600', 'bg-ink'],
  ['bg-brand-900', 'bg-ink'],
  ['bg-brand-950', 'bg-ink'],
  ['hover:bg-brand-700', 'hover:bg-royal'],
  ['border-brand-100', 'border-champagne-light'],
  ['border-brand-200', 'border-champagne'],
  ['border-brand-300', 'border-champagne-dark'],
  ['ring-brand-500/30', 'ring-gold/30'],
  ['fill-brand-600', 'fill-gold'],
  ['fill-brand-500', 'fill-gold'],
  ['accent-brand-600', 'accent-gold'],
  ['brand-950', 'ink'],
  ['brand-900', 'ink'],
  ['brand-800', 'coal'],
  ['brand-700', 'coal'],
  ['brand-600', 'ink'],
  ['brand-500', 'gold'],
  ['brand-400', 'champagne-dark'],
  ['brand-300', 'champagne-dark'],
  ['brand-200', 'champagne'],
  ['brand-100', 'cream'],
  ['brand-50', 'cream'],
  ['#8B5CF6', '#AE8B4F'],
  ['#6D28D9', '#2B4E85'],
  ['#C3A9EB', '#93A1BC'],
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
