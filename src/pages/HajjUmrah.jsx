import { useEffect, useState } from 'react'
import {
  CalendarCheck2, Bus, Building2, Plane, Users, FileCheck2, MapPin,
  ClipboardList, CreditCard, HeartHandshake, ChevronDown, Sparkles, HelpCircle,
} from 'lucide-react'
import { PageHeader } from '../components/layout/Layout.jsx'
import { waHajjUmrah } from '../lib/wa'
import { WhatsAppIcon } from '../components/layout/icons.jsx'
import { SectionRow } from '../components/ui/misc.jsx'
import useReveal from '../hooks/useReveal.js'

const INCLUDED = [
  { icon: Plane, title: 'تذاكر طيران مباشرة', desc: 'ذهاباً وعودة على خطوط مختارة مع أمتعة واسعة.' },
  { icon: FileCheck2, title: 'التأشيرة والتصاريح', desc: 'إنجاز تأشيرة الحج أو العمرة كاملة عن بعد دون عناء.' },
  { icon: Building2, title: 'فنادق قريبة من الحرم', desc: 'خيارات متعددة على بُعد خطوات من الحرم الشريف.' },
  { icon: Bus, title: 'مواصلات مكيّفة', desc: 'تنقلات داخلية بين مكة والمدينة والمشاعر المقدسة.' },
  { icon: Users, title: 'مرشد مرافق', desc: 'موظفون من ديالا يرافقون القافلة من طرطوس حتى العودة.' },
  { icon: CalendarCheck2, title: 'برامج زيارات', desc: 'زيارة المدينة المنورة والمعالم المقدسة بجداول مرنة.' },
]

const PROGRAMS = [
  {
    key: 'حج',
    title: 'حج — الموسم الأكبر',
    tag: 'تسجيل مبكر',
    desc: 'برامج حج بمستويات متعددة: مخيمات وفنادق بمسافات مختلفة عن الحرم، مع متابعة كاملة في المشاعر من وصولاً حتى التسعين.',
    img: '/images/site/hajj.jpg',
    points: ['مخيمات وفنادق بدرجات مختلفة', 'وجبات ونقل بين المشاعر', 'إرشاد شربي ومرافق إداري'],
  },
  {
    key: 'عمرة رمضان',
    title: 'عمرة رمضان',
    tag: 'العشر الأواخر',
    desc: 'برنامج عمرة رمضان في العشر الأواخر: إقامة قريبة من الحرم، إفطار وسحور، وزيارة المدينة المنورة.',
    img: '/images/site/umrah.jpg',
    points: ['إفطار وسحور مشمول', 'فنادق قريبة للحرم', 'زيارة المدينة المنورة'],
  },
  {
    key: 'عمرة السنة',
    title: 'عمرة على مدار السنة',
    tag: 'أي وقت',
    desc: 'مواعيد مرنة طوال السنة بأسعار تناسب كل الميزانيات — رحلات فردية أو عائلية أو مجموعات.',
    img: '/images/site/d-uae.jpg',
    points: ['تواريخ مرنة بطلبك', 'أسعار فردية وعائلية', 'خصم للمجموعات'],
  },
]

const STEPS = [
  { icon: ClipboardList, title: 'راسلنا على واتساب', desc: 'أخبرنا بنوع البرنامج وعدد المسافرين والموعد المناسب.' },
  { icon: CreditCard, title: 'اختر البرنامج والدفع', desc: 'نرسل لك العروض والأسعار، وتختار ما يناسبك مع خطة دفع مرنة.' },
  { icon: FileCheck2, title: 'أنجز أوراقك معنا', desc: 'نتكفل بالتأشيرة والتصاريح والترتيبات — أوراقك بسيطة: جواز وصورة شخصية.' },
  { icon: HeartHandshake, title: 'سافر وأدِّ مناسك بطمأنينة', desc: 'مرشد ديالا معك من طرطوس حتى العودة بإذن الله.' },
]

