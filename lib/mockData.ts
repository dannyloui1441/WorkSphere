export type TaskStatus = 'pending' | 'acknowledged' | 'completed'
export type TaskPriority = 'high' | 'medium' | 'low'
export type TeamMemberStatus = 'online' | 'away' | 'offline'

export interface Task {
  id: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  dueTime: string
  coins: number
  status: TaskStatus
  assignedBy: string
  assignedAt: string
  isTeamTask?: boolean
  assignedTo?: string[]
}

export interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  status: TeamMemberStatus
}

export interface Transaction {
  id: string
  type: 'earned' | 'spent'
  description: string
  amount: number
  date: string
  taskId?: string
  rewardId?: string
}

export interface Reward {
  id: string
  name: string
  description: string
  cost: number
  category: string
  icon: string
  popular?: boolean
}

export interface TimeRecord {
  checkIn: string
  checkOut?: string
}

export interface DayRecord {
  date: Date
  totalHours: number
  records: TimeRecord[]
  tasks: Task[]
}

export interface AttendanceRecord {
  date: string // 'YYYY-MM-DD'
  checkIn: string | null // '09:05' or null if absent
  checkOut: string | null
  hoursWorked: number
  tasksReceived: number
  tasksCompleted: number
  coinsEarned: number
  coinsRedeemed: number
  status: 'early' | 'on-time' | 'late' | 'absent'
}

// Attendance data for March 2026
export const attendanceData: AttendanceRecord[] = [
  { date: '2026-03-02', checkIn: '08:45', checkOut: '17:30', hoursWorked: 8.75, tasksReceived: 4, tasksCompleted: 4, coinsEarned: 175, coinsRedeemed: 0, status: 'early' },
  { date: '2026-03-03', checkIn: '09:02', checkOut: '17:15', hoursWorked: 8.2, tasksReceived: 3, tasksCompleted: 3, coinsEarned: 125, coinsRedeemed: 100, status: 'on-time' },
  { date: '2026-03-04', checkIn: '09:18', checkOut: '18:00', hoursWorked: 8.7, tasksReceived: 5, tasksCompleted: 4, coinsEarned: 150, coinsRedeemed: 0, status: 'late' },
  { date: '2026-03-05', checkIn: '08:55', checkOut: '17:45', hoursWorked: 8.8, tasksReceived: 3, tasksCompleted: 3, coinsEarned: 100, coinsRedeemed: 0, status: 'on-time' },
  { date: '2026-03-06', checkIn: '08:30', checkOut: '16:30', hoursWorked: 8.0, tasksReceived: 2, tasksCompleted: 2, coinsEarned: 75, coinsRedeemed: 0, status: 'early' },
  { date: '2026-03-09', checkIn: '09:08', checkOut: '17:30', hoursWorked: 8.4, tasksReceived: 4, tasksCompleted: 3, coinsEarned: 110, coinsRedeemed: 150, status: 'on-time' },
  { date: '2026-03-10', checkIn: null, checkOut: null, hoursWorked: 0, tasksReceived: 0, tasksCompleted: 0, coinsEarned: 0, coinsRedeemed: 0, status: 'absent' },
  { date: '2026-03-11', checkIn: '08:50', checkOut: '18:15', hoursWorked: 9.4, tasksReceived: 6, tasksCompleted: 5, coinsEarned: 200, coinsRedeemed: 0, status: 'early' },
  { date: '2026-03-12', checkIn: '09:25', checkOut: '17:45', hoursWorked: 8.3, tasksReceived: 4, tasksCompleted: 4, coinsEarned: 140, coinsRedeemed: 0, status: 'late' },
  { date: '2026-03-13', checkIn: '09:10', checkOut: '17:30', hoursWorked: 8.3, tasksReceived: 3, tasksCompleted: 2, coinsEarned: 85, coinsRedeemed: 200, status: 'on-time' }
]

export interface ChatMessage {
  id: string
  senderId: string
  message: string
  timestamp: string
}

