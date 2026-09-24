import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ArrowRight, User, Phone, CalendarClock, MapPin, Plane, Stamp, MessageSquare,
  Users, ArrowRightLeft, Luggage, RefreshCw, ClipboardList,
} from 'lucide-react'
import {
  fetchRequestByType, fetchRequestEvents, updateRequestStatus, requestTable,
} from '../../lib/data'
import { REQUEST_TYPE_LABELS, STATUS_LABELS, STATUS_FLOW, TRIP_TYPE_LABELS, CABIN_LABELS } from '../../lib/constants'
import { StatusBadge } from '../../components/ui/misc.jsx'
import { SelectLight } from '../../components/ui/forms.jsx'
import Button from '../../components/ui/Button.jsx'
import { Spinner } from '../../components/ui/Loader.jsx'
import { fmtDate, shortId, phoneDigits, timeAgo } from '../../lib/utils'
import { supabase } from '../../lib/supabase'

const TYPE_ICONS = {
  TRIP_BOOKING: MapPin,
  FLIGHT_BOOKING: Plane,
  VISA_REQUEST: Stamp,
  GENERAL_INQUIRY: MessageSquare,
}

function DetailRow({ icon: Icon, label, value, ltr = false }) {
  return (
    <div className="flex items-start gap-3 border-b border-gray-100 py-3 last:border-0">
      <Icon size={17} className="mt-0.5 shrink-0 text-gold" />
      <div className="flex-1">
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-gray-800" dir={ltr ? 'ltr' : undefined}>
          {value || '—'}
        </p>
      </div>
    </div>
  )
}

