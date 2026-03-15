'use client'

import { useState, useEffect } from 'react'
import { 
  Megaphone, 
  Calendar, 
  Users, 
  Plus, 
  Send, 
  Clock, 
  Pin,
  Trash2,
  Edit,
  X,
  Bell
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'

interface Announcement {
  id: string
  title: string
  message: string
  date: string
  author: string
  priority: 'high' | 'medium' | 'low'
  audience: string
  status: 'published' | 'scheduled' | 'draft'
  pinned: boolean
  scheduledFor?: string
}

const defaultAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Q1 Performance Review Schedule',
    message: 'Performance reviews will be conducted from March 20-25. Please ensure all self-assessments are completed by March 18.',
    date: 'Mar 14, 2026',
    author: 'Admin',
    priority: 'high',
    audience: 'All Employees',
    status: 'published',
    pinned: true
  },
  {
    id: '2',
    title: 'New Kudos Rewards Added',
    message: 'We have added exciting new rewards to the Kudos store including gym memberships and additional PTO days.',
    date: 'Mar 12, 2026',
    author: 'HR Team',
    priority: 'medium',
    audience: 'All Employees',
    status: 'published',
    pinned: false
  },
  {
    id: '3',
    title: 'Office Maintenance Notice',
    message: 'The office will undergo maintenance this Saturday. Please ensure all personal items are secured.',
    date: 'Mar 10, 2026',
    author: 'Facilities',
    priority: 'low',
    audience: 'On-site Staff',
    status: 'published',
    pinned: false
  },
  {
    id: '4',
    title: 'Team Building Event',
    message: 'Join us for a team building event next Friday at 3 PM. Activities include trivia and virtual escape room.',
    date: 'Mar 8, 2026',
    author: 'Admin',
    priority: 'medium',
    audience: 'All Employees',
    status: 'scheduled',
    pinned: false,
    scheduledFor: 'Mar 20, 2026'
  },
  {
    id: '5',
    title: 'Updated Remote Work Policy',
    message: 'Draft of new remote work guidelines for Q2.',
    date: 'Mar 6, 2026',
    author: 'HR Team',
    priority: 'high',
    audience: 'All Employees',
    status: 'draft',
    pinned: false
  },
]

const audiences = [
  'All Employees',
  'Engineering',
  'Marketing',
  'Sales',
  'HR',
  'Management',
  'On-site Staff',
  'Remote Staff'
]

