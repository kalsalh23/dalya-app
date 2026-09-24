import { useEffect, useRef } from 'react'

/**
 * ظهور تدريجي آمن: يراقب أيضاً العناصر المضافة لاحقاً (نتائج تحميل البيانات)
 * حتى لا يبقى أي محتوى مخفياً أبداً.
 */
export default function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.06 }
    )

    const observeAll = () => {
      el.querySelectorAll('.reveal:not(.revealed)').forEach((t) => io.observe(t))
    }

    observeAll()
    const mo = new MutationObserver(() => observeAll())
    mo.observe(el, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
  return ref
}