const FAQ = [
  {
    q: 'متى يجب التسجيل لبرامج الحج؟',
    a: 'التسجيل للحج يتم مبكراً وفق أنظمة الموسم وحدود المقاعد — ننصح بالتقديم قبل أشهر لضمان المقعد والسعر، والعمرة متاحة على مدار السنة.',
  },
  {
    q: 'ما المستندات المطلوبة للعمرة؟',
    a: 'جواز سفر صالح 6 أشهر على الأقل، صورة شخصية بخلفية بيضاء، وبيانات أساسية — ونتكفل نحن بالباقي: التأشيرة والفندق والتذاكر.',
  },
  {
    q: 'هل يوجد اختلاف أسعار حسب موقع الفندق؟',
    a: 'نعم، نوفّر مستويات متعددة: فنادق على بعد خطوات من الحرم وخيارات أوسع بأسعار أقل — أرسل ميزانيتك ونقترح الأفضل.',
  },
  {
    q: 'هل تتوفر إمكانية الدفع بالتقسيط؟',
    a: 'نعم، نسهّل الدفع على دفعات قبل الموعد — تواصل معنا لترتيب خطة تناسب ظروفك.',
  },
]

function FaqItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card overflow-hidden !rounded-2xl">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-start">
        <span className="flex items-center gap-2 text-sm font-extrabold text-ink">
          <HelpCircle size={16} className="shrink-0 text-plum" />
          {item.q}
        </span>
        <ChevronDown size={17} className={`shrink-0 text-plum transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="border-t border-chip px-4 py-3 text-xs leading-6 text-smoke">{item.a}</p>}
    </div>
  )
}

export default function HajjUmrah() {
  const ref = useReveal()

  useEffect(() => {
    document.title = 'الحج والعمرة | ديالا للسياحة والسفر'
  }, [])

  return (
    <div ref={ref} className="container-app pb-24 pt-2">
      <PageHeader title="الحج والعمرة" subtitle="رحلة العمر تستحق أجمل استعداد — نرافقك من طرطوس إلى الحرمين" />

      {/* البانر */}
      <div className="group relative mt-4 overflow-hidden rounded-4xl shadow-lg shadow-plum/10">
        <div className="relative aspect-[16/11] w-full sm:aspect-[21/9]">
          <img
            src="/images/site/hajj.jpg"
            alt="الحرم المكي"
            loading="eager"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/85 via-plum-dark/25 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-7">
            <p className="text-[11px] font-bold tracking-wide text-white/80">HAJJ & UMRAH · DIALA</p>
            <h2 className="mt-1 text-xl font-black leading-snug sm:text-3xl">
              رحلة العمر من قلب طرطوس إلى بيت الله الحرام 🕋
            </h2>
            <p className="mt-1.5 hidden max-w-lg text-xs leading-6 text-white/80 sm:block">
              برامج متكاملة تشمل الطيران والتأشيرة والإقامة والمواصلات ومرشداً مرافقاً — لتتفرغ للعبادة ونحن نتكفل بالباقي.
            </p>
          </div>
        </div>
      </div>

      {/* نبذة تعريفية */}
      <div className="card mt-5 p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-chip text-xl">🕋</span>
        <h2 className="mt-3 text-base font-extrabold text-ink">لماذا تؤدي مناسكك مع ديالا؟</h2>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-smoke">
          رحلة الحج والعمرة ليست رحلة عادية — هي رحلة يغيب فيها المسافر عن كل شيء إلا العبادة. لذلك صممنا برامجنا
          لتتفرغ أنت لقلبك ودعائك، بينما ندير نحن كل التفاصيل: من إنجاز التأشيرة واختيار الفندق القريب من الحرم،
          إلى مواعيد المشاعر والمواصلات، ومرشد من فريقنا يرافق القافلة من انطلاقها من طرطوس حتى عودتها.
        </p>
      </div>

      {/* ماذا تشمل البرامج */}
      <section className="mt-8">
        <SectionRow title="ماذا تشمل برامجنا؟" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {INCLUDED.map((c, i) => (
            <div key={c.title} className="card reveal p-5 text-center" style={{ transitionDelay: `${i * 50}ms` }}>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-chip text-plum">
                <c.icon size={20} strokeWidth={1.8} />
              </div>
              <h3 className="mt-2.5 text-sm font-extrabold text-ink">{c.title}</h3>
              <p className="mt-1 text-[11px] leading-5 text-smoke">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* أنواع البرامج */}
      <section className="mt-10">
        <SectionRow title="أنواع البرامج" />
        <div className="grid gap-4 lg:grid-cols-3">
          {PROGRAMS.map((p, i) => (
            <div key={p.title} className="card reveal overflow-hidden !rounded-3xl" style={{ transitionDelay: `${i * 60}ms` }}>
              <div className="relative aspect-[16/9] overflow-hidden bg-chip">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/75 via-transparent to-transparent" />
                <span className="absolute start-2.5 top-2.5 rounded-full bg-plum px-2.5 py-1 text-[10px] font-bold text-white">
                  {p.tag}
                </span>
                <h3 className="absolute inset-x-0 bottom-0 p-3.5 text-base font-black text-white">{p.title}</h3>
              </div>
              <div className="p-4">
                <p className="text-xs leading-6 text-smoke">{p.desc}</p>
                <ul className="mt-3 space-y-1.5">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-1.5 text-[11px] text-smoke">
                      <Sparkles size={12} className="shrink-0 text-plum" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <a
                  href={waHajjUmrah(p.key)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-soft btn-sm mt-4 w-full"
                >
                  <WhatsAppIcon size={14} />
                  استفسر عن {p.key}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* خطوات الاستعداد */}
      <section className="mt-10">
        <SectionRow title="خطوات رحلتك معنا" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-5 text-center">
              <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-plum text-white">
                <s.icon size={19} strokeWidth={1.8} />
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-chip text-[10px] font-black text-plum">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-3 text-xs font-extrabold leading-5 text-ink">{s.title}</h3>
              <p className="mt-1 text-[10px] leading-5 text-smoke">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* أسئلة شائعة */}
      <section className="mt-10">
        <SectionRow title="أسئلة شائعة" />
        <div className="grid gap-3 lg:grid-cols-2">
          {FAQ.map((f) => (
            <FaqItem key={f.q} item={f} />
          ))}
        </div>
      </section>

      {/* تنبيه + CTA */}
      <div className="mt-8 rounded-3xl border-2 border-chip bg-white p-5 text-center text-xs leading-6 text-smoke">
        <b className="text-ink">تنبيه مهم:</b> مواعيد وأسعار البرامج تتغير حسب الموسم وتوفر المقاعد، وتسجيل
        الحج يتم مسبقاً وفق أنظمة الموسم — قدّم طلبك مبكراً لضمان مقعدك.
      </div>

      <section className="mt-6">
        <div className="relative overflow-hidden rounded-4xl bg-plum p-7 text-center text-white sm:p-9">
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(ellipse_at_top,#B98CC7,transparent_60%)]" />
          <div className="relative z-10">
            <h3 className="text-lg font-black">استعد لرحلة العمر مع ديالا 🕋</h3>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-white/80">
              راسلنا الآن لمعرفة البرامج المتاحة وأسعارها، وسيتواصل معك مستشار الحج والعمرة المختص من فريقنا.
            </p>
            <a href={waHajjUmrah()} target="_blank" rel="noreferrer" className="btn mt-5 !bg-white !bg-none text-plum shadow-lg hover:bg-chip">
              <WhatsAppIcon size={16} />
              استفسر عبر واتساب
            </a>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-white/70">
              <MapPin size={12} />
              انطلاق القوافل من طرطوس — شارع القصور
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
