import { MessageCircle, MapPin, Phone } from 'lucide-react'
import { SITE, waLink } from '../../config/site'
import { WhatsAppIcon } from '../layout/icons.jsx'
import useReveal from '../../hooks/useReveal.js'

/** كتلة دعوة للتواصل بخلفية بنفسجية بأسلوب renad1 */
export default function ContactStrip() {
  const ref = useReveal()
  return (
    <section ref={ref} className="mt-10">
      <div className="relative overflow-hidden rounded-4xl bg-plum p-7 text-center text-white sm:p-9">
        <div className="absolute inset-0 opacity-20 [background:radial-gradient(ellipse_at_top,#B98CC7,transparent_60%)]" />
        <div className="relative z-10">
          <h3 className="text-lg font-black">جاهزون لخدمتك الآن</h3>
          <p className="mx-auto mt-2 flex max-w-sm flex-col items-center justify-center gap-1.5 text-xs leading-6 text-white/80 sm:flex-row sm:gap-4">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {SITE.addressAr}
            </span>
            <span className="inline-flex items-center gap-1.5" dir="ltr">
              <Phone className="h-3.5 w-3.5" />
              {SITE.phoneDisplay} — {SITE.phone2Display}
            </span>
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
            <a
              href={waLink(SITE.whatsapp, 'مرحباً ديالا للسياحة والسفر، أرغب بالاستفسار عن خدماتكم')}
              target="_blank"
              rel="noreferrer"
              className="btn-gradient !py-2.5 text-xs"
            >
              <WhatsAppIcon size={16} />
              تواصل عبر واتساب
            </a>
            <a href="/contact" className="btn !border-2 !border-white/40 !bg-transparent !py-2.5 text-xs text-white hover:!bg-white hover:text-plum">
              <MessageCircle className="h-4 w-4" />
              أرسل استفساراً
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
