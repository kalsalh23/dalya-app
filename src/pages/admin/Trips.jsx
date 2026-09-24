import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, MapPinned } from 'lucide-react'
import { adminFetchTrips, adminDeleteTrip, adminToggleTrip } from '../../lib/data'
import Button from '../../components/ui/Button.jsx'
import { Spinner } from '../../components/ui/Loader.jsx'
import { ImageFallback } from '../../components/ui/misc.jsx'
import { fmtDateRange, fmtPrice } from '../../lib/utils'

export default function AdminTrips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    adminFetchTrips()
      .then(setTrips)
      .catch(() => toast.error('تعذر تحميل الرحلات'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    document.title = 'إدارة الرحلات | لوحة التحكم'
    load()
  }, [])

  const toggle = async (trip) => {
    try {
      const status = await adminToggleTrip(trip)
      setTrips((ts) => ts.map((t) => (t.id === trip.id ? { ...t, status } : t)))
      toast.success(status === 'PUBLISHED' ? 'تم نشر الرحلة' : 'تم إلغاء نشر الرحلة')
    } catch {
      toast.error('تعذر تغيير الحالة')
    }
  }

  const remove = async (trip) => {
    if (!window.confirm(`حذف الرحلة «${trip.title}» نهائياً؟`)) return
    try {
      await adminDeleteTrip(trip.id)
      setTrips((ts) => ts.filter((t) => t.id !== trip.id))
      toast.success('تم حذف الرحلة')
    } catch {
      toast.error('تعذر الحذف')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-gray-900">إدارة الرحلات</h1>
          <p className="mt-1 text-sm text-gray-500">أضف رحلات جديدة وعدّل أو انشر الرحلات الحالية</p>
        </div>
        <Button to="/admin/trips/new">
          <Plus size={17} />
          إضافة رحلة
        </Button>
      </div>

      {loading ? (
        <Spinner fullscreen />
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
          <MapPinned size={40} className="text-gray-300" />
          <p className="font-bold text-gray-600">لا توجد رحلات بعد</p>
          <Button to="/admin/trips/new" size="sm">إضافة أول رحلة</Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {trips.map((t) => (
            <div key={t.id} className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
              <ImageFallback src={t.main_image_url} alt={t.title} className="h-28 w-full shrink-0 rounded-xl sm:w-44" />

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-bold text-gray-900">{t.title}</h3>
                  {t.featured && <Star size={14} className="fill-star text-plum" />}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                      t.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {t.status === 'PUBLISHED' ? 'منشورة' : 'مسودة'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {t.destination} • {fmtDateRange(t.start_date, t.end_date)} • {t.duration_days || '—'} يوم
                </p>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <span className="font-bold text-plum">{fmtPrice(t.price)}</span>
                  <span className="text-gray-400">{t.available_seats != null ? `${t.available_seats} مقعد` : ''}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => toggle(t)}
                  title={t.status === 'PUBLISHED' ? 'إلغاء النشر' : 'نشر'}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition ${
                    t.status === 'PUBLISHED'
                      ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  {t.status === 'PUBLISHED' ? <EyeOff size={14} /> : <Eye size={14} />}
                  {t.status === 'PUBLISHED' ? 'إلغاء النشر' : 'نشر'}
                </button>
                <Link
                  to={`/admin/trips/${t.id}/edit`}
                  className="flex items-center gap-1.5 rounded-full bg-plum px-3 py-2 text-xs font-bold text-white transition hover:bg-plum-dark"
                >
                  <Pencil size={14} />
                  تعديل
                </Link>
                <button
                  onClick={() => remove(t)}
                  className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                >
                  <Trash2 size={14} />
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
