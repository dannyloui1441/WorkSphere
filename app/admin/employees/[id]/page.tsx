'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Calendar, Flame, Clock, Sparkles, CheckCircle, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
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

function getStatusLabel(status: string) {
  switch (status) {
    case 'early':
      return 'Early'
    case 'on-time':
      return 'On Time'
    case 'late':
      return 'Late'
    case 'absent':
      return 'Absent'
    default:
      return status
  }
}

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  
  const employee = adminEmployees.find(e => e.id === id)
  
  if (!employee) {
    return (
      <div className="p-4">
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
  
  const selectedRecord = selectedDay ? attendanceHistory.find(r => r.date === selectedDay) : null

  return (
    <div className="px-4 py-4 md:px-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="flex-shrink-0 h-8 w-8">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-foreground">Employee Details</h1>
          <p className="text-xs text-muted-foreground truncate">View info for {employee.name}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs py-1.5">Overview</TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs py-1.5">Tasks</TabsTrigger>
          <TabsTrigger value="kudos" className="text-xs py-1.5">Kudos</TabsTrigger>
          <TabsTrigger value="attendance" className="text-xs py-1.5">Attendance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Profile Card - Stacked on mobile */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-4">
                <Avatar className="h-16 w-16 mb-2 md:mb-0 flex-shrink-0">
                  <AvatarImage src={employee.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-semibold">
                    {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-foreground">{employee.name}</h2>
                  <p className="text-xs text-muted-foreground mb-1">{employee.role}</p>
                  <div className="flex items-center justify-center md:justify-start gap-1.5 mb-3">
                    {getStatusDot(employee.status)}
                    <span className="text-xs capitalize text-muted-foreground">{employee.status}</span>
                  </div>
                  
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2 text-xs justify-center md:justify-start">
                      <Mail className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground truncate">{employee.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs justify-center md:justify-start">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">Joined {employee.joinDate}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards - 2 cols mobile, 4 cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Flame className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg font-bold text-foreground">{employee.streak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg font-bold text-foreground">{employee.totalHoursWorked.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg font-bold text-foreground">{employee.kudosBalance.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Kudos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-lg font-bold text-foreground">{employee.tasksCompleted}</p>
                    <p className="text-xs text-muted-foreground">Tasks Done</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm">Assigned Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              {tasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 text-sm">No tasks assigned.</p>
              ) : (
                tasks.map((task) => (
                  <div 
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-foreground text-sm">{task.title}</p>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span className="font-semibold text-sm">{task.kudos}</span>
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
        <TabsContent value="kudos" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
              <CardTitle className="text-sm">Kudos History</CardTitle>
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-sm px-2 py-0.5">
                {employee.kudosBalance.toLocaleString()} Kudos
              </Badge>
            </CardHeader>
            <CardContent className="space-y-2 px-4 pb-4">
              {kudosHistory.map((txn) => (
                <div 
                  key={txn.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      txn.type === 'earned' ? 'bg-emerald-500/10' : 'bg-red-500/10'
                    )}>
                      <Sparkles className={cn(
                        'w-4 h-4',
                        txn.type === 'earned' ? 'text-emerald-500' : 'text-red-500'
                      )} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{txn.description}</p>
                      <p className="text-xs text-muted-foreground">{txn.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      'font-bold text-sm',
                      txn.type === 'earned' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                    )}>
                      {txn.type === 'earned' ? '+' : '-'}{txn.amount}
                    </p>
                    <p className="text-[10px] text-muted-foreground capitalize">{txn.category}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm">March 2026 Attendance</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
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
                  const dateString = `2026-03-${day.toString().padStart(2, '0')}`
                  
                  return [
                    ...emptyCells,
                    <button
                      key={day}
                      onClick={() => record && !isWeekend && !isFuture && setSelectedDay(dateString)}
                      disabled={!record || isWeekend || isFuture}
                      className={cn(
                        'aspect-square rounded-lg flex flex-col items-center justify-center text-sm border border-border transition-all',
                        isWeekend && 'bg-muted/30',
                        isFuture && 'opacity-40 cursor-not-allowed',
                        record && !isWeekend && !isFuture && 'border-2 cursor-pointer hover:shadow-md',
                        record?.status === 'early' && 'border-emerald-500 bg-emerald-500/10',
                        record?.status === 'on-time' && 'border-green-500 bg-green-500/10',
                        record?.status === 'late' && 'border-amber-500 bg-amber-500/10',
                        record?.status === 'absent' && 'border-red-500 bg-red-500/10',
                        !record && !isWeekend && !isFuture && 'cursor-not-allowed opacity-50'
                      )}
                    >
                      <span className="font-medium text-foreground">{day}</span>
                      {record && !isWeekend && !isFuture && (
                        <span className={cn(
                          'w-2 h-2 rounded-full mt-1',
                          getAttendanceStatusColor(record.status)
                        )} />
                      )}
                    </button>
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

      {/* Attendance Day Detail Sheet */}
      <Sheet open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto rounded-t-2xl">
          <SheetHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <SheetTitle className="text-base">Attendance Details</SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={() => setSelectedDay(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </SheetHeader>

          {selectedRecord && (
            <div className="space-y-4 pt-4">
              {/* Date and Status */}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="text-sm font-semibold">
                  {new Date(selectedRecord.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Status Badge */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Status</p>
                <Badge className={cn(
                  'text-sm',
                  selectedRecord.status === 'early' && 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
                  selectedRecord.status === 'on-time' && 'bg-green-500/20 text-green-600 dark:text-green-400',
                  selectedRecord.status === 'late' && 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
                  selectedRecord.status === 'absent' && 'bg-red-500/20 text-red-600 dark:text-red-400'
                )}>
                  {getStatusLabel(selectedRecord.status)}
                </Badge>
              </div>

              {/* Check In Time */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Clock className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Check In</p>
                  <p className="text-sm font-semibold">{selectedRecord.checkIn}</p>
                </div>
              </div>

              {/* Check Out Time */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Clock className="w-4 h-4 text-red-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Check Out</p>
                  <p className="text-sm font-semibold">{selectedRecord.checkOut}</p>
                </div>
              </div>

              {/* Hours Worked */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Clock className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hours Worked</p>
                  <p className="text-sm font-semibold">{selectedRecord.hoursWorked}h</p>
                </div>
              </div>

              {/* Tasks Received */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <CheckCircle className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tasks Received</p>
                  <p className="text-sm font-semibold">{selectedRecord.tasksReceived}</p>
                </div>
              </div>

              {/* Tasks Completed */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tasks Completed</p>
                  <p className="text-sm font-semibold">{selectedRecord.tasksCompleted}</p>
                </div>
              </div>

              {/* Kudos Earned */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">Kudos Earned</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{selectedRecord.kudosEarned}</p>
                </div>
              </div>

              {/* Kudos Redeemed */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <Sparkles className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-red-700 dark:text-red-400">Kudos Redeemed</p>
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">{selectedRecord.kudosRedeemed}</p>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
