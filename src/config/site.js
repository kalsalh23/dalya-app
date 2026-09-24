/**
 * إعدادات الموقع المركزية — عدّل بيانات التواصل هنا فقط
 */
export const SITE = {
  nameAr: 'ديالا للسياحة والسفر',
  nameEn: 'DIALA Tourism & Travel',
  taglineAr: 'رحلتك تبدأ من هنا',
  sloganEn: 'Premium Travel Experience',
  addressAr: 'سوريا – طرطوس – شارع القصور',
  phoneDisplay: '0989351192',
  phone2Display: '0989351191',
  whatsapp: '963989351192', // 0989351192 بالصيغة الدولية لروابط واتساب
  whatsapp2: '963989351191', // 0989351191
  instagram: 'https://www.instagram.com/diala.travel',
  facebook: 'https://www.facebook.com/share/1DaeG49Ug1/',
  email: 'info@diala-travel.com',
  developer: {
    name: 'م. قصي مهند الصالح',
    phone: '0952639157',
    whatsapp: '963952639157',
  },
  currency: '$',
  siteUrl: 'https://dalya-app.vercel.app',
  mapEmbed:
    'https://maps.google.com/maps?q=%D8%B4%D8%A7%D8%B1%D8%B9%20%D8%A7%D9%84%D9%82%D8%B5%D9%88%D8%B1%20%D8%B7%D8%B1%D8%B7%D9%88%D8%B3&t=&z=15&ie=UTF8&iwloc=&output=embed',
  stats: [
    { value: '+1000', label: 'عميل سعيد' },
    { value: '+30', label: 'وجهة حول العالم' },
    { value: '+100', label: 'رحلة منظمة' },
    { value: '24/7', label: 'دعم ومتابعة' },
  ],
}

/** يبني رابط واتساب مع رسالة جاهزة (لا يرسل شيئاً تلقائياً) */
export const waLink = (phone = SITE.whatsapp, text = '') =>
  `https://wa.me/${phone.replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`
