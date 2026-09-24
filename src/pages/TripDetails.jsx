import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  CheckCircle2, XCircle, StickyNote, Image as ImageIcon, Luggage, CalendarDays, Clock, Users,
} from 'lucide-react'
import { fetchTripById } from '../lib/data'
import { fmtDateRange, fmtPrice } from '../lib/utils'
import { ImageFallback, Stars } from '../components/ui/misc.jsx'
import { Skeleton } from '../components/ui/Loader.jsx'
import FlightRoute from '../components/trips/FlightRoute.jsx'
import { waTrip } from '../lib/wa'
import { PageHeader } from '../components/layout/Layout.jsx'

function InfoTile({ icon: Icon, label, value, gold }) {
  return (
    <div className="card px-3 py-4 text-center">
      <Icon size={18} strokeWidth={1.8} className={gold ? 'mx-auto text-plum' : 'mx-auto text-smoke'} />
      <p className="mt-1.5 text-[10px] text-smoke">{label}</p>
      <p className={gold ? 'mt-0.5 text-sm font-black text-plum' : 'mt-0.5 text-xs font-bold text-ink'}>{value}</p>
    </div>
  )
}

export default function TripDetails() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchTripById(id)
      .then((t) => {
        setTrip(t)
        document.title = `${t.title} | ديالا للسياحة والسفر`
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="container-app space-y-4 pt-6">
        <Skeleton className="aspect-[16/10] w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (notFound || !trip) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-chip text-plum">
          <Luggage size={32} strokeWidth={1.8} />
        </div>
        <h1 className="text-lg font-extrabold text-ink">الرحلة غير موجودة</h1>
        <p className="max-w-xs text-sm text-smoke">ربما انتهت أو لم تُنشر بعد.</p>
        <a href="/trips" className="btn-soft btn-sm">العودة إلى الرحلات</a>
      </div>
    )
  }

  const gallery = trip.trip_gallery || []
  const itinerary = (trip.trip_itinerary || []).sort((a, b) => a.day_number - b.day_number)

  return (
    <div className="container-app pb-28 pt-4 md:pb-10">
      {/* بانر الرحلة */}
      <div className="group relative overflow-hidden rounded-4xl shadow-lg shadow-plum/10">
        <div className="relative aspect-[16/11] w-full sm:aspect-[21/9]">
          <ImageFallback src={trip.main_image_url} alt={trip.title} className="h-full w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/80 via-plum-dark/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
            {trip.destination && (
              <span className="mb-2 inline-block rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-plum backdrop-blur">
                {trip.destination}
              </span>
            )}
            <h1 className="text-xl font-black leading-snug sm:text-2xl">{trip.title}</h1>
            <div className="mt-1.5 flex items-center gap-3 text-[11px] text-white/85">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" />
                {fmtDateRange(trip.start_date, trip.end_date)}
              </span>
              {trip.duration_days && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {trip.duration_days} يوم
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* شريط المعلومات */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <InfoTile icon={CalendarDays} label="تاريخ الانطلاق" value={fmtDateRange(trip.start_date, trip.end_date)} />
        <InfoTile icon={Clock} label="المدة" value={trip.duration_days ? `${trip.duration_days} يوم` : '—'} />
        <InfoTile icon={Users} label="المقاعد المتاحة" value={trip.available_seats != null ? `${trip.available_seats} مقعد` : 'غير محدد'} />
        <InfoTile icon={Users} label="السعر للفرد" value={fmtPrice(trip.price)} gold />
      </div>

      {/* مسار الرحلة */}
      {trip.destination && (
        <div className="mt-5">
          <FlightRoute destination={trip.destination} />
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* العمود الرئيسي */}
        <div className="space-y-8 lg:col-span-2">
          {trip.description && (
            <section className="card p-6">
              <h2 className="mb-3 text-base font-extrabold text-ink">عن الرحلة</h2>
              <p className="whitespace-pre-line text-sm leading-7 text-smoke">{trip.description}</p>
              {trip.short_description && <p className="mt-2 text-sm leading-6 text-smoke/80">{trip.short_description}</p>}
            </section>
          )}

          {itinerary.length > 0 && (
            <section className="card p-6">
              <h2 className="mb-4 text-base font-extrabold text-ink">برنامج الرحلة يوماً بيوم</h2>
              <div className="relative space-y-5 border-r-2 border-chip pr-5">
                {itinerary.map((d) => (
                  <div key={d.id} className="relative">
                    <span className="absolute -right-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-plum text-[10px] font-black text-white">
                      {d.day_number}
                    </span>
                    <h3 className="text-sm font-extrabold text-ink">{d.title}</h3>
                    {d.description && <p className="mt-1 text-xs leading-6 text-smoke">{d.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {(trip.included?.length > 0 || trip.excluded?.length > 0) && (
            <section className="grid gap-4 sm:grid-cols-2">
              {trip.included?.length > 0 && (
                <div className="card p-5">
                  <h3 className="mb-3 text-sm font-extrabold text-ink">الخدمات المشمولة</h3>
                  <ul className="space-y-2">
                    {trip.included.map((x, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-6 text-smoke">
                        <CheckCircle2 size={14} className="mt-1 shrink-0 text-mint" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {trip.excluded?.length > 0 && (
                <div className="card p-5">
                  <h3 className="mb-3 text-sm font-extrabold text-ink">الخدمات غير المشمولة</h3>
                  <ul className="space-y-2">
                    {trip.excluded.map((x, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs leading-6 text-smoke">
                        <XCircle size={14} className="mt-1 shrink-0 text-smoke" />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {trip.notes && (
            <section className="rounded-3xl border-2 border-chip bg-white p-5">
              <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-ink">
                <StickyNote size={16} className="text-plum" />
                ملاحظات مهمة
              </h3>
              <p className="whitespace-pre-line text-xs leading-6 text-smoke">{trip.notes}</p>
            </section>
          )}

          {gallery.length > 0 && (
            <section>
              <h2 className="mb-3 flex items-center gap-2 text-base font-extrabold text-ink">
                <ImageIcon size={17} className="text-plum" />
                صور من الرحلة
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((g) => (
                  <button key={g.id} onClick={() => setLightbox(g.image_url)} className="group relative overflow-hidden rounded-2xl bg-chip">
                    <div className="aspect-[4/3] w-full">
                      <ImageFallback
                        src={g.image_url}
                        alt="صورة من الرحلة"
                        className="h-full w-full"
                        imgClassName="transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* بطاقة الحجز عبر واتساب */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card p-6 text-center">
            <p className="text-[11px] font-bold text-smoke">السعر للفرد</p>
            <p className="mt-1 text-3xl font-black text-plum">{fmtPrice(trip.price)}</p>
            <div className="mt-2 flex items-center justify-center gap-1.5">
              <Stars className="text-xs" />
              <span className="text-[11px] text-smoke">تقييم عملائنا</span>
            </div>
            <ul className="mt-4 space-y-1.5 border-t border-chip pt-4 text-start text-xs leading-6 text-smoke">
              <li>• إقامة وبرنامج سياحي كامل</li>
              <li>• متابعة من فريق ديالا للسياحة والسفر</li>
              <li>• إمكانية الدفع بالتقسيط — اسألنا</li>
            </ul>
            <a href={waTrip(trip)} target="_blank" rel="noreferrer" className="btn-gradient mt-5 w-full">
              احجز عبر واتساب
            </a>
            <p className="mt-2.5 text-[10px] leading-5 text-smoke/80">
              يفتح واتساب برسالة جاهزة تحتوي تفاصيل الرحلة — أنت من يضغط إرسال.
            </p>
          </div>
        </aside>
      </div>

      {/* شريط سفلي للهاتف */}
      <div className="fixed inset-x-0 bottom-14 z-30 border-t border-chip bg-white/95 px-4 py-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between gap-4">
          <div>
            <span className="block text-[10px] text-smoke">السعر للفرد</span>
            <span className="text-lg font-black text-plum">{fmtPrice(trip.price)}</span>
          </div>
          <a href={waTrip(trip)} target="_blank" rel="noreferrer" className="btn-gradient btn-sm">
            احجز عبر واتساب
          </a>
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-plum-dark/80 p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="صورة مكبرة" className="max-h-[85vh] max-w-full rounded-2xl object-contain" />
        </div>
      )}
    </div>
  )
}