export default function RequestDetails() {
  const { type, id } = useParams()
  const [req, setReq] = useState(null)
  const [events, setEvents] = useState([])
  const [tripTitle, setTripTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    document.title = `تفاصيل الطلب #${shortId(id)} | لوحة التحكم`
    setLoading(true)
    Promise.all([fetchRequestByType(type, id), fetchRequestEvents(type, id)])
      .then(async ([r, ev]) => {
        setReq(r)
        setEvents(ev)
        setNewStatus(r.status)
        if (r.trip_id) {
          const { data } = await supabase.from('trips').select('title').eq('id', r.trip_id).single()
          setTripTitle(data?.title || '')
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [type, id])

  if (loading) return <Spinner fullscreen />

  if (notFound || !req) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <h1 className="font-display text-xl font-bold text-gray-800">الطلب غير موجود</h1>
        <Link to="/admin/requests" className="inline-flex items-center gap-2 text-sm font-bold text-plum">
          <ArrowRight size={15} />
          العودة إلى الطلبات
        </Link>
      </div>
    )
  }

  const Icon = TYPE_ICONS[type] || ClipboardList
  const currentIndex = STATUS_FLOW.indexOf(req.status)
  const cancelled = req.status === 'CANCELLED'
  const customerPhone = phoneDigits(req.phone || req.customer_phone)

  const changeStatus = async () => {
    if (!newStatus || newStatus === req.status) return
    setSaving(true)
    try {
      await updateRequestStatus(type, id, newStatus)
      setReq((r) => ({ ...r, status: newStatus }))
      const ev = await fetchRequestEvents(type, id)
      setEvents(ev)
      toast.success('تم تحديث حالة الطلب')
    } catch (err) {
      toast.error('تعذر تحديث الحالة')
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const details = () => {
    switch (type) {
      case 'TRIP_BOOKING':
        return (
          <>
            <DetailRow icon={MapPin} label="الرحلة المطلوبة" value={tripTitle || (req.trips?.title ?? '—')} />
            <DetailRow icon={Users} label="عدد المسافرين" value={`${req.travelers || 1}`} />
            <DetailRow icon={MessageSquare} label="ملاحظات العميل" value={req.notes} />
          </>
        )
      case 'FLIGHT_BOOKING':
        return (
          <>
            <DetailRow icon={ArrowRightLeft} label="نوع الرحلة" value={TRIP_TYPE_LABELS[req.trip_type] || req.trip_type} />
            <DetailRow icon={Plane} label="المسار" value={`${req.from_city || '—'} ← ${req.to_city || '—'}`} />
            <DetailRow icon={CalendarClock} label="تاريخ الذهاب" value={fmtDate(req.depart_date)} />
            {req.return_date && <DetailRow icon={CalendarClock} label="تاريخ العودة" value={fmtDate(req.return_date)} />}
            <DetailRow icon={Users} label="عدد المسافرين" value={`${req.passengers || 1}`} />
            <DetailRow icon={Luggage} label="درجة السفر" value={CABIN_LABELS[req.cabin_class] || req.cabin_class} />
            <DetailRow icon={MessageSquare} label="ملاحظات العميل" value={req.notes} />
          </>
        )
      case 'VISA_REQUEST':
        return (
          <>
            <DetailRow icon={Stamp} label="الدولة" value={req.country} />
            <DetailRow icon={Stamp} label="نوع التأشيرة" value={req.visa_type} />
            <DetailRow icon={Users} label="عدد الأشخاص" value={`${req.persons || 1}`} />
            <DetailRow icon={MessageSquare} label="ملاحظات العميل" value={req.notes} />
          </>
        )
      default:
        return <DetailRow icon={MessageSquare} label="نص الرسالة" value={req.message} />
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link to="/admin/requests" className="inline-flex items-center gap-2 text-sm font-bold text-plum hover:underline">
        <ArrowRight size={15} />
        كل الطلبات
      </Link>

      {/* رأس الطلب */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum text-white">
              <Icon size={22} />
            </span>
            <div>
              <h1 className="font-display text-xl font-extrabold text-gray-900">{req.customer_name}</h1>
              <p className="mt-1 text-xs text-gray-400">
                #{shortId(req.id)} • {REQUEST_TYPE_LABELS[type]} • أُنشئ {timeAgo(req.created_at)}
              </p>
            </div>
          </div>
          <StatusBadge status={req.status} className="!text-sm !px-4 !py-1.5" />
        </div>

        {cancelled && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            هذا الطلب ملغى.
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* التفاصيل */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 font-display text-lg font-bold text-gray-900">بيانات العميل</h2>
            <DetailRow icon={User} label="الاسم الكامل" value={req.customer_name} />
            <DetailRow
              icon={Phone}
              label="رقم الهاتف"
              value={
                customerPhone ? (
                  <a href={`tel:${customerPhone}`} className="text-plum hover:underline" dir="ltr">
                    {req.phone}
                  </a>
                ) : '—'
              }
              ltr
            />
            <DetailRow icon={CalendarClock} label="وقت إنشاء الطلب" value={fmtDate(req.created_at)} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 font-display text-lg font-bold text-gray-900">تفاصيل الطلب</h2>
            {details()}
          </div>

          {/* سجل الأحداث */}
          {events.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-display text-lg font-bold text-gray-900">سجل الأحداث</h2>
              <ul className="space-y-3">
                {events.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 text-sm">
                    <RefreshCw size={14} className="text-gray-300" />
                    <span className="text-gray-700">
                      {e.old_status ? `من «${STATUS_LABELS[e.old_status] || e.old_status}» إلى «${STATUS_LABELS[e.new_status] || e.new_status}»` : `أصبحت الحالة «${STATUS_LABELS[e.new_status] || e.new_status}»`}
                    </span>
                    <span className="text-xs text-gray-400">{fmtDate(e.created_at)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* الحالة والتواصل */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-display text-lg font-bold text-gray-900">خط سير الطلب</h2>
            <div className="relative space-y-0">
              {STATUS_FLOW.map((s, i) => {
                const done = currentIndex >= i && currentIndex !== -1
                const current = currentIndex === i
                return (
                  <div key={s} className="relative flex gap-4 pb-7 last:pb-0">
                    {i < STATUS_FLOW.length - 1 && (
                      <span className={`absolute right-[11px] top-6 h-full w-0.5 ${done && currentIndex > i ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                    )}
                    <span
                      className={`z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-black ${
                        current
                          ? 'bg-plum text-white ring-4 ring-plum/20'
                          : done
                            ? 'bg-emerald-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className={`text-sm font-bold ${done ? 'text-gray-800' : 'text-gray-400'}`}>
                        {STATUS_LABELS[s]}
                      </p>
                      {current && <p className="text-[11px] text-plum">الحالة الحالية</p>}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
              <SelectLight value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </SelectLight>
              <Button onClick={changeStatus} loading={saving} className="w-full">
                تحديث الحالة
              </Button>
            </div>
          </div>

          {customerPhone && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <h2 className="font-display text-lg font-bold text-emerald-700">تواصل مع العميل</h2>
              <p className="mt-2 text-xs leading-relaxed text-emerald-600">
                يفتح واتساب مع رسالة جاهزة تحتوي رقم الطلب واسم العميل — أنت من يضغط إرسال.
              </p>
              <a
                href={`https://wa.me/${customerPhone}?text=${encodeURIComponent(
                  `مرحباً ${req.customer_name}،\nمعك ${'فريق ديالا للسياحة والسفر'} ✈️\nبخصوص طلبكم رقم #${shortId(req.id)} (${REQUEST_TYPE_LABELS[type]})، نود تأكيد بعض التفاصيل معكم.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                تواصل عبر WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
