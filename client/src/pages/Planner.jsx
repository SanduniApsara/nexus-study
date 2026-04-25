import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Trash2, Clock, Star } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import useAppStore from '../store/useAppStore'
import Modal from '../components/Modal'

const SESSION_TYPES = ['Study','Revision','Practice','Lecture','Tutorial']

export default function Planner() {
  const { sessions, fetchSessions, addSession, deleteSession, modules, fetchModules } = useAppStore()
  const [modal, setModal] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    fetchSessions()
    fetchModules()
  }, [])

  const onAdd = async (data) => {
    const res = await addSession({ ...data, duration: Number(data.duration), productivity: Number(data.productivity), module: data.module || null })
    if (res.success) { setModal(false); reset() }
  }

  const totalHours  = Math.round(sessions.reduce((s, sess) => s + sess.duration, 0) / 60 * 10) / 10
  const avgProd     = sessions.length ? (sessions.reduce((s, sess) => s + sess.productivity, 0) / sessions.length).toFixed(1) : 0

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-xl text-text1">Study Planner</h1>
          <p className="text-text3 text-xs font-mono mt-0.5">
            {totalHours}h total · {sessions.length} sessions · avg productivity {avgProd}/5
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setModal(true)}>
          <Plus size={15} /> Log Session
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Hours', value: totalHours + 'h', icon: Clock },
          { label: 'Sessions',    value: sessions.length,  icon: Plus },
          { label: 'Avg Productivity', value: avgProd + '/5', icon: Star },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Icon size={18} className="text-accent" />
            </div>
            <div>
              <p className="label">{label}</p>
              <p className="font-black text-lg text-text1">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sessions list */}
      {sessions.length === 0 ? (
        <div className="card text-center py-16">
          <Clock size={40} className="text-text3 mx-auto mb-3" />
          <p className="text-text2 font-semibold">No sessions logged yet</p>
          <p className="text-text3 text-sm font-mono mt-1">Log your first study session to start tracking</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sessions.map(sess => (
            <div key={sess._id} className="card flex items-center gap-4 py-3 px-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-mono font-bold text-accent bg-accent/10 flex-shrink-0">
                {Math.round(sess.duration / 60 * 10) / 10}h
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-text1">{sess.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {sess.module && (
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded"
                      style={{ background: sess.module.color + '22', color: sess.module.color }}>
                      {sess.module.name}
                    </span>
                  )}
                  <span className="text-xs font-mono text-text3">{sess.type}</span>
                  <span className="text-xs font-mono text-text3">{format(parseISO(sess.date), 'MMM d, yyyy')}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} size={12} className={n <= sess.productivity ? 'text-accent fill-accent' : 'text-text3'} />
                  ))}
                </div>
                <button onClick={() => deleteSession(sess._id)} className="text-text3 hover:text-danger transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Session Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="Log Study Session"
        footer={<>
          <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit(onAdd)}>Save Session</button>
        </>}
      >
        <div className="flex flex-col gap-1.5">
          <label className="label">Session Title</label>
          <input className="input-field" placeholder="e.g. Chapter 5 revision"
            {...register('title', { required: true })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label">Date</label>
            <input type="date" className="input-field" {...register('date', { required: true })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label">Duration (minutes)</label>
            <input type="number" className="input-field" placeholder="90" min="5"
              {...register('duration', { required: true })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label">Type</label>
            <select className="select-field" {...register('type')}>
              {SESSION_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label">Productivity (1-5)</label>
            <input type="number" className="input-field" placeholder="4" min="1" max="5"
              {...register('productivity')} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Module (optional)</label>
          <select className="select-field" {...register('module')}>
            <option value="">No module</option>
            {modules.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Notes</label>
          <textarea className="input-field resize-none" rows={2} placeholder="What did you cover?"
            {...register('notes')} />
        </div>
      </Modal>
    </div>
  )
}
