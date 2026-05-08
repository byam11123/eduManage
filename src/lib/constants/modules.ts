export const AVAILABLE_MODULES = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'enquiry', label: 'Enquiry', icon: '📋' },
  { id: 'leads', label: 'Leads', icon: '👥' },
  { id: 'students', label: 'Students', icon: '🎓' },
  { id: 'fees', label: 'Fees', icon: '💰' },
  { id: 'batches', label: 'Batches', icon: '👥' },
  { id: 'attendance', label: 'Attendance', icon: '📅' },
  { id: 'courses', label: 'Courses', icon: '📚' },
  { id: 'branches', label: 'Branches', icon: '🏢' },
  { id: 'staff', label: 'Staff', icon: '👥' },
  { id: 'timetable', label: 'Time Table', icon: '🕒' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'notice', label: 'Notice Board', icon: '📢' },
  { id: 'tickets', label: 'Tickets', icon: '🎫' },
  { id: 'forms', label: 'Forms', icon: '📝' },
  { id: 'expenses', label: 'Expenses', icon: '💸' },
  { id: 'certificate', label: 'Certificate', icon: '📜' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
] as const

export type ModuleId = typeof AVAILABLE_MODULES[number]['id']
