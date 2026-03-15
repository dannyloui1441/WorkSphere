export type EmployeeStatus = 'online' | 'away' | 'offline'
export type AttendanceStatus = 'early' | 'on-time' | 'late' | 'absent'

export interface AdminEmployee {
  id: string
  name: string
  role: string
  email: string
  joinDate: string
  status: EmployeeStatus
  kudosBalance: number
  tasksCompleted: number
  attendanceRate: number
  streak: number
  totalHoursWorked: number
  avatar: string
}

export interface TodayAttendance {
  employeeId: string
  name: string
  role: string
  avatar: string
  status: AttendanceStatus
  checkIn: string | null
  checkOut: string | null
  hoursWorked: number
  weekStreak: number
}

export interface AdminTask {
  id: string
  title: string
  assignedTo: string
  assignedToId: string
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string
  kudos: number
  priority: 'high' | 'medium' | 'low'
}

export interface EmployeeKudosTransaction {
  id: string
  employeeId: string
  type: 'earned' | 'spent'
  category: 'task' | 'attendance' | 'bonus' | 'redemption'
  description: string
  amount: number
  date: string
  balance: number
}

export interface EmployeeAttendanceRecord {
  date: string
  status: AttendanceStatus
  checkIn: string | null
  checkOut: string | null
  hoursWorked: number
}

export const adminEmployees: AdminEmployee[] = [
  { 
    id: 'EMP001', 
    name: 'K Ramachandran', 
    role: 'Software Engineer', 
    email: 'kraman@worksphere.com', 
    joinDate: 'Jan 15, 2024', 
    status: 'online', 
    kudosBalance: 320, 
    tasksCompleted: 24, 
    attendanceRate: 94, 
    streak: 8,
    totalHoursWorked: 1248,
    avatar: '/placeholder.svg?height=80&width=80'
  },
  { 
    id: 'EMP002', 
    name: 'Daniel', 
    role: 'UX Designer', 
    email: 'daniel@worksphere.com', 
    joinDate: 'Mar 3, 2024', 
    status: 'online', 
    kudosBalance: 245, 
    tasksCompleted: 18, 
    attendanceRate: 89, 
    streak: 3,
    totalHoursWorked: 892,
    avatar: '/placeholder.svg?height=80&width=80'
  },
  { 
    id: 'EMP003', 
    name: 'Benito', 
    role: 'Backend Developer', 
    email: 'benito@worksphere.com', 
    joinDate: 'Feb 10, 2024', 
    status: 'away', 
    kudosBalance: 180, 
    tasksCompleted: 21, 
    attendanceRate: 82, 
    streak: 0,
    totalHoursWorked: 1056,
    avatar: '/placeholder.svg?height=80&width=80'
  },
  { 
    id: 'EMP004', 
    name: 'Swithin', 
    role: 'QA Engineer', 
    email: 'swithin@worksphere.com', 
    joinDate: 'Apr 22, 2024', 
    status: 'offline', 
    kudosBalance: 195, 
    tasksCompleted: 15, 
    attendanceRate: 78, 
    streak: 0,
    totalHoursWorked: 624,
    avatar: '/placeholder.svg?height=80&width=80'
  },
  { 
    id: 'EMP005', 
    name: 'John', 
    role: 'Project Manager', 
    email: 'john@worksphere.com', 
    joinDate: 'Jan 2, 2024', 
    status: 'online', 
    kudosBalance: 410, 
    tasksCompleted: 31, 
    attendanceRate: 97, 
    streak: 12,
    totalHoursWorked: 1420,
    avatar: '/placeholder.svg?height=80&width=80'
  },
]

export const todayAttendance: TodayAttendance[] = [
  { 
    employeeId: 'EMP001', 
    name: 'K Ramachandran', 
    role: 'Software Engineer',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'on-time', 
    checkIn: '8:52 AM', 
    checkOut: null,
    hoursWorked: 6.2,
    weekStreak: 8
  },
  { 
    employeeId: 'EMP002', 
    name: 'Daniel', 
    role: 'UX Designer',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'on-time', 
    checkIn: '9:05 AM', 
    checkOut: null,
    hoursWorked: 5.9,
    weekStreak: 3
  },
  { 
    employeeId: 'EMP003', 
    name: 'Benito', 
    role: 'Backend Developer',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'late', 
    checkIn: '9:28 AM', 
    checkOut: null,
    hoursWorked: 5.5,
    weekStreak: 0
  },
  { 
    employeeId: 'EMP004', 
    name: 'Swithin', 
    role: 'QA Engineer',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'absent', 
    checkIn: null, 
    checkOut: null,
    hoursWorked: 0,
    weekStreak: 0
  },
  { 
    employeeId: 'EMP005', 
    name: 'John', 
    role: 'Project Manager',
    avatar: '/placeholder.svg?height=40&width=40',
    status: 'early', 
    checkIn: '8:45 AM', 
    checkOut: null,
    hoursWorked: 6.3,
    weekStreak: 12
  },
]

