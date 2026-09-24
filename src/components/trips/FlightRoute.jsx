import { Clock } from 'lucide-react'

/** أعلام الدول + أزمنة الطيران التقديرية من دمشق */
const COUNTRY_FLAGS = {
  تركيا: '🇹🇷', الإمارات: '🇦🇪', قطر: '🇶🇦', ألمانيا: '🇩🇪', مصر: '🇪🇬', الأردن: '🇯🇴',
  لبنان: '🇱🇧', العراق: '🇮🇶', الكويت: '🇰🇼', السعودية: '🇸🇦', عمان: '🇴🇲', عُمان: '🇴🇲',
  البحرين: '🇧🇭', قبرص: '🇨🇾', اليونان: '🇬🇷', ماليزيا: '🇲🇾', المالديف: '🇲🇻', تونس: '🇹🇳',
  الجزائر: '🇩🇿', إيطاليا: '🇮🇹', فرنسا: '🇫🇷', السويد: '🇸🇪', هولندا: '🇳🇱',
}

const FLIGHT_TIMES = {
  تركيا: 'ساعتان و15 دقيقة',
  الإمارات: '3 ساعات و30 دقيقة',
  قطر: 'ساعتان و45 دقيقة',
  ألمانيا: '4 ساعات و15 دقيقة',
  مصر: 'ساعة و45 دقيقة',
  الأردن: 'ساعة واحدة تقريباً',
  لبنان: 'ساعة واحدة تقريباً',
  العراق: 'ساعة و30 دقيقة',
  الكويت: 'ساعتان و30 دقيقة',
  السعودية: 'ساعتان و30 دقيقة',
  عمان: '3 ساعات و30 دقيقة',
  عُمان: '3 ساعات و30 دقيقة',
  البحرين: '3 ساعات',
  قبرص: 'ساعة و30 دقيقة',
  اليونان: 'ساعتان و30 دقيقة',
  ماليزيا: '9 ساعات',
  المالديف: '7 ساعات و30 دقيقة',
  تونس: '3 ساعات',
  الجزائر: '4 ساعات',
}

/** بطاقة مسار الرحلة: سوريا ← الوجهة بخط طيران والوقت المقدر */
export default function FlightRoute({ destination }) {
  const destFlag = COUNTRY_FLAGS[destination] || '🌍'
  const time = FLIGHT_TIMES[destination] || '3 ساعات تقريباً'

  return (
    <section className="card p-5 sm:p-6">
      <h2 className="mb-4 text-center text-base font-extrabold text-ink">مسار الرحلة</h2>

      <div className="flex items-center justify-between gap-1 sm:gap-3">
        {/* المغادرة */}
        <div className="shrink-0 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-chip text-2xl sm:h-14 sm:w-14">
            🇸🇾
          </span>
          <p className="mt-1.5 text-xs font-extrabold text-ink sm:text-sm">سوريا</p>
          <p className="text-[10px] text-smoke">المغادرة · دمشق</p>
        </div>

        {/* الخط والوقت */}
        <div className="relative h-16 flex-1 px-1">
          <div className="absolute inset-x-0 top-1/2 border-t-2 border-dashed border-plum/35" />
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-plum text-base text-white shadow-lg shadow-plum/30">
            ✈️
          </span>
          <p className="absolute inset-x-0 top-0 flex items-center justify-center gap-1 whitespace-nowrap text-center text-[10px] font-bold text-plum sm:text-[11px]">
            <Clock size={11} />
            الوقت المقدر ≈ {time}
          </p>
        </div>

        {/* الوصول */}
        <div className="shrink-0 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-chip text-2xl sm:h-14 sm:w-14">
            {destFlag}
          </span>
          <p className="mt-1.5 text-xs font-extrabold text-ink sm:text-sm">{destination}</p>
          <p className="text-[10px] text-smoke">الوصول</p>
        </div>
      </div>

      <p className="mt-3 text-center text-[10px] leading-5 text-smoke/70">
        * أوقات الطيران تقديرية للرحلة المباشرة وتختلف حسب الخط الجوي والمحطات.
      </p>
    </section>
  )
}
