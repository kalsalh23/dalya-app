import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Power, Stamp } from 'lucide-react'
import { adminFetchVisas, adminSaveVisa, adminDeleteVisa } from '../../lib/data'
import Modal from '../../components/ui/Modal.jsx'
import Button from '../../components/ui/Button.jsx'
import { FieldLight, InputLight, TextareaLight } from '../../components/ui/forms.jsx'
import ImageUpload from '../../components/ui/ImageUpload.jsx'
import { Spinner } from '../../components/ui/Loader.jsx'
import { fmtPrice } from '../../lib/utils'

const EMPTY = {
  country: '',
  flag: '',
  visa_type: '',
  processing_time: '',
  price: '',
  notes: '',
  image_url: '',
  is_active: true,
}

export default function AdminVisas() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // { data, id }
  const [requirements, setRequirements] = useState('')
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    adminFetchVisas()
      .then(setRows)
      .catch(() => toast.error('تعذر التحميل'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    document.title = 'إدارة التأشيرات | لوحة التحكم'
    load()
  }, [])

  const openNew = () => {
    setRequirements('')
    setModal({ data: { ...EMPTY }, id: null })
  }

  const openEdit = (v) => {
    setRequirements((v.requirements || []).join('\n'))
    setModal({ data: { ...EMPTY, ...v, price: v.price ?? '' }, id: v.id })
  }

  const save = async (e) => {
    e.preventDefault()
    const d = modal.data
    if (!d.country.trim() || !d.visa_type.trim()) {
      toast.error('الدولة ونوع التأشيرة مطلوبان')
      return
    }
    setSaving(true)
    try {
      const payload = {
        country: d.country.trim(),
        flag: d.flag?.trim() || null,
        visa_type: d.visa_type.trim(),
        processing_time: d.processing_time || null,
        price: d.price === '' ? null : Number(d.price),
        notes: d.notes || null,
        image_url: d.image_url || null,
        is_active: d.is_active,
        requirements: requirements.split('\n').map((s) => s.trim()).filter(Boolean),
      }
      await adminSaveVisa(payload, modal.id)
      toast.success(modal.id ? 'تم حفظ التعديلات' : 'تمت إضافة الدولة')
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

  const toggle = async (v) => {
    try {
      await adminSaveVisa({ is_active: !v.is_active }, v.id)
      setRows((rs) => rs.map((x) => (x.id === v.id ? { ...x, is_active: !v.is_active } : x)))
    } catch {
      toast.error('تعذر التغيير')
    }
  }

  const remove = async (v) => {
    if (!window.confirm(`حذف دولة «${v.country}» نهائياً؟`)) return
    try {
      await adminDeleteVisa(v.id)
      setRows((rs) => rs.filter((x) => x.id !== v.id))
      toast.success('تم الحذف')
    } catch {
      toast.error('تعذر الحذف')
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-gray-900">إدارة التأشيرات</h1>
          <p className="mt-1 text-sm text-gray-500">الدول التي يقدم لها المكتب خدمة التأشيرة</p>
        </div>
        <Button onClick={openNew}>
          <Plus size={17} />
          إضافة دولة
        </Button>
      </div>

      {loading ? (
        <Spinner fullscreen />
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white py-20 text-center shadow-sm">
          <Stamp size={40} className="text-gray-300" />
          <p className="font-bold text-gray-600">لا توجد دول مضافة</p>
          <Button size="sm" onClick={openNew}>إضافة أول دولة</Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((v) => (
            <div key={v.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${v.is_active ? 'border-gray-200' : 'border-gray-200 opacity-60'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-2xl border border-gray-200">
                    {v.flag || '🌍'}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900">{v.country}</h3>
                    <span className="text-xs text-plum">{v.visa_type}</span>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    v.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {v.is_active ? 'مفعّلة' : 'معطّلة'}
                </span>
              </div>

              <p className="mt-3 text-xs text-gray-400">⏱ {v.processing_time || '—'} • 💵 {v.price != null ? fmtPrice(v.price) : 'حسب الطلب'}</p>
              <p className="mt-1 text-xs text-gray-400">📄 {(v.requirements || []).length} مستند مطلوب</p>

              <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                <button onClick={() => openEdit(v)} className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-plum px-3 py-2 text-xs font-bold text-white transition hover:bg-plum-dark">
                  <Pencil size={13} />
                  تعديل
                </button>
                <button onClick={() => toggle(v)} className="rounded-lg bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200" title="تفعيل/تعطيل">
                  <Power size={15} />
                </button>
                <button onClick={() => remove(v)} className="rounded-lg bg-rose-50 p-2 text-rose-500 transition hover:bg-rose-100" title="حذف">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* نافذة الإضافة/التعديل */}
      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.id ? 'تعديل دولة' : 'إضافة دولة'} size="lg">
        {modal && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <FieldLight label="اسم الدولة" required>
                <InputLight value={modal.data.country} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, country: e.target.value } }))} placeholder="تركيا" />
              </FieldLight>
              <FieldLight label="علم الدولة (إيموجي)" hint="مثال: 🇹🇷">
                <InputLight value={modal.data.flag || ''} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, flag: e.target.value } }))} />
              </FieldLight>
              <FieldLight label="نوع التأشيرة" required>
                <InputLight value={modal.data.visa_type} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, visa_type: e.target.value } }))} placeholder="سياحية" />
              </FieldLight>
              <FieldLight label="مدة المعالجة">
                <InputLight value={modal.data.processing_time || ''} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, processing_time: e.target.value } }))} placeholder="5 – 10 أيام عمل" />
              </FieldLight>
              <FieldLight label="السعر ($)" hint="اتركه فارغاً لإخفائه">
                <InputLight type="number" min="0" value={modal.data.price ?? ''} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, price: e.target.value } }))} />
              </FieldLight>
              <FieldLight label="مفعّلة للعامة">
                <button
                  type="button"
                  onClick={() => setModal((m) => ({ ...m, data: { ...m.data, is_active: !m.data.is_active } }))}
                  className={`w-full rounded-lg px-3 py-2 text-sm font-bold transition ${
                    modal.data.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {modal.data.is_active ? 'مفعّلة ✓' : 'معطّلة'}
                </button>
              </FieldLight>
            </div>
            <FieldLight label="المستندات المطلوبة" hint="سطر لكل مستند">
              <TextareaLight rows={5} value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder={'جواز سفر صالح 6 أشهر\nصورة شخصية\nكشف حساب'} />
            </FieldLight>
            <FieldLight label="ملاحظات">
              <InputLight value={modal.data.notes || ''} onChange={(e) => setModal((m) => ({ ...m, data: { ...m.data, notes: e.target.value } }))} />
            </FieldLight>
            <ImageUpload
              value={modal.data.image_url}
              onChange={(v) => setModal((m) => ({ ...m, data: { ...m.data, image_url: v } }))}
              folder="visas"
              label="صورة / علم (اختياري)"
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
