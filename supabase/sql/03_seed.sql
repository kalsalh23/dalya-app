-- =============================================================
-- DIALA Tourism & Travel — Seed data
-- =============================================================

-- ---------- عروض الرحلات الحصرية (أسعار تذاكر من دمشق) ----------
insert into public.offers (title, description, image_url, offer_type, destination, new_price, start_date, end_date, is_active)
select v.title, v.description, v.image_url, 'FLIGHT', v.destination, v.new_price, current_date, current_date + 120, true
from (values
  ('طيران دمشق ← الإمارات',
   E'عرض حصري لتذاكر الطيران من دمشق إلى الإمارات بسعر 165$ فقط.\nاحجز مقعدك الآن مع ديالا للسياحة والسفر — المقاعد محدودة.',
   'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
   'الإمارات', 165),
  ('طيران دمشق ← تركيا',
   E'عرض حصري لتذاكر الطيران من دمشق إلى تركيا بسعر 140$ فقط.\nإسطنبول على بعد خطوات منك مع ديالا للسياحة والسفر.',
   'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1600&q=80',
   'تركيا', 140),
  ('طيران دمشق ← ألمانيا',
   E'عرض حصري لتذاكر الطيران من دمشق إلى ألمانيا بسعر 500$ فقط.\nتواصل معنا لحجز تذكرتك مع ديالا للسياحة والسفر.',
   'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1600&q=80',
   'ألمانيا', 500),
  ('طيران دمشق ← قطر',
   E'عرض حصري لتذاكر الطيران من دمشق إلى قطر بسعر 275$ فقط.\nالدوحة بانتظارك — احجز عبر ديالا للسياحة والسفر.',
   'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=1600&q=80',
   'قطر', 275)
) as v(title, description, image_url, destination, new_price)
where not exists (select 1 from public.offers o where o.offer_type = 'FLIGHT' and o.title = v.title);

-- ---------- رحلات تجريبية ----------
insert into public.trips (title, destination, main_image_url, start_date, end_date, duration_days, price, available_seats, short_description, description, included, excluded, notes, status, featured)
select * from (values
  (
    'إسطنبول وطرابزون — 7 أيام',
    'تركيا',
    'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1600&q=80',
    current_date + 30, current_date + 37, 7, 450.00, 20,
    'جولة مميزة تجمع بين سحر إسطنبول وطبيعة طرابزون الخلابة.',
    E'رحلة سياحية شاملة تجمع بين أهم معالم إسطنبول التاريخية (آيا صوفيا، السلطان أحمد، البازار الكبير) وأجمل مناطق طرابزون الطبيعية (أوزون غول، سيرالان، الغابات الخضراء).\nإقامة في فنادق فاخرة مع إفطار، تنقلات خاصة مكيّفة، ومرشد عربي مرافق.',
    ARRAY['تذاكر الطيران ذهاباً وعودة','الإقامة في فنادق 4 نجوم مع الإفطار','جميع التنقلات الداخلية','مرشد عربي مرافق','تأمين سفر'],
    ARRAY['الوجبات الغذائية غير المذكورة','المصاريف الشخصية','مداخل المعالم السياحية','تأشيرة الدخول إن لزم'],
    'يجب أن يكون جواز السفر صالحاً لمدة 6 أشهر على الأقل.',
    'PUBLISHED', true
  ),
  (
    'دبي والشارقة — 5 أيام',
    'الإمارات',
    'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
    current_date + 45, current_date + 50, 5, 620.00, 15,
    'تعالج بين عالمية دبي وهدوء الشارقة في رحلة لا تُنسى.',
    E'برنامج سياحي متكامل يشمل برج خليفة، دبي مول، النخلة جميرا، متحف الشارقة، وسوق الجمعة المركزي.\nرحلة بحرية عصرية في مرسى دبي مع عشاء مفتوح.',
    ARRAY['تذاكر الطيران ذهاباً وعودة','الإقامة مع الإفطار','تأشيرة الإمارات','جميع التنقلات','جولة بحرية مع عشاء'],
    ARRAY['المصاريف الشخصية','مداخل برج خليفة','الوجبات غير المذكورة'],
    'الأسعار خاضعة للتغيير حسب تاريخ الحجز.',
    'PUBLISHED', true
  ),
  (
    'المالديف — عسل الشهر',
    'المالديف',
    'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1600&q=80',
    current_date + 60, current_date + 66, 6, 1250.00, 10,
    'أجمل جزر المالديف في رحلة عسل مثالية على جزيرة خاصة.',
    E'إقامة في منتجع فاخر على الماء، رحلة قارب للغوص والسنوركلينغ، عشاء رومانسي على الشاطئ، ونقل خاص من المطار.',
    ARRAY['الطيران ذهاباً وعودة','منتجع 5 نجوم على الماء','إفطار وعشاء','رحلات بحرية وسنوركلينغ','نقل خاص من وإلى المطار'],
    ARRAY['الأنشطة المائية الإضافية','المصاريف الشخصية'],
    'الحجز المسبق مطلوب قبل شهر على الأقل.',
    'PUBLISHED', true
  ),
  (
    'أوروبا الكلاسيكية — ألمانيا وهولندا',
    'ألمانيا',
    'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1600&q=80',
    current_date + 90, current_date + 99, 10, 1400.00, 12,
    'رحلة شاملة بين برلين وأمستردام وراين الفلاحي.',
    E'برنامج أوروبي متكامل: برلين، كولونيا، أمستردام وقنواتها، وقرى هولندا الخلابة. إقامة في فنادق مركزية مع تحركات قطارات سريعة.',
    ARRAY['الطيران داخلي وأوروبي','الإقامة مع الإفطار','تحركات القطار','مرشد مرافق'],
    ARRAY['التأشيرة الشنغن','المصاريف الشخصية','الوجبات غير المذكورة'],
    'يستلزم موافقة تأشيرة شنغن قبل الحجز النهائي.',
    'DRAFT', false
  )
) as v
where not exists (select 1 from public.trips);

