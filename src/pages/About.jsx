import { Eye, Target, MapPin, Phone, Mail, Plane, Globe2, ShieldCheck, Award, HeartHandshake } from 'lucide-react'
import { TEAM } from '../components/home/Team.jsx'
import { SITE, waLink } from '../config/site'
import { SectionRow } from '../components/ui/misc.jsx'
import { WhatsAppIcon } from '../components/layout/icons.jsx'
import useReveal from '../hooks/useReveal.js'
import { PageHeader } from '../components/layout/Layout.jsx'
import { cn } from '../lib/utils'

const SERVICES_LIST = [
  { icon: Plane, title: 'تذاكر الطيران', desc: 'حجز التذاكر لجميع الخطوط بأفضل الأسعار.' },
  { icon: Globe2, title: 'الرحلات السياحية', desc: 'برامج منظمة إلى تركيا، الإمارات، المالديف وأوروبا.' },
  { icon: ShieldCheck, title: 'التأشيرات', desc: 'تجهيز الملفات ومتابعة الطلبات حتى الموافقة.' },
  { icon: Award, title: 'برامج خاصة', desc: 'عسل الشهر، الرحلات العائلية والمجموعات.' },
]

const WHY = [
  'مكتب مرخّص ومسجّل رسمياً في طرطوس',
  'فريق متخصص بخبرة ميدانية في السياحة والسفر',
  'أسعار تنافسية وعروض حصرية لعملائنا',
  'متابعة شخصية قبل وأثناء وبعد الرحلة',
]

export default function About() {
  const ref = useReveal()
  return (
    <div ref={ref} className="container-app pb-24 pt-2">
      <PageHeader title="عن المؤسسة" subtitle={`${SITE.nameAr} — ${SITE.sloganEn}`} />

      {/* نبذة */}
      <section className="card reveal mt-4 p-6">
        <p className="leading-8 text-smoke">
          مؤسسة ديالا للسياحة والسفر — مكتب سوري متخصص في تنظيم الرحلات السياحية وحجز تذاكر الطيران وخدمات
          التأشيرات، مقره في قلب مدينة طرطوس، شارع القصور. انطلقنا بإيمان بأن السفر ليس رفاهية بل تجربة تُثري
          الحياة، لذلك نهتم بأدق التفاصيل: من اختيار الرحلة المناسبة لميزانيتك، إلى استقبالك في المطار وتوديعك
          سالماً معلماً.
        </p>
        <p className="mt-3 leading-8 text-smoke">
          فريقنا الشاب يتحدث لغتك ويفهم ذوقك، ويستخدم أحدث الأنظمة الرقمية لإدارة حجوزاتك — لذلك أنشأنا هذه
          المنصة لتصلك خدماتنا أينما كنت.
        </p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          <a href="/trips" className="btn-primary btn-sm">استكشف رحلاتنا</a>
          <a href={waLink(SITE.whatsapp, 'مرحباً، أرغب بمعرفة المزيد عن خدماتكم')} target="_blank" rel="noreferrer" className="btn-outline btn-sm">
            <WhatsAppIcon size={15} />
            تحدث معنا
          </a>
        </div>
      </section>

      {/* الرؤية والرسالة */}
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card reveal p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-chip text-plum">
            <Eye size={20} strokeWidth={1.8} />
          </div>
          <h3 className="mt-3 text-sm font-extrabold text-ink">رؤيتنا</h3>
          <p className="mt-2 text-xs leading-6 text-smoke">
            أن نكون الخيار الأول للسفر من سوريا، عبر تقديم تجربة سفر رقمية متكاملة بجودة عالمية ولمسة إنسانية.
          </p>
        </div>
        <div className="card reveal p-6 text-center" style={{ transitionDelay: '60ms' }}>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-chip text-plum">
            <Target size={20} strokeWidth={1.8} />
          </div>
          <h3 className="mt-3 text-sm font-extrabold text-ink">رسالتنا</h3>
          <p className="mt-2 text-xs leading-6 text-smoke">
            تسهيل رحلة كل مسافر — من الفكرة إلى التنفيذ — بخدمة صادقة وشفافية وأسعار عادلة.
          </p>
        </div>
      </section>

      {/* لماذا ديالا */}
      <section className="mt-8">
        <SectionRow title="لماذا ديالا؟" />
        <ul className="grid gap-3 sm:grid-cols-2">
          {WHY.map((w) => (
            <li key={w} className="card flex items-start gap-2.5 p-4 text-xs leading-6 text-smoke">
              <HeartHandshake size={16} className="mt-0.5 shrink-0 text-plum" />
              {w}
            </li>
          ))}
        </ul>
      </section>

      {/* خدماتنا */}
      <section className="mt-8">
        <SectionRow title="خدماتنا" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {SERVICES_LIST.map((s) => (
            <div key={s.title} className="card p-5 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-chip text-plum">
                <s.icon size={19} strokeWidth={1.8} />
              </div>
              <h3 className="mt-2.5 text-sm font-extrabold text-ink">{s.title}</h3>
              <p className="mt-1 text-[11px] leading-5 text-smoke">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* الفريق */}
      <section id="team" className="mt-8 scroll-mt-20">
        <SectionRow title="كادر ديالا وإدارتها" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TEAM.map((m, i) => (
            <div key={m.nameEn} className="card reveal group relative overflow-hidden !rounded-3xl text-center" style={{ transitionDelay: `${i * 50}ms` }}>
              <div className="relative aspect-[3/4] overflow-hidden bg-chip">
                <img
                  src={m.img}
                  alt={m.name}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-plum-dark/70 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-2.5 text-white">
                  <h3 className="text-sm font-extrabold">{m.name}</h3>
                  <p className="mt-0.5 text-[10px] text-white/80">{m.role}</p>
                  <p className="text-[9px] text-white/60">{m.roleEn}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* التواصل */}
      <section className="reveal mt-8 rounded-4xl bg-plum p-7 text-center text-white">
        <h2 className="text-base font-black">معلومات التواصل</h2>
        <div className="mt-4 grid gap-3 text-xs text-white/85 sm:grid-cols-3">
          <p className="flex items-center justify-center gap-2">
            <MapPin size={16} className="shrink-0" />
            {SITE.addressAr}
          </p>
          <p className="flex items-center justify-center gap-2" dir="ltr">
            <Phone size={16} className="shrink-0" />
            {SITE.phoneDisplay} — {SITE.phone2Display}
          </p>
          <p className="flex items-center justify-center gap-2" dir="ltr">
            <Mail size={16} className="shrink-0" />
            {SITE.email}
          </p>
        </div>
      </section>
    </div>
  )
}
