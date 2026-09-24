import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, ChevronRight, ChevronLeft, ClipboardList } from 'lucide-react'
import { fetchUnifiedRequests } from '../../lib/data'
import { REQUEST_TYPE_LABELS, STATUS_LABELS } from '../../lib/constants'
import { StatusBadge } from '../../components/ui/misc.jsx'
import { InputLight, SelectLight } from '../../components/ui/forms.jsx'
import { Spinner } from '../../components/ui/Loader.jsx'
import { fmtDate, shortId } from '../../lib/utils'

const PAGE_SIZE = 15

export default function Requests() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const [rows, setRows] = useState([])
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const search = params.get('search') || ''
  const type = params.get('type') || ''
  const status = params.get('status') || ''
  const order = params.get('order') || 'desc'

  const [searchInput, setSearchInput] = useState(search)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const { rows, count } = await fetchUnifiedRequests({
        search,
        type,
        status,
        ascending: order === 'asc',
        from: page * PAGE_SIZE,
        to: page * PAGE_SIZE + PAGE_SIZE - 1,
      })
      setRows(rows)
      setCount(count)
    } catch {
      setRows([])
      setCount(0)
    } finally {
      setLoading(false)
    }
  }, [search, type, status, order, page])

  useEffect(() => {
    document.title = 'الطلبات | لوحة التحكم'
    load()
  }, [load])

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0)
      const next = new URLSearchParams(params)
      if (searchInput) next.set('search', searchInput)
      else next.delete('search')
      setParams(next, { replace: true })
    }, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setPage(0)
    setParams(next, { replace: true })
  }

  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-gray-900">الطلبات</h1>
          <p className="mt-1 text-sm text-gray-500">كل الطلبات الواردة من الموقع — {count} طلب</p>
        </div>
      </div>

      {/* الفلاتر */}
      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <InputLight
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف..."
            className="!pr-9"
          />
        </div>
        <SelectLight value={type} onChange={(e) => setFilter('type', e.target.value)}>
          <option value="">كل الأنواع</option>
          {Object.entries(REQUEST_TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </SelectLight>
        <SelectLight value={status} onChange={(e) => setFilter('status', e.target.value)}>
          <option value="">كل الحالات</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </SelectLight>
        <SelectLight value={order} onChange={(e) => setFilter('order', e.target.value)}>
          <option value="desc">الأحدث أولاً</option>
          <option value="asc">الأقدم أولاً</option>
        </SelectLight>
      </div>

      {/* الجدول */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <ClipboardList size={40} className="text-gray-300" />
            <p className="font-bold text-gray-600">لا توجد طلبات مطابقة</p>
            <p className="text-sm text-gray-400">جرّب تعديل البحث أو الفلاتر</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-500">
                  <th className="px-4 py-3 text-right font-bold">رقم الطلب</th>
                  <th className="px-4 py-3 text-right font-bold">العميل</th>
                  <th className="px-4 py-3 text-right font-bold">النوع</th>
                  <th className="px-4 py-3 text-right font-bold">الهاتف</th>
                  <th className="px-4 py-3 text-right font-bold">التاريخ</th>
                  <th className="px-4 py-3 text-right font-bold">الحالة</th>
                  <th className="px-4 py-3 text-right font-bold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.request_type + r.id}
                    onClick={() => navigate(`/admin/requests/${r.request_type}/${r.id}`)}
                    className="cursor-pointer border-b border-gray-50 transition hover:bg-chip/50"
                  >
                    <td className="px-4 py-3.5 font-mono text-xs font-bold text-gray-500">#{shortId(r.id)}</td>
                    <td className="px-4 py-3.5 font-bold text-gray-800">{r.customer_name}</td>
                    <td className="px-4 py-3.5 text-gray-600">{REQUEST_TYPE_LABELS[r.request_type]}</td>
                    <td className="px-4 py-3.5 text-gray-600" dir="ltr">{r.phone || '—'}</td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">{fmtDate(r.created_at)}</td>
                    <td className="px-4 py-3.5"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/admin/requests/${r.request_type}/${r.id}`)
                        }}
                        className="rounded-full bg-plum px-3 py-1.5 text-xs font-bold text-white transition hover:bg-plum-dark"
                      >
                        التفاصيل
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ترقيم الصفحات */}
        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <span className="text-xs text-gray-400">
              صفحة {page + 1} من {pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                aria-label="السابق"
              >
                <ChevronRight size={16} />
              </button>
              <button
                disabled={page >= pages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
                aria-label="التالي"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
