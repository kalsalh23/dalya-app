import { Instagram } from 'lucide-react'
import { SITE } from '../../config/site'
import useReveal from '../../hooks/useReveal.js'
import { SectionRow } from '../ui/misc.jsx'

const THUMBS = [
  '/images/site/d-turkey.jpg',
  '/images/site/d-uae.jpg',
  '/images/site/d-malaysia.jpg',
  '/images/site/d-lebanon.jpg',
]

export default function InstagramSection() {
  const ref = useReveal()
  return (
    <section ref={ref} className="mt-10">
      <SectionRow
        title="تابع آخر أخبارنا"
        action={
          <a href={SITE.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs font-bold text-plum">
            <Instagram className="h-4 w-4" />
            حسابنا
          </a>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {THUMBS.map((t, i) => (
          <a
            key={i}
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer"
            className="card reveal group relative overflow-hidden !rounded-3xl"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="aspect-square overflow-hidden bg-chip">
              <img
                src={t}
                alt="منشور إنستغرام"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-plum-dark/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Instagram className="h-7 w-7 text-white" />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
