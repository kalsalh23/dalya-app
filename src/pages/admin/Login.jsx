import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Lock, Mail, Plane } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.jsx'
import Button from '../../components/ui/Button.jsx'
import { FieldLight, InputLight } from '../../components/ui/forms.jsx'

export default function Login() {
  const { session, isStaff, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  if (!loading && session && isStaff) return <Navigate to="/admin" replace />

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await signIn(email.trim(), password)
      toast.success('مرحباً بعودتك 👋')
      navigate('/admin')
    } catch (err) {
      const msg =
        err.message?.includes('Invalid login') ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
        : err.message?.includes('Email not confirmed') ? 'لم يتم تأكيد البريد الإلكتروني بعد'
        : 'تعذر تسجيل الدخول، حاول مرة أخرى'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-plum p-4">
      <div className="absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-chip0/20 blur-3xl" />
      <div className="absolute -bottom-24 left-1/4 h-80 w-80 rounded-full bg-chip0/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="bg-white mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-lg">
            <Plane size={30} className="text-white" strokeWidth={2.5} />
          </span>
          <span className="font-display text-3xl font-black tracking-[0.2em] text-white">DIALA</span>
          <p className="mt-2 text-sm text-white/50">لوحة تحكم السياحة والسفر</p>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-3xl bg-white p-8 shadow-luxury">
          <h1 className="text-center font-display text-xl font-bold text-ink">تسجيل دخول الأدمن</h1>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm text-rose-600">
              {error}
            </div>
          )}

          <FieldLight label="البريد الإلكتروني" required>
            <div className="relative">
              <Mail size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <InputLight
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="!py-3 !pl-4 !pr-10"
                dir="ltr"
                required
              />
            </div>
          </FieldLight>

          <FieldLight label="كلمة المرور" required>
            <div className="relative">
              <Lock size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300" />
              <InputLight
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="!py-3 !pl-4 !pr-10"
                dir="ltr"
                required
              />
            </div>
          </FieldLight>

          <Button type="submit" loading={saving} size="lg" className="w-full">
            دخول
          </Button>
        </form>
      </div>
    </div>
  )
}
