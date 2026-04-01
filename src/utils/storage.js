const STORAGE_KEY = 'tabc-app-data-v1'

const defaultData = {
  students: [],
  records: [],
}

export function loadAppData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultData
    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed.students) || !Array.isArray(parsed.records)) {
      return defaultData
    }

    const students = parsed.students.map((student) => ({
      ...student,
      schedule: Array.isArray(student.schedule) ? student.schedule : [],
    }))

    const records = parsed.records.map((record) => ({
      ...record,
      sessions: Array.isArray(record.sessions) ? record.sessions : [],
      paymentAmount:
        typeof record.paymentAmount === 'number' ? record.paymentAmount : null,
    }))

    return { students, records }
  } catch {
    return defaultData
  }
}

export function saveAppData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

