// Creates (or confirms) the admin user in Supabase Auth and grants the admin role.
// Usage: SUPABASE_ACCESS_TOKEN=sbp_... node scripts/setup-admin.mjs
import { readFileSync, existsSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

function readEnv(file = '.env') {
  if (!existsSync(file)) return {}
  return Object.fromEntries(
    readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
      .map((l) => {
        const i = l.indexOf('=')
        return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
      })
  )
}

const env = readEnv()
const url = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL
const anon = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY
const email = process.env.ADMIN_EMAIL || env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD || env.ADMIN_PASSWORD
const token = process.env.SUPABASE_ACCESS_TOKEN
if (!url || !anon || !email || !password || !token) {
  console.error('Missing env: VITE_SUPABASE_URL / ANON_KEY / ADMIN_EMAIL / ADMIN_PASSWORD / SUPABASE_ACCESS_TOKEN')
  process.exit(1)
}
const ref = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1]

const supabase = createClient(url, anon)

// 1) Sign up (idempotent: if the user exists we get an error we can ignore)
const { data, error } = await supabase.auth.signUp({ email, password })
if (error) {
  if (/already registered|already exists|User already/i.test(error.message)) {
    console.log('User already exists — continuing to confirm + role upgrade')
  } else {
    console.error('signUp error:', error.message)
    process.exit(1)
  }
} else {
  console.log('Signed up user:', data.user?.id)
}

// 2) Confirm email + set admin role via Management API SQL
async function runSql(query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  const body = await res.text()
  if (!res.ok) {
    console.error('SQL error:', body.slice(0, 3000))
    process.exit(1)
  }
  return body
}

await runSql(
  `update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now()), updated_at = now()
   where email = '${email}';`
)
console.log('Email confirmed (if it was pending)')

await runSql(
  `update public.profiles set role = 'admin', full_name = coalesce(full_name, 'مدير ديالا')
   where id in (select id from auth.users where email = '${email}');
   select u.id, u.email, p.role from auth.users u join public.profiles p on p.id = u.id where u.email = '${email}';`
)
console.log('Admin role granted')
console.log('DONE')
