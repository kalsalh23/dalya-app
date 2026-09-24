import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { SectionRow } from '../ui/misc.jsx'
import { waHajjUmrah } from '../../lib/wa'
import { WhatsAppIcon } from '../layout/icons.jsx'

/** قسم الحج والعمرة في الصفحة الرئيسية */
export default function HajjUmrahSection() {
  return (
    <section className="mt-10">
      <SectionRow
        title="الحج والعمرة"
        action={
          <Link to="/hajj-umrah" className="flex items-center gap-1 text-xs font-bold text-plum">
            البرامج
            <ChevronLeft className="h-4 w-4" />
          </Link>
        }
      />
      <div className="grid gap-4 lg:grid-cols-3">
        <Link
          to="/hajj-umrah"
          className="card group relative col-span-1 overflow-hidden !rounded-3xl lg:col-span-2"
        >
          <div className="relative aspect-[16/10] w-full sm:aspect-[21/9] lg:h-full">
            <img
              src="/images/site/hajj.jpg"
              alt="الحرم المكي"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/85 via-plum-dark/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <p className="text-[10px] font-bold tracking-wide text-white/80">HAJJ & UMRAH</p>
              <h3 className="mt-1 text-lg font-black leading-snug sm:text-xl">
                برامج الحج والعمرة من طرطوس إلى الحرمين 🕋
              </h3>
              <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-black text-plum shadow-lg transition-transform group-hover:-translate-y-0.5">
                اكتشف البرامج
              </span>
            </div>
          </div>
        </Link>

        <div className="card flex flex-col justify-center gap-3 p-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-chip text-plum">🕋</span>
          <h3 className="text-sm font-extrabold leading-6 text-ink">
            كل شيء محسّن لرحلة العمر: الطيران، التأشيرة، الفنادق القريبة من الحرم، والمواصلات
          </h3>
          <p className="text-[11px] leading-5 text-smoke">
            مع مرشد مرافق من ديالا يرافق القافلة من طرطوس حتى العودة بإذن الله.
          </p>
          <a href={waHajjUmrah('العمرة')} target="_blank" rel="noreferrer" className="btn-soft mt-1 !py-2.5 text-xs">
            <WhatsAppIcon size={15} />
            استفسر عن أقرب برنامج
          </a>
        </div>
      </div>
    </section>
  )
}
