import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Plane, Info } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import { SITE, waLink } from '../config/site'
import { WhatsAppIcon } from '../components/layout/icons.jsx'
import { PageHeader } from '../components/layout/Layout.jsx'

const DEALS = [
  ['الإمارات', 165],
  ['تركيا', 140],
  ['قطر', 275],
  ['ألمانيا', 500],
]

export default function Flights() {
  const [params] = useSearchParams()
  const promoTo = params.get('to') || ''
  const promoTitle = params.get('promo') || ''

  useEffect(() => {
    document.title = 'تذاكر الطيران | ديالا للسياحة والسفر'
  }, [])

  return (
    <div className="container-app pb-24 pt-2">
      <PageHeader title="تذاكر الطيران" subtitle="أفضل الأسعار من دمشق إلى وجهتك — الحجز عبر واتساب مباشرة" />

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {/* بطاقة الحجز عبر واتساب */}
        <div className="card p-6 lg:col-span-2">
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-chip text-plum">
              <Plane size={24} strokeWidth={1.8} />
            </span>
            <h2 className="mt-3 text-base font-extrabold text-ink">احجز تذكرتك عبر واتساب</h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-smoke">
              أرسل لنا وجهتك وتاريخ سفرك عبر واتساب، وسيتواصل معك فريق فوري خلال ساعات العمل
              بتأكيد السعر النهائي وإصدار التذكرة.
            </p>

            {promoTitle && (
              <div className="mx-auto mt-4 flex max-w-md items-center gap-2.5 rounded-2xl border-2 border-plum/20 bg-plum-soft px-4 py-3 text-xs font-bold text-plum">
                <Info size={16} className="shrink-0" />
                أنت تطلب العرض الحصري: {promoTitle} — سيُثبّت السعر عند التواصل.
              </div>
            )}

            <a
              href={waLink(
                SITE.whatsapp,
                `مرحباً ديالا للسياحة والسفر ✈️\nأرغب بحجز تذكرة طيران${promoTo ? `\nمن: دمشق\nإلى: ${promoTo}` : ''}${
                  promoTitle ? `\nبخصوص العرض: ${promoTitle}` : ''
                }\nأرجو تزويدي بالأسعار والمواعيد المتاحة.`
              )}
              target="_blank"
              rel="noreferrer"
              className="btn-gradient mx-auto mt-5"
            >
              <WhatsAppIcon size={17} />
              حجز تذكرة عبر واتساب
            </a>
            <p className="mt-3 text-[10px] text-smoke/80">
              يفتح واتساب برسالة جاهزة {promoTo ? `إلى ${promoTo} ` : ''}— أنت من يضغط إرسال.
            </p>
          </div>

          {/* كيف نعمل */}
          <div className="mt-6 grid gap-3 border-t border-chip pt-5 sm:grid-cols-3">
            {[
              ['أرسل طلبك', 'راسلنا بوجهتك وتاريخ سفرك'],
              ['نؤكد السعر', 'نعود إليك بأفضل الأسعار المتاحة'],
              ['تصلك تذكرتك', 'بعد التأكيد نُصدر التذكرة ونرسلها لك'],
            ].map(([t, d], i) => (
              <div key={t} className="rounded-2xl bg-chip/60 p-4 text-center">
                <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-plum text-[11px] font-black text-white">
                  {i + 1}
                </span>
                <h3 className="mt-2 text-xs font-extrabold text-ink">{t}</h3>
                <p className="mt-1 text-[10px] leading-5 text-smoke">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* أسعار حصرية */}
        <aside className="space-y-4">
          <div className="card overflow-hidden !rounded-3xl">
            <div className="bg-plum p-5 text-center text-white">
              <p className="text-[11px] font-bold text-white/75">EXCLUSIVE DEALS</p>
              <h3 className="mt-1 text-base font-black">أسعار حصرية من دمشق</h3>
            </div>
            <ul className="space-y-3 p-5 text-sm">
              {DEALS.map(([d, p]) => (
                <li key={d} className="flex items-center justify-between border-b border-chip pb-2.5 last:border-0">
                  <span className="text-smoke">دمشق ← {d}</span>
                  <span className="font-black text-plum">{p}$</span>
                </li>
              ))}
            </ul>
            <p className="px-5 pb-4 text-[10px] leading-5 text-smoke/80">
              * الأسعار قابلة للتغيير حسب توفر المقاعد وتاريخ السفر.
            </p>
          </div>

          <div className="card p-5 text-center text-xs leading-6 text-smoke">
            تفضّل الحديث مباشرة؟
            <Button href={waLink(SITE.whatsapp, 'مرحباً، أرغب بحجز تذكرة طيران')} variant="soft" size="sm" className="mt-3 w-full">
              <WhatsAppIcon size={15} />
              واتساب مباشر
            </Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
