import { Link } from 'react-router-dom'
import { Instagram, Phone, MapPin, Mail } from 'lucide-react'
import { SITE, waLink } from '../../config/site'
import { WhatsAppIcon } from './icons.jsx'
import { NAV_LINKS } from '../../lib/nav.js'

const SERVICES = [
  { to: '/flights', label: 'تذاكر الطيران' },
  { to: '/visas', label: 'التأشيرات' },
  { to: '/trips', label: 'الرحلات السياحية' },
  { to: '/offers', label: 'العروض والخصومات' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory/85">
      <div className="container-site grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4 lg:py-18">
        <div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-3xl text-ivory">ديالا</span>
            <span className="mt-1 font-latin text-[10px] tracking-[0.5em] text-gold-light">DIALA</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-7 text-ivory/60">
            {SITE.nameAr} — وجهتك الأولى لتذاكر الطيران والتأشيرات والرحلات السياحية. {SITE.taglineAr} ✈️
          </p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:border-gold-light hover:text-gold-light"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={waLink(SITE.whatsapp, 'مرحباً، أرغب بالاستفسار عن خدماتكم')}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/20 transition-colors hover:border-gold-light hover:text-gold-light"
            >
              <WhatsAppIcon size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-latin text-xs tracking-[0.3em] text-gold-light">روابط سريعة</h4>
          <ul className="space-y-2.5 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-ivory/70 transition-colors hover:text-gold-light">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-latin text-xs tracking-[0.3em] text-gold-light">خدماتنا</h4>
          <ul className="space-y-2.5 text-sm">
            {SERVICES.map((s) => (
              <li key={s.to}>
                <Link to={s.to} className="text-ivory/70 transition-colors hover:text-gold-light">
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-latin text-xs tracking-[0.3em] text-gold-light">تواصل معنا</h4>
          <ul className="space-y-3 text-sm text-ivory/70">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <span>{SITE.addressAr}</span>
            </li>
            <li className="flex items-center gap-2.5" dir="ltr">
              <Phone className="h-4 w-4 shrink-0 text-gold-light" />
              <span>{SITE.phoneDisplay}</span>
            </li>
            <li className="flex items-center gap-2.5" dir="ltr">
              <Mail className="h-4 w-4 shrink-0 text-gold-light" />
              <span>{SITE.email}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ivory/10">
        <div className="container-site flex flex-col items-center justify-between gap-2 py-5 text-xs text-ivory/40 sm:flex-row">
          <span>© {new Date().getFullYear()} {SITE.nameAr} — جميع الحقوق محفوظة</span>
          <span className="font-latin tracking-[0.3em]">DIALA · TOURISM & TRAVEL</span>
        </div>
      </div>
    </footer>
  )
}