export const adminTasks: AdminTask[] = [
  { 
    id: 'TASK-1001', 
    title: 'Complete quarterly report', 
    assignedTo: 'K Ramachandran', 
    assignedToId: 'EMP001',
    status: 'in-progress', 
    dueDate: 'Today',
    kudos: 75,
    priority: 'high'
  },
  { 
    id: 'TASK-1002', 
    title: 'Design new dashboard mockups', 
    assignedTo: 'Daniel', 
    assignedToId: 'EMP002',
    status: 'pending', 
    dueDate: 'Tomorrow',
    kudos: 50,
    priority: 'medium'
  },
  { 
    id: 'TASK-1003', 
    title: 'Fix API authentication bug', 
    assignedTo: 'Benito', 
    assignedToId: 'EMP003',
    status: 'completed', 
    dueDate: 'Yesterday',
    kudos: 65,
    priority: 'high'
  },
  { 
    id: 'TASK-1004', 
    title: 'Write test cases for payment module', 
    assignedTo: 'Swithin', 
    assignedToId: 'EMP004',
    status: 'pending', 
    dueDate: 'Friday',
    kudos: 40,
    priority: 'medium'
  },
  { 
    id: 'TASK-1005', 
    title: 'Sprint planning preparation', 
    assignedTo: 'John', 
    assignedToId: 'EMP005',
    status: 'in-progress', 
    dueDate: 'Today',
    kudos: 50,
    priority: 'high'
  },
  { 
    id: 'TASK-1006', 
    title: 'Review pull requests', 
    assignedTo: 'K Ramachandran', 
    assignedToId: 'EMP001',
    status: 'pending', 
    dueDate: 'Today',
    kudos: 25,
    priority: 'low'
  },
  { 
    id: 'TASK-1007', 
    title: 'Update component library', 
    assignedTo: 'Daniel', 
    assignedToId: 'EMP002',
    status: 'completed', 
    dueDate: 'Yesterday',
    kudos: 40,
    priority: 'medium'
  },
  { 
    id: 'TASK-1008', 
    title: 'Database optimization', 
    assignedTo: 'Benito', 
    assignedToId: 'EMP003',
    status: 'in-progress', 
    dueDate: 'Tomorrow',
    kudos: 75,
    priority: 'high'
  },
]

export function getEmployeeTasks(employeeId: string): AdminTask[] {
  return adminTasks.filter(task => task.assignedToId === employeeId)
}

export function getEmployeeKudosHistory(employeeId: string): EmployeeKudosTransaction[] {
  const employee = adminEmployees.find(e => e.id === employeeId)
  if (!employee) return []
  
  // Generate mock transaction history
  const transactions: EmployeeKudosTransaction[] = [
    { id: 'TXN001', employeeId, type: 'earned', category: 'task', description: 'Task Completed: API Integration', amount: 200, date: 'Mar 14, 2026', balance: employee.kudosBalance },
    { id: 'TXN002', employeeId, type: 'earned', category: 'attendance', description: 'Perfect Attendance Bonus', amount: 50, date: 'Mar 13, 2026', balance: employee.kudosBalance - 200 },
    { id: 'TXN003', employeeId, type: 'spent', category: 'redemption', description: 'Redeemed: Coffee Gift Card', amount: 100, date: 'Mar 12, 2026', balance: employee.kudosBalance - 250 },
    { id: 'TXN004', employeeId, type: 'earned', category: 'task', description: 'Task Completed: Code Review', amount: 75, date: 'Mar 11, 2026', balance: employee.kudosBalance - 150 },
    { id: 'TXN005', employeeId, type: 'earned', category: 'bonus', description: 'Performance Bonus - Q1', amount: 500, date: 'Mar 10, 2026', balance: employee.kudosBalance - 225 },
    { id: 'TXN006', employeeId, type: 'earned', category: 'task', description: 'Task Completed: Bug Fix', amount: 125, date: 'Mar 9, 2026', balance: employee.kudosBalance - 725 },
    { id: 'TXN007', employeeId, type: 'spent', category: 'redemption', description: 'Redeemed: Work From Home Day', amount: 200, date: 'Mar 8, 2026', balance: employee.kudosBalance - 850 },
    { id: 'TXN008', employeeId, type: 'earned', category: 'attendance', description: 'Early Check-in Bonus', amount: 25, date: 'Mar 7, 2026', balance: employee.kudosBalance - 650 },
  ]
  
  return transactions
}

export function getEmployeeAttendanceHistory(employeeId: string): EmployeeAttendanceRecord[] {
  // Generate March 2026 attendance data
  const records: EmployeeAttendanceRecord[] = []
  const statuses: AttendanceStatus[] = ['early', 'on-time', 'late', 'absent']
  
  for (let day = 1; day <= 15; day++) {
    const date = `2026-03-${day.toString().padStart(2, '0')}`
    const dayOfWeek = new Date(date).getDay()
    
    // Skip weekends
    if (dayOfWeek === 0 || dayOfWeek === 6) continue
    
    // Generate somewhat realistic attendance
    const rand = Math.random()
    let status: AttendanceStatus
    let checkIn: string | null = null
    let checkOut: string | null = null
    let hoursWorked = 0
    
    if (rand < 0.1) {
      status = 'absent'
    } else if (rand < 0.25) {
      status = 'late'
      checkIn = `9:${(15 + Math.floor(Math.random() * 30)).toString().padStart(2, '0')} AM`
      checkOut = `5:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`
      hoursWorked = 7 + Math.random()
    } else if (rand < 0.5) {
      status = 'early'
      checkIn = `8:${(30 + Math.floor(Math.random() * 25)).toString().padStart(2, '0')} AM`
      checkOut = `5:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`
      hoursWorked = 8 + Math.random()
    } else {
      status = 'on-time'
      checkIn = `9:0${Math.floor(Math.random() * 10)} AM`
      checkOut = `5:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} PM`
      hoursWorked = 8 + Math.random() * 0.5
    }
    
    records.push({ date, status, checkIn, checkOut, hoursWorked: Math.round(hoursWorked * 10) / 10 })
  }
  
  return records.reverse()
}

export const adminStats = {
  totalEmployees: 5,
  checkedInToday: 4,
  activeTasks: 8,
  kudosDistributedThisMonth: 1240
}
