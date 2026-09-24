// إصلاحات تباين نهائية لأيقونات الشعار في لوحة التحكم
import { readFileSync, writeFileSync } from 'node:fs'

function patch(file, pairs) {
  let s = readFileSync(file, 'utf8')
  for (const [a, b] of pairs) s = s.split(a).join(b)
  writeFileSync(file, s)
  console.log('patched:', file)
}

patch('src/pages/admin/AdminLayout.jsx', [
  [
    `rounded-xl bg-white">
        <Plane size={18} className="text-white" strokeWidth={2.5} />`,
    `rounded-xl bg-white">
        <Plane size={18} className="text-plum" strokeWidth={2.5} />`,
  ],
])

patch('src/pages/admin/Login.jsx', [
  [
    `rounded-full shadow-lg">
          <Plane size={30} className="text-white" strokeWidth={2.5} />`,
    `rounded-full shadow-lg">
          <Plane size={30} className="text-plum" strokeWidth={2.5} />`,
  ],
])

console.log('DONE')
