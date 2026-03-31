import { useMemo, useState } from 'react'
import StudentList from './components/StudentList'
import Attendance from './components/Attendance'
import Records from './components/Records'
import AddStudentModal from './components/AddStudentModal'
import { loadAppData, saveAppData } from './utils/storage'

const TABS = [
  { key: 'students', label: '学生' },
  { key: 'attendance', label: '点名' },
  { key: 'records', label: '记录' },
]

function createRecord(studentId, type, amount, paymentAmount = null) {
  return {
    id: crypto.randomUUID(),
    studentId,
    type,
    amount,
    paymentAmount,
    date: new Date().toISOString(),
  }
}

function App() {
  const [appData, setAppData] = useState(() => loadAppData())
  const [activeTab, setActiveTab] = useState('students')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')

  const sortedRecords = useMemo(
    () =>
      [...appData.records].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [appData.records],
  )

  const studentsMap = useMemo(
    () => Object.fromEntries(appData.students.map((student) => [student.id, student])),
    [appData.students],
  )

  const persistData = (nextData) => {
    setAppData(nextData)
    saveAppData(nextData)
  }

  const handleAddStudent = (name, initialLessons) => {
    const studentId = crypto.randomUUID()
    const nextStudents = [
      {
        id: studentId,
        name: name.trim(),
        remainingLessons: initialLessons,
      },
      ...appData.students,
    ]
    persistData({ students: nextStudents, records: appData.records })
  }

  const handleDeleteStudent = (studentId) => {
    const nextStudents = appData.students.filter((student) => student.id !== studentId)
    persistData({ ...appData, students: nextStudents })
  }

  const handlePayment = (studentId, paymentAmount, lessonAmount) => {
    const nextStudents = appData.students.map((student) =>
      student.id === studentId
        ? { ...student, remainingLessons: student.remainingLessons + lessonAmount }
        : student,
    )

    const nextRecords = [
      createRecord(studentId, 'recharge', lessonAmount, paymentAmount),
      ...appData.records,
    ]
    persistData({ students: nextStudents, records: nextRecords })
  }

  const handleDeductLesson = (studentId, type) => {
    const targetStudent = appData.students.find((student) => student.id === studentId)
    if (!targetStudent || targetStudent.remainingLessons <= 0) return

    const nextStudents = appData.students.map((student) =>
      student.id === studentId
        ? { ...student, remainingLessons: student.remainingLessons - 1 }
        : student,
    )

    const nextRecords = [createRecord(studentId, type, -1), ...appData.records]
    persistData({ students: nextStudents, records: nextRecords })
  }

  const filteredStudents = useMemo(() => {
    const normalizedKeyword = searchKeyword.trim().toLowerCase()
    if (!normalizedKeyword) return appData.students

    return appData.students.filter((student) =>
      student.name.toLowerCase().includes(normalizedKeyword),
    )
  }, [appData.students, searchKeyword])

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
        <h1 className="text-xl font-semibold">TABC 点名系统</h1>
        <p className="mt-1 text-xs text-slate-500">Mobile-first / PWA / localStorage</p>
      </header>

      <main className="flex-1 px-4 pb-24 pt-4">
        {activeTab === 'students' && (
          <StudentList
            students={filteredStudents}
            searchKeyword={searchKeyword}
            onSearch={setSearchKeyword}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onDeleteStudent={handleDeleteStudent}
            onPayment={handlePayment}
          />
        )}

        {activeTab === 'attendance' && (
          <Attendance students={appData.students} onDeductLesson={handleDeductLesson} />
        )}

        {activeTab === 'records' && (
          <Records records={sortedRecords} studentsMap={studentsMap} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t border-slate-200 bg-white">
        <div className="mx-auto grid w-full max-w-md grid-cols-3 gap-2 px-4 py-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-2xl py-3 text-sm font-medium transition ${
                  isActive ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      <AddStudentModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddStudent}
      />
    </div>
  )
}

export default App
