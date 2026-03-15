'use client'

import { useRouter } from 'next/navigation'
import { Sparkles, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { adminEmployees } from '@/lib/adminMockData'
import { cn } from '@/lib/utils'

function getStatusDot(status: string) {
  const colors = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-gray-400'
  }
  return <span className={cn('w-2.5 h-2.5 rounded-full', colors[status as keyof typeof colors] || 'bg-gray-400')} />
}

export default function EmployeesPage() {
  const router = useRouter()

  return (
    <div className="px-4 py-6 md:px-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Employees</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage and view all employee information.</p>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {adminEmployees.map((employee) => (
          <Card 
            key={employee.id}
            onClick={() => router.push(`/admin/employees/${employee.id}`)}
            className="cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={employee.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
                    {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{employee.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {getStatusDot(employee.status)}
                      <span className="text-xs capitalize text-muted-foreground">{employee.status}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                    <div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Sparkles className="w-3 h-3" />
                        <span className="text-sm font-semibold">{employee.kudosBalance.toLocaleString()}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Kudos</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{employee.tasksCompleted}</p>
                      <p className="text-[10px] text-muted-foreground">Tasks</p>
                    </div>
                    <div>
                      <p className={cn(
                        'text-sm font-semibold',
                        employee.attendanceRate >= 90 ? 'text-emerald-600' :
                        employee.attendanceRate >= 80 ? 'text-amber-600' : 'text-red-600'
                      )}>{employee.attendanceRate}%</p>
                      <p className="text-[10px] text-muted-foreground">Attendance</p>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle className="text-lg">All Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Employee</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Kudos Balance</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tasks Completed</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {adminEmployees.map((employee) => (
                  <tr 
                    key={employee.id}
                    onClick={() => router.push(`/admin/employees/${employee.id}`)}
                    className="border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
                            {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-foreground">{employee.role}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusDot(employee.status)}
                        <span className="text-sm capitalize text-foreground">{employee.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                        {employee.kudosBalance.toLocaleString()}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-foreground font-medium">{employee.tasksCompleted}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              'h-full rounded-full',
                              employee.attendanceRate >= 90 ? 'bg-emerald-500' :
                              employee.attendanceRate >= 80 ? 'bg-amber-500' : 'bg-red-500'
                            )}
                            style={{ width: `${employee.attendanceRate}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">{employee.attendanceRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
