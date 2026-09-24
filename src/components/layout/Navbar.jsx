import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Plane } from 'lucide-react'
import { cn } from '../../lib/utils'
import { SITE, waLink } from '../../config/site'

const LINKS = [
  { to: '/', label: 'الرئيسية' },
  { to: '/trips', label: 'الرحلات' },
  { to: '/visas', label: 'التأشيرات' },
  { to: '/flights', label: 'تذاكر الطيران' },
  { to: '/offers', label: 'العروض' },
  { to: '/about', label: 'عن ديالا' },
  { to: '/contact', label: 'تواصل معنا' },
]

export function Logo({ compact = false, dark = false }) {
  return (
    <Link to="/" className="group flex flex-col items-start leading-none" aria-label="ديالا - الرئيسية">
      <span className={cn('font-display text-2xl transition-colors lg:text-3xl', dark ? 'text-white' : 'text-ink')}>
        ديالا
      </span>
      <span className={cn('mt-1 font-latin text-[10px] tracking-[0.5em] transition-colors', dark ? 'text-gold-light' : 'text-gold-dark')}>
        DIALA
      </span>
      {!compact && null}
    </Link>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled && !open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          transparent
            ? 'bg-transparent'
            : 'border-b border-champagne bg-ivory/95 shadow-[0_1px_20px_rgba(16,28,54,0.05)] backdrop-blur'
        )}
      >
        <div className="container-site flex h-16 items-center justify-between gap-4 lg:h-20">
          <Logo dark={transparent} />

          <nav className="hidden items-center gap-7 lg:flex" aria-label="التنقل الرئيسي">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cn('nav-link', isActive && 'active', transparent && 'text-white/90 hover:text-white after:bg-gold-light')
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ButtonHrefCta transparent={transparent} />
            <button
              onClick={() => setOpen(!open)}
              className={cn(
                'btn-icon !border-transparent !bg-transparent lg:hidden',
                transparent ? 'text-white' : ''
              )}
              aria-label="القائمة"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* قائمة الهاتف */}
      <div
        className={cn(
          'fixed inset-0 z-40 flex flex-col bg-ivory pt-20 transition-all duration-500 lg:hidden',
          open ? 'visible opacity-100' : 'invisible opacity-0'
        )}
      >
        <nav className="flex flex-1 flex-col items-center justify-center gap-1 overflow-y-auto py-8">
          {LINKS.map((link, i) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={{ transitionDelay: open ? `${i * 60}ms` : '0ms' }}
              className={({ isActive }) =>
                cn(
                  'py-3 font-display text-3xl text-ink transition-all duration-500 hover:text-gold-dark',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
                  isActive && 'text-gold-dark'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mt-6 flex flex-col items-center gap-3">
            <Link to="/flights" className="btn-gold">
              <Plane className="h-4 w-4" />
              احجز الآن
            </Link>
            <a
              href={waLink(SITE.whatsapp, 'مرحباً، أرغب بالاستفسار عن خدماتكم')}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-smoke underline-offset-4 hover:underline"
            >
              تواصل عبر واتساب
            </a>
          </div>
        </nav>
      </div>
    </>
  )
}

function ButtonHrefCta({ transparent }) {
  return (
    <Link
      to="/flights"
      className={cn('btn btn-sm hidden md:inline-flex', transparent && 'bg-white text-ink hover:bg-gold hover:text-white')}
    >
      <Plane className="h-4 w-4" />
      احجز الآن
    </Link>
  )
}
