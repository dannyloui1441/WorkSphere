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
    <div className="px-4 py-4 md:px-6 space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-foreground">Attendance</h1>
        <p className="text-xs text-muted-foreground">{today}</p>
      </div>

      {/* Attendance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {todayAttendance.map((record) => (
          <Card key={record.employeeId} className="overflow-hidden">
            <CardContent className="p-0">
              {/* Status Header */}
              <div className={cn(
                'px-4 py-2',
                record.status === 'early' && 'bg-emerald-500/10',
                record.status === 'on-time' && 'bg-green-500/10',
                record.status === 'late' && 'bg-amber-500/10',
                record.status === 'absent' && 'bg-red-500/10'
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 border-2 border-background">
                      <AvatarImage src={record.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-semibold">
                        {record.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{record.name}</p>
                      <p className="text-xs text-muted-foreground">{record.role}</p>
                    </div>
                  </div>
                  {getStatusBadge(record.status)}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Check In</p>
                    <p className="text-sm font-semibold text-foreground">{record.checkIn || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Check Out</p>
                    <p className="text-sm font-semibold text-foreground">{record.checkOut || '—'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Hours Today</p>
                    <p className="text-sm font-semibold text-foreground">
                      {record.hoursWorked > 0 ? `${record.hoursWorked.toFixed(1)}h` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Week Streak</p>
                    <div className="flex items-center gap-1">
                      {record.weekStreak > 0 ? (
                        <>
                          <Flame className={cn(
                            'w-4 h-4',
                            record.weekStreak >= 7 ? 'text-orange-500' : 'text-amber-500'
                          )} />
                          <span className="text-sm font-semibold text-foreground">{record.weekStreak} days</span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-muted-foreground">—</span>
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
        <CardContent className="p-4">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {todayAttendance.filter(r => r.status === 'early' || r.status === 'on-time').length}
              </p>
              <p className="text-xs text-muted-foreground">Checked In</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {todayAttendance.filter(r => r.status === 'early').length}
              </p>
              <p className="text-xs text-muted-foreground">Early</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {todayAttendance.filter(r => r.status === 'late').length}
              </p>
              <p className="text-xs text-muted-foreground">Late</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {todayAttendance.filter(r => r.status === 'absent').length}
              </p>
              <p className="text-xs text-muted-foreground">Absent</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
