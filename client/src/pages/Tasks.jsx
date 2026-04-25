import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Trash2, CheckCircle, Circle, AlertCircle } from 'lucide-react'
import { format, parseISO, isPast } from 'date-fns'
import useAppStore from '../store/useAppStore'
import Modal from '../components/Modal'
import clsx from 'clsx'

const PRIORITIES = ['Low','Medium','High','Critical']
const TYPES      = ['Assignment','Exam','Project','Quiz','Reading','Other']
const STATUSES   = ['Todo','In Progress','Done']

const priorityStyles = {
  Critical: 'priority-critical border',
  High:     'priority-high border',
  Medium:   'priority-medium border',
  Low:      'priority-low border',
}

export default function Tasks() {
  const { tasks, fetchTasks, addTask, updateTask, deleteTask, modules, fetchModules } = useAppStore()
  const [modal, setModal]       = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    fetchTasks()
    fetchModules()
  }, [])

  const onAdd = async (data) => {
    const res = await addTask({ ...data, module: data.module || null })
    if (res.success) { setModal(false); reset() }
  }

  const toggleStatus = async (task) => {
    const next = task.status === 'Done' ? 'Todo' : task.status === 'Todo' ? 'In Progress' : 'Done'
    await updateTask(task._id, { status: next })
  }

  const filtered = tasks.filter(t => {
    if (filterStatus   !== 'all' && t.status   !== filterStatus)   return false
    if (filterPriority !== 'all' && t.priority  !== filterPriority) return false
    return true
  })

  const StatusIcon = ({ task }) => {
    if (task.status === 'Done')        return <CheckCircle size={18} className="text-accent flex-shrink-0" />
    if (task.isOverdue || isPast(parseISO(task.dueDate))) return <AlertCircle size={18} className="text-danger flex-shrink-0" />
    return <Circle size={18} className="text-text3 flex-shrink-0" />
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-black text-xl text-text1">Tasks</h1>
          <p className="text-text3 text-xs font-mono mt-0.5">
            {tasks.filter(t=>t.status==='Done').length}/{tasks.length} completed
          </p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setModal(true)}>
          <Plus size={15} /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={clsx('chip text-xs px-3 py-1.5 rounded-full border transition-all',
              filterStatus === s
                ? 'bg-accent/10 border-accent/30 text-accent'
                : 'bg-bg3 border-border text-text3 hover:text-text1')}>
            {s === 'all' ? 'All' : s}
          </button>
        ))}
        <div className="w-px bg-border mx-1" />
        {['all', ...PRIORITIES].map(p => (
          <button key={p} onClick={() => setFilterPriority(p)}
            className={clsx('chip text-xs px-3 py-1.5 rounded-full border transition-all',
              filterPriority === p
                ? 'bg-violet/20 border-violet/30 text-violet'
                : 'bg-bg3 border-border text-text3 hover:text-text1')}>
            {p === 'all' ? 'All Priority' : p}
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <CheckCircle size={40} className="text-text3 mx-auto mb-3" />
          <p className="text-text2 font-semibold">No tasks found</p>
          <p className="text-text3 text-sm font-mono mt-1">Add a new task or change your filters</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(task => {
            const overdue = task.status !== 'Done' && isPast(parseISO(task.dueDate))
            return (
              <div key={task._id}
                className={clsx(
                  'card flex items-center gap-4 py-3 px-4 cursor-pointer',
                  task.status === 'Done' && 'opacity-50',
                  overdue && 'border-danger/30'
                )}>
                <button onClick={() => toggleStatus(task)}>
                  <StatusIcon task={task} />
                </button>

                <div className="flex-1 min-w-0">
                  <p className={clsx('font-semibold text-sm', task.status === 'Done' && 'line-through text-text3')}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    {task.module && (
                      <span className="text-xs font-mono px-1.5 py-0.5 rounded"
                        style={{ background: task.module.color + '22', color: task.module.color }}>
                        {task.module.name}
                      </span>
                    )}
                    <span className="text-xs font-mono text-text3">{task.type}</span>
                    {overdue && <span className="text-xs font-mono text-danger">OVERDUE</span>}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={clsx('text-xs font-mono px-2 py-0.5 rounded border', priorityStyles[task.priority])}>
                    {task.priority}
                  </span>
                  <span className="text-xs font-mono text-text3">
                    {format(parseISO(task.dueDate), 'MMM d')}
                  </span>
                  <button onClick={() => deleteTask(task._id)}
                    className="text-text3 hover:text-danger transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Task Modal */}
      <Modal open={modal} onClose={() => setModal(false)} title="New Task"
        footer={<>
          <button className="btn-ghost" onClick={() => setModal(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit(onAdd)}>Create Task</button>
        </>}
      >
        <div className="flex flex-col gap-1.5">
          <label className="label">Title</label>
          <input className="input-field" placeholder="e.g. Complete Assignment 2"
            {...register('title', { required: true })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label">Type</label>
            <select className="select-field" {...register('type')}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label">Priority</label>
            <select className="select-field" {...register('priority')}>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label">Due Date</label>
            <input type="date" className="input-field"
              {...register('dueDate', { required: true })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label">Est. Hours</label>
            <input type="number" className="input-field" placeholder="2" min="0.5" step="0.5"
              {...register('estimatedHours')} />
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
          <label className="label">Description</label>
          <textarea className="input-field resize-none" rows={3} placeholder="Optional notes…"
            {...register('description')} />
        </div>
      </Modal>
    </div>
  )
}
