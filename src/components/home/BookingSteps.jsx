import { Map, Send, PhoneCall, Plane } from 'lucide-react'
import useReveal from '../../hooks/useReveal.js'
import { SectionRow } from '../ui/misc.jsx'

const STEPS = [
  { icon: Map, title: 'اختر الخدمة', desc: 'رحلة، تذكرة أو تأشيرة' },
  { icon: Send, title: 'أرسل طلبك', desc: 'املأ النموذج في دقيقة' },
  { icon: PhoneCall, title: 'نتواصل معك', desc: 'نؤكد التفاصيل والأسعار' },
  { icon: Plane, title: 'استمتع برحلتك', desc: 'ورحلة سعيدة ✈️' },
]

export default function BookingSteps() {
  const ref = useReveal()
  return (
    <section ref={ref} className="mt-10">
      <SectionRow title="كيف تحجز؟" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.title} className="card reveal p-5 text-center" style={{ transitionDelay: `${i * 60}ms` }}>
            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-plum text-white">
              <s.icon className="h-5 w-5" strokeWidth={1.8} />
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-chip text-[10px] font-black text-plum">
                {i + 1}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-extrabold text-ink">{s.title}</h3>
            <p className="mt-1 text-[11px] leading-5 text-smoke">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
