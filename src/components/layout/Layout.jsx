import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Search, Map, Home, BadgePercent, Phone, ChevronRight, Instagram, Facebook } from 'lucide-react'
import { cn } from '../../lib/utils'
import { SITE } from '../../config/site'
import { WhatsAppIcon } from './icons.jsx'

/** ترويسة الرئيسية: ترحيب + بحث */
function HomeHeader() {
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    navigate(`/trips?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <div className="container-app pt-5">
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-plum text-lg font-black text-white">
            D
          </span>
          <span className="leading-tight">
            <span className="block text-xs text-smoke">أهلاً بك في</span>
            <span className="block text-sm font-extrabold text-ink">ديالا للسياحة والسفر</span>
          </span>
        </Link>
        <Link
          to="/contact"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-ink shadow-[0_4px_24px_rgba(74,31,82,0.07)]"
          aria-label="تواصل معنا"
        >
          <Phone className="h-5 w-5" />
        </Link>
      </div>

      {/* البحث */}
      <form onSubmit={submit} className="mt-5">
        <div className="flex items-center gap-2 rounded-full bg-white px-5 py-3.5 shadow-[0_4px_24px_rgba(74,31,82,0.07)]">
          <Search className="h-5 w-5 shrink-0 text-smoke" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن رحلة أو وجهة..."
            className="w-full bg-transparent text-sm text-ink placeholder:text-smoke/70 focus:outline-none"
            aria-label="بحث"
          />
        </div>
      </form>
    </div>
  )
}

/** ترويسة الصفحات الداخلية */
function InnerHeader() {
  const location = useLocation()
  const links = [
    { to: '/trips', label: 'الرحلات' },
    { to: '/visas', label: 'التأشيرات' },
    { to: '/flights', label: 'الطيران' },
    { to: '/hajj-umrah', label: 'الحج والعمرة' },
    { to: '/offers', label: 'العروض' },
    { to: '/about', label: 'عن ديالا' },
    { to: '/contact', label: 'تواصل' },
  ]
  return (
    <div className="sticky top-0 z-40 border-b border-chip bg-lilac/95 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-plum text-sm font-black text-white">D</span>
          <span className="text-base font-black text-ink">ديالا</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="التنقل">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn('text-sm font-bold transition-colors', location.pathname === l.to ? 'text-plum' : 'text-smoke hover:text-ink')}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link to="/flights" className="btn-primary !rounded-full !px-5 !py-2 text-xs">
          احجز الآن
        </Link>
      </div>
    </div>
  )
}

/** شريط تنقل سفلي كالتطبيقات */
function BottomNav() {
  const location = useLocation()
  const items = [
    { to: '/', label: 'الرئيسية', icon: Home, match: (p) => p === '/' },
    { to: '/trips', label: 'الرحلات', icon: Map, match: (p) => p.startsWith('/trips') },
    { to: '/flights', label: 'احجز', icon: Search, match: (p) => p.startsWith('/flights') || p.startsWith('/visas') },
    { to: '/offers', label: 'العروض', icon: BadgePercent, match: (p) => p.startsWith('/offers') },
    { to: '/contact', label: 'تواصل', icon: Phone, match: (p) => p.startsWith('/contact') || p.startsWith('/about') },
  ]

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-chip bg-white pb-[env(safe-area-inset-bottom)]" aria-label="التنقل السفلي">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((item) => {
          const active = item.match(location.pathname)
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold transition-colors',
                active ? 'text-plum' : 'text-smoke'
              )}
            >
              <item.icon
                className="h-6 w-6"
                strokeWidth={active ? 2.4 : 1.8}
                fill={active ? 'currentColor' : 'none'}
                opacity={active ? 0.15 : 1}
              />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

/** ترويسة صفحة داخلية مع زر رجوع */
export function PageHeader({ title, subtitle }) {
  const navigate = useNavigate()
  return (
    <div className="container-app flex items-center gap-3 pb-2 pt-6">
      <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-[0_4px_24px_rgba(74,31,82,0.07)]" aria-label="رجوع">
        <ChevronRight className="h-5 w-5 text-ink" />
      </button>
      <div>
        <h1 className="text-xl font-black text-ink">{title}</h1>
        {subtitle && <p className="text-xs text-smoke">{subtitle}</p>}
      </div>
    </div>
  )
}

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      {isHome ? <HomeHeader /> : <InnerHeader />}
      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      {/* تذييل مختصر */}
      <footer className="border-t border-chip bg-white">
        <div className="container-app flex flex-col items-center gap-3 py-6 text-xs text-smoke sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} {SITE.nameAr} — جميع الحقوق محفوظة</span>
          <div className="flex items-center gap-2">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-chip text-smoke transition hover:border-plum hover:text-plum"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href={SITE.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-chip text-smoke transition hover:border-plum hover:text-plum"
            >
              <Facebook className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-chip text-smoke transition hover:border-plum hover:text-plum"
            >
              <WhatsAppIcon size={15} />
            </a>
          </div>
          <span className="font-bold">{SITE.addressAr}</span>
        </div>
        <div className="border-t border-chip">
          <div className="container-app flex flex-col items-center justify-center gap-1 py-3 text-[11px] text-smoke/80 sm:flex-row sm:gap-3">
            <span>تطوير: <b className="text-plum">{SITE.developer.name}</b></span>
            <span dir="ltr" className="hidden text-champagne sm:inline">|</span>
            <a
              href={`https://wa.me/${SITE.developer.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              dir="ltr"
              className="font-bold text-plum underline-offset-4 hover:underline"
            >
              {SITE.developer.phone}
            </a>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  )
}