export const currentUser: TeamMember = {
  id: 'EMP001',
  name: 'K Ramachandran',
  role: 'Software Engineer',
  avatar: '/placeholder.svg?height=80&width=80',
  status: 'online'
}

export const teamMembers: TeamMember[] = [
  currentUser,
  {
    id: 'EMP002',
    name: 'Alex Johnson',
    role: 'Project Manager',
    avatar: '/placeholder.svg?height=80&width=80',
    status: 'online'
  },
  {
    id: 'EMP003',
    name: 'Sarah Williams',
    role: 'UX Designer',
    avatar: '/placeholder.svg?height=80&width=80',
    status: 'away'
  },
  {
    id: 'EMP004',
    name: 'Michael Brown',
    role: 'Backend Developer',
    avatar: '/placeholder.svg?height=80&width=80',
    status: 'offline'
  },
  {
    id: 'EMP005',
    name: 'Emily Davis',
    role: 'QA Engineer',
    avatar: '/placeholder.svg?height=80&width=80',
    status: 'offline'
  }
]

export const tasks: Task[] = [
  {
    id: 'TASK-1234',
    title: 'Complete quarterly report',
    description: 'Prepare and submit the Q4 financial report with all department summaries',
    priority: 'high',
    dueDate: 'Today',
    dueTime: '5:00 PM',
    coins: 35,
    status: 'pending',
    assignedBy: 'Alex Johnson',
    assignedAt: 'Mar 14 2026 9:00 AM',
    isTeamTask: false
  },
  {
    id: 'TASK-1235',
    title: 'Review new employee documents',
    description: 'Review and approve onboarding documents for three new hires',
    priority: 'medium',
    dueDate: 'Tomorrow',
    dueTime: '12:00 PM',
    coins: 20,
    status: 'acknowledged',
    assignedBy: 'Sarah Williams',
    assignedAt: 'Mar 13 2026 10:30 AM',
    isTeamTask: false
  },
  {
    id: 'TASK-1236',
    title: 'Update client presentation',
    description: 'Revise the pitch deck with new product features and pricing',
    priority: 'low',
    dueDate: 'Friday',
    dueTime: '3:00 PM',
    coins: 25,
    status: 'completed',
    assignedBy: 'Michael Brown',
    assignedAt: 'Mar 12 2026 2:00 PM',
    isTeamTask: false
  },
  {
    id: 'TASK-1237',
    title: 'Prepare for team meeting',
    description: 'Create agenda and gather status updates from all team members',
    priority: 'medium',
    dueDate: 'Tomorrow',
    dueTime: '9:00 AM',
    coins: 15,
    status: 'pending',
    assignedBy: 'Emily Davis',
    assignedAt: 'Mar 14 2026 11:00 AM',
    isTeamTask: false
  },
  {
    id: 'TASK-1238',
    title: 'Code review for new feature',
    description: 'Review pull request for the new authentication module',
    priority: 'high',
    dueDate: 'Today',
    dueTime: '4:00 PM',
    coins: 30,
    status: 'acknowledged',
    assignedBy: 'David Wilson',
    assignedAt: 'Mar 14 2026 8:30 AM',
    isTeamTask: false
  },
  {
    id: 'TASK-1239',
    title: 'Sprint Planning Preparation',
    description: 'Prepare sprint backlog, story points, and agenda for the upcoming two-week sprint planning session',
    priority: 'high',
    dueDate: 'Tomorrow',
    dueTime: '2:00 PM',
    coins: 100,
    status: 'pending',
    assignedBy: 'Alex Johnson',
    assignedAt: 'Mar 14 2026 9:00 AM',
    isTeamTask: true,
    assignedTo: ['EMP001', 'EMP002', 'EMP003', 'EMP004', 'EMP005']
  },
  {
    id: 'TASK-1240',
    title: 'UI Component Library Update',
    description: 'Update shared component library with new design tokens and document all changes',
    priority: 'medium',
    dueDate: 'Friday',
    dueTime: '5:00 PM',
    coins: 150,
    status: 'acknowledged',
    assignedBy: 'Sarah Williams',
    assignedAt: 'Mar 13 2026 11:00 AM',
    isTeamTask: true,
    assignedTo: ['EMP001', 'EMP003']
  },
  {
    id: 'TASK-1241',
    title: 'API Performance Testing',
    description: 'Run load tests on the new payment API endpoints and document results',
    priority: 'high',
    dueDate: 'Today',
    dueTime: '6:00 PM',
    coins: 125,
    status: 'pending',
    assignedBy: 'Michael Brown',
    assignedAt: 'Mar 14 2026 8:30 AM',
    isTeamTask: true,
    assignedTo: ['EMP001', 'EMP004']
  }
]

