// توحيد استيراد Spinner (named export) في كل المشروع
import { readdirSync, statSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) walk(full, acc)
    else if (/\.(jsx|js)$/.test(name)) acc.push(full)
  }
  return acc
}

let n = 0
for (const f of walk('src')) {
  let s = readFileSync(f, 'utf8')
  const before = s
  s = s.replace(/import Spinner from '([^']*Loader\.jsx)'/g, "import { Spinner } from '$1'")
  if (s !== before) {
    writeFileSync(f, s)
    console.log('fixed:', f)
    n++
  }
}
console.log('DONE', n)
