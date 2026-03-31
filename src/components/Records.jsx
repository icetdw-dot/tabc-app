import { useMemo, useState } from 'react'

const typeLabelMap = {
  attendance: '点名',
  makeup: '补课',
  recharge: '付款',
}

const typeColorMap = {
  attendance: 'text-blue-600 bg-blue-50',
  makeup: 'text-violet-600 bg-violet-50',
  recharge: 'text-emerald-600 bg-emerald-50',
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString('zh-CN', {
    hour12: false,
  })
}

function getDateOnly(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Records({ records, studentsMap }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedDate, setSelectedDate] = useState('')

  const filteredRecords = useMemo(() => {
    let nextRecords = records

    if (activeFilter === 'attendance') {
      nextRecords = records.filter(
        (record) => record.type === 'attendance' || record.type === 'makeup',
      )
    }
    if (activeFilter === 'payment') {
      nextRecords = records.filter((record) => record.type === 'recharge')
    }

    if ((activeFilter === 'attendance' || activeFilter === 'payment') && selectedDate) {
      nextRecords = nextRecords.filter(
        (record) => getDateOnly(record.date) === selectedDate,
      )
    }

    return nextRecords
  }, [records, activeFilter, selectedDate])

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`rounded-2xl py-2 text-xs font-medium ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          全部
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('attendance')}
          className={`rounded-2xl py-2 text-xs font-medium ${
            activeFilter === 'attendance'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          点名历史
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('payment')}
          className={`rounded-2xl py-2 text-xs font-medium ${
            activeFilter === 'payment'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          付款记录
        </button>
      </div>

      {(activeFilter === 'attendance' || activeFilter === 'payment') && (
        <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
          <label className="mb-1 block text-xs font-medium text-slate-500">
            {activeFilter === 'attendance'
              ? '选择日期查看当天点名历史'
              : '选择日期查看当天付款记录'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-10 flex-1 rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
            />
            <button
              type="button"
              onClick={() => setSelectedDate('')}
              className="h-10 rounded-xl bg-slate-100 px-3 text-xs font-medium text-slate-700"
            >
              清除
            </button>
          </div>
        </div>
      )}

      {filteredRecords.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
          暂无操作记录。
        </div>
      ) : (
        filteredRecords.map((record) => {
          const studentName = studentsMap[record.studentId]?.name ?? '已删除学生'
          const amountPrefix = record.amount > 0 ? '+' : ''
          return (
            <article
              key={record.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-base font-semibold">{studentName}</h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    typeColorMap[record.type]
                  }`}
                >
                  {typeLabelMap[record.type]}
                </span>
              </div>
              {record.type === 'recharge' ? (
                <>
                  <p className="mt-2 text-sm text-slate-600">
                    收款：RM {Number(record.paymentAmount ?? 0).toFixed(2)}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    增加课数：+{record.amount}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-slate-600">
                  课时变动：{amountPrefix}
                  {record.amount}
                </p>
              )}
              <p className="mt-1 text-xs text-slate-500">{formatDate(record.date)}</p>
            </article>
          )
        })
      )}
    </section>
  )
}

export default Records

