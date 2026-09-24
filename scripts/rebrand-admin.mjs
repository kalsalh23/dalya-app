// One-time rebrand: switches the admin panel from navy/gold to the new purple identity.
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DIRS = ['src/pages/admin']

const RULES = [
  ['gold-bg', 'brand-bg'],
  ['gold-text', 'brand-text'],
  ['text-navy-950', 'text-white'],
  ['text-gold-400', 'text-brand-600'],
  ['text-gold-300', 'text-brand-600'],
  ['text-gold-600', 'text-brand-700'],
  ['text-gold-700', 'text-brand-700'],
  ['gold-400', 'brand-500'],
  ['gold-500', 'brand-600'],
  ['gold-200', 'brand-200'],
  ['gold-100', 'brand-100'],
  ['gold-50', 'brand-50'],
  ['navy-', 'brand-'],
  ['"#D4AF37"', '"#8B5CF6"'],
  ['#D4AF37', '#8B5CF6'],
  ['#3A65A3', '#6D28D9'],
  ['#8AAAD6', '#C3A9EB'],
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
