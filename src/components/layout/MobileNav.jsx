import { NavLink } from 'react-router-dom'
import { Home, Map, Plane, BadgePercent, Phone } from 'lucide-react'
import { cn } from '../../lib/utils'

const ITEMS = [
  { to: '/', label: 'الرئيسية', icon: Home, end: true },
  { to: '/trips', label: 'الرحلات', icon: Map },
  { to: '/flights', label: 'احجز', icon: Plane },
  { to: '/offers', label: 'العروض', icon: BadgePercent },
  { to: '/contact', label: 'تواصل', icon: Phone },
]

export default function MobileNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-champagne bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      aria-label="التنقل السفلي"
    >
      <div className="grid grid-cols-5">
        {ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors',
                isActive ? 'text-gold-dark' : 'text-smoke'
              )
            }
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
