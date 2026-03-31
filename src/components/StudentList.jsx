import { useState } from 'react'

function StudentCard({ student, onDeleteStudent, onRecharge }) {
  const [rechargeAmount, setRechargeAmount] = useState(1)

  const submitRecharge = (event) => {
    event.preventDefault()
    const amount = Number(rechargeAmount)
    if (Number.isNaN(amount) || amount <= 0) return
    onRecharge(student.id, amount)
    setRechargeAmount(1)
  }

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{student.name}</h3>
        <button
          type="button"
          onClick={() => onDeleteStudent(student.id)}
          className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600"
        >
          删除
        </button>
      </div>

      <p className="mt-2 text-sm text-slate-500">剩余课时</p>
      <p
        className={`text-2xl font-bold ${
          student.remainingLessons <= 3 ? 'text-rose-600' : 'text-slate-900'
        }`}
      >
        {student.remainingLessons}
      </p>

      {student.remainingLessons <= 3 && (
        <p className="mt-1 text-xs font-semibold text-rose-600">课时不足，请及时充值</p>
      )}

      <form onSubmit={submitRecharge} className="mt-4 flex items-center gap-2">
        <input
          type="number"
          min="1"
          value={rechargeAmount}
          onChange={(event) => setRechargeAmount(event.target.value)}
          className="h-11 w-24 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
        />
        <button
          type="submit"
          className="h-11 flex-1 rounded-xl bg-emerald-500 px-3 text-sm font-semibold text-white"
        >
          充值课时
        </button>
      </form>
    </article>
  )
}

function StudentList({
  students,
  searchKeyword,
  onSearch,
  onOpenAddModal,
  onDeleteStudent,
  onRecharge,
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <input
          value={searchKeyword}
          onChange={(event) => onSearch(event.target.value)}
          className="h-12 flex-1 rounded-2xl border border-slate-300 px-4 text-sm outline-none focus:border-slate-900"
          placeholder="搜索学生姓名"
        />
        <button
          type="button"
          onClick={onOpenAddModal}
          className="h-12 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white"
        >
          添加
        </button>
      </div>

      <div className="space-y-3">
        {students.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            暂无学生，请先添加。
          </div>
        ) : (
          students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onDeleteStudent={onDeleteStudent}
              onRecharge={onRecharge}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default StudentList

