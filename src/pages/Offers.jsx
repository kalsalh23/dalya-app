import { useEffect, useState } from 'react'
import { CalendarRange, Gift, MapPinned } from 'lucide-react'
import { fetchOffers } from '../lib/data'
import { CardSkeletonGrid } from '../components/ui/Loader.jsx'
import { EmptyState, ImageFallback } from '../components/ui/misc.jsx'
import { waOffer } from '../lib/wa'
import { fmtDateRange, fmtPrice, isExpired } from '../lib/utils'
import { OFFER_TYPE_LABELS } from '../lib/constants'
import useReveal from '../hooks/useReveal.js'
import { PageHeader } from '../components/layout/Layout.jsx'

export default function Offers() {
  const ref = useReveal()
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'العروض والخصومات | ديالا للسياحة والسفر'
    fetchOffers()
      .then(setOffers)
      .catch(() => setOffers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div ref={ref} className="container-app pb-24 pt-2">
      <PageHeader title="عروض الرحلات الحصرية الآن" subtitle="أسعار مميزة لفترة محدودة — احجز عبر واتساب قبل نفاد المقاعد" />

      <div className="mt-4">
        {loading ? (
          <CardSkeletonGrid count={4} />
        ) : offers.length === 0 ? (
          <EmptyState
            icon={Gift}
            title="لا توجد عروض نشطة حالياً"
            subtitle="تابعنا على إنستغرام أو ارجع قريباً — العروض الجديدة تصل أولاً بأول."
            action={<a href="/" className="btn-soft btn-sm">العودة للرئيسية</a>}
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {offers.map((o, i) => {
              const expired = isExpired(o)
              return (
                <article
                  key={o.id}
                  className={`card group relative flex flex-col overflow-hidden !rounded-3xl ${expired ? 'opacity-60 saturate-50' : ''}`}
                  style={{ transitionDelay: `${(i % 4) * 60}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-chip">
                    <ImageFallback
                      src={o.image_url}
                      alt={o.title}
                      className="h-full w-full"
                      imgClassName="transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/60 via-transparent to-transparent" />
                    <span className="absolute start-2.5 top-2.5 rounded-full bg-plum px-2.5 py-1 text-[10px] font-bold text-white">
                      {OFFER_TYPE_LABELS[o.offer_type] || 'عرض'}
                    </span>
                    {expired && (
                      <span className="absolute end-2.5 top-2.5 rounded-full bg-rose px-2.5 py-1 text-[10px] font-bold text-white">
                        انتهى
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3.5">
                    <h3 className="truncate text-sm font-extrabold text-ink">{o.title}</h3>
                    {o.description && <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-smoke">{o.description}</p>}

                    <p className="mt-2 flex items-center gap-1.5 text-[10px] text-smoke">
                      <CalendarRange size={12} className="text-plum" />
                      {o.start_date || o.end_date ? fmtDateRange(o.start_date, o.end_date) : 'دائم'}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                      {o.old_price && <span className="text-xs text-smoke line-through">{fmtPrice(o.old_price)}</span>}
                      {o.new_price && <span className="text-base font-black text-plum">{fmtPrice(o.new_price)}</span>}
                    </div>

                    {o.destination && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-smoke">
                        <MapPinned size={11} className="text-plum" />
                        {o.destination}
                      </p>
                    )}

                    <div className="mt-auto pt-3">
                      {!expired ? (
                        <a href={waOffer(o)} target="_blank" rel="noreferrer" className="btn-gradient btn-sm w-full">
                          استفد عبر واتساب
                        </a>
                      ) : (
                        <span className="block rounded-full bg-chip px-4 py-2 text-center text-[11px] font-bold text-smoke">
                          انتهت فترة هذا العرض
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
