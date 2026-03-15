'use client'

import { motion } from 'framer-motion'
import { Power } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface PunchButtonProps {
  isPunchedIn: boolean
  punchInTime: string | null
}

export function PunchButton({ isPunchedIn, punchInTime }: PunchButtonProps) {
  const router = useRouter()

  return (
    <div className="fixed bottom-[5.5rem] left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">
      <motion.button
        onClick={() => router.push('/employee/punch')}
        className={cn(
          'relative w-16 h-16 rounded-full flex items-center justify-center shadow-lg',
          isPunchedIn
            ? 'bg-gradient-to-br from-emerald-500 to-green-600'
            : 'bg-gradient-to-br from-red-500 to-rose-600'
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {!isPunchedIn && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-rose-600 opacity-50"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
        <Power className="w-7 h-7 text-white relative z-10" />
      </motion.button>
      <div className={cn(
        'mt-2 px-3 py-0.5 rounded-full',
        isPunchedIn ? 'bg-emerald-500/20 dark:bg-emerald-500/10' : 'bg-black/10 dark:bg-white/10'
      )}>
        <span className="text-xs text-muted-foreground font-medium">
          {isPunchedIn ? 'Punched In' : 'Tap to Punch In'}
        </span>
      </div>
      {isPunchedIn && punchInTime && (
        <div className="mt-1 bg-black/10 dark:bg-white/10 rounded-full px-2 py-0.5">
          <p className="text-[10px] text-white/90 font-medium">{punchInTime}</p>
        </div>
      )}
    </div>
  )
}
