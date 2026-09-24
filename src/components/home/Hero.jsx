import { Link } from 'react-router-dom'
import { Plane } from 'lucide-react'
import { SITE } from '../../config/site'

/** بانر الهيرو بنمط التطبيق: بطاقة كبيرة rounded-4xl */
export default function Hero() {
  return (
    <Link to="/trips" className="group relative block overflow-hidden rounded-4xl shadow-lg shadow-plum/10">
      <div className="relative aspect-[16/12] w-full sm:aspect-[21/9]">
        <img
          src="/images/site/hero.jpg"
          alt="رحلات ديالا للسياحة والسفر"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/80 via-plum-dark/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
          <p className="text-[11px] font-bold tracking-wide text-white/80">{SITE.nameEn} · SYRIA</p>
          <h2 className="mt-1 text-xl font-black leading-snug sm:text-3xl">{SITE.taglineAr} ✈️</h2>
          <p className="mt-1 hidden max-w-md text-xs leading-6 text-white/80 sm:block">
            نساعدك على الوصول إلى وجهتك بسهولة، من حجز التذاكر إلى التأشيرات والرحلات السياحية.
          </p>
          <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-black text-plum shadow-lg transition-transform group-hover:-translate-y-0.5">
            <Plane className="h-4 w-4" />
            استكشف الرحلات
          </span>
        </div>
      </div>
    </Link>
  )
}
