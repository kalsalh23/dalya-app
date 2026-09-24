import { Link } from 'react-router-dom'
import useReveal from '../../hooks/useReveal.js'
import { SectionRow } from '../ui/misc.jsx'

export const TEAM = [
  { name: 'ديالا', nameEn: 'DIALA', role: 'المدير العام', roleEn: 'General Manager', img: '/images/team/diala.jpg' },
  { name: 'منهل', nameEn: 'MANHL', role: 'المدير العام', roleEn: 'General Manager', img: '/images/team/manhal.jpg' },
  { name: 'فرح', nameEn: 'FARAH', role: 'مستشارة سفر', roleEn: 'Travel Consultant', img: '/images/team/farah.jpg' },
  { name: 'دنيا', nameEn: 'DONIA', role: 'مستشارة سياحة', roleEn: 'Tourism Consultant', img: '/images/team/donia.jpg' },
  { name: 'غفران', nameEn: 'GHOLFRAN', role: 'مسؤولة حجز التذاكر', roleEn: 'Ticket Booking Officer', img: '/images/team/ghofran.jpg' },
]

/** الفريق كدوائر بأسلوب التصنيفات */
export default function Team() {
  const ref = useReveal()
  return (
    <section ref={ref} className="mt-8">
      <SectionRow
        title="كادر ديالا وإدارتها"
        action={
          <Link to="/about#team" className="text-xs font-bold text-plum">
            المزيد
          </Link>
        }
      />
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0">
        {TEAM.map((m, i) => (
          <Link
            key={m.nameEn}
            to="/about#team"
            className="reveal flex w-20 shrink-0 flex-col items-center gap-2"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            <span className={cn2('block h-20 w-20 overflow-hidden rounded-full border-[3px] bg-chip', i === 0 ? 'border-plum' : 'border-white shadow-md')}>
              <img src={m.img} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
            </span>
            <span className="text-center text-[11px] font-bold leading-tight text-ink">{m.name}</span>
            <span className="-mt-1.5 text-center text-[10px] leading-tight text-smoke">{m.role}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function cn2(...c) {
  return c.filter(Boolean).join(' ')
}
