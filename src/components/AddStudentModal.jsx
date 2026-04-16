import { useEffect, useState } from 'react'

function AddStudentModal({ open, onClose, onConfirm }) {
  const [name, setName] = useState('')
  const [initialLessons, setInitialLessons] = useState(10)
  const [billingType, setBillingType] = useState('monthly')

  useEffect(() => {
    if (!open) {
      setName('')
      setInitialLessons(10)
      setBillingType('monthly')
    }
  }, [open])

  if (!open) return null

  const submit = (event) => {
    event.preventDefault()
    const trimmedName = name.trim()
    const lessons = Number(initialLessons)

    if (!trimmedName || Number.isNaN(lessons) || lessons < 0) return
    onConfirm(trimmedName, lessons, billingType)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-20 flex items-end bg-black/40 p-4">
      <form
        onSubmit={submit}
        className="w-full rounded-3xl bg-white p-4 shadow-xl"
      >
        <h2 className="text-lg font-semibold">添加学生</h2>
        <p className="mt-1 text-sm text-slate-500">输入姓名和初始课时。</p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          姓名
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-base outline-none ring-0 focus:border-slate-900"
            placeholder="例如：王小明"
            required
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-slate-700">
          初始课时
          <input
            type="number"
            min="0"
            value={initialLessons}
            onChange={(event) => setInitialLessons(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-base outline-none ring-0 focus:border-slate-900"
            required
          />
        </label>

        <label className="mt-3 block text-sm font-medium text-slate-700">
          学员类型
          <select
            value={billingType}
            onChange={(event) => setBillingType(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3 text-base outline-none ring-0 focus:border-slate-900"
          >
            <option value="monthly">月费</option>
            <option value="dropin">散户</option>
          </select>
        </label>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 py-3 font-medium text-slate-700"
          >
            取消
          </button>
          <button
            type="submit"
            className="rounded-xl bg-slate-900 py-3 font-medium text-white"
          >
            保存
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStudentModal

