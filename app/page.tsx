'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

type RoleType = 'employee' | 'admin' | null

const mockCredentials = {
  employee: { email: 'emp@worksphere.com', password: '1234' },
  admin: { email: 'admin@worksphere.com', password: '1234' }
}

export default function LoginPage() {
  const router = useRouter()
  const [expandedCard, setExpandedCard] = useState<RoleType>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  const handleCardClick = (role: RoleType) => {
    if (expandedCard === role) return
    setExpandedCard(role)
    setEmail('')
    setPassword('')
    setError(false)
  }

  const handleLogin = (role: RoleType) => {
    if (!role) return
    
    const creds = mockCredentials[role]
    if (email === creds.email && password === creds.password) {
      router.push(role === 'employee' ? '/employee' : '/admin')
    } else {
      setError(true)
      setShakeKey(prev => prev + 1)
    }
  }

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
          <span className="text-white font-bold text-2xl">WS</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">WorkSphere</h1>
        <p className="text-sm text-muted-foreground">Workforce. Rewarded.</p>
      </div>

      {/* Role Selection Cards */}
      <div className="w-full max-w-md flex gap-4">
        {/* Employee Card */}
        <motion.div
          className="flex-1"
          animate={expandedCard === 'employee' && error ? shakeAnimation : {}}
          key={`employee-${shakeKey}`}
        >
          <Card
            className={`cursor-pointer transition-all duration-300 border-2 ${
              expandedCard === 'employee'
                ? 'border-indigo-500'
                : 'border-transparent hover:border-indigo-500/50'
            }`}
            onClick={() => handleCardClick('employee')}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-indigo-500/10 mb-3">
                  <User className="w-6 h-6 text-indigo-500" />
                </div>
                <h2 className="font-semibold text-foreground">Employee</h2>
              </div>

              <AnimatePresence>
                {expandedCard === 'employee' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      <div>
                        <Label htmlFor="emp-email" className="text-xs text-muted-foreground">Email</Label>
                        <Input
                          id="emp-email"
                          type="email"
                          placeholder="emp@worksphere.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError(false)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="emp-password" className="text-xs text-muted-foreground">Password</Label>
                        <Input
                          id="emp-password"
                          type="password"
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setError(false)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.stopPropagation()
                              handleLogin('employee')
                            }
                          }}
                          className="mt-1"
                        />
                      </div>
                      {error && (
                        <p className="text-xs text-red-500">Invalid credentials</p>
                      )}
                      <Button
                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLogin('employee')
                        }}
                      >
                        Login
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Admin Card */}
        <motion.div
          className="flex-1"
          animate={expandedCard === 'admin' && error ? shakeAnimation : {}}
          key={`admin-${shakeKey}`}
        >
          <Card
            className={`cursor-pointer transition-all duration-300 border-2 ${
              expandedCard === 'admin'
                ? 'border-purple-500'
                : 'border-transparent hover:border-purple-500/50'
            }`}
            onClick={() => handleCardClick('admin')}
          >
            <CardContent className="p-4">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-purple-500/10 mb-3">
                  <Shield className="w-6 h-6 text-purple-500" />
                </div>
                <h2 className="font-semibold text-foreground">Admin</h2>
              </div>

              <AnimatePresence>
                {expandedCard === 'admin' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3">
                      <div>
                        <Label htmlFor="admin-email" className="text-xs text-muted-foreground">Email</Label>
                        <Input
                          id="admin-email"
                          type="email"
                          placeholder="admin@worksphere.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            setError(false)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="admin-password" className="text-xs text-muted-foreground">Password</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          placeholder="Enter password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            setError(false)
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.stopPropagation()
                              handleLogin('admin')
                            }
                          }}
                          className="mt-1"
                        />
                      </div>
                      {error && (
                        <p className="text-xs text-red-500">Invalid credentials</p>
                      )}
                      <Button
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLogin('admin')
                        }}
                      >
                        Login
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  )
}
