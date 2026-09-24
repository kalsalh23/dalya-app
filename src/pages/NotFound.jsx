import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container-app flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-chip text-plum">
        <Compass size={32} strokeWidth={1.8} />
      </div>
      <p className="mt-5 text-5xl font-black text-plum">404</p>
      <h1 className="mt-2 text-lg font-extrabold text-ink">الصفحة غير موجودة</h1>
      <p className="mt-2 max-w-xs text-sm leading-7 text-smoke">
        يبدو أنك انحرفت عن المسار — لا مشكلة، وجهتك القادمة على بُعد نقرة واحدة.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a href="/" className="btn-primary btn-sm">العودة للرئيسية</a>
        <a href="/trips" className="btn-outline btn-sm">استكشف الرحلات</a>
      </div>
    </div>
  )
}
