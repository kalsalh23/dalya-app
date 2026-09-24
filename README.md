# DIALA Tourism & Travel — مؤسسة ديالا للسياحة والسفر

منصة سياحة وسفر متكاملة (Web App) لمؤسسة ديالا للسياحة والسفر — طرطوس، شارع القصور.

✈️ تذاكر الطيران • 🛂 التأشيرات • 🌍 الرحلات السياحية • 🧳 برامج السفر والعروض

## المزايا

- **واجهة عربية RTL بالكامل** بهوية بصرية كحلي/ذهبي فاخرة، Mobile-First مع Bottom Navigation للهاتف.
- **صفحات عامة**: الرئيسية، الرحلات (+ تفاصيل رحلة ببرنامج يوم بيوم ومعرض صور)، طلب تذكرة طيران، التأشيرات، العروض، عن المؤسسة، التواصل (مع خريطة Google).
- **نظام طلبات موحد**: حجز رحلة / تذكرة طيران / تأشيرة / استفسار عام — يُحفظ في Supabase ويظهر فوراً في لوحة التحكم.
- **لوحة تحكم `/admin`**: إحصائيات ورسوم بيانية، إدارة كاملة للرحلات والتأشيرات والعروض (إضافة/تعديل/حذف/نشر)، جدول طلبات مع بحث وفلاتر وترقيم صفحات، صفحة تفاصيل طلب مع Timeline لتغيير الحالة وزر «تواصل عبر WhatsApp» برسالة جاهزة.
- **إشعارات فورية** في اللوحة عند وصول أي طلب أو تغيير حالة (Supabase Realtime).
- **أمان**: Row Level Security على كل الجداول — الزائر يقرأ المحتوى المنشور فقط ويرسل الطلبات، وبيانات العملاء لا تُعرض إلا للأدمن.
- **SEO**: Meta/OG/Twitter، Schema.org TravelAgency، sitemap.xml، robots.txt، favicon.

## التقنيات

React 18 + Vite + Tailwind CSS • Supabase (PostgreSQL + Auth + Storage + Realtime) • Recharts • react-hot-toast • lucide-react

## التشغيل محلياً

```bash
npm install
cp .env.example .env   # ثم املأ VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY
npm run dev
```

البناء للإنتاج: `npm run build` ثم `npm run preview`.

## متغيرات البيئة

| المتغير | الوصف |
|---|---|
| `VITE_SUPABASE_URL` | رابط مشروع Supabase |
| `VITE_SUPABASE_ANON_KEY` | المفتاح العام (anon) — آمن للواجهة بفضل RLS |

> مفاتيح الإدارة (service_role / access tokens) لا تُوضع في الواجهة أبداً.

## قاعدة البيانات (Supabase)

الجداول: `profiles, trips, trip_gallery, trip_itinerary, visas, offers, booking_requests, flight_requests, visa_requests, contact_messages, notifications, request_events` + عرض موحّد `requests_unified`.

- سكربتات SQL في `supabase/sql/`: `01_schema.sql` (الجداول والـ Triggers وRealtime) ثم `02_policies.sql` (RLS) ثم `03_seed.sql` (بيانات أولية).
- Triggers تلقائية: إنشاء إشعار عند كل طلب جديد، إشعار وتسجيل حدث عند تغيير حالة طلب.
- Storage: bucket عام باسم `media` لصور الرحلات/العروض/التأشيرات.

## النشر على Vercel

1. ارفع المستودع إلى GitHub.
2. في Vercel: New Project ← اختر المستودع (Framework: Vite).
3. أضف متغيري البيئة `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY`.
4. انشر — ملف `vercel.json` مهيأ مسبقاً لـ SPA rewrite.

بعد معرفة الدومين النهائي، حدّث `site_url` في Supabase Auth وروابط sitemap/OG في `index.html`.

## تخصيص بيانات المؤسسة

كل بيانات التواصل (هاتف، واتساب، إنستغرام، بريد، خريطة) في مكان واحد: `src/config/site.js`.

## إضافة إنجليزية مستقبلاً

النصوص مركزية نسبياً ويمكن نقلها إلى ملف ترجمة (`src/lib/i18n`) — البنية جاهزة لذلك.
