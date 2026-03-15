'use client'

import { useState } from 'react'
import { Sparkles, TrendingUp, Award, Gift } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { adminEmployees, adminStats } from '@/lib/adminMockData'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

// Employee kudos balances
const employeeKudosData = [
  { id: 'EMP001', name: 'K Ramachandran', role: 'Software Engineer', balance: 3250 },
  { id: 'EMP002', name: 'Daniel', role: 'UX Designer', balance: 2780 },
  { id: 'EMP003', name: 'Benito', role: 'Backend Developer', balance: 1950 },
  { id: 'EMP004', name: 'Swithin', role: 'QA Engineer', balance: 2100 },
  { id: 'EMP005', name: 'John', role: 'Project Manager', balance: 4200 },
]

const barColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export default function KudosPage() {
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [kudosAmount, setKudosAmount] = useState('')
  const [reason, setReason] = useState('')

  const sortedByKudos = [...employeeKudosData].sort((a, b) => b.balance - a.balance)
  const maxBalance = Math.max(...employeeKudosData.map(e => e.balance))
  const totalKudosBalance = employeeKudosData.reduce((sum, emp) => sum + emp.balance, 0)
  
  // Mock stats
  const kudosAwardedThisMonth = adminStats.kudosDistributedThisMonth
  const kudosRedeemedThisMonth = 850

  // Chart data
  const chartData = employeeKudosData.map(emp => ({
    name: emp.name.split(' ')[0],
    balance: emp.balance,
  }))

  const handleAwardKudos = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedEmployee) {
      toast.error('Please select an employee')
      return
    }
    
    if (!kudosAmount || Number(kudosAmount) <= 0) {
      toast.error('Please enter a valid kudos amount')
      return
    }
    
    if (!reason.trim()) {
      toast.error('Please enter a reason')
      return
    }

    const employee = adminEmployees.find(e => e.id === selectedEmployee)
    
    // Save to localStorage
    const existingAwards = JSON.parse(localStorage.getItem('admin_kudos_awards') || '[]')
    const newAward = {
      id: `AWARD-${Date.now()}`,
      employeeId: selectedEmployee,
      employeeName: employee?.name,
      amount: Number(kudosAmount),
      reason: reason.trim(),
      date: new Date().toISOString()
    }
    localStorage.setItem('admin_kudos_awards', JSON.stringify([...existingAwards, newAward]))
    
    toast.success(`Kudos awarded to ${employee?.name}`)
    
    // Reset form
    setSelectedEmployee('')
    setKudosAmount('')
    setReason('')
  }

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-amber-500 text-white' // Gold
      case 1:
        return 'bg-gray-400 text-white' // Silver
      case 2:
        return 'bg-amber-700 text-white' // Bronze
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-6 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Kudos</h1>
        <p className="text-sm md:text-base text-muted-foreground">Track and award team kudos.</p>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Kudos Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          {sortedByKudos.map((employee, index) => (
            <div 
              key={employee.id}
              className={cn(
                'flex items-center justify-between p-3 md:p-4 rounded-lg transition-colors',
                index === 0 
                  ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20' 
                  : 'bg-muted/50 hover:bg-muted'
              )}
            >
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                {/* Rank Badge */}
                <div className={cn(
                  'w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0',
                  getRankStyle(index)
                )}>
                  {index + 1}
                </div>
                
                {/* Avatar */}
                <Avatar className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs md:text-sm">
                    {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Name and Role */}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm md:text-base truncate">{employee.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{employee.role}</p>
                </div>
                
                {/* Progress Bar - hidden on mobile */}
                <div className="hidden md:block flex-1 max-w-[200px]">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full transition-all',
                        index === 0 ? 'bg-amber-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-amber-700' :
                        'bg-primary/50'
                      )}
                      style={{ width: `${(employee.balance / maxBalance) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Balance */}
              <div className="flex items-center gap-1.5 text-amber-500 flex-shrink-0">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-lg md:text-xl font-bold">{employee.balance.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Award Performance Bonus */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-500" />
            Award Performance Bonus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAwardKudos} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Employee</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kudosAmount">Kudos Amount</Label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                  <Input 
                    id="kudosAmount"
                    type="number"
                    min={1}
                    placeholder="Enter amount"
                    value={kudosAmount}
                    onChange={(e) => setKudosAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input 
                id="reason"
                placeholder="Enter reason for bonus..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              Award Kudos
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-amber-500/10 flex-shrink-0">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-3xl font-bold text-foreground">{totalKudosBalance.toLocaleString()}</p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">Total in Circulation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-emerald-500/10 flex-shrink-0">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-3xl font-bold text-foreground">{kudosAwardedThisMonth.toLocaleString()}</p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">Awarded This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-purple-500/10 flex-shrink-0">
                <Gift className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-3xl font-bold text-foreground">{kudosRedeemedThisMonth.toLocaleString()}</p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">Redeemed This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base md:text-lg">Kudos Balance by Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString(), 'Kudos']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
