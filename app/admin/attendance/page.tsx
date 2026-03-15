'use client'

import { Flame } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { todayAttendance } from '@/lib/adminMockData'
import { cn } from '@/lib/utils'

function getStatusBadge(status: string) {
  switch (status) {
    case 'early':
      return <Badge className="bg-emerald-500 text-white border-0">Early</Badge>
    case 'on-time':
      return <Badge className="bg-green-500 text-white border-0">On Time</Badge>
    case 'late':
      return <Badge className="bg-amber-500 text-white border-0">Late</Badge>
    case 'absent':
      return <Badge className="bg-red-500 text-white border-0">Absent</Badge>
    default:
      return null
  }
}

export default function AttendancePage() {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* Attendance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {todayAttendance.map((record) => (
          <Card key={record.employeeId} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Status Header */}
              <div className={cn(
                'px-6 py-3',
                record.status === 'early' && 'bg-emerald-500/10',
                record.status === 'on-time' && 'bg-green-500/10',
                record.status === 'late' && 'bg-amber-500/10',
                record.status === 'absent' && 'bg-red-500/10'
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-background">
                      <AvatarImage src={record.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold">
                        {record.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">{record.name}</p>
                      <p className="text-sm text-muted-foreground">{record.role}</p>
                    </div>
                  </div>
                  {getStatusBadge(record.status)}
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Check In</p>
                    <p className="text-lg font-semibold text-foreground">{record.checkIn || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Check Out</p>
                    <p className="text-lg font-semibold text-foreground">{record.checkOut || '—'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Hours Today</p>
                    <p className="text-lg font-semibold text-foreground">
                      {record.hoursWorked > 0 ? `${record.hoursWorked.toFixed(1)}h` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Week Streak</p>
                    <div className="flex items-center gap-1.5">
                      {record.weekStreak > 0 ? (
                        <>
                          <Flame className={cn(
                            'w-5 h-5',
                            record.weekStreak >= 7 ? 'text-orange-500' : 'text-amber-500'
                          )} />
                          <span className="text-lg font-semibold text-foreground">{record.weekStreak} days</span>
                        </>
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {todayAttendance.filter(r => r.status === 'early' || r.status === 'on-time').length}
              </p>
              <p className="text-sm text-muted-foreground">Checked In</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {todayAttendance.filter(r => r.status === 'early').length}
              </p>
              <p className="text-sm text-muted-foreground">Early</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                {todayAttendance.filter(r => r.status === 'late').length}
              </p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {todayAttendance.filter(r => r.status === 'absent').length}
              </p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
