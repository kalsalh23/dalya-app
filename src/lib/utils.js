export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

const AR_MONTHS = [
  'كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
  'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول',
]

/** 2026-10-15 -> "15 تشرين الأول 2026" */
export function fmtDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/** نطاق تاريخين مختصر */
export function fmtDateRange(from, to) {
  if (!from) return '—'
  if (!to) return fmtDate(from)
  const a = new Date(from)
  const b = new Date(to)
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${a.getDate()} – ${b.getDate()} ${AR_MONTHS[b.getMonth()]} ${b.getFullYear()}`
  }
  return `${fmtDate(from)} — ${fmtDate(to)}`
}

export function fmtPrice(value) {
  if (value === null || value === undefined || value === '') return 'حسب الطلب'
  const n = Number(value)
  return `${Number.isInteger(n) ? n : n.toFixed(2)}$`
}

export function shortId(id) {
  return id ? String(id).slice(0, 8).toUpperCase() : '—'
}

/** وقت نسبي عربي بسيط */
export function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'الآن'
  if (m < 60) return `قبل ${m} دقيقة`
  const h = Math.floor(m / 60)
  if (h < 24) return `قبل ${h} ساعة`
  const d = Math.floor(h / 24)
  if (d < 30) return `قبل ${d} يوم`
  return fmtDate(dateStr)
}

export function isExpired(offer) {
  if (!offer?.end_date) return false
  return new Date(offer.end_date) < new Date(new Date().toDateString())
}

/** استخراج أرقام الهاتف فقط لروابط واتساب */
export function phoneDigits(phone = '') {
  return String(phone).replace(/\D/g, '')
}
