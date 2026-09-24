export const STATUS_LABELS = {
  NEW: 'جديد',
  CONTACTED: 'تم التواصل',
  IN_PROGRESS: 'قيد المعالجة',
  CONFIRMED: 'مؤكد',
  COMPLETED: 'مكتمل',
  CANCELLED: 'ملغي',
}

export const STATUS_FLOW = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CONFIRMED', 'COMPLETED']

export const STATUS_COLORS = {
  NEW: 'bg-blue-100 text-blue-700 ring-blue-600/20',
  CONTACTED: 'bg-cyan-100 text-cyan-700 ring-cyan-600/20',
  IN_PROGRESS: 'bg-amber-100 text-amber-700 ring-amber-600/20',
  CONFIRMED: 'bg-violet-100 text-violet-700 ring-violet-600/20',
  COMPLETED: 'bg-emerald-100 text-emerald-700 ring-emerald-600/20',
  CANCELLED: 'bg-rose-100 text-rose-700 ring-rose-600/20',
}

export const REQUEST_TYPE_LABELS = {
  TRIP_BOOKING: 'حجز رحلة',
  FLIGHT_BOOKING: 'حجز تذكرة طيران',
  VISA_REQUEST: 'طلب تأشيرة',
  GENERAL_INQUIRY: 'استفسار عام',
}

export const CABIN_LABELS = {
  ECONOMY: 'درجة اقتصادية',
  BUSINESS: 'رجال أعمال',
  FIRST: 'الدرجة الأولى',
}

export const TRIP_TYPE_LABELS = {
  ONE_WAY: 'ذهاب فقط',
  ROUND_TRIP: 'ذهاب وعودة',
}

export const OFFER_TYPE_LABELS = {
  FLIGHT: 'عرض تذكرة',
  TRIP: 'عرض رحلة',
  DISCOUNT: 'خصم',
  SEASONAL: 'عرض موسمي',
}

export const SUCCESS_MESSAGE =
  'تم إرسال طلبك بنجاح، سيقوم فريق ديالا للسياحة والسفر بالتواصل معك لتأكيد الحجز.'

/** احتياطي للعروض الحصرية إذا كانت قاعدة البيانات فارغة */
export const FALLBACK_FLIGHT_OFFERS = [
  { id: 'fb-uae', title: 'طيران دمشق ← الإمارات', destination: 'الإمارات', new_price: 165, image_url: '/images/site/d-uae.jpg' },
  { id: 'fb-tr', title: 'طيران دمشق ← تركيا', destination: 'تركيا', new_price: 140, image_url: '/images/site/d-turkey.jpg' },
  { id: 'fb-de', title: 'طيران دمشق ← ألمانيا', destination: 'ألمانيا', new_price: 500, image_url: '/images/site/d-germany.jpg' },
  { id: 'fb-qa', title: 'طيران دمشق ← قطر', destination: 'قطر', new_price: 275, image_url: '/images/site/d-qatar.jpg' },
]
