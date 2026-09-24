import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList, Sparkles, Plane, Map, Stamp, MessageSquare, MapPinned, BadgePercent,
  ArrowLeft, TrendingUp,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts'
import { fetchUnifiedRequests, adminFetchTrips, adminFetchOffers } from '../../lib/data'
import { REQUEST_TYPE_LABELS, STATUS_LABELS } from '../../lib/constants'
import { StatusBadge } from '../../components/ui/misc.jsx'
import { Spinner } from '../../components/ui/Loader.jsx'
import { fmtDate, shortId, timeAgo } from '../../lib/utils'

const TYPE_COLORS = ['#4A1F52', '#6D3B75', '#B98CC7', '#10B981']
const STATUS_COLORS = { NEW: '#3B82F6', CONTACTED: '#06B6D4', IN_PROGRESS: '#F59E0B', CONFIRMED: '#4A1F52', COMPLETED: '#10B981', CANCELLED: '#F43F5E' }

export default function Dashboard() {
  const [rows, setRows] = useState([])
  const [trips, setTrips] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'لوحة القيادة | ديالا للسياحة والسفر'
    Promise.allSettled([fetchUnifiedRequests({ to: 999 }), adminFetchTrips(), adminFetchOffers()])
      .then(([r, t, o]) => {
        setRows(r.status === 'fulfilled' ? r.value.rows : [])
        setTrips(t.status === 'fulfilled' ? t.value : [])
        setOffers(o.status === 'fulfilled' ? o.value : [])
      })
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const byType = {}
    const byStatus = {}
    rows.forEach((r) => {
      byType[r.request_type] = (byType[r.request_type] || 0) + 1
      byStatus[r.status] = (byStatus[r.status] || 0) + 1
    })
    return {
      total: rows.length,
      fresh: rows.filter((r) => r.status === 'NEW').length,
      byType,
      byStatus,
      activeTrips: trips.filter((t) => t.status === 'PUBLISHED').length,
      activeOffers: offers.filter((o) => o.is_active).length,
    }
  }, [rows, trips, offers])

  const daily = useMemo(() => {
    const days = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      days.push({
        key,
        name: `${d.getDate()}/${d.getMonth() + 1}`,
        count: rows.filter((r) => String(r.created_at).slice(0, 10) === key).length,
      })
    }
    return days
  }, [rows])

  const pieData = useMemo(
    () =>
      Object.entries(stats.byType).map(([k, v]) => ({
        name: REQUEST_TYPE_LABELS[k] || k,
        value: v,
      })),
    [stats]
  )

  const barData = useMemo(
    () =>
      Object.entries(stats.byStatus).map(([k, v]) => ({
        name: STATUS_LABELS[k] || k,
        value: v,
        status: k,
      })),
    [stats]
  )

  if (loading) return <Spinner fullscreen />

  const cards = [
    { icon: ClipboardList, label: 'إجمالي الطلبات', value: stats.total, color: 'bg-plum' },
    { icon: Sparkles, label: 'طلبات جديدة', value: stats.fresh, color: 'bg-rose-500', link: '/admin/requests?status=NEW' },
    { icon: Map, label: 'حجوزات الرحلات', value: stats.byType.TRIP_BOOKING || 0, color: 'bg-emerald-500' },
    { icon: Plane, label: 'طلبات الطيران', value: stats.byType.FLIGHT_BOOKING || 0, color: 'bg-blue-500' },
    { icon: Stamp, label: 'طلبات التأشيرات', value: stats.byType.VISA_REQUEST || 0, color: 'bg-amber-500' },
    { icon: MessageSquare, label: 'استفسارات عامة', value: stats.byType.GENERAL_INQUIRY || 0, color: 'bg-violet-500' },
    { icon: MapPinned, label: 'رحلات منشورة', value: stats.activeTrips, color: 'bg-cyan-600', link: '/admin/trips' },
    { icon: BadgePercent, label: 'عروض نشطة', value: stats.activeOffers, color: 'bg-plum', link: '/admin/offers' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold text-gray-900">لوحة القيادة</h1>
        <p className="mt-1 text-sm text-gray-500">نظرة عامة على أداء المنصة والطلبات الواردة</p>
      </div>

      {/* بطاقات الإحصائيات */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const inner = (
            <>
              <div className="flex items-center justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${c.color}`}>
                  <c.icon size={20} />
                </span>
                <span className="font-display text-3xl font-black text-gray-900">{c.value}</span>
              </div>
              <p className="mt-3 text-xs font-medium text-gray-500">{c.label}</p>
            </>
          )
          return c.link ? (
            <Link key={c.label} to={c.link} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-plum/30 hover:shadow-md">
              {inner}
            </Link>
          ) : (
            <div key={c.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              {inner}
            </div>
          )
        })}
      </div>

      {/* الرسوم البيانية */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-gray-800">
            <TrendingUp size={18} className="text-plum" />
            الطلبات اليومية — آخر 14 يوماً
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={daily} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4A1F52" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="#4A1F52" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} reversed />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} orientation="right" />
              <Tooltip contentStyle={{ fontFamily: 'Tajawal', borderRadius: 12, border: '1px solid #E5E7EB' }} />
              <Area type="monotone" dataKey="count" name="الطلبات" stroke="#4A1F52" strokeWidth={2.5} fill="url(#goldFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-bold text-gray-800">الطلبات حسب النوع</h3>
          {pieData.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-400">لا توجد بيانات بعد</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontFamily: 'Tajawal', borderRadius: 12 }} />
                <Legend wrapperStyle={{ fontFamily: 'Tajawal', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-bold text-gray-800">الطلبات حسب الحالة</h3>
          {barData.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-400">لا توجد بيانات بعد</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} reversed />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} orientation="right" />
                <Tooltip contentStyle={{ fontFamily: 'Tajawal', borderRadius: 12 }} />
                <Bar dataKey="value" name="الطلبات" radius={[8, 8, 0, 0]}>
                  {barData.map((d) => (
                    <Cell key={d.status} fill={STATUS_COLORS[d.status] || '#6D3B75'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* أحدث الطلبات */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">أحدث الطلبات</h3>
            <Link to="/admin/requests" className="inline-flex items-center gap-1 text-xs font-bold text-plum hover:underline">
              كل الطلبات
              <ArrowLeft size={13} />
            </Link>
          </div>
          {rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">لا توجد طلبات بعد — ستظهر هنا فور وصول أول طلب</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-400">
                    <th className="px-2 py-2 text-right font-medium">العميل</th>
                    <th className="px-2 py-2 text-right font-medium">النوع</th>
                    <th className="px-2 py-2 text-right font-medium">الحالة</th>
                    <th className="px-2 py-2 text-right font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 6).map((r) => (
                    <tr key={r.request_type + r.id} className="border-b border-gray-50 transition hover:bg-gray-50">
                      <td className="px-2 py-3">
                        <Link to={`/admin/requests/${r.request_type}/${r.id}`} className="font-bold text-gray-800 hover:text-plum">
                          {r.customer_name}
                        </Link>
                        <span className="block text-[10px] text-gray-400">#{shortId(r.id)}</span>
                      </td>
                      <td className="px-2 py-3 text-gray-600">{REQUEST_TYPE_LABELS[r.request_type]}</td>
                      <td className="px-2 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-2 py-3 text-xs text-gray-400">{timeAgo(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
