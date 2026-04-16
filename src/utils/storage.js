const STORAGE_KEY = 'tabc-app-data'
const LEGACY_STORAGE_KEYS = ['tabc-app-data-v1']
const CURRENT_SCHEMA_VERSION = 3

const defaultData = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  students: [],
  records: [],
}

function normalizeData(rawData) {
  if (!rawData || !Array.isArray(rawData.students) || !Array.isArray(rawData.records)) {
    return defaultData
  }

  const students = rawData.students.map((student) => ({
    ...student,
    billingType: student.billingType === 'dropin' ? 'dropin' : 'monthly',
    schedule: Array.isArray(student.schedule) ? student.schedule : [],
  }))

  const records = rawData.records.map((record) => ({
    ...record,
    sessions: Array.isArray(record.sessions) ? record.sessions : [],
    paymentAmount:
      typeof record.paymentAmount === 'number' ? record.paymentAmount : null,
    paymentMethod:
      typeof record.paymentMethod === 'string' ? record.paymentMethod : null,
  }))

  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    students,
    records,
  }
}

export function loadAppData() {
  try {
    const candidateKeys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS]
    const sourceKey = candidateKeys.find((key) => localStorage.getItem(key))
    const raw = sourceKey ? localStorage.getItem(sourceKey) : null
    if (!raw) return defaultData
    const parsed = JSON.parse(raw)
    const normalized = normalizeData(parsed)

    // Migrate legacy key or old schema to latest key format.
    if (sourceKey !== STORAGE_KEY || parsed.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
    }

    return normalized
  } catch {
    return defaultData
  }
}

export function saveAppData(data) {
  const normalized = normalizeData(data)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized))
}

