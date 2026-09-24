import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Power, BadgePercent } from 'lucide-react'
import { adminFetchOffers, adminSaveOffer, adminDeleteOffer, adminFetchTrips } from '../../lib/data'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'
import { FieldLight, InputLight, TextareaLight, SelectLight } from '../../components/ui/forms.jsx'
import ImageUpload from '../../components/ui/ImageUpload.jsx'
import { Spinner } from '../../components/ui/Loader.jsx'
import { fmtDateRange, fmtPrice, isExpired } from '../../lib/utils'
import { OFFER_TYPE_LABELS } from '../../lib/constants'

const EMPTY = {
  title: '',
  description: '',
  offer_type: 'FLIGHT',
  destination: '',
  old_price: '',
  new_price: '',
  start_date: '',
  end_date: '',
  trip_id: '',
  image_url: '',
  is_active: true,
}

export default function AdminOffers() {
  const [rows, setRows] = useState([])
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    Promise.all([adminFetchOffers(), adminFetchTrips()])
      .then(([o, t]) => {
        setRows(o)
        setTrips(t)
      })
      .catch(() => toast.error('تعذر التحميل'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    document.title = 'إدارة العروض | لوحة التحكم'
    load()
  }, [])

  const save = async (e) => {
    e.preventDefault()
    const d = modal.data
    if (!d.title.trim()) {
      toast.error('عنوان العرض مطلوب')
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: d.title.trim(),
        description: d.description || null,
        offer_type: d.offer_type,
        destination: d.destination?.trim() || null,
        old_price: d.old_price === '' ? null : Number(d.old_price),
        new_price: d.new_price === '' ? null : Number(d.new_price),
        start_date: d.start_date || null,
        end_date: d.end_date || null,
        trip_id: d.trip_id || null,
        image_url: d.image_url || null,
        is_active: d.is_active,
      }
      await adminSaveOffer(payload, modal.id)
      toast.success(modal.id ? 'تم حفظ التعديلات' : 'تمت إضافة العرض')
      setModal(null)
      load()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      toast.error('تعذر الحفظ')
    } finally {
      setSaving(false)
    }
  }

  const toggle = async (o) => {
    try {
      await adminSaveOffer({ is_active: !o.is_active }, o.id)
      setRows((rs) => rs.map((x) => (x.id === o.id ? { ...x, is_active: !o.is_active } : x)))
    } catch {
      toast.error('تعذر التغيير')
    }
  }

  const remove = async (o) => {
    if (!window.confirm(`حذف العرض «${o.title}» نهائياً؟`)) return
    try {
      await adminDeleteOffer(o.id)
      setRows((rs) => rs.filter((x) => x.id !== o.id))
      toast.success('تم الحذف')
    } catch {
      toast.error('تعذر الحذف')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-gray-900">إدارة العروض</h1>
          <p className="mt-1 text-sm text-gray-500">عروض الرحلات والتذاكر والخصومات الموسمية</p>
        </div>
        <Button onClick={() => setModal({ data: { ...EMPTY }, id: null })}>
          <Plus size={17} />
          إضافة عرض
        </Button>
      </div>

      {loading ? (
        <Spinner fullscreen />
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
          <BadgePercent size={40} className="text-gray-300" />
          <p className="font-bold text-gray-600">لا توجد عروض بعد</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((o) => {
            const expired = isExpired(o)
            return (
              <div key={o.id} className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${!o.is_active || expired ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900">{o.title}</h3>
                  <span className="shrink-0 rounded-full bg-chip px-2.5 py-0.5 text-[11px] font-bold text-plum">
                    {OFFER_TYPE_LABELS[o.offer_type] || o.offer_type}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs text-gray-500">{o.description}</p>
                <p className="mt-3 text-xs text-gray-400">
                  {o.destination ? `📍 ${o.destination} • ` : ''}
                  {fmtDateRange(o.start_date, o.end_date)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {o.old_price && <span className="text-sm text-gray-400 line-through">{fmtPrice(o.old_price)}</span>}
                  {o.new_price && <span className="font-display text-lg font-black text-plum-dark">{fmtPrice(o.new_price)}</span>}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {!o.is_active && <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-bold text-gray-500">موقوف</span>}
                  {expired && o.is_active && <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-bold text-rose-600">انتهى العرض</span>}
                </div>
                <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                  <button
                    onClick={() => setModal({ data: { ...EMPTY, ...o, old_price: o.old_price ?? '', new_price: o.new_price ?? '', trip_id: o.trip_id || '' }, id: o.id })}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-plum px-3 py-2 text-xs font-bold text-white transition hover:bg-plum-dark"
                  >
                    <Pencil size={13} />
                    تعديل
                  </button>
                  <button onClick={() => toggle(o)} className="rounded-lg bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200" title="تفعيل/إيقاف">
                    <Power size={15} />
                  </button>
                  <button onClick={() => remove(o)} className="rounded-lg bg-rose-50 p-2 text-rose-500 transition hover:bg-rose-100" title="حذف">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* نافذة الإضافة/التعديل */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.id ? 'تعديل عرض' : 'إضافة عرض'} size="lg">
        {modal && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldLight label="عنوان العرض" required>
                <InputLight value={modal.data.title} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, title: e.target.value } }))} placeholder="طيران دمشق ← تركيا" />
              </FieldLight>
              <FieldLight label="نوع العرض">
                <SelectLight value={modal.data.offer_type} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, offer_type: e.target.value } }))}>
                  {Object.entries(OFFER_TYPE_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </SelectLight>
              </FieldLight>
              <FieldLight label="الوجهة" hint="للعروض الخاصة بالتذاكر">
                <InputLight value={modal.data.destination || ''} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, destination: e.target.value } }))} placeholder="تركيا" />
              </FieldLight>
              <FieldLight label="السعر الجديد ($)">
                <InputLight type="number" min="0" value={modal.data.new_price ?? ''} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, new_price: e.target.value } }))} placeholder="140" />
              </FieldLight>
              <FieldLight label="السعر السابق ($)" hint="اختياري — يظهر مشطوباً">
                <InputLight type="number" min="0" value={modal.data.old_price ?? ''} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, old_price: e.target.value } }))} />
              </FieldLight>
              <FieldLight label="رحلة مرتبطة" hint="اختياري">
                <SelectLight value={modal.data.trip_id || ''} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, trip_id: e.target.value } }))}>
                  <option value="">بدون رحلة</option>
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </SelectLight>
              </FieldLight>
              <FieldLight label="بداية العرض">
                <InputLight type="date" value={modal.data.start_date || ''} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, start_date: e.target.value } }))} />
              </FieldLight>
              <FieldLight label="نهاية العرض">
                <InputLight type="date" value={modal.data.end_date || ''} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, end_date: e.target.value } }))} />
              </FieldLight>
            </div>
            <FieldLight label="وصف العرض">
              <TextareaLight rows={3} value={modal.data.description || ''} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, description: e.target.value } }))} />
            </FieldLight>
            <button
              type="button"
              onClick={() => setModal((m) => ({ ...m, data: { ...m.data, is_active: !m.data.is_active } }))}
              className={`rounded-lg px-4 py-2 text-sm font-bold transition ${
                modal.data.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
              }`}
            >
              {modal.data.is_active ? 'مفعّل ✓ — ظاهر في الموقع' : 'موقوف — مخفي عن الزوار'}
            </button>
            <ImageUpload
              value={modal.data.image_url}
              onChange={(v) => setModal((m) => ({ ...m, data: { ...m.data, image_url: v } }))}
              folder="offers"
              label="صورة العرض"
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setModal(null)}>
                إلغاء
              </Button>
              <Button type="submit" loading={saving}>
                حفظ
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
