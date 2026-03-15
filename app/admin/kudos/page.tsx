'use client'

import { Sparkles, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { adminEmployees, adminStats } from '@/lib/adminMockData'
import { cn } from '@/lib/utils'

export default function KudosPage() {
  const sortedByKudos = [...adminEmployees].sort((a, b) => b.kudosBalance - a.kudosBalance)
  const totalKudosBalance = adminEmployees.reduce((sum, emp) => sum + emp.kudosBalance, 0)

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Kudos</h1>
        <p className="text-muted-foreground">Track and manage team kudos distribution.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <Sparkles className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalKudosBalance.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Kudos Balance</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{adminStats.kudosDistributedThisMonth.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Distributed This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <Sparkles className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{Math.round(totalKudosBalance / adminEmployees.length).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Average Per Employee</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Kudos Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedByKudos.map((employee, index) => (
            <div 
              key={employee.id}
              className={cn(
                'flex items-center justify-between p-4 rounded-lg transition-colors',
                index === 0 ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20' : 'bg-muted/50 hover:bg-muted'
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                  index === 0 ? 'bg-amber-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-amber-700 text-white' :
                  'bg-muted text-muted-foreground'
                )}>
                  {index + 1}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={employee.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
                    {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-amber-500">
                <Sparkles className="w-5 h-5" />
                <span className="text-xl font-bold">{employee.kudosBalance.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
