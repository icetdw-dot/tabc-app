import { useState } from 'react'

const WEEKDAY_OPTIONS = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

function getTodayWeekday() {
  const day = new Date().getDay()
  const map = {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六',
  }
  return map[day]
}

function StudentAttendanceCard({ student, onDeductLesson, selectedWeekday }) {
  const [selectedSessions, setSelectedSessions] = useState([])
  const scheduleOptions = (student.schedule ?? []).filter(
    (item) => item.weekday === selectedWeekday,
  )

  const toggleSession = (sessionLabel) => {
    setSelectedSessions((prev) => {
      if (prev.includes(sessionLabel)) {
        return prev.filter((item) => item !== sessionLabel)
      }
      return [...prev, sessionLabel]
    })
  }

  const deductionCount = selectedSessions.length
  const canSubmit = deductionCount > 0 && student.remainingLessons >= deductionCount

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold">{student.name}</h3>
        <p
          className={`text-sm font-semibold ${
            student.remainingLessons <= 3 ? 'text-rose-600' : 'text-slate-500'
          }`}
        >
          余 {student.remainingLessons} 课时
        </p>
      </div>

      <div className="mt-3">
        <p className="mb-2 text-xs font-medium text-slate-500">选择上课星期与时段（可多选）</p>
        {scheduleOptions.length === 0 ? (
          <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700">
            该学生未配置上课安排，请先到学生页添加星期和时段。
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {scheduleOptions.map((item) => {
              const label = `${item.weekday} ${item.timeSlot}`
              const active = selectedSessions.includes(label)
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleSession(label)}
                  className={`rounded-xl py-2 text-xs font-medium ${
                    active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-slate-500">
        本次扣课：{deductionCount} 课时
      </p>
      {!canSubmit && (
        <p className="mt-1 text-xs font-medium text-rose-600">
          {deductionCount === 0 ? '请至少选择 1 个时段' : '课时不足，无法按所选时段扣课'}
        </p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!canSubmit || scheduleOptions.length === 0}
          onClick={() => onDeductLesson(student.id, 'attendance', selectedSessions)}
          className="rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          点名扣课
        </button>
        <button
          type="button"
          disabled={!canSubmit || scheduleOptions.length === 0}
          onClick={() => onDeductLesson(student.id, 'makeup', selectedSessions)}
          className="rounded-xl bg-violet-500 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          补课扣课
        </button>
      </div>
    </article>
  )
}

function Attendance({ students, onDeductLesson }) {
  const [selectedWeekday, setSelectedWeekday] = useState(getTodayWeekday())

  const filteredStudents = students.filter((student) =>
    (student.schedule ?? []).some((item) => item.weekday === selectedWeekday),
  )

  return (
    <section className="space-y-3">
      <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
        <p className="mb-2 text-xs font-medium text-slate-500">按星期过滤点名列表</p>
        <div className="grid grid-cols-4 gap-2">
          {WEEKDAY_OPTIONS.map((weekday) => {
            const active = selectedWeekday === weekday
            return (
              <button
                key={weekday}
                type="button"
                onClick={() => setSelectedWeekday(weekday)}
                className={`rounded-xl py-2 text-xs font-medium ${
                  active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {weekday}
              </button>
            )
          })}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
          暂无学生可点名。
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
          {selectedWeekday} 暂无已配置该日安排的学生。
        </div>
      ) : (
        filteredStudents.map((student) => (
          <StudentAttendanceCard
            key={student.id}
            student={student}
            onDeductLesson={onDeductLesson}
            selectedWeekday={selectedWeekday}
          />
        ))
      )}
    </section>
  )
}

export default Attendance

