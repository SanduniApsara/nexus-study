import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, Trash2, Plus as PlusIcon, BookOpen } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import Modal from '../components/Modal'
import clsx from 'clsx'

const MODULE_COLORS = ['#c8f050','#7b5ea7','#f05050','#50b4f0','#f0a050','#50f0b0','#f050c8','#f0d050']
const MODULE_ICONS  = ['📚','🔬','🧮','💻','⚗️','📐','🌍','🎨','🏛️','📖']

const scoreToGrade = (score) => {
  if (score === null) return '—'
  if (score >= 90) return 'A'
  if (score >= 85) return 'A-'
  if (score >= 80) return 'B+'
  if (score >= 75) return 'B'
  if (score >= 70) return 'B-'
  if (score >= 65) return 'C+'
  if (score >= 60) return 'C'
  if (score >= 50) return 'C-'
  if (score >= 45) return 'D'
  return 'F'
}

export default function Modules() {
  const { modules, fetchModules, addModule, deleteModule, addGrade, deleteGrade } = useAppStore()
  const [moduleModal, setModuleModal]   = useState(false)
  const [gradeModal, setGradeModal]     = useState(null) // module id
  const [selectedColor, setSelectedColor] = useState(MODULE_COLORS[0])
  const [selectedIcon, setSelectedIcon]   = useState(MODULE_ICONS[0])

  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const { register: regGrade, handleSubmit: submitGrade, reset: resetGrade } = useForm()

  useEffect(() => { fetchModules() }, [])

  const onAddModule = async (data) => {
    const res = await addModule({ ...data, color: selectedColor, icon: selectedIcon })
    if (res.success) { setModuleModal(false); reset() }
  }

  const onAddGrade = async (data) => {
    const res = await addGrade(gradeModal, { ...data, score: Number(data.score), weight: Number(data.weight) })
    if (res.success) { setGradeModal(null); resetGrade() }
  }

  return (
    <div className="flex flex-col gap-5 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-black text-xl text-text1">Modules</h1>
          <p className="text-text3 text-xs font-mono mt-0.5">{modules.length} modules this semester</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setModuleModal(true)}>
          <Plus size={15} /> Add Module
        </button>
      </div>

      {modules.length === 0 ? (
        <div className="card text-center py-16">
          <BookOpen size={40} className="text-text3 mx-auto mb-3" />
          <p className="text-text2 font-semibold">No modules yet</p>
          <p className="text-text3 text-sm font-mono mt-1">Add your first module to start tracking</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {modules.map(mod => {
            const avg = mod.averageScore
            const grade = scoreToGrade(avg)
            return (
              <div key={mod._id} className="card flex flex-col gap-4">
                {/* Module header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                         style={{ background: mod.color + '22' }}>
                      {mod.icon}
                    </div>
                    <div>
                      <p className="font-bold text-text1">{mod.name}</p>
                      <p className="text-xs font-mono text-text3">{mod.code} · {mod.credits} credits · {mod.semester}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="font-black text-lg" style={{ color: mod.color }}>{grade}</p>
                      <p className="text-xs font-mono text-text3">{avg !== null ? avg.toFixed(1) + '%' : 'No grades'}</p>
                    </div>
                    <button onClick={() => deleteModule(mod._id)} className="btn-icon text-text3 hover:text-danger p-1">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Score bar */}
                <div className="h-2 bg-bg3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                       style={{ width: `${avg || 0}%`, background: mod.color }} />
                </div>

                {/* Grades list */}
                {mod.grades?.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <p className="label">Grade Breakdown</p>
                    {mod.grades.map(g => (
                      <div key={g._id} className="flex items-center gap-2 text-sm">
                        <span className="flex-1 text-text2">{g.name}</span>
                        <span className="font-mono text-text3 text-xs">{g.weight}%</span>
                        <span className="font-mono font-semibold" style={{ color: mod.color }}>{g.score}%</span>
                        <button onClick={() => deleteGrade(mod._id, g._id)}
                          className="text-text3 hover:text-danger transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button className="btn-ghost text-xs flex items-center justify-center gap-1.5"
                        onClick={() => setGradeModal(mod._id)}>
                  <PlusIcon size={13} /> Add Grade
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Module Modal */}
      <Modal open={moduleModal} onClose={() => setModuleModal(false)} title="Add Module"
        footer={<>
          <button className="btn-ghost" onClick={() => setModuleModal(false)}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit(onAddModule)}>Add Module</button>
        </>}
      >
        <div className="flex flex-col gap-1.5">
          <label className="label">Module Name</label>
          <input className="input-field" placeholder="Data Structures & Algorithms"
            {...register('name', { required: true })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label">Module Code</label>
            <input className="input-field" placeholder="CS2040"
              {...register('code', { required: true })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label">Credits</label>
            <input type="number" className="input-field" placeholder="3" min="1" max="12"
              {...register('credits', { required: true })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label">Semester</label>
            <select className="select-field" {...register('semester')}>
              {['Semester 1','Semester 2','Semester 3','Full Year'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label">Year</label>
            <select className="select-field" {...register('year')}>
              {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Color</label>
          <div className="flex gap-2 flex-wrap">
            {MODULE_COLORS.map(c => (
              <button key={c} onClick={() => setSelectedColor(c)}
                className={clsx('w-7 h-7 rounded-full transition-transform', selectedColor === c && 'scale-125 ring-2 ring-white/30')}
                style={{ background: c }} />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="label">Icon</label>
          <div className="flex gap-2 flex-wrap">
            {MODULE_ICONS.map(i => (
              <button key={i} onClick={() => setSelectedIcon(i)}
                className={clsx('w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all',
                  selectedIcon === i ? 'bg-accent/20 border border-accent/40' : 'bg-bg3 border border-border')}>
                {i}
              </button>
            ))}
          </div>
        </div>
      </Modal>

      {/* Add Grade Modal */}
      <Modal open={!!gradeModal} onClose={() => setGradeModal(null)} title="Add Grade"
        footer={<>
          <button className="btn-ghost" onClick={() => setGradeModal(null)}>Cancel</button>
          <button className="btn-primary" onClick={submitGrade(onAddGrade)}>Save Grade</button>
        </>}
      >
        <div className="flex flex-col gap-1.5">
          <label className="label">Assessment Name</label>
          <input className="input-field" placeholder="e.g. Midterm Exam"
            {...regGrade('name', { required: true })} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="label">Score (%)</label>
            <input type="number" className="input-field" placeholder="78" min="0" max="100"
              {...regGrade('score', { required: true })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="label">Weight (%)</label>
            <input type="number" className="input-field" placeholder="30" min="1" max="100"
              {...regGrade('weight', { required: true })} />
          </div>
        </div>
      </Modal>
    </div>
  )
}
