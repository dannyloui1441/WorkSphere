'use client'

import { Users, UserCheck, ClipboardList, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { adminStats, todayAttendance, adminTasks } from '@/lib/adminMockData'
import { cn } from '@/lib/utils'

const statCards = [
  { 
    label: 'Total Employees', 
    value: adminStats.totalEmployees, 
    icon: Users, 
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-l-blue-500'
  },
  { 
    label: 'Checked In Today', 
    value: adminStats.checkedInToday, 
    icon: UserCheck, 
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-l-emerald-500'
  },
  { 
    label: 'Active Tasks', 
    value: adminStats.activeTasks, 
    icon: ClipboardList, 
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-l-amber-500'
  },
  { 
    label: 'Kudos This Month', 
    value: adminStats.kudosDistributedThisMonth.toLocaleString(), 
    icon: Sparkles, 
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-l-purple-500'
  },
]

function getAttendanceStatusBadge(status: string) {
  switch (status) {
    case 'early':
    case 'on-time':
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 whitespace-nowrap">Checked In</Badge>
    case 'late':
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 whitespace-nowrap">Late</Badge>
    case 'absent':
      return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 whitespace-nowrap">Absent</Badge>
    default:
      return null
  }
}

function getTaskStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 whitespace-nowrap">Completed</Badge>
    case 'in-progress':
      return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 whitespace-nowrap">In Progress</Badge>
    case 'pending':
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 whitespace-nowrap">Pending</Badge>
    default:
      return null
  }
}

export default function AdminDashboard() {
  const recentTasks = adminTasks.slice(0, 5)

  return (
    <div className="px-4 py-4 md:px-6 space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-xs text-muted-foreground">Welcome back, Admin. Here&apos;s your team overview.</p>
      </div>

      {/* Stats Cards - 2x2 on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className={cn('border-l-4 min-w-0', stat.borderColor)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={cn('p-2 rounded-lg flex-shrink-0', stat.bgColor)}>
                    <Icon className={cn('w-4 h-4', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Two Column Layout - stacked on mobile, side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's Attendance */}
        <Card className="min-w-0">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm">Today&apos;s Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            {todayAttendance.map((record) => (
              <div 
                key={record.employeeId} 
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-w-0"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={record.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs">
                      {record.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground text-sm truncate">{record.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{record.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-medium text-foreground">
                      {record.checkIn || '—'}
                    </p>
                  </div>
                  {getAttendanceStatusBadge(record.status)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Task Overview */}
        <Card className="min-w-0">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm">Task Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            {recentTasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors min-w-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm truncate">{task.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{task.assignedTo}</p>
                </div>
                <div className="flex-shrink-0">
                  {getTaskStatusBadge(task.status)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