export const transactions: Transaction[] = [
  { id: 'TXN001', type: 'earned', description: 'Task Completed: Bug Fix', amount: 75, date: '2024-01-15', taskId: 'TASK-1230' },
  { id: 'TXN002', type: 'spent', description: 'Redeemed: Coffee Gift Card', amount: 100, date: '2024-01-14', rewardId: 'RWD001' },
  { id: 'TXN003', type: 'earned', description: 'Task Completed: Code Review', amount: 50, date: '2024-01-13', taskId: 'TASK-1229' },
  { id: 'TXN004', type: 'earned', description: 'Task Completed: Documentation', amount: 100, date: '2024-01-12', taskId: 'TASK-1228' },
  { id: 'TXN005', type: 'spent', description: 'Redeemed: Flexible Start Time', amount: 150, date: '2024-01-11', rewardId: 'RWD006' },
  { id: 'TXN006', type: 'earned', description: 'Task Completed: Sprint Planning', amount: 125, date: '2024-01-10', taskId: 'TASK-1227' },
  { id: 'TXN007', type: 'spent', description: 'Redeemed: Skip Meeting Pass', amount: 100, date: '2024-01-09', rewardId: 'RWD004' },
  { id: 'TXN008', type: 'earned', description: 'Task Completed: API Integration', amount: 200, date: '2024-01-08', taskId: 'TASK-1226' }
]

export const rewards: Reward[] = [
  { id: 'RWD001', name: 'Coffee Gift Card', description: 'Get a $10 coffee shop gift card', cost: 100, category: 'Gift Cards', icon: 'Coffee', popular: true },
  { id: 'RWD002', name: 'Work From Home Day', description: 'Enjoy a remote work day of your choice', cost: 200, category: 'Flexibility', icon: 'Home', popular: true },
  { id: 'RWD003', name: 'Movie Tickets', description: 'Two tickets to any movie', cost: 200, category: 'Entertainment', icon: 'Film' },
  { id: 'RWD004', name: 'Skip One Meeting Pass', description: 'Skip one non-essential meeting', cost: 100, category: 'Flexibility', icon: 'CalendarX' },
  { id: 'RWD005', name: 'Company Swag', description: 'Choose from our premium merch collection', cost: 150, category: 'Merchandise', icon: 'Gift' },
  { id: 'RWD006', name: 'Flexible Start Time', description: 'Start 2 hours later for one day', cost: 150, category: 'Flexibility', icon: 'Clock' },
  { id: 'RWD007', name: 'Amazon Gift Card', description: '$25 Amazon gift card', cost: 350, category: 'Gift Cards', icon: 'ShoppingBag' },
  { id: 'RWD008', name: 'Extra Day Off', description: 'One additional PTO day', cost: 500, category: 'Time Off', icon: 'Calendar', popular: true },
  { id: 'RWD009', name: 'Online Course Voucher', description: 'Up to $50 for any online course', cost: 400, category: 'Learning', icon: 'GraduationCap' },
  { id: 'RWD010', name: 'Team Lunch Pick', description: 'Choose the restaurant for team lunch', cost: 400, category: 'Social', icon: 'Utensils' },
  { id: 'RWD011', name: 'LinkedIn Recommendation', description: 'Personal recommendation from leadership', cost: 500, category: 'Career', icon: 'Award' },
  { id: 'RWD012', name: 'Lunch with CEO', description: 'One-on-one lunch with the CEO', cost: 750, category: 'Career', icon: 'Users' },
  { id: 'RWD013', name: 'Gym Membership Month', description: 'One month gym membership coverage', cost: 500, category: 'Wellness', icon: 'Dumbbell' },
  { id: 'RWD014', name: 'Travel Voucher', description: '$100 travel voucher', cost: 1500, category: 'Travel', icon: 'Plane' }
]

