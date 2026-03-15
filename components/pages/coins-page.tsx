'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Sparkles, Search, TrendingUp, TrendingDown, Coffee, Home, Film, CalendarX, Gift, Clock, ShoppingBag, Calendar, GraduationCap, Utensils, Award, Users, Dumbbell, Plane, Filter, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { transactions as initialTransactions, rewards, type Transaction } from '@/lib/mockData'
import { cn, type KudosData, updateKudos, addTransaction, getTransactions } from '@/lib/utils'

const iconMap: Record<string, typeof Coffee> = {
  Coffee, Home, Film, CalendarX, Gift, Clock, ShoppingBag, Calendar, GraduationCap, Utensils, Award, Users, Dumbbell, Plane
}

interface CoinsPageProps {
  kudosData: KudosData
  onKudosUpdate: () => void
}

export function CoinsPage({ kudosData, onKudosUpdate }: CoinsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [timeFilter, setTimeFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Load transactions from localStorage, merge with initial if empty
    const storedTransactions = getTransactions()
    if (storedTransactions.length === 0) {
      setTransactions(initialTransactions)
    } else {
      // Merge: stored first, then initial ones that aren't duplicated
      const storedIds = new Set(storedTransactions.map(t => t.id))
      const merged = [...storedTransactions, ...initialTransactions.filter(t => !storedIds.has(t.id))]
      setTransactions(merged)
    }
  }, [])

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'all' || t.type === typeFilter
    return matchesSearch && matchesType
  })

  const categories = [...new Set(rewards.map(r => r.category))]

  const filteredRewards = rewards.filter(r => {
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter
    return matchesCategory
  })

  const handleRedeem = (reward: typeof rewards[0]) => {
    updateKudos('spend', reward.cost)
    const newTxns = addTransaction({
      type: 'spent',
      description: `Redeemed: ${reward.name}`,
      amount: reward.cost,
      date: format(new Date(), 'yyyy-MM-dd'),
      rewardId: reward.id
    })
    setTransactions([...newTxns, ...initialTransactions.filter(t => !newTxns.some(nt => nt.id === t.id))])
    setRedeemSuccess(reward.name)
    onKudosUpdate()
    setTimeout(() => setRedeemSuccess(null), 2000)
  }

  return (
    <div className="pb-36 px-4 pt-4 relative">
      {/* Success Toast */}
      {redeemSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
        >
          Reward redeemed!
        </motion.div>
      )}
      
      {/* Balance Card */}
      <Card className="bg-gradient-to-br from-amber-500 to-yellow-500 border-0 mb-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6" />
            <span className="text-sm font-medium opacity-90">Current Balance</span>
          </div>
          <p className="text-4xl font-bold mb-4">{kudosData.balance.toLocaleString()}</p>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
            <div>
              <p className="text-2xl font-bold">{kudosData.lifetimeEarned.toLocaleString()}</p>
              <p className="text-xs opacity-80">Lifetime Earned</p>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <p className="text-lg font-bold">+{kudosData.thisMonthEarned}</p>
              </div>
              <p className="text-xs opacity-80">This Month</p>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <TrendingDown className="w-4 h-4" />
                <p className="text-lg font-bold">-{kudosData.thisMonthSpent}</p>
              </div>
              <p className="text-xs opacity-80">Spent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          {/* Filters */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="earned">Earned</SelectItem>
                  <SelectItem value="spent">Spent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-2">
            {filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      transaction.type === 'earned' ? 'bg-emerald-100 dark:bg-emerald-950/50' : 'bg-red-100 dark:bg-red-950/50'
                    )}>
                      {transaction.type === 'earned' ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date} &bull; {transaction.taskId || transaction.rewardId}
                      </p>
                    </div>
                    <p className={cn(
                      'font-semibold',
                      transaction.type === 'earned' ? 'text-emerald-600' : 'text-red-600'
                    )}>
                      {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rewards">
          {/* Category Filter */}
          <div className="mb-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-2 gap-3">
            {filteredRewards.map((reward, index) => {
              const IconComponent = iconMap[reward.icon] || Gift
              const canAfford = kudosData.balance >= reward.cost
              
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={cn(
                    'relative overflow-hidden',
                    !canAfford && 'opacity-60'
                  )}>
                    {reward.popular && (
                      <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-[10px]">
                        Popular
                      </Badge>
                    )}
                    <CardContent className="p-4">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 w-fit mb-3">
                        <IconComponent className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{reward.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Sparkles className="w-4 h-4" />
                          <span className="font-bold">{reward.cost}</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant={canAfford ? 'default' : 'secondary'}
                          disabled={!canAfford}
                          onClick={() => handleRedeem(reward)}
                          className={cn(
                            'text-xs',
                            canAfford && 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white'
                          )}
                        >
                          Redeem
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
