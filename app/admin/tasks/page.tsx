'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Trash2, Users, User } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { adminTasks as mockTasks, adminEmployees } from '@/lib/adminMockData'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AdminTask {
  id: string
  title: string
  description?: string
  assignedTo: string
  assignedToId: string
  status: 'pending' | 'in-progress' | 'completed'
  dueDate: string
  dueTime?: string
  kudos: number
  priority: 'high' | 'medium' | 'low'
  isTeamTask?: boolean
  assignedToIds?: string[]
}

const priorityKudosMap: Record<string, number> = {
  low: 20,
  medium: 40,
  high: 75
}

function getTaskStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 whitespace-nowrap">Completed</Badge>
    case 'in-progress':
      return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 whitespace-nowrap">In Progress</Badge>
    case 'pending':
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 whitespace-nowrap">Pending</Badge>
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

export default function TasksPage() {
  const [tasks, setTasks] = useState<AdminTask[]>([])
  const [filter, setFilter] = useState<string>('all')
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [taskType, setTaskType] = useState<'individual' | 'team'>('individual')
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<string[]>([])
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [kudosReward, setKudosReward] = useState(40)
  const [dueDate, setDueDate] = useState('')
  const [dueTime, setDueTime] = useState('')

  // Load tasks from localStorage and merge with mock data
  useEffect(() => {
    const storedTasks = localStorage.getItem('admin_tasks')
    const parsedStoredTasks: AdminTask[] = storedTasks ? JSON.parse(storedTasks) : []
    
    // Convert mock tasks to the right format
    const formattedMockTasks: AdminTask[] = mockTasks.map(t => ({
      ...t,
      description: '',
      dueTime: '',
      isTeamTask: false,
      assignedToIds: [t.assignedToId]
    }))
    
    // Merge stored tasks with mock tasks (stored tasks take priority for same IDs)
    const storedIds = new Set(parsedStoredTasks.map(t => t.id))
    const mergedTasks = [
      ...parsedStoredTasks,
      ...formattedMockTasks.filter(t => !storedIds.has(t.id))
    ]
    
    setTasks(mergedTasks)
  }, [])

  // Update kudos when priority changes
  useEffect(() => {
    setKudosReward(priorityKudosMap[priority])
  }, [priority])

  const handleTeamMemberToggle = (employeeId: string) => {
    setSelectedTeamMembers(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim()) {
      toast.error('Please enter a task title')
      return
    }
    
    if (taskType === 'individual' && !selectedEmployee) {
      toast.error('Please select an employee')
      return
    }
    
    if (taskType === 'team' && selectedTeamMembers.length === 0) {
      toast.error('Please select at least one team member')
      return
    }
    
    if (!dueDate) {
      toast.error('Please select a due date')
      return
    }

    const assignedToIds = taskType === 'individual' ? [selectedEmployee] : selectedTeamMembers
    const assignedEmployees = adminEmployees.filter(e => assignedToIds.includes(e.id))
    const assignedToNames = assignedEmployees.map(e => e.name).join(', ')

    const newTask: AdminTask = {
      id: `TASK-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      assignedTo: assignedToNames,
      assignedToId: assignedToIds[0],
      assignedToIds: assignedToIds,
      status: 'pending',
      dueDate: new Date(dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      dueTime: dueTime || undefined,
      kudos: kudosReward,
      priority,
      isTeamTask: taskType === 'team'
    }

    const updatedTasks = [newTask, ...tasks]
    setTasks(updatedTasks)
    
    // Save only new/modified tasks to localStorage
    const storedTasks = updatedTasks.filter(t => t.id.startsWith('TASK-') && t.id.includes('-'))
    localStorage.setItem('admin_tasks', JSON.stringify(storedTasks.filter(t => !mockTasks.some(m => m.id === t.id))))
    
    toast.success('Task assigned successfully!')
    
    // Reset form
    setTitle('')
    setDescription('')
    setTaskType('individual')
    setSelectedEmployee('')
    setSelectedTeamMembers([])
    setPriority('medium')
    setKudosReward(40)
    setDueDate('')
    setDueTime('')
  }

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId)
    setTasks(updatedTasks)
    
    // Update localStorage
    const storedTasks = updatedTasks.filter(t => !mockTasks.some(m => m.id === t.id))
    localStorage.setItem('admin_tasks', JSON.stringify(storedTasks))
    
    toast.success('Task deleted successfully')
    setDeleteTaskId(null)
  }

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'pending': return task.status === 'pending'
      case 'in-progress': return task.status === 'in-progress'
      case 'completed': return task.status === 'completed'
      case 'team': return task.isTeamTask
      default: return true
    }
  })

  const pendingCount = tasks.filter(t => t.status === 'pending').length
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length
  const completedCount = tasks.filter(t => t.status === 'completed').length

  return (
    <div className="w-full min-w-0 px-4 py-4 md:px-6 space-y-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl font-bold text-foreground">Tasks</h1>
        <p className="text-xs text-muted-foreground">Create and manage team tasks.</p>
      </div>

      {/* Stats - 3 columns on mobile, same on desktop */}
      <div className="grid grid-cols-3 gap-3 w-full">
        <Card className="border-l-4 border-l-amber-500 min-w-0 overflow-hidden">
          <CardContent className="p-3">
            <p className="text-xl font-bold text-foreground">{pendingCount}</p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 min-w-0 overflow-hidden">
          <CardContent className="p-3">
            <p className="text-xl font-bold text-foreground">{inProgressCount}</p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500 min-w-0 overflow-hidden">
          <CardContent className="p-3">
            <p className="text-xl font-bold text-foreground">{completedCount}</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Task Form */}
      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm">Create New Task</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input 
                id="title"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                placeholder="Enter task description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Task Type Toggle */}
            <div className="space-y-2">
              <Label>Task Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={taskType === 'individual' ? 'default' : 'outline'}
                  className={cn(
                    'flex-1 gap-2',
                    taskType === 'individual' && 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  )}
                  onClick={() => setTaskType('individual')}
                >
                  <User className="w-4 h-4" />
                  Individual
                </Button>
                <Button
                  type="button"
                  variant={taskType === 'team' ? 'default' : 'outline'}
                  className={cn(
                    'flex-1 gap-2',
                    taskType === 'team' && 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  )}
                  onClick={() => setTaskType('team')}
                >
                  <Users className="w-4 h-4" />
                  Team
                </Button>
              </div>
            </div>

            {/* Employee Selection */}
            {taskType === 'individual' ? (
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>Team Members</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 border rounded-lg bg-muted/30">
                  {adminEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center gap-2">
                      <Checkbox
                        id={employee.id}
                        checked={selectedTeamMembers.includes(employee.id)}
                        onCheckedChange={() => handleTeamMemberToggle(employee.id)}
                      />
                      <Label htmlFor={employee.id} className="text-sm font-normal cursor-pointer">
                        {employee.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Priority and Kudos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={(v) => setPriority(v as 'low' | 'medium' | 'high')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (20 Kudos)</SelectItem>
                    <SelectItem value="medium">Medium (40 Kudos)</SelectItem>
                    <SelectItem value="high">High (75 Kudos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kudos">Kudos Reward</Label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                  <Input 
                    id="kudos"
                    type="number"
                    min={1}
                    value={kudosReward}
                    onChange={(e) => setKudosReward(Number(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Due Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueTime">Due Time (Optional)</Label>
                <Input 
                  id="dueTime"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              Assign Task
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* All Tasks List */}
      <Card className="min-w-0 overflow-hidden">
        <CardHeader className="pb-2 pt-4 px-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-sm">All Tasks</CardTitle>
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'in-progress', 'completed', 'team'].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={cn(
                    'text-xs',
                    filter === f && 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  )}
                >
                  {f === 'all' ? 'All' : 
                   f === 'in-progress' ? 'In Progress' : 
                   f === 'team' ? 'Team Tasks' :
                   f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {filteredTasks.length === 0 ? (
            <p className="text-center text-muted-foreground py-6 text-sm">No tasks found.</p>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-foreground text-sm truncate">{task.title}</p>
                      {task.isTeamTask && (
                        <Badge variant="outline" className="text-xs gap-1">
                          <Users className="w-3 h-3" />
                          Team
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">
                      Assigned to: {task.assignedTo}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-muted-foreground">
                        Due: {task.dueDate}{task.dueTime ? ` at ${task.dueTime}` : ''}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    {getPriorityBadge(task.priority)}
                    <div className="flex items-center gap-1 text-amber-500">
                      <Sparkles className="w-4 h-4" />
                      <span className="font-semibold text-sm">{task.kudos}</span>
                    </div>
                    {getTaskStatusBadge(task.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTaskId(task.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTaskId} onOpenChange={() => setDeleteTaskId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTaskId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteTaskId && handleDeleteTask(deleteTaskId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
