import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX, MapPinned, Search } from 'lucide-react'
import TripCard from '../components/trips/TripCard.jsx'
import { CardSkeletonGrid } from '../components/ui/Loader.jsx'
import { EmptyState } from '../components/ui/misc.jsx'
import Button from '../components/ui/Button.jsx'
import { Select } from '../components/ui/forms.jsx'
import { fetchTrips } from '../lib/data'
import useReveal from '../hooks/useReveal.js'
import { fmtPrice, cn } from '../lib/utils'
import { PageHeader } from '../components/layout/Layout.jsx'

const DURATIONS = [
  { v: '', label: 'أي مدة' },
  { v: 'short', label: 'حتى 5 أيام' },
  { v: 'mid', label: '6 – 7 أيام' },
  { v: 'long', label: 'أكثر من أسبوع' },
]

const PRICES = [
  { v: '', label: 'كل الأسعار' },
  { v: '300', label: 'حتى 300$' },
  { v: '500', label: 'حتى 500$' },
  { v: '1000', label: 'حتى 1000$' },
]

export default function Trips() {
  const ref = useReveal()
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [destination, setDestination] = useState('')
  const [duration, setDuration] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [month, setMonth] = useState('')

  useEffect(() => {
    document.title = 'الرحلات السياحية | ديالا للسياحة والسفر'
    fetchTrips()
      .then(setTrips)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const destinations = useMemo(() => [...new Set(trips.map((t) => t.destination))], [trips])
  const months = useMemo(() => {
    const set = new Set()
    trips.forEach((t) => {
      if (t.start_date) {
        const d = new Date(t.start_date)
        set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
      }
    })
    return [...set].sort()
  }, [trips])

  const filtered = useMemo(
    () =>
      trips.filter((t) => {
        if (q) {
          const hay = `${t.title} ${t.destination} ${t.short_description || ''}`.toLowerCase()
          if (!hay.includes(q.toLowerCase())) return false
        }
        if (destination && t.destination !== destination) return false
        if (duration) {
          const d = t.duration_days || 0
          if (duration === 'short' && d > 5) return false
          if (duration === 'mid' && (d < 6 || d > 7)) return false
          if (duration === 'long' && d < 8) return false
        }
        if (maxPrice && Number(t.price) > Number(maxPrice)) return false
        if (month && !String(t.start_date || '').startsWith(month)) return false
        return true
      }),
    [trips, q, destination, duration, maxPrice, month]
  )

  const reset = () => {
    setDestination('')
    setDuration('')
    setMaxPrice('')
    setMonth('')
  }
  const hasFilters = destination || duration || maxPrice || month

  return (
    <div ref={ref}>
      <PageHeader title="الرحلات السياحية" subtitle="اختر وجهتك القادمة وأرسل طلب حجزك" />
      <div className="container-app pb-8 pt-2">
        {/* فلاتر الوجهات */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-smoke">الوجهة:</span>
          <button onClick={() => setDestination('')} className={cn('chip', !destination && 'chip-active')}>
            الكل
          </button>
          {destinations.map((d) => (
            <button key={d} onClick={() => setDestination(d)} className={cn('chip', destination === d && 'chip-active')}>
              {d}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="block">
            <span className="field-label">شهر الانطلاق</span>
            <Select value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">أي شهر</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {new Date(`${m}-01`).toLocaleDateString('ar-SY', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="field-label">مدة الرحلة</span>
            <Select value={duration} onChange={(e) => setDuration(e.target.value)}>
              {DURATIONS.map((d) => (
                <option key={d.v} value={d.v}>
                  {d.label}
                </option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="field-label">السعر</span>
            <Select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
              {PRICES.map((p) => (
                <option key={p.v} value={p.v}>
                  {p.label}
                </option>
              ))}
            </Select>
          </label>
        </div>

        <div className="mt-6">
          {loading ? (
            <CardSkeletonGrid count={6} />
          ) : error ? (
            <EmptyState
              icon={MapPinned}
              title="تعذر تحميل الرحلات"
              subtitle="تأكد من اتصالك بالإنترنت وأعد المحاولة."
              action={<Button onClick={() => window.location.reload()} size="sm">إعادة المحاولة</Button>}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title={q ? `لا نتائج عن «${q}»` : 'لا توجد رحلات مطابقة'}
              subtitle="جرّب كلمة أخرى أو أعد تعيين الفلاتر."
              action={
                hasFilters || q ? (
                  <Button variant="soft" size="sm" onClick={reset}>
                    إعادة تعيين الفلاتر
                  </Button>
                ) : null
              }
            />
          ) : (
            <>
              <p className="mb-4 flex items-center gap-1.5 text-xs text-smoke">
                {q && <Search className="h-3.5 w-3.5" />}
                {filtered.length} رحلة متاحة — الأسعار تبدأ من{' '}
                <b className="text-plum">{fmtPrice(Math.min(...filtered.map((t) => Number(t.price) || Infinity)))}</b>
              </p>
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {filtered.map((t, i) => (
                  <div key={t.id} className="reveal" style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
                    <TripCard trip={t} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
