import { cn } from '../../lib/utils'

export function Field({ label, error, required, hint, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="field-label">
          {label} {required && <span className="text-plum">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-smoke/80">{hint}</p>}
      {error && <p className="text-xs text-rose">{error}</p>}
    </div>
  )
}

export function FieldLight({ label, error, required, hint, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="field-label">
          {label} {required && <span className="text-rose">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-smoke/80">{hint}</p>}
      {error && <p className="text-xs text-rose">{error}</p>}
    </div>
  )
}

export function Input({ error, className, ...props }) {
  return <input className={cn('field', error && 'border-rose/60', className)} {...props} />
}

export function Textarea({ error, className, rows = 4, ...props }) {
  return <textarea rows={rows} className={cn('field', error && 'border-rose/60', className)} {...props} />
}

export function Select({ error, className, children, ...props }) {
  return (
    <select className={cn('field', error && 'border-rose/60', className)} {...props}>
      {children}
    </select>
  )
}

/* ------- نسخ لوحة التحكم (نفس النمط) ------- */

export function InputLight({ error, className, ...props }) {
  return <input className={cn('field', error && 'border-rose/60', className)} {...props} />
}

export function TextareaLight({ error, className, rows = 4, ...props }) {
  return <textarea rows={rows} className={cn('field', error && 'border-rose/60', className)} {...props} />
}

export function SelectLight({ error, className, children, ...props }) {
  return (
    <select className={cn('field', error && 'border-rose/60', className)} {...props}>
      {children}
    </select>
  )
}
