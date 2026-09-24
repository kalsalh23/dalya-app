import { useNavigate } from 'react-router-dom'
import useReveal from '../../hooks/useReveal.js'
import { SectionRow } from '../ui/misc.jsx'
import { cn } from '../../lib/utils'

const DESTINATIONS = [
  { name: 'تركيا', img: '/images/site/d-turkey.jpg' },
  { name: 'الإمارات', img: '/images/site/d-uae.jpg' },
  { name: 'قطر', img: '/images/site/d-qatar.jpg' },
  { name: 'ألمانيا', img: '/images/site/d-germany.jpg' },
  { name: 'ماليزيا', img: '/images/site/d-malaysia.jpg' },
  { name: 'لبنان', img: '/images/site/d-lebanon.jpg' },
]

/** الوجهات كدوائر أفقية بأسلوب التصنيفات في renad1 */
export default function Destinations() {
  const navigate = useNavigate()
  const ref = useReveal()
  return (
    <section ref={ref} className="mt-8">
      <SectionRow
        title="وجهات شهيرة"
        action={
          <button onClick={() => navigate('/trips')} className="text-xs font-bold text-plum">
            الكل
          </button>
        }
      />
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-6 sm:overflow-visible sm:px-0">
        {DESTINATIONS.map((d, i) => (
          <button
            key={d.name}
            onClick={() => navigate(`/flights?to=${encodeURIComponent(d.name)}`)}
            className="reveal flex w-20 shrink-0 flex-col items-center gap-2"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <span className={cn('block h-20 w-20 overflow-hidden rounded-full border-[3px] bg-chip', i === 0 ? 'border-plum' : 'border-white shadow-md')}>
              <img src={d.img} alt={d.name} loading="lazy" className="h-full w-full object-cover" />
            </span>
            <span className="text-center text-[11px] font-bold leading-tight text-ink">{d.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
