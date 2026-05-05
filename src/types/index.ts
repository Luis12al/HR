export interface Employee {
  id: string
  cedula: string
  fullName: string
  email: string
  phone: string
  position: string
  department: string
  hireDate: string
  status: 'active' | 'inactive' | 'on_leave'
  photo?: string
  salary: number
  schedule: WorkSchedule
  isOnShift: boolean
  shiftStart?: string
  shiftEnd?: string
  location?: string
  documents: EmployeeDocument[]
  courses: Course[]
  attendance: AttendanceRecord[]
  requests: Request[]
  reports: Report[]
}

export interface WorkSchedule {
  monday: { start: string; end: string; enabled: boolean }
  tuesday: { start: string; end: string; enabled: boolean }
  wednesday: { start: string; end: string; enabled: boolean }
  thursday: { start: string; end: string; enabled: boolean }
  friday: { start: string; end: string; enabled: boolean }
  saturday: { start: string; end: string; enabled: boolean }
  sunday: { start: string; end: string; enabled: boolean }
}

export interface EmployeeDocument {
  id: string
  name: string
  type: 'contract' | 'certificate' | 'license' | 'insurance' | 'other'
  fileUrl?: string
  issueDate: string
  expiryDate?: string
  status: 'valid' | 'expired' | 'pending' | 'missing'
  description?: string
}

export interface AttendanceRecord {
  id: string
  date: string
  checkIn: string
  checkOut?: string
  location?: string
  isLate: boolean
  notes?: string
}

export interface Course {
  id: string
  title: string
  description: string
  category: 'academic' | 'technical' | 'process' | 'soft_skills'
  duration: string
  status: 'available' | 'in_progress' | 'completed'
  progress: number
  instructor: string
  startDate?: string
  endDate?: string
  thumbnail?: string
}

export interface Request {
  id: string
  type: 'vacation' | 'incapacity' | 'permission' | 'other'
  status: 'pending' | 'approved' | 'rejected'
  startDate: string
  endDate: string
  reason: string
  createdAt: string
  approvedBy?: string
  approvedAt?: string
  attachments?: string[]
}

export interface Report {
  id: string
  type: 'document_missing' | 'document_expired' | 'violation' | 'meeting' | 'request' | 'attendance' | 'other'
  title: string
  description: string
  employeeId?: string
  employeeName?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved'
  createdAt: string
  resolvedAt?: string
  createdBy: string
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'employee'
  employeeId?: string
  name: string
  avatar?: string
}

export interface DashboardStats {
  totalEmployees: number
  activeEmployees: number
  onShiftEmployees: number
  lateToday: number
  pendingRequests: number
  expiredDocuments: number
  openReports: number
  newHiresThisMonth: number
}

export interface RecruitmentCandidate {
  id: string
  fullName: string
  email: string
  phone: string
  position: string
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected'
  appliedDate: string
  experience: string
  skills: string[]
  notes?: string
  rating: number
}
