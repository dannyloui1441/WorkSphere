import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { initialCoinsData, type Transaction } from './mockData'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface CoinsData {
  balance: number
  lifetimeEarned: number
  thisMonthEarned: number
  thisMonthSpent: number
}

export { initialCoinsData } from './mockData'

export function getCoinsData(): CoinsData {
  if (typeof window === 'undefined') return initialCoinsData
  const stored = localStorage.getItem('worksphere_coins')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return initialCoinsData
    }
  }
  return initialCoinsData
}

export function updateCoins(type: 'earn' | 'spend', amount: number): CoinsData {
  const current = getCoinsData()
  const updated: CoinsData = {
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
