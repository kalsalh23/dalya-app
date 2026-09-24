import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowRight, Plus, Trash2, Save } from 'lucide-react'
import { adminSaveTrip } from '../../lib/data'
import { adminFetchTripFull } from '../../lib/data'
import { FieldLight, InputLight, TextareaLight, SelectLight } from '../../components/ui/forms.jsx'
import ImageUpload from '../../components/ui/ImageUpload.jsx'
import Button from '../../components/ui/Button.jsx'
import { Spinner } from '../../components/ui/Loader.jsx'

const EMPTY = {
  title: '',
  destination: '',
  price: '',
  duration_days: '',
  start_date: '',
  end_date: '',
  available_seats: '',
  short_description: '',
  description: '',
  notes: '',
  status: 'PUBLISHED',
  featured: false,
  main_image_url: '',
}

export default function TripForm() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()

  const [trip, setTrip] = useState(EMPTY)
  const [included, setIncluded] = useState('')
  const [excluded, setExcluded] = useState('')
  const [gallery, setGallery] = useState([])
  const [itinerary, setItinerary] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    document.title = isEdit ? 'تعديل رحلة | لوحة التحكم' : 'رحلة جديدة | لوحة التحكم'
    if (!isEdit) return
    adminFetchTripFull(id)
      .then((t) => {
        setTrip({
          ...EMPTY,
          ...t,
          price: t.price ?? '',
          duration_days: t.duration_days ?? '',
          available_seats: t.available_seats ?? '',
        })
        setIncluded((t.included || []).join('\n'))
        setExcluded((t.excluded || []).join('\n'))
        setGallery((t.trip_gallery || []).map((g) => ({ image_url: g.image_url })))
        setItinerary(
          (t.trip_itinerary || []).sort((a, b) => a.day_number - b.day_number).map((d) => ({
            day_number: d.day_number,
            title: d.title || '',
            description: d.description || '',
          }))
        )
      })
      .catch(() => toast.error('تعذر تحميل بيانات الرحلة'))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k) => (e) => setTrip((t) => ({ ...t, [k]: e.target.value }))

  const validate = () => {
    const er = {}
    if (!trip.title.trim()) er.title = 'العنوان مطلوب'
    if (!trip.destination.trim()) er.destination = 'الوجهة مطلوبة'
    setErrors(er)
    return !Object.keys(er).length
  }

  const save = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      const payload = {
        title: trip.title.trim(),
        destination: trip.destination.trim(),
        price: trip.price === '' ? null : Number(trip.price),
        duration_days: trip.duration_days === '' ? null : Number(trip.duration_days),
        start_date: trip.start_date || null,
        end_date: trip.end_date || null,
        available_seats: trip.available_seats === '' ? null : Number(trip.available_seats),
        short_description: trip.short_description || null,
        description: trip.description || null,
        notes: trip.notes || null,
        status: trip.status,
        featured: trip.featured,
        main_image_url: trip.main_image_url || null,
        included: included.split('\n').map((s) => s.trim()).filter(Boolean),
        excluded: excluded.split('\n').map((s) => s.trim()).filter(Boolean),
      }
      await adminSaveTrip({ trip: payload, gallery, itinerary }, id)
      toast.success(isEdit ? 'تم حفظ التعديلات' : 'تمت إضافة الرحلة')
      navigate('/admin/trips')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      toast.error('تعذر الحفظ — تحقق من الحقول وحاول مجدداً')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Spinner fullscreen />

  return (
    <form onSubmit={save} className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/trips" className="inline-flex items-center gap-2 text-sm font-bold text-plum hover:underline">
          <ArrowRight size={15} />
          كل الرحلات
        </Link>
        <h1 className="font-display text-2xl font-extrabold text-gray-900">
          {isEdit ? 'تعديل الرحلة' : 'إضافة رحلة جديدة'}
        </h1>
      </div>

      {/* البيانات الأساسية */}
      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="font-bold text-gray-800">البيانات الأساسية</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldLight label="اسم الرحلة" required error={errors.title}>
            <InputLight value={trip.title} onChange={set('title')} placeholder="مثال: إسطنبول وطرابزون — 7 أيام" error={errors.title} />
          </FieldLight>
          <FieldLight label="الوجهة" required error={errors.destination}>
            <InputLight value={trip.destination} onChange={set('destination')} placeholder="مثال: تركيا" error={errors.destination} />
          </FieldLight>
          <FieldLight label="السعر للفرد ($)">
            <InputLight type="number" min="0" value={trip.price} onChange={set('price')} placeholder="450" />
          </FieldLight>
          <FieldLight label="المدة (أيام)">
            <InputLight type="number" min="1" value={trip.duration_days} onChange={set('duration_days')} placeholder="7" />
          </FieldLight>
          <FieldLight label="تاريخ الانطلاق">
            <InputLight type="date" value={trip.start_date || ''} onChange={set('start_date')} />
          </FieldLight>
          <FieldLight label="تاريخ العودة">
            <InputLight type="date" value={trip.end_date || ''} onChange={set('end_date')} />
          </FieldLight>
          <FieldLight label="المقاعد المتاحة">
            <InputLight type="number" min="0" value={trip.available_seats} onChange={set('available_seats')} placeholder="20" />
          </FieldLight>
          <FieldLight label="حالة النشر">
            <SelectLight value={trip.status} onChange={set('status')}>
              <option value="PUBLISHED">منشورة (ظاهرة للزوار)</option>
              <option value="DRAFT">مسودة (مخفية)</option>
            </SelectLight>
          </FieldLight>
        </div>
        <FieldLight label="وصف مختصر" hint="يظهر في بطاقة الرحلة">
          <InputLight value={trip.short_description} onChange={set('short_description')} placeholder="سطر تعريفي جذاب عن الرحلة" />
        </FieldLight>
        <FieldLight label="الوصف الكامل">
          <TextareaLight rows={5} value={trip.description} onChange={set('description')} />
        </FieldLight>
        <FieldLight label="ملاحظات">
          <TextareaLight rows={2} value={trip.notes} onChange={set('notes')} placeholder="متطلبات الجواز، شروط الحجز..." />
        </FieldLight>
        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={trip.featured} onChange={(e) => setTrip((t) => ({ ...t, featured: e.target.checked }))} className="h-4 w-4 accent-plum" />
          رحلة مميزة (تظهر بأول الرئيسية)
        </label>
      </section>

      {/* الصورة الرئيسية */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-gray-800">الصورة الرئيسية</h2>
        <ImageUpload value={trip.main_image_url} onChange={(v) => setTrip((t) => ({ ...t, main_image_url: v }))} folder="trips" label="صورة الغلاف" />
      </section>

      {/* معرض الصور */}
      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800">معرض الصور</h2>
          <button
            type="button"
            onClick={() => setGallery((g) => [...g, { image_url: '' }])}
            className="flex items-center gap-1.5 rounded-full bg-plum px-3 py-1.5 text-xs font-bold text-white"
          >
            <Plus size={14} />
            إضافة صورة
          </button>
        </div>
        {gallery.length === 0 && <p className="text-sm text-gray-400">لا توجد صور — أضف صوراً من الرحلة لتظهر في صفحة التفاصيل.</p>}
        {gallery.map((g, i) => (
          <div key={i} className="flex items-end gap-3">
            <ImageUpload
              value={g.image_url}
              onChange={(v) => setGallery((arr) => arr.map((x, j) => (j === i ? { image_url: v } : x)))}
              folder="trips/gallery"
              label={`صورة ${i + 1}`}
            />
            <button
              type="button"
              onClick={() => setGallery((arr) => arr.filter((_, j) => j !== i))}
              className="mb-1 rounded-lg bg-rose-50 p-2.5 text-rose-500 transition hover:bg-rose-100"
              aria-label="حذف الصورة"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </section>

      {/* برنامج الرحلة */}
      <section className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-800">برنامج الرحلة (يوم بيوم)</h2>
          <button
            type="button"
            onClick={() => setItinerary((r) => [...r, { day_number: r.length + 1, title: '', description: '' }])}
            className="flex items-center gap-1.5 rounded-full bg-plum px-3 py-1.5 text-xs font-bold text-white"
          >
            <Plus size={14} />
            إضافة يوم
          </button>
        </div>
        {itinerary.length === 0 && <p className="text-sm text-gray-400">أضف تفاصيل كل يوم من أيام الرحلة.</p>}
        {itinerary.map((d, i) => (
          <div key={i} className="rounded-xl border border-gray-200 p-4">
            <div className="mb-3 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-plum/20 text-sm font-black text-plum">
                {d.day_number || i + 1}
              </span>
              <InputLight
                value={d.title}
                onChange={(e) => setItinerary((arr) => arr.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))}
                placeholder={`عنوان اليوم ${d.day_number || i + 1}`}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => setItinerary((arr) => arr.filter((_, j) => j !== i))}
                className="rounded-lg bg-rose-50 p-2 text-rose-500 transition hover:bg-rose-100"
                aria-label="حذف اليوم"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <TextareaLight
              rows={2}
              value={d.description}
              onChange={(e) => setItinerary((arr) => arr.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)))}
              placeholder="وصف أنشطة هذا اليوم..."
            />
          </div>
        ))}
      </section>

      {/* المشمول / غير المشمول */}
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-bold text-gray-800">الخدمات المشمولة</h2>
          <TextareaLight rows={6} value={included} onChange={(e) => setIncluded(e.target.value)} placeholder={'سطر لكل خدمة\nمثال: تذاكر الطيران ذهاباً وعودة\nالإقامة مع الإفطار'} />
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-bold text-gray-800">الخدمات غير المشمولة</h2>
          <TextareaLight rows={6} value={excluded} onChange={(e) => setExcluded(e.target.value)} placeholder={'سطر لكل بند\nمثال: المصاريف الشخصية\nمداخل المعالم'} />
        </div>
      </section>

      <div className="flex justify-end gap-3 pb-6">
        <Button variant="secondary" as={Link} to="/admin/trips" type="button">
          إلغاء
        </Button>
        <Button type="submit" loading={saving}>
          <Save size={17} />
          {isEdit ? 'حفظ التعديلات' : 'إضافة الرحلة'}
        </Button>
      </div>
    </form>
  )
}
