import { useState } from 'react'

const WEEKDAY_OPTIONS = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
const PAYMENT_METHOD_OPTIONS = ['现金', '银行转账', "Touch 'n Go"]

function getBillingTypeLabel(type) {
  return type === 'dropin' ? '散户' : '月费'
}

function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString('zh-CN', {
    hour12: false,
  })
}

function StudentCard({
  student,
  onDeleteStudent,
  onPayment,
  records,
  onUpdateStudentSchedule,
  onDeleteRecord,
}) {
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [showStudentRecords, setShowStudentRecords] = useState(false)
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [lessonAmount, setLessonAmount] = useState('0')
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD_OPTIONS[0])
  const [weekday, setWeekday] = useState(WEEKDAY_OPTIONS[0])
  const [timeSlot, setTimeSlot] = useState('')

  const submitPayment = (event) => {
    event.preventDefault()
    const payment = Number(paymentAmount)
    const lessons = Number(lessonAmount)
    if (Number.isNaN(payment) || payment <= 0) return
    if (Number.isNaN(lessons) || lessons < 0) return

    onPayment(student.id, payment, lessons, paymentMethod)
    setPaymentAmount('')
    setLessonAmount('0')
    setPaymentMethod(PAYMENT_METHOD_OPTIONS[0])
    setShowPaymentForm(false)
  }

  const studentRecords = records.filter((record) => record.studentId === student.id)
  const studentSchedule = student.schedule ?? []

  const addSchedule = (event) => {
    event.preventDefault()
    const trimmedSlot = timeSlot.trim()
    if (!trimmedSlot) return
    const nextSchedule = [
      ...studentSchedule,
      {
        id: crypto.randomUUID(),
        weekday,
        timeSlot: trimmedSlot,
      },
    ]
    onUpdateStudentSchedule(student.id, nextSchedule)
    setTimeSlot('')
  }

  const removeSchedule = (scheduleId) => {
    const nextSchedule = studentSchedule.filter((item) => item.id !== scheduleId)
    onUpdateStudentSchedule(student.id, nextSchedule)
  }

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">{student.name}</h3>
          <p className="mt-1 text-xs text-slate-500">{getBillingTypeLabel(student.billingType)}</p>
        </div>
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

      <button
        type="button"
        onClick={() => setShowPaymentForm((prev) => !prev)}
        className="mt-4 h-11 w-full rounded-xl bg-emerald-500 px-3 text-sm font-semibold text-white"
      >
        {showPaymentForm ? '取消付款' : '付款'}
      </button>

      {showPaymentForm && (
        <form onSubmit={submitPayment} className="mt-3 grid grid-cols-2 gap-2">
          <input
            type="number"
            min="0"
            step="0.01"
            value={paymentAmount}
            onChange={(event) => setPaymentAmount(event.target.value)}
            className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
            placeholder="RM 金额"
          />
          <input
            type="number"
            min="0"
            value={lessonAmount}
            onChange={(event) => setLessonAmount(event.target.value)}
            className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
            placeholder="增加课数(可0)"
          />
          <select
            value={paymentMethod}
            onChange={(event) => setPaymentMethod(event.target.value)}
            className="col-span-2 h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
          >
            {PAYMENT_METHOD_OPTIONS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="col-span-2 h-11 rounded-xl bg-slate-900 px-3 text-sm font-semibold text-white"
          >
            记录付款
          </button>
        </form>
      )}

      <button
        type="button"
        onClick={() => setShowScheduleForm((prev) => !prev)}
        className="mt-3 h-11 w-full rounded-xl bg-indigo-100 px-3 text-sm font-semibold text-indigo-700"
      >
        {showScheduleForm ? '收起上课安排' : '配置上课安排'}
      </button>

      {showScheduleForm && (
        <div className="mt-3 rounded-xl bg-slate-50 p-3">
          <form onSubmit={addSchedule} className="grid grid-cols-2 gap-2">
            <select
              value={weekday}
              onChange={(event) => setWeekday(event.target.value)}
              className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
            >
              {WEEKDAY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <input
              value={timeSlot}
              onChange={(event) => setTimeSlot(event.target.value)}
              className="h-11 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
              placeholder="时段，如 1-3pm"
            />
            <button
              type="submit"
              className="col-span-2 h-11 rounded-xl bg-indigo-600 px-3 text-sm font-semibold text-white"
            >
              添加安排
            </button>
          </form>

          <div className="mt-3 space-y-2">
            {studentSchedule.length === 0 ? (
              <p className="text-xs text-slate-500">尚未添加上课安排</p>
            ) : (
              studentSchedule.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
                  <p className="text-xs text-slate-700">
                    {item.weekday} {item.timeSlot}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeSchedule(item.id)}
                    className="text-xs font-semibold text-rose-600"
                  >
                    删除
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowStudentRecords((prev) => !prev)}
        className="mt-3 h-11 w-full rounded-xl bg-slate-100 px-3 text-sm font-semibold text-slate-700"
      >
        {showStudentRecords ? '收起个人记录' : '查看个人记录'}
      </button>

      {showStudentRecords && (
        <div className="mt-3 rounded-xl bg-slate-50 p-3">
          {studentRecords.length === 0 ? (
            <p className="text-xs text-slate-500">该学生暂无记录</p>
          ) : (
            <div className="space-y-2">
              {studentRecords.map((record) => (
                <div key={record.id} className="rounded-lg bg-white p-2 ring-1 ring-slate-200">
                  <p className="text-xs font-semibold text-slate-700">
                    {record.type === 'recharge'
                      ? `付款 RM ${Number(record.paymentAmount ?? 0).toFixed(2)}`
                      : record.type === 'attendance'
                        ? '点名扣课'
                        : '补课扣课'}
                  </p>
                  {record.type === 'recharge' ? (
                    <>
                      <p className="mt-1 text-xs text-slate-500">增加课数：+{record.amount}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        付款方式：{record.paymentMethod ?? '-'}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-1 text-xs text-slate-500">扣课：{record.amount}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        时段：{record.sessions?.length ? record.sessions.join(', ') : '-'}
                      </p>
                      <button
                        type="button"
                        onClick={() => onDeleteRecord(record.id)}
                        className="mt-2 rounded-lg bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600"
                      >
                        删除扣课
                      </button>
                    </>
                  )}
                  <p className="mt-1 text-xs text-slate-400">{formatDateTime(record.date)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  )
}

function StudentList({
  students,
  searchKeyword,
  onSearch,
  onOpenAddModal,
  onDeleteStudent,
  onPayment,
  records,
  onUpdateStudentSchedule,
  onDeleteRecord,
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
              onPayment={onPayment}
              records={records}
              onUpdateStudentSchedule={onUpdateStudentSchedule}
              onDeleteRecord={onDeleteRecord}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default StudentList

