import { useState } from 'react'
import { NavLink, Link, Outlet, useNavigate, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Map, Stamp, BadgePercent, LogOut,
  Bell, ExternalLink, Plane, Menu, X, MapPin, MessageSquare, Stamp as VisaIcon,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.jsx'
import { NotificationsProvider, useNotifications } from '../../hooks/useNotifications.jsx'
import { Spinner } from '../../components/ui/Loader.jsx'
import Button from '../../components/ui/Button.jsx'
import { cn, timeAgo } from '../../lib/utils'
import { REQUEST_TYPE_LABELS } from '../../lib/constants'
import { SITE } from '../../config/site'

const NAV = [
  { to: '/admin', label: 'لوحة القيادة', icon: LayoutDashboard, end: true },
  { to: '/admin/requests', label: 'الطلبات', icon: ClipboardList },
  { to: '/admin/trips', label: 'الرحلات', icon: Map },
  { to: '/admin/visas', label: 'التأشيرات', icon: Stamp },
  { to: '/admin/offers', label: 'العروض', icon: BadgePercent },
]

function NotifIcon({ type }) {
  if (type === 'FLIGHT_BOOKING') return <Plane size={16} className="text-blue-500" />
  if (type === 'TRIP_BOOKING') return <MapPin size={16} className="text-emerald-500" />
  if (type === 'VISA_REQUEST') return <VisaIcon size={16} className="text-amber-500" />
  if (type === 'GENERAL_INQUIRY') return <MessageSquare size={16} className="text-violet-500" />
  return <ClipboardList size={16} className="text-gray-500" />
}

function NotificationsBell() {
  const { items, unreadCount, open, setOpen, markRead, markAll } = useNotifications()
  const navigate = useNavigate()

  const onItem = async (n) => {
    await markRead(n)
    setOpen(false)
    if (n.request_type && n.request_id) {
      navigate(`/admin/requests/${n.request_type}/${n.request_id}`)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 text-gray-500 transition hover:bg-gray-100"
        aria-label="الإشعارات"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -left-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-gray-200 bg-white shadow-xl sm:w-96">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <h3 className="font-bold text-gray-800">الإشعارات</h3>
              {unreadCount > 0 && (
                <button onClick={markAll} className="text-xs font-bold text-plum hover:underline">
                  تعليم الكل كمقروء
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {items.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-gray-400">لا توجد إشعارات بعد</p>
              ) : (
                items.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => onItem(n)}
                    className={cn(
                      'flex w-full items-start gap-3 border-b border-gray-50 px-4 py-3 text-right transition hover:bg-gray-50',
                      !n.is_read && 'bg-chip/60'
                    )}
                  >
                    <span className="mt-0.5 rounded-full bg-gray-100 p-2">
                      <NotifIcon type={n.request_type} />
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800">{n.title}</span>
                        {!n.is_read && <span className="h-2 w-2 rounded-full bg-rose-500" />}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">{n.body}</span>
                      <span className="mt-1 block text-[10px] text-gray-400">
                        {timeAgo(n.created_at)}
                        {n.request_type ? ` • ${REQUEST_TYPE_LABELS[n.request_type]}` : ''}
                      </span>
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function AdminShell() {
  const { profile, isStaff, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!isStaff) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-50 p-6 text-center">
        <h1 className="font-display text-2xl font-bold text-gray-800">غير مصرّح بالدخول</h1>
        <p className="max-w-sm text-sm text-gray-500">
          حسابك ({profile?.full_name || profile?.role}) لا يملك صلاحية الوصول إلى لوحة التحكم.
        </p>
        <Button variant="secondary" onClick={signOut}>
          تسجيل الخروج
        </Button>
      </div>
    )
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-plum">
      <Link to="/" className="flex items-center gap-2.5 border-b border-white/10 px-5 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
          <Plane size={18} className="text-white" strokeWidth={2.5} />
        </span>
        <span className="leading-tight">
          <span className="font-latin block !tracking-[0.3em] text-white font-display text-lg font-black tracking-widest">DIALA</span>
          <span className="block text-[10px] text-white/50">لوحة التحكم</span>
        </span>
      </Link>

      <nav className="flex-1 space-y-1 p-4">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition',
                isActive ? 'bg-white/15 text-white ring-1 ring-white/30' : 'text-white/60 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <n.icon size={18} />
            {n.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Link
          to="/"
          className="mb-2 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-white/50 transition hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={16} />
          عرض الموقع
        </Link>
        <button
          onClick={async () => {
            await signOut()
            navigate('/admin/login')
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-rose-400/90 transition hover:bg-rose-500/10"
        >
          <LogOut size={16} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* الشريط الجانبي - سطح المكتب */}
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

      {/* الشريط الجانبي - الهاتف */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-plum-dark/70" onClick={() => setMenuOpen(false)} />
          <aside className="absolute inset-y-0 right-0 w-72">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:mr-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="القائمة"
          >
            <Menu size={22} />
          </button>
          <div className="hidden items-center gap-2 text-sm text-gray-500 lg:flex">
            <span className="font-bold text-gray-800">{SITE.nameAr}</span>
            <span className="text-gray-300">|</span>
            لوحة إدارة المحتوى والطلبات
          </div>
          <div className="flex items-center gap-2">
            <NotificationsBell />
            <span className="hidden text-sm text-gray-600 sm:block">{profile?.full_name || 'الأدمن'}</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white font-display text-sm font-black text-plum">
              {(profile?.full_name || 'A').charAt(0)}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const { session, loading } = useAuth()

  if (loading) return <div className="min-h-screen bg-gray-50"><Spinner fullscreen /></div>
  if (!session) return <Navigate to="/admin/login" replace />

  return (
    <NotificationsProvider>
      <AdminShell />
    </NotificationsProvider>
  )
}
