'use client'

import { Megaphone, Calendar, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const announcements = [
  {
    id: '1',
    title: 'Q1 Performance Review Schedule',
    message: 'Performance reviews will be conducted from March 20-25. Please ensure all self-assessments are completed by March 18.',
    date: 'Mar 14, 2026',
    author: 'Admin',
    priority: 'high',
    audience: 'All Employees'
  },
  {
    id: '2',
    title: 'New Kudos Rewards Added',
    message: 'We have added exciting new rewards to the Kudos store including gym memberships and additional PTO days.',
    date: 'Mar 12, 2026',
    author: 'HR Team',
    priority: 'medium',
    audience: 'All Employees'
  },
  {
    id: '3',
    title: 'Office Maintenance Notice',
    message: 'The office will undergo maintenance this Saturday. Please ensure all personal items are secured.',
    date: 'Mar 10, 2026',
    author: 'Facilities',
    priority: 'low',
    audience: 'On-site Staff'
  },
  {
    id: '4',
    title: 'Team Building Event',
    message: 'Join us for a team building event next Friday at 3 PM. Activities include trivia and virtual escape room.',
    date: 'Mar 8, 2026',
    author: 'Admin',
    priority: 'medium',
    audience: 'All Employees'
  },
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

export default function AnnouncementsPage() {
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground">Broadcast messages to your team.</p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Megaphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">By {announcement.author}</p>
                  </div>
                </div>
                {getPriorityBadge(announcement.priority)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">{announcement.message}</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {announcement.date}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  {announcement.audience}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
