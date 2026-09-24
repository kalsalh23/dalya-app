import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { SectionRow } from '../ui/misc.jsx'

/** الخدمات كبطاقات صور بأسلوب شبكة المنتجات */
const SERVICES = [
  { title: 'تذاكر الطيران', desc: 'حجز واستفسار عن الرحلات', to: '/flights', img: '/images/site/svc-flights.jpg' },
  { title: 'التأشيرات', desc: 'متطلبات وتقديم الطلبات', to: '/visas', img: '/images/site/svc-visa.jpg' },
  { title: 'الرحلات السياحية', desc: 'برامج منظمة بالكامل', to: '/trips', img: '/images/site/d-turkey.jpg' },
  { title: 'العروض', desc: 'خصومات حصرية مستمرة', to: '/offers', img: '/images/site/svc-offers.jpg' },
]

export default function Services() {
  return (
    <section className="mt-8">
      <SectionRow
        title="خدماتنا"
        action={
          <Link to="/about" className="flex items-center gap-1 text-xs font-bold text-plum">
            المزيد
            <ChevronLeft className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <Link key={s.title} to={s.to} className="card group relative overflow-hidden !rounded-3xl">
            <div className="relative aspect-[4/3] overflow-hidden bg-chip">
              <img
                src={s.img}
                alt={s.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/70 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                <h3 className="text-sm font-extrabold">{s.title}</h3>
                <p className="mt-0.5 text-[10px] text-white/75">{s.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
