import { MapPin, Phone, Instagram, Facebook, Mail } from 'lucide-react'
import { SITE, waLink } from '../config/site'
import { WhatsAppIcon } from '../components/layout/icons.jsx'
import useReveal from '../hooks/useReveal.js'
import { PageHeader } from '../components/layout/Layout.jsx'

const CHANNELS = [
  { icon: Phone, label: 'واتساب / اتصال', value: SITE.phoneDisplay, href: waLink(SITE.whatsapp, 'مرحباً ديالا للسياحة والسفر'), ltr: true, wa: true },
  { icon: Phone, label: 'هاتف 2', value: SITE.phone2Display, href: `tel:${SITE.phone2Display}`, ltr: true },
  { icon: Instagram, label: 'إنستغرام', value: '@diala.travel', href: SITE.instagram, ltr: true },
  { icon: Facebook, label: 'فيسبوك', value: 'DIALA Tourism', href: SITE.facebook, ltr: true },
  { icon: Mail, label: 'البريد', value: SITE.email, href: `mailto:${SITE.email}`, ltr: true },
]

export default function Contact() {
  const ref = useReveal()

  return (
    <div ref={ref} className="container-app pb-24 pt-2">
      <PageHeader title="تواصل معنا" subtitle="زرنا في مكتبنا أو راسلنا عبر أي قناة — نرد بسرعة" />

      {/* قنوات التواصل */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CHANNELS.map((c) => {
          const Icon = c.wa ? null : c.icon
          const inner = (
            <>
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-chip text-plum">
                {c.wa ? <WhatsAppIcon size={19} /> : Icon ? <Icon size={19} strokeWidth={1.8} /> : null}
              </span>
              <h3 className="mt-2 text-sm font-extrabold text-ink">{c.label}</h3>
              <p className="mt-0.5 text-[11px] text-smoke" dir={c.ltr ? 'ltr' : undefined}>
                {c.value}
              </p>
            </>
          )
          return c.href ? (
            <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="card p-5 text-center transition-transform hover:-translate-y-0.5">
              {inner}
            </a>
          ) : (
            <div key={c.label} className="card p-5 text-center">
              {inner}
            </div>
          )
        })}
      </div>

      {/* العنوان */}
      <div className="card mt-6 flex flex-col items-center gap-2 p-6 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-chip text-plum">
          <MapPin size={20} strokeWidth={1.8} />
        </span>
        <h2 className="text-sm font-extrabold text-ink">مكتبنا</h2>
        <p className="text-xs text-smoke">{SITE.addressAr}</p>
        <p className="text-[11px] text-smoke/80">نستقبلكم يومياً من الساعة 10 صباحاً حتى 6 مساءً (عدا الجمعة)</p>
      </div>

      {/* الخريطة */}
      <div className="mt-6 overflow-hidden rounded-3xl border-2 border-chip bg-white">
        <iframe
          title="موقع مكتب ديالا على الخريطة"
          src={SITE.mapEmbed}
          className="h-full min-h-[340px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      {/* CTA واتساب */}
      <div className="relative mt-6 overflow-hidden rounded-4xl bg-plum p-7 text-center text-white sm:p-9">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(ellipse_at_top,#B98CC7,transparent_60%)]" />
        <div className="relative z-10">
          <h2 className="text-lg font-black">أسرع طريقة للوصول إلينا 🚀</h2>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-white/80">
            راسلنا عبر واتساب وسنجيبك خلال دقائق خلال ساعات العمل — استفسارات، حجوزات، برامج خاصة.
          </p>
          <a href={waLink(SITE.whatsapp, 'مرحباً ديالا للسياحة والسفر، أرغب بالاستفسار')} target="_blank" rel="noreferrer" className="btn-gradient mt-5 !bg-white !bg-none text-plum shadow-lg">
            <WhatsAppIcon size={16} />
            محادثة واتساب مباشرة
          </a>
        </div>
      </div>
    </div>
  )
}
