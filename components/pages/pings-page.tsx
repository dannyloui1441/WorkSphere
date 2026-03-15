'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { AlertTriangle, Clock, Sparkles, User, Check, ChevronDown, Users, MessageCircle, Filter } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { tasks as initialTasks, teamMembers, type Task, type TaskStatus } from '@/lib/mockData'
import { cn, updateKudos, addTransaction } from '@/lib/utils'

interface PingsPageProps {
  onKudosUpdate: () => void
  onOpenTaskChat?: (taskId: string) => void
}

// Admin task shape from localStorage
interface AdminTask {
  id: string
  title: string
  description: string
  assignedTo: string
  assignedToId: string
  isTeamTask: boolean
  assignedToIds: string[]
  priority: 'high' | 'medium' | 'low'
  kudos: number
  dueDate: string
  dueTime: string
  status: 'pending' | 'in-progress' | 'completed'
}

export function PingsPage({ onKudosUpdate, onOpenTaskChat }: PingsPageProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'acknowledged' | 'team'>('all')
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; task: Task | null; action: 'acknowledge' | 'complete' | null }>({
    open: false,
    task: null,
    action: null
  })
  
  // Load and merge admin tasks from localStorage
  useEffect(() => {
    const loadAdminTasks = () => {
      try {
        const adminTasksJson = localStorage.getItem('admin_tasks')
        if (!adminTasksJson) return
        
        const adminTasks: AdminTask[] = JSON.parse(adminTasksJson)
        
        // Filter tasks assigned to EMP001 (K Ramachandran) or team tasks
        const relevantTasks = adminTasks.filter(task => 
          task.assignedToId === 'EMP001' || task.isTeamTask === true
        )
        
        // Map admin tasks to the Task interface
        const mappedTasks: Task[] = relevantTasks.map(adminTask => ({
          id: adminTask.id,
          title: adminTask.title,
          description: adminTask.description,
          priority: adminTask.priority,
          dueDate: adminTask.dueDate,
          dueTime: adminTask.dueTime,
          coins: adminTask.kudos, // Map kudos to coins
          status: adminTask.status === 'in-progress' ? 'acknowledged' : adminTask.status as TaskStatus,
          assignedBy: 'Admin',
          assignedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
          isTeamTask: adminTask.isTeamTask,
          assignedTo: adminTask.isTeamTask ? adminTask.assignedToIds : undefined
        }))
        
        // Merge with initial tasks, avoiding duplicates by ID
        setTasks(prevTasks => {
          const existingIds = new Set(initialTasks.map(t => t.id))
          const newAdminTasks = mappedTasks.filter(t => !existingIds.has(t.id))
          return [...initialTasks, ...newAdminTasks]
        })
      } catch (error) {
        console.error('Error loading admin tasks:', error)
      }
    }
    
    loadAdminTasks()
  }, [])

  const filterTasks = (taskList: Task[]) => {
    if (statusFilter === 'all') return taskList
    if (statusFilter === 'team') return taskList.filter(t => t.isTeamTask)
    if (statusFilter === 'pending') return taskList.filter(t => t.status === 'pending')
    if (statusFilter === 'acknowledged') return taskList.filter(t => t.status === 'acknowledged')
    return taskList
  }

  const activeTasks = filterTasks(tasks.filter(t => t.status !== 'completed'))
  const completedTasks = filterTasks(tasks.filter(t => t.status === 'completed'))

  const handleAction = (e: React.MouseEvent, task: Task, action: 'acknowledge' | 'complete') => {
    e.stopPropagation()
    setConfirmDialog({ open: true, task, action })
  }

  const confirmAction = () => {
    if (!confirmDialog.task || !confirmDialog.action) return

    const task = confirmDialog.task
    const action = confirmDialog.action

    setTasks(prev => prev.map(t => {
      if (t.id === task.id) {
        const newStatus: TaskStatus = action === 'acknowledge' ? 'acknowledged' : 'completed'
        return { ...t, status: newStatus }
      }
      return t
    }))

    if (action === 'complete') {
      updateKudos('earn', task.coins)
      addTransaction({
        type: 'earned',
        description: `Task Completed: ${task.title}`,
        amount: task.coins,
        date: format(new Date(), 'yyyy-MM-dd'),
        taskId: task.id
      })
      onKudosUpdate()
    }

    setConfirmDialog({ open: false, task: null, action: null })
  }

  const toggleExpand = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId)
  }

  const handleTeamChat = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation()
    if (onOpenTaskChat) {
      onOpenTaskChat(taskId)
    }
  }

  const getAssignedMembers = (assignedTo?: string[]) => {
    if (!assignedTo) return []
    return teamMembers.filter(m => assignedTo.includes(m.id))
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const isExpanded = expandedTaskId === task.id
    const assignedMembers = getAssignedMembers(task.assignedTo)
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card 
          className={cn(
            'mb-3 cursor-pointer transition-shadow hover:shadow-md',
            isExpanded && 'ring-2 ring-primary/20'
          )}
          onClick={() => toggleExpand(task.id)}
        >
          <CardContent className="p-4">
            {/* Collapsed Header - Always visible */}
            <div className="flex items-start gap-3">
              <div className={cn(
                'p-2 rounded-lg mt-0.5 shrink-0',
                task.priority === 'high' && 'bg-red-100 dark:bg-red-950/50',
                task.priority === 'medium' && 'bg-amber-100 dark:bg-amber-950/50',
                task.priority === 'low' && 'bg-blue-100 dark:bg-blue-950/50'
              )}>
                <AlertTriangle className={cn(
                  'w-4 h-4',
                  task.priority === 'high' && 'text-red-600',
                  task.priority === 'medium' && 'text-amber-600',
                  task.priority === 'low' && 'text-blue-600'
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs text-muted-foreground font-mono">{task.id}</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      'text-[10px] px-1.5',
                      task.priority === 'high' && 'border-red-300 text-red-600',
                      task.priority === 'medium' && 'border-amber-300 text-amber-600',
                      task.priority === 'low' && 'border-blue-300 text-blue-600'
                    )}
                  >
                    {task.priority}
                  </Badge>
                  {task.isTeamTask && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 bg-blue-100 text-blue-600 dark:bg-blue-950/50">
                      <Users className="w-3 h-3 mr-1" />
                      Team
                    </Badge>
                  )}
                </div>
                <h3 className="font-semibold text-sm mb-2">{task.title}</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{task.dueDate} {task.dueTime}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Sparkles className="w-3 h-3" />
                      <span className="font-semibold">{task.coins}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {task.status === 'pending' && (
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs h-7"
                        onClick={(e) => handleAction(e, task, 'acknowledge')}
                      >
                        Acknowledge
                      </Button>
                    )}
                    {task.status === 'acknowledged' && (
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white text-xs h-7"
                        onClick={(e) => handleAction(e, task, 'complete')}
                      >
                        Complete
                      </Button>
                    )}
                    {task.status === 'completed' && (
                      <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 text-xs">
                        <Check className="w-3 h-3 mr-1" />
                        Done
                      </Badge>
                    )}
                    <ChevronDown className={cn(
                      'w-4 h-4 text-muted-foreground transition-transform',
                      isExpanded && 'rotate-180'
                    )} />
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">{task.description}</p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                      <User className="w-3 h-3" />
                      <span>Assigned by <span className="font-medium text-foreground">{task.assignedBy}</span></span>
                      <span className="text-muted-foreground/50">|</span>
                      <span>{task.assignedAt}</span>
                    </div>

                    {task.isTeamTask && assignedMembers.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {assignedMembers.map((member) => (
                              <Avatar key={member.id} className="w-7 h-7 border-2 border-background">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback className="text-[10px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {assignedMembers.map(m => m.name.split(' ')[0]).join(', ')}
                          </span>
                        </div>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/50"
                          onClick={(e) => handleTeamChat(e, task.id)}
                        >
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Team Chat
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="pb-36 px-4 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Tasks</h1>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
          <SelectTrigger className="w-[130px] h-8 text-xs">
            <Filter className="w-3 h-3 mr-1" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">New</SelectItem>
            <SelectItem value="acknowledged">In Progress</SelectItem>
            <SelectItem value="team">Team</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active">Active ({activeTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <AnimatePresence mode="popLayout">
            {activeTasks.length > 0 ? (
              activeTasks.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Check className="w-12 h-12 mx-auto text-emerald-500 mb-3" />
                <p className="text-muted-foreground">No tasks match this filter</p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
        
        <TabsContent value="completed">
          <AnimatePresence mode="popLayout">
            {completedTasks.length > 0 ? (
              completedTasks.map(task => <TaskCard key={task.id} task={task} />)
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">No completed tasks</p>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>

      <Dialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === 'acknowledge' ? 'Acknowledge Task?' : 'Complete Task?'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === 'acknowledge' 
                ? 'This will mark the task as acknowledged and you will be responsible for completing it.'
                : `This will mark the task as complete and you will earn ${confirmDialog.task?.coins} Kudos.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmDialog({ open: false, task: null, action: null })}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAction}
              className={cn(
                confirmDialog.action === 'acknowledge' 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-600',
                'text-white'
              )}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
