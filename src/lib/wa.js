import { SITE, waLink } from '../config/site'
import { fmtPrice } from './utils'

/** رسائل واتساب جاهزة — لا يُرسل شيء تلقائياً، المستخدم هو من يضغط إرسال */

export const waGeneral = () =>
  waLink(SITE.whatsapp, 'مرحباً ديالا للسياحة والسفر ✈️\nأرغب بالاستفسار عن خدماتكم.')

export const waTrip = (trip) =>
  waLink(
    SITE.whatsapp,
    `مرحباً ديالا للسياحة والسفر ✈️\nأرغب بحجز الرحلة: ${trip.title}\nالوجهة: ${trip.destination}${
      trip.price ? `\nالسعر المعروض: ${fmtPrice(trip.price)}` : ''
    }${trip.start_date ? `\nتاريخ الانطلاق: ${trip.start_date}` : ''}\nأرجو تزويدي بالتفاصيل.`
  )

export const waFlight = ({ to, promo, passengers, cabin } = {}) =>
  waLink(
    SITE.whatsapp,
    `مرحباً ديالا للسياحة والسفر ✈️\nأرغب بحجز تذكرة طيران${
      to ? `\nمن: دمشق\nإلى: ${to}` : ''
    }${passengers ? `\nعدد المسافرين: ${passengers}` : ''}${cabin ? `\nدرجة السفر: ${cabin}` : ''}${
      promo ? `\nبخصوص العرض: ${promo}` : ''
    }\nأرجو تزويدي بالأسعار المتاحة.`
  )

export const waVisa = (visa) =>
  waLink(
    SITE.whatsapp,
    `مرحباً ديالا للسياحة والسفر ✈️\nأرغب بطلب تأشيرة:\nالدولة: ${visa.country}\nالنوع: ${visa.visa_type}${
      visa.price != null ? `\nالسعر المعروض: ${fmtPrice(visa.price)}` : ''
    }\nأرجو إفادتي بالمستندات المطلوبة.`
  )

export const waOffer = (offer) =>
  waLink(
    SITE.whatsapp,
    `مرحباً ديالا للسياحة والسفر ✈️\nأرغب بالاستفادة من العرض: ${offer.title}${
      offer.new_price ? `\nالسعر المعروض: ${fmtPrice(offer.new_price)}` : ''
    }${offer.destination ? `\nالوجهة: ${offer.destination}` : ''}`
  )

export const waHajjUmrah = (kind = '') =>
  waLink(
    SITE.whatsapp,
    `مرحباً ديالا للسياحة والسفر 🕋\nأرغب بالاستفسار عن برامج ${kind || 'الحج والعمرة'}\nأرجو تزويدي بالبرامج المتاحة والأسعار.`
  )
