'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { Navigation, type TabType } from '@/components/navigation'
import { PunchButton } from '@/components/punch-button'
import { HomePage } from '@/components/pages/home-page'
import { PingsPage } from '@/components/pages/pings-page'
import { CoinsPage } from '@/components/pages/coins-page'
import { CalendarPage } from '@/components/pages/calendar-page'
import { StatsPage } from '@/components/pages/stats-page'
import { TeamPage } from '@/components/pages/team-page'
import { getCoinsData, type CoinsData, initialCoinsData } from '@/lib/utils'

const tabOrder: TabType[] = ['calendar', 'team', 'home', 'tasks', 'coins']

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home')
  const [isPunchedIn, setIsPunchedIn] = useState(false)
  const [punchInTime, setPunchInTime] = useState<string | null>(null)
  const [direction, setDirection] = useState(0)
  const [coinsData, setCoinsData] = useState<CoinsData>(initialCoinsData)
  const [openTaskChatId, setOpenTaskChatId] = useState<string | null>(null)

  const refreshCoinsData = useCallback(() => {
    setCoinsData(getCoinsData())
  }, [])

  useEffect(() => {
    // Read punch state from localStorage
    const stored = localStorage.getItem('worksphere_punch')
    if (stored) {
      try {
        const data = JSON.parse(stored)
        setIsPunchedIn(data.isPunchedIn)
        setPunchInTime(data.punchInTime)
      } catch {
        // Invalid data, ignore
      }
    }
    // Load coins data
    refreshCoinsData()
  }, [refreshCoinsData])

  const handleTabChange = (tab: TabType) => {
    const currentIndex = tabOrder.indexOf(activeTab)
    const newIndex = tabOrder.indexOf(tab)
    setDirection(newIndex > currentIndex ? 1 : -1)
    setActiveTab(tab)
    // Clear task chat id when manually changing tabs
    if (tab !== 'team') {
      setOpenTaskChatId(null)
    }
  }

  const handleOpenTaskChat = useCallback((taskId: string) => {
    setOpenTaskChatId(taskId)
    const currentIndex = tabOrder.indexOf(activeTab)
    const newIndex = tabOrder.indexOf('team')
    setDirection(newIndex > currentIndex ? 1 : -1)
    setActiveTab('team')
  }, [activeTab])

  const handleSwipe = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    const currentIndex = tabOrder.indexOf(activeTab)
    
    if (info.offset.x < -threshold && currentIndex < tabOrder.length - 1) {
      setDirection(1)
      setActiveTab(tabOrder[currentIndex + 1])
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setDirection(-1)
      setActiveTab(tabOrder[currentIndex - 1])
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage isPunchedIn={isPunchedIn} punchInTime={punchInTime} onNavigate={handleTabChange} coinsData={coinsData} />
      case 'tasks':
        return <PingsPage onCoinsUpdate={refreshCoinsData} onOpenTaskChat={handleOpenTaskChat} />
      case 'coins':
        return <CoinsPage coinsData={coinsData} onCoinsUpdate={refreshCoinsData} />
      case 'calendar':
        return <CalendarPage />
      case 'team':
        return <TeamPage taskChatId={openTaskChatId} onClearTaskChat={() => setOpenTaskChatId(null)} />
      default:
        return <HomePage isPunchedIn={isPunchedIn} punchInTime={punchInTime} onNavigate={handleTabChange} coinsData={coinsData} />
    }
  }

  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleSwipe}
        className="min-h-screen"
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {activeTab === 'home' && (
        <PunchButton isPunchedIn={isPunchedIn} punchInTime={punchInTime} />
      )}
      
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />
    </main>
  )
}
