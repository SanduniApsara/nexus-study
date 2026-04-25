import { useForm } from 'react-hook-form'
import { GraduationCap, Save } from 'lucide-react'
import useAuthStore from '../store/useAuthStore'
import useAppStore  from '../store/useAppStore'

export default function Profile() {
  const { user, updateProfile } = useAuthStore()
  const { showToast } = useAppStore()

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name:       user?.name       || '',
      university: user?.university || '',
      degree:     user?.degree     || '',
      year:       user?.year       || 1,
      targetGPA:  user?.targetGPA  || 3.7,
    },
  })

  const onSubmit = async (data) => {
    await updateProfile({ ...data, year: Number(data.year), targetGPA: Number(data.targetGPA) })
    showToast('Profile updated!')
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-up max-w-2xl">
      <div>
        <h1 className="font-display font-black text-xl text-text1">Profile</h1>
        <p className="text-text3 text-xs font-mono mt-0.5">Manage your academic profile</p>
      </div>

      {/* Avatar section */}
      <div className="card flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet to-accent flex items-center justify-center text-2xl font-black text-black flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-lg text-text1">{user?.name}</p>
          <p className="text-text3 text-sm font-mono">{user?.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <GraduationCap size={13} className="text-accent" />
            <span className="text-xs font-mono text-text2">{user?.university || 'No university set'}</span>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="card">
        <p className="section-title mb-4">Edit Information</p>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label">Full Name</label>
            <input className="input-field" {...register('name', { required: true })} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label">University</label>
            <input className="input-field" placeholder="University of Colombo"
              {...register('university')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="label">Degree Programme</label>
            <input className="input-field" placeholder="BSc Computer Science"
              {...register('degree')} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="label">Year of Study</label>
              <select className="select-field" {...register('year')}>
                {[1,2,3,4,5,6].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="label">Target GPA (max 4.0)</label>
              <input type="number" step="0.1" min="0" max="4" className="input-field"
                {...register('targetGPA')} />
            </div>
          </div>

          <button type="submit" className="btn-primary flex items-center justify-center gap-2 w-fit">
            <Save size={15} /> Save Changes
          </button>
        </form>
      </div>

      {/* Tech stack badge */}
      <div className="card border-accent/20">
        <p className="section-title mb-3">Built With</p>
        <div className="flex flex-wrap gap-2">
          {['React 18','Vite','Tailwind CSS','Zustand','Recharts','React Hook Form',
            'Node.js','Express.js','MongoDB','Mongoose','JWT Auth','REST API'].map(tech => (
            <span key={tech} className="badge-accent">{tech}</span>
          ))}
        </div>
        <p className="text-text3 text-xs font-mono mt-3">
          ✦ Portfolio project — Full Stack · Undergraduate Level
        </p>
      </div>
    </div>
  )
}
