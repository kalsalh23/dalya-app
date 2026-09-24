import { Headset, BadgeDollarSign, ShieldCheck, Gem } from 'lucide-react'
import useReveal from '../../hooks/useReveal.js'
import { SectionRow } from '../ui/misc.jsx'

const VALUES = [
  { icon: Gem, title: 'خبرة وثقة', body: 'مكتب مرخّص في طرطوس بخبرة ميدانية طويلة.' },
  { icon: BadgeDollarSign, title: 'أسعار تنافسية', body: 'عروض حصرية بدون رسوم خفية.' },
  { icon: Headset, title: 'متابعة 24/7', body: 'نجيب على استفساراتك في أي وقت.' },
  { icon: ShieldCheck, title: 'خدمة شخصية', body: 'مستشار سفر يرافقك خطوة بخطوة.' },
]

export default function WhyDiala() {
  const ref = useReveal()
  return (
    <section ref={ref} className="mt-10">
      <SectionRow title="لماذا ديالا؟" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {VALUES.map((v, i) => (
          <div
            key={v.title}
            className="card reveal p-5 text-center"
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-chip text-plum">
              <v.icon className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <h3 className="mt-3 text-sm font-extrabold text-ink">{v.title}</h3>
            <p className="mt-1 text-[11px] leading-5 text-smoke">{v.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
