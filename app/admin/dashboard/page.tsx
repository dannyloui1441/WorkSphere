'use client'

import { Clock, Users, UserCheck, ClipboardList, Sparkles, CheckCircle, AlertCircle, LogIn, LogOut, Flame, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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

// Recent activity feed data
const recentActivities = [
  { id: 1, description: 'K Ramachandran checked in at 8:52 AM', icon: LogIn, color: 'text-emerald-500', timeAgo: '2h ago' },
  { id: 2, description: 'John completed Sprint planning preparation', icon: CheckCircle, color: 'text-emerald-500', timeAgo: '1h 30m ago' },
  { id: 3, description: 'Admin awarded 50 Kudos to Daniel', icon: Sparkles, color: 'text-amber-500', timeAgo: '1h ago' },
  { id: 4, description: 'Benito checked in late at 9:28 AM', icon: AlertCircle, color: 'text-amber-500', timeAgo: '45m ago' },
  { id: 5, description: 'New task assigned to Swithin: Write test cases', icon: FileText, color: 'text-blue-500', timeAgo: '30m ago' },
  { id: 6, description: 'Swithin is absent today', icon: LogOut, color: 'text-red-500', timeAgo: '15m ago' },
]

export default function AdminDashboard() {
  const recentTasks = adminTasks.slice(0, 5)

  return (
    <div className="w-full min-w-0 px-4 py-4 md:px-6 space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-xs text-muted-foreground">Welcome back, Admin. Here&apos;s your team overview.</p>
      </div>

      {/* Stats Cards - 2x2 on mobile, 4 columns on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className={cn('border-l-4 min-w-0 overflow-hidden', stat.borderColor)}>
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

      {/* Second Row - Attendance Table + Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
        {/* Today's Attendance - Table */}
        <Card className="min-w-0 overflow-hidden lg:col-span-2">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-sm">Today&apos;s Attendance</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-t">
                    <TableHead className="px-4 py-2 text-xs">Employee</TableHead>
                    <TableHead className="px-4 py-2 text-xs">Role</TableHead>
                    <TableHead className="px-4 py-2 text-xs">Status</TableHead>
                    <TableHead className="px-4 py-2 text-xs">Check In</TableHead>
                    <TableHead className="px-4 py-2 text-xs">Hours</TableHead>
                    <TableHead className="px-4 py-2 text-xs">Streak</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayAttendance.map((record) => (
                    <TableRow key={record.employeeId} className="hover:bg-muted/50 text-xs">
                      <TableCell className="px-4 py-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarImage src={record.avatar} />
                            <AvatarFallback className="text-[10px]">
                              {record.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate font-medium">{record.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-2 text-muted-foreground truncate">{record.role}</TableCell>
                      <TableCell className="px-4 py-2">
                        {record.status === 'early' || record.status === 'on-time' ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]">Checked In</Badge>
                        ) : record.status === 'late' ? (
                          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px]">Late</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px]">Absent</Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-2 font-medium">{record.checkIn || '—'}</TableCell>
                      <TableCell className="px-4 py-2 font-medium">8.5h</TableCell>
                      <TableCell className="px-4 py-2">
                        <div className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          <span className="font-medium">5</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="min-w-0 overflow-hidden">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 px-4 pb-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Tasks Today</p>
                  <p className="text-lg font-bold">3</p>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                  <p className="text-lg font-bold">5</p>
                </div>
                <ClipboardList className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Kudos Today</p>
                  <p className="text-lg font-bold">85</p>
                </div>
                <Sparkles className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Announcements</p>
                  <p className="text-lg font-bold">3</p>
                </div>
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card className="min-w-0 overflow-hidden w-full">
        <CardHeader className="pb-3 pt-4 px-4">
          <CardTitle className="text-sm">Recent Activity Feed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 px-4 pb-4">
          {recentActivities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-border last:border-b-0 last:pb-0">
                <div className={cn('p-2 rounded-lg flex-shrink-0', activity.color === 'text-emerald-500' && 'bg-emerald-500/10', activity.color === 'text-amber-500' && 'bg-amber-500/10', activity.color === 'text-blue-500' && 'bg-blue-500/10', activity.color === 'text-red-500' && 'bg-red-500/10')}>
                  <Icon className={cn('w-4 h-4', activity.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timeAgo}</p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
