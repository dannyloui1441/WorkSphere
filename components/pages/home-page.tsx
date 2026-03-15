'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Coins, ListTodo, Users, ChevronRight, Clock, Moon, Sun, LogOut, Award, BarChart3, Settings, History } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { currentUser, tasks } from '@/lib/mockData'
import { cn, type CoinsData } from '@/lib/utils'
import type { TabType } from '@/components/navigation'

interface HomePageProps {
  isPunchedIn: boolean
  punchInTime: string | null
  onNavigate: (tab: TabType) => void
  coinsData: CoinsData
}

export function HomePage({ isPunchedIn, punchInTime, onNavigate, coinsData }: HomePageProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const activeTasks = tasks.filter(t => t.status !== 'completed')
  const highPriorityCount = activeTasks.filter(t => t.priority === 'high').length

  const formatTime = (date: Date) => {
    const hours = format(date, 'h')
    const minutes = format(date, 'mm')
    const seconds = format(date, 'ss')
    const ampm = format(date, 'a')
    return { hours, minutes, seconds, ampm }
  }

  const time = formatTime(currentTime)

  return (
    <div className="pb-36 px-4 pt-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <button className="relative">
                <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    KR
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[380px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="sr-only">Profile</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col items-center py-4">
                <Avatar className="w-20 h-20 mb-3">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                    KR
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground">{currentUser.role}</p>
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold">156h</p>
                    <p className="text-xs text-muted-foreground">Total Hours</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-amber-500">{coinsData.lifetimeEarned}</p>
                    <p className="text-xs text-muted-foreground">Total Earned</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="py-2 space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left">
                  <History className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Rewards History</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Analytics</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">My Team</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left">
                  <Settings className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Settings</span>
                </button>
              </div>
              <Separator />
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-3">
                  {mounted && theme === 'dark' ? (
                    <Moon className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Sun className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span className="text-sm">Dark Mode</span>
                </div>
                <Switch
                  checked={mounted && theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>
              <Separator />
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
            </DialogContent>
          </Dialog>
          <div>
            <p className="text-sm text-primary font-medium">Welcome back,</p>
            <h1 className="text-lg font-semibold">{currentUser.name}</h1>
            <p className="text-xs text-muted-foreground">{currentUser.role}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono font-bold">
            {mounted ? (
              <>
                <span className="text-3xl text-indigo-600 dark:text-indigo-400">{time.hours}:{time.minutes}</span>
                <span className="text-xl text-amber-500">:{time.seconds}</span>
                <span className="text-xs ml-1 text-muted-foreground">{time.ampm}</span>
              </>
            ) : (
              <span className="text-3xl text-muted-foreground">--:--</span>
            )}
          </div>
          <Badge variant={isPunchedIn ? 'default' : 'secondary'} className={cn(
            'text-[10px] mt-1',
            isPunchedIn && 'bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20'
          )}>
            {isPunchedIn ? 'Checked In' : 'Checked Out'}
          </Badge>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Card 
            className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-200/50 dark:border-amber-800/50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate('coins')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500">
                  <Coins className="w-4 h-4 text-white" />
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{coinsData.balance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Coins Balance</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">+125 this week</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Card 
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/50 dark:border-purple-800/50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate('tasks')}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <ListTodo className="w-4 h-4 text-white" />
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{activeTasks.length}</p>
              <p className="text-xs text-muted-foreground">Active Tasks</p>
              <p className="text-xs text-red-500 font-medium mt-1">{highPriorityCount} high priority</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Team Card */}
      <motion.div whileTap={{ scale: 0.98 }}>
        <Card 
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/50 dark:border-blue-800/50 mb-6 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('team')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold">My Team</p>
                <p className="text-xs text-muted-foreground">5 members &bull; 2 active tasks</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent Tasks</h2>
          <button 
            onClick={() => onNavigate('tasks')}
            className="text-xs text-primary font-medium"
          >
            View All
          </button>
        </div>
        <div className="space-y-3">
          {tasks.slice(0, 3).map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-[10px] px-1.5',
                            task.priority === 'high' && 'border-red-300 text-red-600 bg-red-50 dark:bg-red-950/30',
                            task.priority === 'medium' && 'border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-950/30',
                            task.priority === 'low' && 'border-blue-300 text-blue-600 bg-blue-50 dark:bg-blue-950/30'
                          )}
                        >
                          {task.priority}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{task.id}</span>
                      </div>
                      <p className="font-medium text-sm truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{task.dueDate} {task.dueTime}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge 
                        className={cn(
                          'text-[10px]',
                          task.status === 'completed' && 'bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20',
                          task.status === 'acknowledged' && 'bg-blue-500/20 text-blue-600 hover:bg-blue-500/20',
                          task.status === 'pending' && 'bg-amber-500/20 text-amber-600 hover:bg-amber-500/20'
                        )}
                      >
                        {task.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Coins className="w-3 h-3" />
                        <span className="text-xs font-medium">{task.coins}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
