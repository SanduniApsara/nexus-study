import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Loader } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { register: registerUser, loading, error, clearError } = useAuthStore()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    clearError()
    const res = await registerUser(data)
    if (res.success) navigate('/')
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 mb-4">
            <GraduationCap size={28} className="text-accent" />
          </div>
          <h1 className="font-display font-black text-2xl tracking-tight text-text1">Create your account</h1>
          <p className="text-text3 text-sm font-mono mt-1">Start tracking your academic journey</p>
        </div>

        <div className="card">
          {error && (
            <div className="bg-danger/10 border border-danger/30 rounded-lg px-4 py-3 text-danger text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="label">Full Name</label>
                <input className="input-field" placeholder="John Doe"
                  {...register('name', { required: 'Name is required' })} />
                {errors.name && <p className="text-danger text-xs">{errors.name.message}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label">Email</label>
                <input type="email" className="input-field" placeholder="you@uni.edu"
                  {...register('email', { required: 'Email required' })} />
                {errors.email && <p className="text-danger text-xs">{errors.email.message}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="label">Password</label>
              <input type="password" className="input-field" placeholder="Min. 6 characters"
                {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })} />
              {errors.password && <p className="text-danger text-xs">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="label">University</label>
                <input className="input-field" placeholder="University of Colombo"
                  {...register('university')} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label">Degree</label>
                <input className="input-field" placeholder="BSc Computer Science"
                  {...register('degree')} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="label">Year of Study</label>
                <select className="select-field" {...register('year')}>
                  {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="label">Target GPA</label>
                <input type="number" step="0.1" min="0" max="4" className="input-field"
                  placeholder="3.7" {...register('targetGPA')} />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader size={16} className="animate-spin" /> Creating…</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-text3 text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:underline font-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
