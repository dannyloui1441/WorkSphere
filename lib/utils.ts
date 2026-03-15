import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { initialKudosData, type Transaction } from './mockData'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface KudosData {
  balance: number
  lifetimeEarned: number
  thisMonthEarned: number
  thisMonthSpent: number
}

export { initialKudosData } from './mockData'

export function getKudosData(): KudosData {
  if (typeof window === 'undefined') return initialKudosData
  const stored = localStorage.getItem('worksphere_coins')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return initialKudosData
    }
  }
  return initialKudosData
}

export function updateKudos(type: 'earn' | 'spend', amount: number): KudosData {
  const current = getKudosData()
  const updated: KudosData = {
    ...current,
    balance: type === 'earn' ? current.balance + amount : current.balance - amount,
    lifetimeEarned: type === 'earn' ? current.lifetimeEarned + amount : current.lifetimeEarned,
    thisMonthEarned: type === 'earn' ? current.thisMonthEarned + amount : current.thisMonthEarned,
    thisMonthSpent: type === 'spend' ? current.thisMonthSpent + amount : current.thisMonthSpent
  }
  localStorage.setItem('worksphere_coins', JSON.stringify(updated))
  return updated
}

export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem('worksphere_transactions')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return []
    }
  }
  return []
}

export function addTransaction(transaction: Omit<Transaction, 'id'>): Transaction[] {
  const current = getTransactions()
  const newTransaction: Transaction = {
    ...transaction,
    id: `TXN${Date.now()}`
  }
  const updated = [newTransaction, ...current]
  localStorage.setItem('worksphere_transactions', JSON.stringify(updated))
  return updated
}
