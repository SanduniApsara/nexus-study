import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Mail, Lock, Loader } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    clearError()
    const res = await login(data)
    if (res.success) navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
            <GraduationCap size={28} className="text-accent" />
          </div>
          <h1 className="font-display font-black text-2xl tracking-tight text-text1">Welcome back</h1>
          <p className="text-text3 text-sm font-mono mt-1">Sign in to Nexus Study</p>
        </div>

        {/* Card */}
        <div className="card">
          {error && (
            <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 text-danger text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
                <input
                  type="email"
                  placeholder="you@university.edu"
                  className="input-field pl-9"
                  {...register('email', { required: 'Email is required' })}
                />
              </div>
              {errors.email && <p className="text-danger text-xs">{errors.email.message}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-9"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && <p className="text-danger text-xs">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-text3 text-sm mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:underline font-semibold">Create one</Link>
        </p>
      </div>
    </div>
  )
}