export const initialKudosData = {
  balance: 320,
  lifetimeEarned: 890,
  thisMonthEarned: 85,
  thisMonthSpent: 60
}

export const chatMessages: ChatMessage[] = [
  { id: 'MSG001', senderId: 'EMP002', message: 'Hey team, how is the quarterly report coming along?', timestamp: '9:15 AM' },
  { id: 'MSG002', senderId: 'EMP001', message: 'Making good progress! Should be done by 3 PM today.', timestamp: '9:18 AM' },
  { id: 'MSG003', senderId: 'EMP003', message: 'I can help with the design sections if needed.', timestamp: '9:22 AM' },
  { id: 'MSG004', senderId: 'EMP002', message: 'That would be great Sarah, thanks!', timestamp: '9:25 AM' },
  { id: 'MSG005', senderId: 'EMP004', message: 'Let me know if you need any data from the backend.', timestamp: '9:30 AM' },
  { id: 'MSG006', senderId: 'EMP001', message: 'Will do! I might need the API metrics later.', timestamp: '9:32 AM' }
]

export const weeklyHoursData = [
  { day: 'Mon', hours: 8.5 },
  { day: 'Tue', hours: 7.5 },
  { day: 'Wed', hours: 9 },
  { day: 'Thu', hours: 8 },
  { day: 'Fri', hours: 5.5 }
]

export const taskCompletionData = [
  { name: 'Completed', value: 12, fill: 'var(--color-success)' },
  { name: 'In Progress', value: 5, fill: 'var(--color-primary)' },
  { name: 'Pending', value: 3, fill: 'var(--color-warning)' }
]

export const earningsByTypeData = [
  { name: 'Code Review', value: 450, fill: 'var(--color-chart-1)' },
  { name: 'Bug Fixes', value: 320, fill: 'var(--color-chart-2)' },
  { name: 'Documentation', value: 280, fill: 'var(--color-chart-3)' },
  { name: 'Meetings', value: 150, fill: 'var(--color-chart-4)' }
]

export const monthlyTrendData = [
  { month: 'Jan', hours: 165, coins: 850 },
  { month: 'Feb', hours: 172, coins: 920 },
  { month: 'Mar', hours: 158, coins: 780 },
  { month: 'Apr', hours: 180, coins: 1050 },
  { month: 'May', hours: 168, coins: 890 },
  { month: 'Jun', hours: 175, coins: 960 }
]

export function generateCalendarData(): DayRecord[] {
  const today = new Date()
  const records: DayRecord[] = []
  
  for (let i = 0; i < 4; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    const checkInHour = 8 + Math.floor(Math.random() * 2)
    const checkInMin = Math.floor(Math.random() * 60)
    const checkOutHour = 17 + Math.floor(Math.random() * 2)
    const checkOutMin = Math.floor(Math.random() * 60)
    
    const totalHours = checkOutHour - checkInHour + (checkOutMin - checkInMin) / 60
    
    records.push({
      date,
      totalHours: Math.round(totalHours * 10) / 10,
      records: [
        {
          checkIn: `${checkInHour}:${checkInMin.toString().padStart(2, '0')} AM`,
          checkOut: `${checkOutHour - 12}:${checkOutMin.toString().padStart(2, '0')} PM`
        }
      ],
      tasks: tasks.slice(0, 2 + Math.floor(Math.random() * 2))
    })
  }
  
  return records
}
