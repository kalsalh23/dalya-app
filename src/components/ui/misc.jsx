import { useState } from 'react'
import { Plane } from 'lucide-react'
import { cn } from '../../lib/utils'
import { STATUS_LABELS, STATUS_COLORS } from '../../lib/constants'

/** صورة مع بديل هادئ عند فشل التحميل */
export function ImageFallback({ src, alt = '', className, imgClassName, gradientClass = 'bg-chip' }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <div className={cn('flex items-center justify-center', gradientClass, className)}>
        <Plane className="text-plum/30" size={40} />
      </div>
    )
  }
  return (
    <div className={cn('overflow-hidden', className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={cn('h-full w-full object-cover', imgClassName)}
      />
    </div>
  )
}

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold',
        STATUS_COLORS[status] || 'bg-gray-100 text-gray-600',
        className
      )}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export function Tag({ children, className }) {
  return <span className={cn('chip !cursor-default', className)}>{children}</span>
}

/** نجوم التقييم الذهبية بأسلوب renad1 */
export function Stars({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-star ${className}`} aria-hidden>
      ★★★★★
    </span>
  )
}

/** صف عنوان قسم بأسلوب التطبيق: عنوان يمين + رابط يسار */
export function SectionRow({ title, action, className }) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)}>
      <h2 className="text-lg font-extrabold text-ink">{title}</h2>
      {action}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, subtitle, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 px-6 py-16 text-center', className)}>
      {Icon && (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-chip text-plum">
          <Icon size={32} strokeWidth={1.8} />
        </div>
      )}
      <h3 className="text-lg font-extrabold text-ink">{title}</h3>
      {subtitle && <p className="max-w-xs text-sm leading-7 text-smoke">{subtitle}</p>}
      {action}
    </div>
  )
}
