'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { format } from 'date-fns'
import { ArrowLeft, Check, X, RefreshCw, Scan, UserCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/mockData'
import { cn, updateKudos, addTransaction } from '@/lib/utils'

type PunchState = 'READY' | 'QR_ACTIVE' | 'SCANNED' | 'CONFIRMED' | 'EXPIRED'

interface PunchData {
  isPunchedIn: boolean
  punchInTime: string | null
  punchOutTime: string | null
}

function generateQRValue() {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 10)
  return `WS-${currentUser.id}-${timestamp}-${randomString}`
}

export default function PunchPage() {
  const router = useRouter()
  const [state, setState] = useState<PunchState>('READY')
  const [qrValue, setQrValue] = useState('')
  const [countdown, setCountdown] = useState(30)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isPunchingOut, setIsPunchingOut] = useState(false)
  const [existingPunchInTime, setExistingPunchInTime] = useState<string | null>(null)

  useEffect(() => {
    // Check current punch state
    const stored = localStorage.getItem('worksphere_punch')
    if (stored) {
      try {
        const data: PunchData = JSON.parse(stored)
        if (data.isPunchedIn) {
          setIsPunchingOut(true)
          setExistingPunchInTime(data.punchInTime)
        }
      } catch {
        // Invalid data
      }
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (state === 'QR_ACTIVE' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (state === 'QR_ACTIVE' && countdown === 0) {
      setState('EXPIRED')
    }
  }, [state, countdown])

  useEffect(() => {
    if (state === 'SCANNED') {
      const timer = setTimeout(() => {
        setState('CONFIRMED')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [state])

  useEffect(() => {
    if (state === 'CONFIRMED') {
      const timer = setTimeout(() => {
        const punchTime = format(new Date(), 'h:mm a')
        
        if (isPunchingOut) {
          // Punching OUT
          localStorage.setItem('worksphere_punch', JSON.stringify({
            isPunchedIn: false,
            punchInTime: existingPunchInTime,
            punchOutTime: punchTime
          }))
        } else {
          // Punching IN - earn 10 kudos for on-time
          localStorage.setItem('worksphere_punch', JSON.stringify({
            isPunchedIn: true,
            punchInTime: punchTime,
            punchOutTime: null
          }))
          updateKudos('earn', 10)
          addTransaction({
            type: 'earned',
            description: 'On-time Punch In Bonus',
            amount: 10,
            date: format(new Date(), 'yyyy-MM-dd')
          })
        }
        router.push('/employee')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [state, router, isPunchingOut, existingPunchInTime])

  const handleGenerateQR = () => {
    setQrValue(generateQRValue())
    setCountdown(30)
    setState('QR_ACTIVE')
  }

  const handleSimulateScan = () => {
    setState('SCANNED')
  }

  const handleRegenerate = () => {
    setQrValue(generateQRValue())
    setCountdown(30)
    setState('QR_ACTIVE')
  }

  const circumference = 2 * Math.PI * 45
  const progress = (countdown / 30) * circumference

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.push('/employee')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">{isPunchingOut ? 'Punch Out' : 'Punch In'}</h1>
      </div>

      <AnimatePresence mode="wait">
        {/* READY State */}
        {state === 'READY' && (
          <motion.div
            key="ready"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <Card className="w-full max-w-sm mb-8">
              <CardContent className="p-6 flex flex-col items-center">
                <Avatar className="w-20 h-20 mb-4">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                    KR
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-semibold text-lg">{currentUser.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{currentUser.role}</p>
                <div className="text-center">
                  <p className="text-3xl font-bold font-mono">
                    {format(currentTime, 'h:mm:ss a')}
                  </p>
                  <p className="text-sm text-muted-foreground">{format(currentTime, 'EEEE, MMMM d, yyyy')}</p>
                </div>
              </CardContent>
            </Card>

            <Button 
              size="lg" 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8"
              onClick={handleGenerateQR}
            >
              Generate QR Code
            </Button>
          </motion.div>
        )}

        {/* QR_ACTIVE State */}
        {state === 'QR_ACTIVE' && (
          <motion.div
            key="qr-active"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              {/* Countdown Ring */}
              <svg className="w-64 h-64 transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  strokeDasharray={2 * Math.PI * 120}
                  strokeDashoffset={2 * Math.PI * 120 * (1 - countdown / 30)}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* QR Code */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <QRCodeSVG value={qrValue} size={140} level="H" />
                </div>
              </div>
            </div>

            <p className="text-2xl font-bold mb-2">{countdown}s</p>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-6">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-amber-500 rounded-full"
              />
              <span className="text-sm">Awaiting scanner confirmation...</span>
            </div>

            <Button 
              variant="outline"
              onClick={handleSimulateScan}
              className="gap-2"
            >
              <Scan className="w-4 h-4" />
              Simulate Scan
            </Button>
          </motion.div>
        )}

        {/* SCANNED State */}
        {state === 'SCANNED' && (
          <motion.div
            key="scanned"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
            >
              <Check className="w-12 h-12 text-emerald-500" />
            </motion.div>
            
            <h2 className="text-xl font-semibold text-emerald-600 mb-4">QR Verified</h2>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-blue-500 rounded-full"
              />
              <span className="text-sm">Awaiting facial recognition confirmation...</span>
            </div>

            <Button 
              variant="outline"
              onClick={() => setState('CONFIRMED')}
              className="mt-6 gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Simulate Face Recognition
            </Button>
          </motion.div>
        )}

        {/* CONFIRMED State */}
        {state === 'CONFIRMED' && (
          <motion.div
            key="confirmed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30"
            >
              <Check className="w-16 h-16 text-white" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-emerald-600 mb-2"
            >
              Identity Confirmed
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-muted-foreground"
            >
              Redirecting...
            </motion.p>
          </motion.div>
        )}

        {/* EXPIRED State */}
        {state === 'EXPIRED' && (
          <motion.div
            key="expired"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6"
            >
              <X className="w-12 h-12 text-red-500" />
            </motion.div>
            
            <h2 className="text-xl font-semibold text-red-600 mb-2">QR Expired</h2>
            <p className="text-sm text-muted-foreground mb-6">The QR code has timed out. Please generate a new one.</p>
            
            <Button 
              onClick={handleRegenerate}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Regenerate QR
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
