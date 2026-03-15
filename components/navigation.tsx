'use client'

import { motion } from 'framer-motion'
import { Calendar, Users, Home, Bell, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabType = 'calendar' | 'team' | 'home' | 'tasks' | 'kudos'

interface NavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs: { id: TabType; icon: typeof Home; label: string; gradient: string }[] = [
  { id: 'calendar', icon: Calendar, label: 'Calendar', gradient: 'from-emerald-500 to-green-600' },
  { id: 'team', icon: Users, label: 'Team', gradient: 'from-blue-500 to-cyan-600' },
  { id: 'home', icon: Home, label: 'Home', gradient: 'from-indigo-500 to-purple-600' },
  { id: 'tasks', icon: Bell, label: 'Tasks', gradient: 'from-purple-500 to-pink-600' },
  { id: 'kudos', icon: Sparkles, label: 'Kudos', gradient: 'from-amber-500 to-yellow-500' }
]

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-card/95 backdrop-blur-lg border-t border-border z-50">
      <div className="flex items-center justify-around py-2 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center gap-1 p-2 min-w-[60px]"
            >
              <motion.div
                className={cn(
                  'relative p-2 rounded-full transition-all duration-200',
                  isActive && `bg-gradient-to-br ${tab.gradient}`
                )}
                whileTap={{ scale: 0.9 }}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors',
                    isActive ? 'text-white' : 'text-muted-foreground'
                  )}
                />
              </motion.div>
              <span
                className={cn(
                  'text-[10px] font-medium transition-colors',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className={cn('absolute -bottom-1 w-1 h-1 rounded-full bg-gradient-to-r', tab.gradient)}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
