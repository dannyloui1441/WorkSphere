'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Sparkles, ListTodo, Users, ChevronRight, Clock, Moon, Sun, LogOut, Award, BarChart3, Settings, History, Bell, MessageSquare, ChevronDown, Send, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { currentUser, tasks } from '@/lib/mockData'
import { cn, type KudosData } from '@/lib/utils'
import type { TabType } from '@/components/navigation'

interface Announcement {
  id: string
  title: string
  message: string
  priority: 'high' | 'medium' | 'low'
  targetAudience: string
  status: 'draft' | 'published' | 'scheduled'
  createdAt: string
}

interface HomePageProps {
  isPunchedIn: boolean
  punchInTime: string | null
  onNavigate: (tab: TabType) => void
  kudosData: KudosData
}

export function HomePage({ isPunchedIn, punchInTime, onNavigate, kudosData }: HomePageProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [profileView, setProfileView] = useState<'menu' | 'analytics' | 'kudos' | 'complaints'>('menu')
  const [complaintText, setComplaintText] = useState('')
  const [complaintCategory, setComplaintCategory] = useState('Workplace Issue')
  const [complaintAnonymous, setComplaintAnonymous] = useState(false)
  const [complaintSubmitted, setComplaintSubmitted] = useState(false)
  const [complaints, setComplaints] = useState<any[]>([])
  const [kudosTransactions, setKudosTransactions] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load published announcements from localStorage
  useEffect(() => {
    try {
      const storedAnnouncements = localStorage.getItem('admin_announcements')
      if (storedAnnouncements) {
        const parsed: Announcement[] = JSON.parse(storedAnnouncements)
        const published = parsed
          .filter(a => a.status === 'published')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
        setAnnouncements(published)
      }
    } catch (error) {
      console.error('Error loading announcements:', error)
    }
  }, [])

  // Load complaints and transactions when profile view changes
  useEffect(() => {
    if (profileView === 'complaints' || profileView === 'menu') {
      try {
        const stored = localStorage.getItem('employee_complaints')
        setComplaints(stored ? JSON.parse(stored) : [])
      } catch (error) {
        console.error('Error loading complaints:', error)
        setComplaints([])
      }
    }
    
    if (profileView === 'kudos' || profileView === 'menu') {
      try {
        const stored = localStorage.getItem('worksphere_transactions')
        const transactions = stored ? JSON.parse(stored) : []
        setKudosTransactions(transactions.slice(-5))
      } catch (error) {
        console.error('Error loading transactions:', error)
        setKudosTransactions([])
      }
    }
  }, [profileView])

  const handleComplaintSubmit = () => {
    if (!complaintText.trim()) return
    
    try {
      const newComplaint = {
        id: Date.now().toString(),
        message: complaintText,
        category: complaintCategory,
        anonymous: complaintAnonymous,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
      }
      
      const existing = localStorage.getItem('employee_complaints')
      const allComplaints = existing ? JSON.parse(existing) : []
      allComplaints.push(newComplaint)
      localStorage.setItem('employee_complaints', JSON.stringify(allComplaints))
      
      setComplaints(allComplaints)
      setComplaintSubmitted(true)
      setTimeout(() => {
        setComplaintText('')
        setComplaintCategory('Workplace Issue')
        setComplaintAnonymous(false)
        setComplaintSubmitted(false)
      }, 2000)
    } catch (error) {
      console.error('Error submitting complaint:', error)
    }
  }

  const handleSignOut = () => {
    try {
      localStorage.removeItem('worksphere_punch')
      localStorage.removeItem('worksphere_kudos')
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
    router.push('/')
  }

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
                <Avatar className="w-10 h-10 ring-2 ring-primary/20">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                    KR
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-background rounded-full" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[380px] rounded-2xl aria-describedby={undefined}">
              <DialogHeader>
                <DialogTitle className="sr-only">Profile</DialogTitle>
              </DialogHeader>
              
              {/* Profile View */}
              <AnimatePresence mode="wait">
                {profileView === 'menu' && (
                  <motion.div key="menu" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
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
                          <p className="text-lg font-bold text-amber-500">{kudosData.lifetimeEarned}</p>
                          <p className="text-xs text-muted-foreground">Total Earned</p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="py-2 space-y-1">
                      <button 
                        onClick={() => setProfileView('kudos')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <History className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Kudos History</span>
                      </button>
                      <button 
                        onClick={() => setProfileView('analytics')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Analytics</span>
                      </button>
                      <button 
                        onClick={() => setProfileView('complaints')}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                      >
                        <MessageSquare className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Complaints</span>
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
                    <Button 
                      onClick={handleSignOut}
                      variant="ghost" 
                      className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </Button>
                  </motion.div>
                )}

                {profileView === 'analytics' && (
                  <motion.div key="analytics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                    <button 
                      onClick={() => setProfileView('menu')}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" />
                      Back
                    </button>
                    <h3 className="font-semibold text-base">Your Analytics</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Total Hours This Month</p>
                              <p className="text-xl font-bold">156h</p>
                            </div>
                            <Clock className="w-5 h-5 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Tasks Completed</p>
                              <p className="text-xl font-bold">8</p>
                            </div>
                            <Award className="w-5 h-5 text-amber-500" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Current Streak</p>
                              <p className="text-xl font-bold">8 days</p>
                            </div>
                            <span className="text-2xl">🔥</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                )}

                {profileView === 'kudos' && (
                  <motion.div key="kudos" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                    <button 
                      onClick={() => setProfileView('menu')}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" />
                      Back
                    </button>
                    <h3 className="font-semibold text-base">Recent Kudos Transactions</h3>
                    {kudosTransactions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">No transactions yet</p>
                    ) : (
                      <div className="space-y-2">
                        {kudosTransactions.map((txn: any, idx: number) => (
                          <div key={idx} className="flex items-start justify-between p-2 rounded-lg bg-muted/50">
                            <div>
                              <p className="text-sm font-medium">{txn.description || 'Kudos Transaction'}</p>
                              <p className="text-xs text-muted-foreground">{txn.date || new Date().toLocaleDateString()}</p>
                            </div>
                            <p className={cn('font-bold text-sm', txn.type === 'earned' ? 'text-emerald-600' : 'text-red-600')}>
                              {txn.type === 'earned' ? '+' : '-'}{txn.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {profileView === 'complaints' && (
                  <motion.div key="complaints" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="space-y-4">
                    <button 
                      onClick={() => setProfileView('menu')}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2"
                    >
                      <ChevronDown className="w-4 h-4 rotate-90" />
                      Back
                    </button>
                    <h3 className="font-semibold text-base">Submit Complaint</h3>
                    
                    {complaintSubmitted && (
                      <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-sm text-emerald-600 font-medium">Complaint submitted successfully</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Message</label>
                        <textarea 
                          placeholder="Describe your complaint or concern..."
                          value={complaintText}
                          onChange={(e) => setComplaintText(e.target.value)}
                          className="w-full p-2 rounded-lg border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                        <select 
                          value={complaintCategory}
                          onChange={(e) => setComplaintCategory(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option>Workplace Issue</option>
                          <option>Task Related</option>
                          <option>Technical Problem</option>
                          <option>HR Related</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-muted-foreground">Submit Anonymously</label>
                        <Switch 
                          checked={complaintAnonymous}
                          onCheckedChange={setComplaintAnonymous}
                        />
                      </div>

                      <Button 
                        onClick={handleComplaintSubmit}
                        disabled={!complaintText.trim()}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
                      >
                        Submit Complaint
                      </Button>
                    </div>

                    {complaints.length > 0 && (
                      <>
                        <Separator />
                        <h4 className="text-sm font-semibold">Previous Complaints</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {complaints.map((complaint: any, idx: number) => (
                            <Card key={idx} className="min-w-0">
                              <CardContent className="p-2.5">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <Badge className="text-[10px] mb-1">{complaint.category}</Badge>
                                    <p className="text-xs text-foreground line-clamp-2">{complaint.message.substring(0, 50)}...</p>
                                    <p className="text-[10px] text-muted-foreground mt-1">{complaint.date}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
      <div className="grid grid-cols-2 gap-2 mb-3">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Card 
            className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-200/50 dark:border-amber-800/50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate('kudos')}
          >
            <CardContent className="p-2.5">
              <div className="flex items-center justify-between mb-1">
                <div className="p-1 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold">{kudosData.balance.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Kudos Balance</p>
              <p className="text-xs text-emerald-600 font-medium">+125 this week</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Card 
            className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200/50 dark:border-purple-800/50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onNavigate('tasks')}
          >
            <CardContent className="p-2.5">
              <div className="flex items-center justify-between mb-1">
                <div className="p-1 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <ListTodo className="w-3 h-3 text-white" />
                </div>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              </div>
              <p className="text-lg font-bold">{activeTasks.length}</p>
              <p className="text-xs text-muted-foreground">Active Tasks</p>
              <p className="text-xs text-red-500 font-medium">{highPriorityCount} high priority</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Team Card */}
      <motion.div whileTap={{ scale: 0.98 }}>
        <Card 
          className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-200/50 dark:border-blue-800/50 mb-3 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onNavigate('team')}
        >
          <CardContent className="p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
                <Users className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-xs">My Team</p>
                <p className="text-xs text-muted-foreground">5 members &bull; 2 active tasks</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Announcements Section */}
      {announcements.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-primary" />
            <h2 className="font-semibold">Announcements</h2>
          </div>
          <div className="space-y-2">
            {announcements.map((announcement) => (
              <Card 
                key={announcement.id}
                className={cn(
                  'overflow-hidden',
                  announcement.priority === 'high' && 'border-l-4 border-l-red-500',
                  announcement.priority === 'medium' && 'border-l-4 border-l-blue-500',
                  announcement.priority === 'low' && 'border-l-4 border-l-gray-400'
                )}
              >
                <CardContent className="p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-sm truncate">{announcement.title}</p>
                        {announcement.priority === 'high' && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 h-4">
                            Important
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate overflow-hidden text-ellipsis whitespace-nowrap">
                        {announcement.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {announcement.targetAudience} &bull; {new Date(announcement.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

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
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
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
                        <Sparkles className="w-3 h-3" />
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
