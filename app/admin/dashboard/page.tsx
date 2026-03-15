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
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Checked In</Badge>
    case 'late':
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Late</Badge>
    case 'absent':
      return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20">Absent</Badge>
    default:
      return null
  }
}

function getTaskStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Completed</Badge>
    case 'in-progress':
      return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">In Progress</Badge>
    case 'pending':
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Pending</Badge>
    default:
      return null
  }
}

export default function AdminDashboard() {
  const recentTasks = adminTasks.slice(0, 5)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here&apos;s your team overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className={cn('border-l-4', stat.borderColor)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={cn('p-3 rounded-xl', stat.bgColor)}>
                    <Icon className={cn('w-6 h-6', stat.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Today&apos;s Attendance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayAttendance.map((record) => (
              <div 
                key={record.employeeId} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={record.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
                      {record.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{record.name}</p>
                    <p className="text-sm text-muted-foreground">{record.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium text-foreground truncate">{task.title}</p>
                  <p className="text-sm text-muted-foreground">{task.assignedTo}</p>
                </div>
                {getTaskStatusBadge(task.status)}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
