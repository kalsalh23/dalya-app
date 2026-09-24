import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ImageFallback, SectionRow, Stars } from '../ui/misc.jsx'
import { FALLBACK_FLIGHT_OFFERS } from '../../lib/constants'
import { fmtPrice, isExpired } from '../../lib/utils'
import useReveal from '../../hooks/useReveal.js'

/** شريط العروض الحصرية — أسعار تذاكر من دمشق بأسلوب بطاقات التطبيق */
export default function ExclusiveOffers({ offers = [] }) {
  const navigate = useNavigate()
  const ref = useReveal()
  const flightOffers = (offers.length ? offers : FALLBACK_FLIGHT_OFFERS).filter((o) => !isExpired(o)).slice(0, 4)

  const go = (o) => navigate(`/flights?to=${encodeURIComponent(o.destination)}&promo=${encodeURIComponent(o.title)}`)

  return (
    <section ref={ref} className="mt-10">
      <SectionRow title="عروض الرحلات الحصرية الآن" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {flightOffers.map((o, i) => (
          <button
            key={o.id}
            onClick={() => go(o)}
            className="card reveal group relative overflow-hidden !rounded-3xl text-start"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-chip">
              <ImageFallback
                src={o.image_url}
                alt={o.title}
                className="h-full w-full"
                imgClassName="transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/70 via-transparent to-transparent" />
              <span className="absolute start-2.5 top-2.5 rounded-full bg-plum px-2.5 py-1 text-[10px] font-bold text-white">
                عرض حصري
              </span>
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <h3 className="text-sm font-extrabold">{o.title}</h3>
                <p className="mt-0.5 text-[10px] text-white/75">تذكرة من دمشق — لفترة محدودة</p>
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Stars className="text-[11px]" />
                <span className="text-sm font-black text-plum">{fmtPrice(o.new_price)}</span>
              </div>
              <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-plum opacity-0 transition-opacity group-hover:opacity-100">
                احجز الآن
                <ArrowLeft className="h-3 w-3" />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