-- gallery للرحلات
insert into public.trip_gallery (trip_id, image_url, sort_order)
select t.id, u.url, u.ord
from public.trips t
join (values
  ('تركيا', 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=1200&q=80', 0),
  ('تركيا', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80', 1),
  ('الإمارات', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', 0),
  ('الإمارات', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 1),
  ('المالديف', 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80', 0),
  ('المالديف', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 1)
) as u(dest, url, ord) on u.dest = t.destination
where not exists (select 1 from public.trip_gallery);

-- برنامج الرحلة
insert into public.trip_itinerary (trip_id, day_number, title, description)
select t.id, i.day_number, i.title, i.description
from public.trips t
join (values
  ('تركيا', 1, 'الوصول إلى إسطنبول', 'استقبال من المطار والانتقال إلى الفندق، جولة مسائية على البوسفور.'),
  ('تركيا', 2, 'معالم إسطنبول', 'زيارة آيا صوفيا والمسجد الأزرق والبازار الكبير.'),
  ('تركيا', 3, 'الانتقال إلى طرابزون', 'تحرك بري إلى طرابزون وتسكن في الفندق الجبلي.'),
  ('تركيا', 4, 'أوزون غول', 'يوم كامل في بحيرة أوزون غول وقرى الجبال.'),
  ('تركيا', 5, 'سيرالان وأيدر', 'جولة هضبة سيرالان وبحيرة أيدر الشهيرة.'),
  ('الإمارات', 1, 'الوصول إلى دبي', 'استقبال والانتقال للفندق، نزهة مسائية في دبي مول.'),
  ('الإمارات', 2, 'دبي المدينة', 'برج خليفة، النخلة جميرا، ومتحف المستقبل.'),
  ('الإمارات', 3, 'الشارقة', 'جولة في الشارقة وسوق الجمعة والمتحف الإسلامي.'),
  ('الإمارات', 4, 'رحلة بحرية', 'عشاء مفتوح في رحلة بحرية على مرسى دبي.'),
  ('المالديف', 1, 'الوصول', 'استقبال خاص وقارب سريع إلى المنتجع.'),
  ('المالديف', 2, 'استرخاء', 'يوم حر على الشاطئ الخاص مع سنوركلينغ.'),
  ('المالديف', 3, 'رحلة بحرية', 'غوص ومشاهدة الدلافين مع عشاء رومانسي.')
) as i(dest, day_number, title, description) on i.dest = t.destination
where not exists (select 1 from public.trip_itinerary);

-- ---------- التأشيرات ----------
insert into public.visas (country, flag, visa_type, processing_time, requirements, price, notes, is_active)
select v.country, v.flag, v.visa_type, v.processing_time, v.requirements, v.price, v.notes, true
from (values
  ('تركيا', '🇹🇷', 'سياحية (زيارة واحدة)', '5 – 10 أيام عمل',
   ARRAY['جواز سفر صالح لمدة 6 أشهر','صورة شخصية بخلفية بيضاء','كشف حساب بنكي أو إثبات دخل','حجز فندقي وتذكرة طيران'], 
   45.00::numeric, 'يمكن للمواطنين السوريين التقديم عبر القنصلية مع موعد مسبق.', true),
  ('الإمارات', '🇦🇪', 'سياحية إلكترونية', '3 – 5 أيام عمل',
   ARRAY['جواز سفر صالح لمدة 6 أشهر','صورة شخصية واضحة','نسخة من الهوية الشخصية'], 
   70.00::numeric, 'تُصدر إلكترونياً دون حاجة لمقابلة.', true),
  ('قطر', '🇶🇷', 'سياحية / ETA', '3 – 7 أيام عمل',
   ARRAY['جواز سفر صالح لمدة 6 أشهر','صورة شخصية','إثبات حجز فندقي'], 
   55.00::numeric, 'تساعدك بخدمة حجز الفندق والتأمين عند الحاجة.', true),
  ('ألمانيا (شنغن)', '🇩🇪', 'زيارة قصيرة شنغن', '15 – 30 يوم عمل',
   ARRAY['جواز سفر صالح','نموذج طلب موقّع','كشف حساب بنكي آخر 6 أشهر','تأمين سفر صحي (30,000 يورو)','حجز فندقي وتذاكر طيران','سجل عائلي / مستندات الدعوة إن وجدت'], 
   90.00::numeric, 'مقابلة شخصية في السفارة مطلوبة، نجهز لك الملف كاملاً.', true),
  ('ماليزيا', '🇲🇾', 'إلكترونية eVisa', '2 – 4 أيام عمل',
   ARRAY['جواز سفر صالح 6 أشهر','صورة شخصية','تذكرة طيران ذهاب وعودة'], 
   40.00::numeric, 'تُصدر إلكترونياً بالكامل.', true),
  ('لبنان', '🇱🇧', 'تأشيرة عند الوصول', 'فوري',
   ARRAY['جواز سفر صالح','إثبات حجز فندقي أو دعوة'], 
   NULL::numeric, 'لا حاجة لتأشيرة مسبقة لمعظم الجنسيات — ننسق لك رحلتك كاملة.', true)
) as v(country, flag, visa_type, processing_time, requirements, price, notes)
where not exists (select 1 from public.visas);

-- ---------- طلبات تجريبية لعرض عمل اللوحة ----------
insert into public.flight_requests (customer_name, phone, trip_type, from_city, to_city, depart_date, return_date, passengers, cabin_class, notes)
select 'أحمد محمد', '+963991234567', 'ROUND_TRIP', 'دمشق', 'إسطنبول', current_date + 14, current_date + 21, 2, 'ECONOMY',
       'طلب تجريبي لأغراض الفحص — يمكن حذفه من لوحة التحكم.'
where not exists (select 1 from public.flight_requests);

insert into public.visa_requests (customer_name, phone, country, visa_type, persons, notes)
select 'سارة خليل', '+963993456789', 'الإمارات', 'سياحية إلكترونية', 2,
       'طلب تجريبي لأغراض الفحص — يمكن حذفه من لوحة التحكم.'
where not exists (select 1 from public.visa_requests);

insert into public.booking_requests (customer_name, phone, travelers, trip_id, notes)
select 'وليد حسن', '+963995678901', 3, (select id from public.trips where destination = 'تركيا' limit 1),
       'طلب تجريبي لأغراض الفحص — يمكن حذفه من لوحة التحكم.'
where not exists (select 1 from public.booking_requests);
