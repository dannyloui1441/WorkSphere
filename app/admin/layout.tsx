'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, ClipboardList, CalendarCheck, Sparkles, Megaphone, LogOut, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
  { id: 'employees', label: 'Employees', icon: Users, href: '/admin/employees' },
  { id: 'tasks', label: 'Tasks', icon: ClipboardList, href: '/admin/tasks' },
  { id: 'attendance', label: 'Attendance', icon: CalendarCheck, href: '/admin/attendance' },
  { id: 'kudos', label: 'Kudos', icon: Sparkles, href: '/admin/kudos' },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, href: '/admin/announcements' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    document.documentElement.classList.toggle('dark', newMode)
    localStorage.setItem('worksphere_theme', newMode ? 'dark' : 'light')
  }

  const getActiveItem = () => {
    for (const item of navItems) {
      if (pathname.startsWith(item.href)) return item.id
    }
    return 'dashboard'
  }

  const activeItem = getActiveItem()

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Fixed Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">WS</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">WorkSphere</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-4">
          {/* Admin Profile */}
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-semibold">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Admin</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-8 w-8"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          {/* Switch to Employee */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => router.push('/employee')}
          >
            <LogOut className="w-4 h-4" />
            Switch to Employee
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
