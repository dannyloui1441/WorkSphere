'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Send, Clock, AlertTriangle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { teamMembers, tasks, chatMessages as initialMessages, currentUser, type ChatMessage, type Task } from '@/lib/mockData'
import { cn } from '@/lib/utils'

interface TeamPageProps {
  taskChatId?: string | null
  onClearTaskChat?: () => void
}

export function TeamPage({ taskChatId, onClearTaskChat }: TeamPageProps) {
  const [activeTab, setActiveTab] = useState('tasks')
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [currentTaskChat, setCurrentTaskChat] = useState<Task | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Handle incoming taskChatId from Tasks page
  useEffect(() => {
    if (taskChatId) {
      const task = tasks.find(t => t.id === taskChatId)
      if (task) {
        setCurrentTaskChat(task)
        setActiveTab('chat')
      }
    }
  }, [taskChatId])

  // When switching away from chat, clear the task context
  useEffect(() => {
    if (activeTab !== 'chat' && currentTaskChat) {
      setCurrentTaskChat(null)
      onClearTaskChat?.()
    }
  }, [activeTab, currentTaskChat, onClearTaskChat])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    
    const message: ChatMessage = {
      id: `MSG${Date.now()}`,
      senderId: currentUser.id,
      message: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    }
    
    setMessages([...messages, message])
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getMemberById = (id: string) => teamMembers.find(m => m.id === id)

  const teamTasks = tasks.filter(t => t.status !== 'completed').slice(0, 3)

  return (
    <div className="pb-36 px-4 pt-4 flex flex-col h-[calc(100vh-140px)]">
      <h1 className="text-xl font-bold mb-4">My Team</h1>
      
      {/* Team Members Row */}
      <div className="mb-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-2">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                className="flex flex-col items-center"
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <Avatar className="w-12 h-12 ring-2 ring-border">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className={cn(
                    'absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-background rounded-full',
                    member.status === 'online' && 'bg-emerald-500',
                    member.status === 'away' && 'bg-amber-500',
                    member.status === 'offline' && 'bg-gray-400'
                  )} />
                </div>
                <span className="text-xs mt-1 text-muted-foreground max-w-[60px] truncate">
                  {member.name.split(' ')[0]}
                </span>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="tasks">Team Tasks</TabsTrigger>
          <TabsTrigger value="chat">Team Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="flex-1 overflow-auto">
          <div className="space-y-3">
            {teamTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        'p-2 rounded-lg mt-0.5',
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
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-mono">{task.id}</span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'text-[10px]',
                              task.status === 'pending' && 'border-amber-300 text-amber-600',
                              task.status === 'acknowledged' && 'border-blue-300 text-blue-600'
                            )}
                          >
                            {task.status}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-sm mb-1">{task.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{task.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{task.dueDate} {task.dueTime}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {teamMembers.slice(0, 3).map((member) => (
                                <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback className="text-[10px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-xs"
                              onClick={() => setActiveTab('chat')}
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              Discuss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 pb-4">
          {/* Task Context Banner */}
          {currentTaskChat && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-0.5">Discussing task</p>
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">{currentTaskChat.title}</p>
                  <p className="text-xs text-blue-600/80 dark:text-blue-400/80">{currentTaskChat.id}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                  onClick={() => {
                    setCurrentTaskChat(null)
                    onClearTaskChat?.()
                  }}
                >
                  Clear
                </Button>
              </div>
            </motion.div>
          )}
          
          {/* Messages */}
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-4 pb-4">
              {messages.map((message) => {
                const sender = getMemberById(message.senderId)
                const isCurrentUser = message.senderId === currentUser.id
                
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'flex gap-2',
                      isCurrentUser && 'flex-row-reverse'
                    )}
                  >
                    {!isCurrentUser && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={sender?.avatar} alt={sender?.name} />
                        <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                          {sender?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn(
                      'max-w-[75%]',
                      isCurrentUser && 'text-right'
                    )}>
                      {!isCurrentUser && (
                        <p className="text-xs text-muted-foreground mb-1">{sender?.name}</p>
                      )}
                      <div className={cn(
                        'rounded-2xl px-4 py-2 inline-block',
                        isCurrentUser 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm' 
                          : 'bg-muted rounded-bl-sm'
                      )}>
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">{message.timestamp}</p>
                    </div>
                  </motion.div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="flex gap-2 pt-4 border-t">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
