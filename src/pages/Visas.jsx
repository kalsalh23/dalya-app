import { useEffect, useState } from 'react'
import { Clock, Globe2 } from 'lucide-react'
import { fetchVisas } from '../lib/data'
import { CardSkeletonGrid } from '../components/ui/Loader.jsx'
import { EmptyState } from '../components/ui/misc.jsx'
import { waVisa } from '../lib/wa'
import useReveal from '../hooks/useReveal.js'
import { fmtPrice } from '../lib/utils'
import { PageHeader } from '../components/layout/Layout.jsx'

/** بطاقة تأشيرة مختصرة: صف واحد أنيق */
function VisaCard({ visa, delay }) {
  return (
    <div className="card reveal flex items-center gap-3.5 p-4" style={{ transitionDelay: `${delay}ms` }}>
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-chip text-xl">
        {visa.flag || '🌍'}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-extrabold text-ink">{visa.country}</h3>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-smoke">
          <span className="truncate">{visa.visa_type}</span>
          {visa.processing_time && (
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Clock size={11} className="text-plum" />
              {visa.processing_time}
            </span>
          )}
        </p>
      </div>

      <div className="shrink-0 text-center">
        {visa.price != null && <p className="text-sm font-black text-plum">{fmtPrice(visa.price)}</p>}
        <a href={waVisa(visa)} target="_blank" rel="noreferrer" className="btn-soft btn-sm mt-1 !px-3.5 !py-1.5 text-[11px]">
          واتساب
        </a>
      </div>
    </div>
  )
}

export default function Visas() {
  const ref = useReveal()
  const [visas, setVisas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'خدمات التأشيرات | ديالا للسياحة والسفر'
    fetchVisas()
      .then(setVisas)
      .catch(() => setVisas([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div ref={ref} className="container-app pb-24 pt-2">
      <PageHeader title="خدمات التأشيرات" subtitle="نجهّز ملفك ونتابع طلبك حتى الموافقة — الطلب عبر واتساب" />

      <div className="mt-4">
        {loading ? (
          <CardSkeletonGrid count={6} cols="grid-cols-1 sm:grid-cols-2" height="h-20" />
        ) : visas.length === 0 ? (
          <EmptyState
            icon={Globe2}
            title="لا توجد دول متاحة حالياً"
            subtitle="يتم تحديث قائمة الدول باستمرار — تواصل معنا مباشرة للاستفسار عن أي دولة."
            action={<a href="/contact" className="btn-soft btn-sm">تواصل معنا</a>}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {visas.map((v, i) => (
              <VisaCard key={v.id} visa={v} delay={(i % 4) * 50} />
            ))}
          </div>
        )}

        <div className="mt-8 rounded-3xl border-2 border-chip bg-white p-5 text-center text-xs leading-6 text-smoke">
          الدولة التي تريدها غير موجودة في القائمة؟ ندرس أي وجهة —{' '}
          <a href="/contact" className="font-bold text-plum underline underline-offset-4">
            راسلنا وسنجيبك بكل التفاصيل
          </a>
        </div>
      </div>
    </div>
  )
}
