'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, getDay, startOfWeek, addDays, isWeekend, isFuture, parseISO } from 'date-fns'
import { ChevronLeft, ChevronRight, Clock, LogIn, LogOut, ListTodo, CheckCircle, Coins, TrendingUp, TrendingDown, Flame } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { attendanceData, type AttendanceRecord } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getAttendanceForDate(dateStr: string): AttendanceRecord | undefined {
  return attendanceData.find(record => record.date === dateStr)
}

function calculateStreak(dateStr: string): number {
  const targetDate = parseISO(dateStr)
  let streak = 0
  let currentDate = targetDate
  
  while (true) {
    const record = getAttendanceForDate(format(currentDate, 'yyyy-MM-dd'))
    if (record && (record.status === 'early' || record.status === 'on-time')) {
      streak++
      currentDate = addDays(currentDate, -1)
      // Skip weekends when counting streak
      while (isWeekend(currentDate)) {
        currentDate = addDays(currentDate, -1)
      }
    } else {
      break
    }
  }
  
  return streak
}

export function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 14)) // March 2026
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [direction, setDirection] = useState(0)

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const startDate = startOfWeek(monthStart) // Get Sunday of the week containing month start
    const days: Date[] = []
    
    let day = startDate
    // Generate 6 weeks worth of days to cover all possible month layouts
    for (let i = 0; i < 42; i++) {
      days.push(day)
      day = addDays(day, 1)
    }
    
    return days
  }, [currentMonth])

  const handlePrevMonth = () => {
    setDirection(-1)
    setCurrentMonth(prev => subMonths(prev, 1))
  }

  const handleNextMonth = () => {
    setDirection(1)
    setCurrentMonth(prev => addMonths(prev, 1))
  }

  const handleSwipe = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handlePrevMonth()
    } else if (info.offset.x < -100) {
      handleNextMonth()
    }
  }

  const handleDayClick = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const record = getAttendanceForDate(dateStr)
    if (record) {
      setSelectedRecord(record)
      setSheetOpen(true)
    }
  }

  const getStatusColor = (date: Date): string | null => {
    // No color for weekends or future dates
    if (isWeekend(date) || isFuture(date)) return null
    
    const dateStr = format(date, 'yyyy-MM-dd')
    const record = getAttendanceForDate(dateStr)
    
    if (!record) return null
    
    switch (record.status) {
      case 'early':
      case 'on-time':
        return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100'
      case 'late':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-100'
      case 'absent':
        return 'bg-red-100 dark:bg-red-900/40 text-red-900 dark:text-red-100'
      default:
        return null
    }
  }

  const selectedStreak = selectedRecord ? calculateStreak(selectedRecord.date) : 0

  return (
    <div className="pb-36 px-4 pt-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        
        <motion.h2 
          key={format(currentMonth, 'MMM-yyyy')}
          initial={{ opacity: 0, y: direction * 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-semibold"
        >
          {format(currentMonth, 'MMMM yyyy')}
        </motion.h2>
        
        <Button variant="ghost" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <motion.div
        key={format(currentMonth, 'MMM-yyyy')}
        initial={{ opacity: 0, x: direction * 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleSwipe}
        className="mb-6"
      >
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isTodayDate = isToday(day)
            const statusColor = isCurrentMonth ? getStatusColor(day) : null
            const hasRecord = isCurrentMonth && getAttendanceForDate(format(day, 'yyyy-MM-dd'))
            
            return (
              <motion.button
                key={day.toISOString()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01 }}
                onClick={() => isCurrentMonth && handleDayClick(day)}
                disabled={!isCurrentMonth || !hasRecord}
                className={cn(
                  'aspect-square flex items-center justify-center text-sm rounded-lg transition-all relative',
                  !isCurrentMonth && 'text-muted-foreground/40 cursor-default',
                  isCurrentMonth && !hasRecord && 'text-foreground',
                  statusColor,
                  hasRecord && 'cursor-pointer hover:ring-2 hover:ring-primary/50',
                  isTodayDate && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                )}
              >
                {format(day, 'd')}
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700" />
          <span>Early/On Time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700" />
          <span>Late</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700" />
          <span>Absent</span>
        </div>
      </div>

      {/* Day Detail Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          {selectedRecord && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <SheetHeader className="pb-4">
                <SheetTitle className="text-left">
                  {format(parseISO(selectedRecord.date), 'EEEE, MMMM d')}
                </SheetTitle>
                <Badge 
                  className={cn(
                    'w-fit',
                    selectedRecord.status === 'early' && 'bg-emerald-500 text-white',
                    selectedRecord.status === 'on-time' && 'bg-emerald-500 text-white',
                    selectedRecord.status === 'late' && 'bg-amber-500 text-white',
                    selectedRecord.status === 'absent' && 'bg-red-500 text-white'
                  )}
                >
                  {selectedRecord.status === 'early' ? 'Early' : 
                   selectedRecord.status === 'on-time' ? 'On Time' :
                   selectedRecord.status === 'late' ? 'Late' : 'Absent'}
                </Badge>
              </SheetHeader>

              <div className="space-y-4">
                {/* Check In / Out Times */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <LogIn className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Check In</p>
                      <p className="font-semibold">{selectedRecord.checkIn || '---'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                      <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Check Out</p>
                      <p className="font-semibold">{selectedRecord.checkOut || '---'}</p>
                    </div>
                  </div>
                </div>

                {/* Hours Worked */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Hours Worked</p>
                    <p className="font-semibold">{selectedRecord.hoursWorked}h</p>
                  </div>
                </div>

                {/* Tasks */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                      <ListTodo className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tasks Received</p>
                      <p className="font-semibold">{selectedRecord.tasksReceived}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Tasks Completed</p>
                      <p className="font-semibold">{selectedRecord.tasksCompleted}</p>
                    </div>
                  </div>
                </div>

                {/* Coins */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Coins Earned</p>
                      <p className="font-semibold text-emerald-600 dark:text-emerald-400">+{selectedRecord.coinsEarned}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                      <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Coins Redeemed</p>
                      <p className="font-semibold text-red-600 dark:text-red-400">
                        {selectedRecord.coinsRedeemed > 0 ? `-${selectedRecord.coinsRedeemed}` : '0'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Streak Note */}
                {selectedStreak >= 3 && (selectedRecord.status === 'early' || selectedRecord.status === 'on-time') && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200 dark:border-orange-800"
                  >
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-medium text-orange-700 dark:text-orange-300">
                      {selectedStreak} day streak!
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
