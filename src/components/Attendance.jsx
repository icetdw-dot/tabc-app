function Attendance({ students, onDeductLesson }) {
  return (
    <section className="space-y-3">
      {students.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
          暂无学生可点名。
        </div>
      ) : (
        students.map((student) => (
          <article
            key={student.id}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
          >
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

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={student.remainingLessons <= 0}
                onClick={() => onDeductLesson(student.id, 'attendance')}
                className="rounded-xl bg-blue-500 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                点名 -1
              </button>
              <button
                type="button"
                disabled={student.remainingLessons <= 0}
                onClick={() => onDeductLesson(student.id, 'makeup')}
                className="rounded-xl bg-violet-500 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                补课 -1
              </button>
            </div>
          </article>
        ))
      )}
    </section>
  )
}

export default Attendance

