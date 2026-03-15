'use client'

import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { adminTasks } from '@/lib/adminMockData'
import { cn } from '@/lib/utils'

function getTaskStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Completed</Badge>
    case 'in-progress':
      return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">In Progress</Badge>
    case 'pending':
      return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Pending</Badge>
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
  const pendingTasks = adminTasks.filter(t => t.status === 'pending')
  const inProgressTasks = adminTasks.filter(t => t.status === 'in-progress')
  const completedTasks = adminTasks.filter(t => t.status === 'completed')

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
        <p className="text-muted-foreground">Manage and track all team tasks.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{pendingTasks.length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{inProgressTasks.length}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-foreground">{completedTasks.length}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* All Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Task</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Assigned To</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Kudos</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {adminTasks.map((task) => (
                  <tr 
                    key={task.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-foreground">{task.title}</p>
                        <p className="text-sm text-muted-foreground">{task.id}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-foreground">{task.assignedTo}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className={cn(
                        'text-foreground',
                        task.dueDate === 'Today' && 'text-amber-600 dark:text-amber-400 font-medium'
                      )}>{task.dueDate}</p>
                    </td>
                    <td className="py-4 px-4">
                      {getPriorityBadge(task.priority)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-semibold">{task.kudos}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getTaskStatusBadge(task.status)}
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
