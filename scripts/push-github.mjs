// Push the project to GitHub using the Git Data API (no git binary needed).
// Usage: GH_TOKEN=ghp_... node scripts/push-github.mjs owner repo [branch]
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs'
import { join, relative, sep } from 'node:path'

const [owner, repo, branch = 'main'] = process.argv.slice(2)
const token = process.env.GH_TOKEN
if (!owner || !repo || !token) {
  console.error('Usage: GH_TOKEN=... node scripts/push-github.mjs owner repo [branch]')
  process.exit(1)
}

const ROOT = join(process.cwd())
const API = 'https://api.github.com'
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
}

const IGNORED_DIRS = new Set(['.git', 'node_modules', 'dist', 'cmd', '.vercel'])
const IGNORED_FILES = new Set(['.env', '.env.local', 'mingit.zip', 'Thumbs.db', '.DS_Store'])

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (!IGNORED_DIRS.has(name)) walk(full, acc)
    } else if (!IGNORED_FILES.has(name)) {
      acc.push(full)
    }
  }
  return acc
}

const TEXT_EXT = new Set(['.js', '.jsx', '.mjs', '.json', '.html', '.css', '.md', '.svg', '.txt', '.xml', '.example', '.gitignore'])
const isText = (p) => {
  const base = p.split(sep).pop()
  if (base === '.gitignore' || base.endsWith('.env.example')) return true
  const ext = p.slice(p.lastIndexOf('.')).toLowerCase()
  return TEXT_EXT.has(ext)
}

async function gh(path, body, method = 'POST', retries = 4) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await res.text()
    if (res.ok) return text ? JSON.parse(text) : {}
    const transient = res.status >= 500 || res.status === 409
    if (!transient || attempt === retries) {
      throw new Error(`${method} ${path} -> ${res.status}: ${text.slice(0, 800)}`)
    }
    console.log(`  ${res.status} on ${method} ${path} — retry ${attempt}/${retries - 1}...`)
    await new Promise((r) => setTimeout(r, 1500 * attempt))
  }
}

const files = walk(ROOT).filter((f) => relative(ROOT, f) !== 'scripts' + sep + 'push-github.mjs' ? true : true)
console.log(`Uploading ${files.length} files to ${owner}/${repo} (${branch})...`)

// 0) empty repo? initialize it with one commit via the Contents API first
async function repoIsEmpty() {
  const res = await fetch(`${API}/repos/${owner}/${repo}/branches/${branch}`, { headers })
  return res.status === 404
}
if (await repoIsEmpty()) {
  console.log('Repo is empty — initializing with README commit...')
  const readme = readFileSync(join(ROOT, 'README.md'), 'utf8')
  await gh(
    `/repos/${owner}/${repo}/contents/README.md`,
    {
      message: 'init',
      content: Buffer.from(readme, 'utf8').toString('base64'),
      branch,
    },
    'PUT'
  )
}

// 1) blobs
const treeItems = []
for (const f of files) {
  const path = relative(ROOT, f).split(sep).join('/')
  const content = isText(f) ? readFileSync(f, 'utf8') : readFileSync(f).toString('base64')
  const encoding = isText(f) ? 'utf-8' : 'base64'
  const blob = await gh(`/repos/${owner}/${repo}/git/blobs`, { content, encoding })
  treeItems.push({ path, mode: '100644', type: 'blob', sha: blob.sha })
  console.log(`  blob ok: ${path}`)
}

// 2) tree
const tree = await gh(`/repos/${owner}/${repo}/git/trees`, { tree: treeItems })

// 3) commit
const commit = await gh(`/repos/${owner}/${repo}/git/commits`, {
  tree: tree.sha,
  message: 'DIALA Tourism & Travel — full web app (React+Vite+Tailwind, Supabase, admin dashboard)',
})

// 4) ref — check existence first, then update or create
const ref = `refs/heads/${branch}`
const refRes = await fetch(`${API}/repos/${owner}/${repo}/git/ref/heads/${branch}`, { headers })
if (refRes.ok) {
  await gh(`/repos/${owner}/${repo}/git/${ref}`, { sha: commit.sha, force: true }, 'PATCH')
  console.log('Updated branch', ref)
} else {
  await gh(`/repos/${owner}/${repo}/git/refs`, { ref, sha: commit.sha })
  console.log('Created branch', ref)
}

console.log('DONE ->', `https://github.com/${owner}/${repo}/tree/${branch}`)
