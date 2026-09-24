import { useRef, useState } from 'react'
import { UploadCloud, Loader2, X } from 'lucide-react'
import { uploadImage } from '../../lib/upload'
import { cn } from '../../lib/utils'

/** رفع صورة إلى Supabase Storage أو لصق رابط خارجي */
export default function ImageUpload({ value, onChange, folder = 'uploads', label = 'الصورة' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const pick = () => inputRef.current?.click()

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      alert('فشل رفع الصورة — تحقق من صلاحياتك أو استخدم رابطاً خارجياً')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="field-label">{label}</label>
      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative shrink-0">
            <img src={value} alt="معاينة" className="h-20 w-28 rounded-2xl border-2 border-chip object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -left-2 -top-2 rounded-full bg-rose p-1 text-white shadow"
              aria-label="إزالة الصورة"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={pick}
            disabled={uploading}
            className={cn(
              'flex h-20 w-28 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-chip text-xs text-smoke transition hover:border-plum/50 hover:text-plum',
              uploading && 'opacity-60'
            )}
          >
            {uploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
            {uploading ? 'جارٍ الرفع...' : 'رفع صورة'}
          </button>
        )}
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="أو الصق رابط صورة https://..."
          dir="ltr"
          className="field flex-1 !rounded-2xl"
        />
      </div>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
    </div>
  )
}