function getPriorityBadge(priority: string) {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive">Important</Badge>
    case 'medium':
      return <Badge variant="secondary">General</Badge>
    case 'low':
      return <Badge variant="outline">Info</Badge>
    default:
      return null
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'published':
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Published</Badge>
    case 'scheduled':
      return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Scheduled</Badge>
    case 'draft':
      return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Draft</Badge>
    default:
      return null
  }
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  
  // Form state
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [audience, setAudience] = useState('All Employees')
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [isPinned, setIsPinned] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('admin_announcements')
    if (stored) {
      setAnnouncements(JSON.parse(stored))
    } else {
      setAnnouncements(defaultAnnouncements)
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (announcements.length > 0) {
      localStorage.setItem('admin_announcements', JSON.stringify(announcements))
    }
  }, [announcements])

  const resetForm = () => {
    setTitle('')
    setMessage('')
    setPriority('medium')
    setAudience('All Employees')
    setIsScheduled(false)
    setScheduledDate('')
    setIsPinned(false)
    setEditingAnnouncement(null)
  }

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement)
    setTitle(announcement.title)
    setMessage(announcement.message)
    setPriority(announcement.priority)
    setAudience(announcement.audience)
    setIsScheduled(announcement.status === 'scheduled')
    setScheduledDate(announcement.scheduledFor || '')
    setIsPinned(announcement.pinned)
    setIsDialogOpen(true)
  }

  const handleSubmit = (status: 'published' | 'scheduled' | 'draft') => {
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    
    const finalStatus = isScheduled && scheduledDate ? 'scheduled' : status

    if (editingAnnouncement) {
      setAnnouncements(prev => prev.map(a => 
        a.id === editingAnnouncement.id
          ? {
              ...a,
              title,
              message,
              priority,
              audience,
              status: finalStatus,
              pinned: isPinned,
              scheduledFor: isScheduled ? scheduledDate : undefined
            }
          : a
      ))
    } else {
      const newAnnouncement: Announcement = {
        id: Date.now().toString(),
        title,
        message,
        date: dateStr,
        author: 'Admin',
        priority,
        audience,
        status: finalStatus,
        pinned: isPinned,
        scheduledFor: isScheduled ? scheduledDate : undefined
      }
      setAnnouncements(prev => [newAnnouncement, ...prev])
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id))
  }

  const togglePin = (id: string) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, pinned: !a.pinned } : a
    ))
  }

  const filteredAnnouncements = announcements
    .filter(a => {
      if (activeTab === 'all') return true
      if (activeTab === 'published') return a.status === 'published'
      if (activeTab === 'scheduled') return a.status === 'scheduled'
      if (activeTab === 'drafts') return a.status === 'draft'
      return true
    })
    .sort((a, b) => {
      // Pinned items first
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      return 0
    })

  const stats = {
    total: announcements.length,
    published: announcements.filter(a => a.status === 'published').length,
    scheduled: announcements.filter(a => a.status === 'scheduled').length,
    drafts: announcements.filter(a => a.status === 'draft').length
  }

  return (
    <div className="w-full min-w-0 px-4 py-4 md:px-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Broadcast messages to your team.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              Compose Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAnnouncement ? 'Edit Announcement' : 'Compose New Announcement'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Announcement title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write your announcement message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={priority} onValueChange={(v: 'high' | 'medium' | 'low') => setPriority(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High - Important</SelectItem>
                      <SelectItem value="medium">Medium - General</SelectItem>
                      <SelectItem value="low">Low - Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map(a => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="schedule" className="font-normal">Schedule for later</Label>
                </div>
                <Switch
                  id="schedule"
                  checked={isScheduled}
                  onCheckedChange={setIsScheduled}
                />
              </div>

              {isScheduled && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Scheduled Date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Pin className="w-4 h-4 text-muted-foreground" />
                  <Label htmlFor="pin" className="font-normal">Pin to top</Label>
                </div>
                <Switch
                  id="pin"
                  checked={isPinned}
                  onCheckedChange={setIsPinned}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleSubmit('draft')}
                  disabled={!title.trim() || !message.trim()}
                >
                  Save as Draft
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={() => handleSubmit(isScheduled ? 'scheduled' : 'published')}
                  disabled={!title.trim() || !message.trim()}
                >
                  <Send className="w-4 h-4" />
                  {isScheduled ? 'Schedule' : 'Publish Now'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full min-w-0">
        <Card className="min-w-0 overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Megaphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0 overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.published}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0 overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.scheduled}</p>
                <p className="text-sm text-muted-foreground">Scheduled</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0 overflow-hidden">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Edit className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.drafts}</p>
                <p className="text-sm text-muted-foreground">Drafts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:flex">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Timeline View */}
          <div className="relative space-y-4">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />
            
            {filteredAnnouncements.length === 0 ? (
              <Card className="min-w-0 overflow-hidden">
                <CardContent className="py-12 text-center">
                  <Megaphone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No announcements found</p>
                </CardContent>
              </Card>
            ) : (
              filteredAnnouncements.map((announcement) => (
                <div key={announcement.id} className="relative md:pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-6 w-4 h-4 rounded-full bg-primary border-4 border-background hidden md:block" />
                  
                  <Card className={`hover:shadow-md transition-shadow min-w-0 overflow-hidden ${announcement.pinned ? 'ring-2 ring-primary/20' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                            <Megaphone className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <CardTitle className="text-lg">{announcement.title}</CardTitle>
                              {announcement.pinned && (
                                <Pin className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">By {announcement.author}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                          {getPriorityBadge(announcement.priority)}
                          {getStatusBadge(announcement.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground mb-4">{announcement.message}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-4 sm:gap-6 text-sm text-muted-foreground flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {announcement.status === 'scheduled' && announcement.scheduledFor
                              ? `Scheduled: ${announcement.scheduledFor}`
                              : announcement.date
                            }
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-4 h-4" />
                            {announcement.audience}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePin(announcement.id)}
                            className={announcement.pinned ? 'text-primary' : ''}
                          >
                            <Pin className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(announcement)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteAnnouncement(announcement.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
