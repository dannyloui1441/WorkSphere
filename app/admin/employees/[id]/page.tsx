'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Calendar, Flame, Clock, Sparkles, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { adminEmployees, getEmployeeTasks, getEmployeeKudosHistory, getEmployeeAttendanceHistory } from '@/lib/adminMockData'
import { cn } from '@/lib/utils'

function getStatusDot(status: string) {
  const colors = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-gray-400'
  }
  return <span className={cn('w-3 h-3 rounded-full', colors[status as keyof typeof colors] || 'bg-gray-400')} />
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

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive" className="text-xs">High</Badge>
    case 'medium':
      return <Badge variant="secondary" className="text-xs">Medium</Badge>
    case 'low':
      return <Badge variant="outline" className="text-xs">Low</Badge>
    default:
      return null
  }
}

function getAttendanceStatusColor(status: string) {
  switch (status) {
    case 'early':
      return 'bg-emerald-500'
    case 'on-time':
      return 'bg-green-500'
    case 'late':
      return 'bg-amber-500'
    case 'absent':
      return 'bg-red-500'
    default:
      return 'bg-gray-300'
  }
}

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const employee = adminEmployees.find(e => e.id === id)
  
  if (!employee) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Employee not found.</p>
        <Button variant="outline" onClick={() => router.back()} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  const tasks = getEmployeeTasks(id)
  const kudosHistory = getEmployeeKudosHistory(id)
  const attendanceHistory = getEmployeeAttendanceHistory(id)

  return (
    <div className="px-4 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 md:gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="flex-shrink-0">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg md:text-2xl font-bold text-foreground">Employee Details</h1>
          <p className="text-sm md:text-base text-muted-foreground truncate">View info for {employee.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs md:text-sm py-2">Overview</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs md:text-sm py-2">Tasks</TabsTrigger>
          <TabsTrigger value="kudos" className="text-xs md:text-sm py-2">Kudos</TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs md:text-sm py-2">Attendance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 md:space-y-6">
          {/* Profile Card - Stacked on mobile */}
          <Card>
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-6">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 mb-3 md:mb-0 flex-shrink-0">
                  <AvatarImage src={employee.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl md:text-2xl font-semibold">
                    {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-lg md:text-xl font-bold text-foreground">{employee.name}</h2>
                  <p className="text-sm text-muted-foreground mb-2">{employee.role}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                    {getStatusDot(employee.status)}
                    <span className="text-sm capitalize text-muted-foreground">{employee.status}</span>
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-3 text-sm justify-center md:justify-start">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm justify-center md:justify-start">
                      <Calendar className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">Joined {employee.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards - 2 cols mobile, 4 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-orange-500/10">
                    <Flame className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg md:text-2xl font-bold text-foreground">{employee.streak}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-blue-500/10">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg md:text-2xl font-bold text-foreground">{employee.totalHoursWorked.toLocaleString()}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Total Hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-amber-500/10">
                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg md:text-2xl font-bold text-foreground">{employee.kudosBalance.toLocaleString()}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Kudos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                  <div className="p-2 md:p-3 rounded-xl bg-emerald-500/10">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg md:text-2xl font-bold text-foreground">{employee.tasksCompleted}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">Tasks Done</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No tasks assigned.</p>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-foreground">{task.title}</p>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-semibold">{task.kudos}</span>
                      </div>
                      {getTaskStatusBadge(task.status)}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kudos Tab */}
        <TabsContent value="kudos" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Kudos History</CardTitle>
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-lg px-4 py-1">
                {employee.kudosBalance.toLocaleString()} Kudos
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {kudosHistory.map((txn) => (
                <div 
                  key={txn.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      txn.type === 'earned' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                    )}>
                      <Sparkles className={cn(
                        'w-5 h-5',
                        txn.type === 'earned' ? 'text-emerald-500' : 'text-red-500'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{txn.description}</p>
                      <p className="text-sm text-muted-foreground">{txn.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      'font-bold',
                      txn.type === 'earned' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      {txn.type === 'earned' ? '+' : '-'}{txn.amount}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">{txn.category}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>March 2026 Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar Days */}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1
                  const date = new Date(2026, 2, day)
                  const dayOfWeek = date.getDay()
                  
                  // Add empty cells for first week offset
                  const emptyCells = i === 0 ? Array.from({ length: dayOfWeek }, (_, j) => (
                    <div key={`empty-${j}`} className="aspect-square" />
                  )) : []
                  
                  const record = attendanceHistory.find(r => r.date === `2026-03-${day.toString().padStart(2, '0')}`)
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
                  const isFuture = day > 15
                  
                  return [
                    ...emptyCells,
                    <div
                      key={day}
                      className={cn(
                        'aspect-square rounded-lg flex flex-col items-center justify-center text-sm border border-border',
                        isWeekend && 'bg-muted/30',
                        isFuture && 'opacity-40',
                        record && !isWeekend && !isFuture && 'border-2',
                        record?.status === 'early' && 'border-emerald-500 bg-emerald-500/10',
                        record?.status === 'on-time' && 'border-green-500 bg-green-500/10',
                        record?.status === 'late' && 'border-amber-500 bg-amber-500/10',
                        record?.status === 'absent' && 'border-red-500 bg-red-500/10'
                      )}
                    >
                      <span className="font-medium text-foreground">{day}</span>
                      {record && !isWeekend && !isFuture && (
                        <span className={cn(
                          'w-2 h-2 rounded-full mt-1',
                          getAttendanceStatusColor(record.status)
                        )} />
                      )}
                    </div>
                  ]
                })}
              </div>
              
              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-muted-foreground">Early</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-muted-foreground">On Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-sm text-muted-foreground">Late</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-muted-foreground">Absent</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
