const typeLabelMap = {
  attendance: '点名',
  makeup: '补课',
  recharge: '充值',
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

function Records({ records, studentsMap }) {
  return (
    <section className="space-y-3">
      {records.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
          暂无操作记录。
        </div>
      ) : (
        records.map((record) => {
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
              <p className="mt-2 text-sm text-slate-600">课时变动：{amountPrefix}{record.amount}</p>
              <p className="mt-1 text-xs text-slate-500">{formatDate(record.date)}</p>
            </article>
          )
        })
      )}
    </section>
  )
}

export default Records

