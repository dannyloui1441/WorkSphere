'use client'

import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Award, Gift, Plus, Pencil, Trash2, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { adminEmployees, adminStats } from '@/lib/adminMockData'
import { rewards as mockRewards, type Reward } from '@/lib/mockData'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'

const REWARD_CATEGORIES = [
  'Gift Cards',
  'Flexibility', 
  'Time Off',
  'Merchandise',
  'Learning',
  'Wellness',
  'Career',
  'Entertainment',
  'Travel'
]

interface CatalogueReward extends Reward {
  isCustom?: boolean
}

// Employee kudos balances
const employeeKudosData = [
  { id: 'EMP001', name: 'K Ramachandran', role: 'Software Engineer', balance: 3250 },
  { id: 'EMP002', name: 'Daniel', role: 'UX Designer', balance: 2780 },
  { id: 'EMP003', name: 'Benito', role: 'Backend Developer', balance: 1950 },
  { id: 'EMP004', name: 'Swithin', role: 'QA Engineer', balance: 2100 },
  { id: 'EMP005', name: 'John', role: 'Project Manager', balance: 4200 },
]

const barColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export default function KudosPage() {
  const [selectedEmployee, setSelectedEmployee] = useState('')
  const [kudosAmount, setKudosAmount] = useState('')
  const [reason, setReason] = useState('')
  
  // Rewards Catalogue state
  const [rewards, setRewards] = useState<CatalogueReward[]>([])
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false)
  const [editingReward, setEditingReward] = useState<CatalogueReward | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [rewardToDelete, setRewardToDelete] = useState<CatalogueReward | null>(null)
  
  // Reward form state
  const [rewardName, setRewardName] = useState('')
  const [rewardDescription, setRewardDescription] = useState('')
  const [rewardCategory, setRewardCategory] = useState('')
  const [rewardCost, setRewardCost] = useState('')
  const [rewardPopular, setRewardPopular] = useState(false)
  
  // Load rewards from localStorage and merge with mock data
  useEffect(() => {
    const customRewards = JSON.parse(localStorage.getItem('admin_rewards_catalogue') || '[]') as CatalogueReward[]
    const deletedIds = JSON.parse(localStorage.getItem('admin_deleted_rewards') || '[]') as string[]
    
    // Mark custom rewards
    const customWithFlag = customRewards.map(r => ({ ...r, isCustom: true }))
    
    // Merge mock rewards (excluding deleted) with custom rewards
    const allRewards = [
      ...mockRewards.filter(r => !deletedIds.includes(r.id)).map(r => ({ ...r, isCustom: false })),
      ...customWithFlag
    ]
    
    setRewards(allRewards)
  }, [])
  
  const resetRewardForm = () => {
    setRewardName('')
    setRewardDescription('')
    setRewardCategory('')
    setRewardCost('')
    setRewardPopular(false)
    setEditingReward(null)
  }
  
  const openEditReward = (reward: CatalogueReward) => {
    setEditingReward(reward)
    setRewardName(reward.name)
    setRewardDescription(reward.description)
    setRewardCategory(reward.category)
    setRewardCost(reward.cost.toString())
    setRewardPopular(reward.popular || false)
    setRewardDialogOpen(true)
  }
  
  const handleSaveReward = () => {
    if (!rewardName.trim() || !rewardCategory || !rewardCost) {
      toast.error('Please fill in all required fields')
      return
    }
    
    const newReward: CatalogueReward = {
      id: editingReward?.id || `RWD-${Date.now()}`,
      name: rewardName.trim(),
      description: rewardDescription.trim(),
      category: rewardCategory,
      cost: Number(rewardCost),
      icon: 'Gift',
      popular: rewardPopular,
      isCustom: true
    }
    
    // Get existing custom rewards
    const customRewards = JSON.parse(localStorage.getItem('admin_rewards_catalogue') || '[]') as CatalogueReward[]
    
    let updatedCustomRewards: CatalogueReward[]
    if (editingReward?.isCustom) {
      // Update existing custom reward
      updatedCustomRewards = customRewards.map(r => r.id === editingReward.id ? newReward : r)
    } else if (editingReward) {
      // Editing a mock reward - add as new custom, delete original
      const deletedIds = JSON.parse(localStorage.getItem('admin_deleted_rewards') || '[]') as string[]
      localStorage.setItem('admin_deleted_rewards', JSON.stringify([...deletedIds, editingReward.id]))
      updatedCustomRewards = [...customRewards, newReward]
    } else {
      // Add new custom reward
      updatedCustomRewards = [...customRewards, newReward]
    }
    
    localStorage.setItem('admin_rewards_catalogue', JSON.stringify(updatedCustomRewards))
    
    // Reload rewards
    const deletedIds = JSON.parse(localStorage.getItem('admin_deleted_rewards') || '[]') as string[]
    const allRewards = [
      ...mockRewards.filter(r => !deletedIds.includes(r.id)).map(r => ({ ...r, isCustom: false })),
      ...updatedCustomRewards.map(r => ({ ...r, isCustom: true }))
    ]
    setRewards(allRewards)
    
    toast.success('Reward created')
    setRewardDialogOpen(false)
    resetRewardForm()
  }
  
  const handleDeleteReward = () => {
    if (!rewardToDelete) return
    
    if (rewardToDelete.isCustom) {
      // Remove from custom rewards
      const customRewards = JSON.parse(localStorage.getItem('admin_rewards_catalogue') || '[]') as CatalogueReward[]
      const updated = customRewards.filter(r => r.id !== rewardToDelete.id)
      localStorage.setItem('admin_rewards_catalogue', JSON.stringify(updated))
    } else {
      // Add to deleted list for mock rewards
      const deletedIds = JSON.parse(localStorage.getItem('admin_deleted_rewards') || '[]') as string[]
      localStorage.setItem('admin_deleted_rewards', JSON.stringify([...deletedIds, rewardToDelete.id]))
    }
    
    // Reload rewards
    const customRewards = JSON.parse(localStorage.getItem('admin_rewards_catalogue') || '[]') as CatalogueReward[]
    const deletedIds = JSON.parse(localStorage.getItem('admin_deleted_rewards') || '[]') as string[]
    const allRewards = [
      ...mockRewards.filter(r => !deletedIds.includes(r.id)).map(r => ({ ...r, isCustom: false })),
      ...customRewards.map(r => ({ ...r, isCustom: true }))
    ]
    setRewards(allRewards)
    
    toast.success('Reward deleted')
    setDeleteDialogOpen(false)
    setRewardToDelete(null)
  }
  
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Gift Cards': 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
      'Flexibility': 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
      'Time Off': 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
      'Merchandise': 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
      'Learning': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400',
      'Wellness': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
      'Career': 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
      'Entertainment': 'bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400',
      'Travel': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400'
    }
    return colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }

  const sortedByKudos = [...employeeKudosData].sort((a, b) => b.balance - a.balance)
  const maxBalance = Math.max(...employeeKudosData.map(e => e.balance))
  const totalKudosBalance = employeeKudosData.reduce((sum, emp) => sum + emp.balance, 0)
  
  // Mock stats
  const kudosAwardedThisMonth = adminStats.kudosDistributedThisMonth
  const kudosRedeemedThisMonth = 850

  // Chart data
  const chartData = employeeKudosData.map(emp => ({
    name: emp.name.split(' ')[0],
    balance: emp.balance,
  }))

  const handleAwardKudos = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedEmployee) {
      toast.error('Please select an employee')
      return
    }
    
    if (!kudosAmount || Number(kudosAmount) <= 0) {
      toast.error('Please enter a valid kudos amount')
      return
    }
    
    if (!reason.trim()) {
      toast.error('Please enter a reason')
      return
    }

    const employee = adminEmployees.find(e => e.id === selectedEmployee)
    
    // Save to localStorage
    const existingAwards = JSON.parse(localStorage.getItem('admin_kudos_awards') || '[]')
    const newAward = {
      id: `AWARD-${Date.now()}`,
      employeeId: selectedEmployee,
      employeeName: employee?.name,
      amount: Number(kudosAmount),
      reason: reason.trim(),
      date: new Date().toISOString()
    }
    localStorage.setItem('admin_kudos_awards', JSON.stringify([...existingAwards, newAward]))
    
    toast.success(`Kudos awarded to ${employee?.name}`)
    
    // Reset form
    setSelectedEmployee('')
    setKudosAmount('')
    setReason('')
  }

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-amber-500 text-white' // Gold
      case 1:
        return 'bg-gray-400 text-white' // Silver
      case 2:
        return 'bg-amber-700 text-white' // Bronze
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-6 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-foreground">Kudos</h1>
        <p className="text-sm md:text-base text-muted-foreground">Track and award team kudos.</p>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Kudos Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          {sortedByKudos.map((employee, index) => (
            <div 
              key={employee.id}
              className={cn(
                'flex items-center justify-between p-3 md:p-4 rounded-lg transition-colors',
                index === 0 
                  ? 'bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20' 
                  : 'bg-muted/50 hover:bg-muted'
              )}
            >
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                {/* Rank Badge */}
                <div className={cn(
                  'w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-xs md:text-sm flex-shrink-0',
                  getRankStyle(index)
                )}>
                  {index + 1}
                </div>
                
                {/* Avatar */}
                <Avatar className="h-9 w-9 md:h-10 md:w-10 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs md:text-sm">
                    {employee.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Name and Role */}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground text-sm md:text-base truncate">{employee.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{employee.role}</p>
                </div>
                
                {/* Progress Bar - hidden on mobile */}
                <div className="hidden md:block flex-1 max-w-[200px]">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full transition-all',
                        index === 0 ? 'bg-amber-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-amber-700' :
                        'bg-primary/50'
                      )}
                      style={{ width: `${(employee.balance / maxBalance) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Balance */}
              <div className="flex items-center gap-1.5 text-amber-500 flex-shrink-0">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-lg md:text-xl font-bold">{employee.balance.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Award Performance Bonus */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Gift className="w-5 h-5 text-purple-500" />
            Award Performance Bonus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAwardKudos} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Select Employee</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="kudosAmount">Kudos Amount</Label>
                <div className="relative">
                  <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                  <Input 
                    id="kudosAmount"
                    type="number"
                    min={1}
                    placeholder="Enter amount"
                    value={kudosAmount}
                    onChange={(e) => setKudosAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input 
                id="reason"
                placeholder="Enter reason for bonus..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
            >
              Award Kudos
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Rewards Catalogue */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Rewards Catalogue
            </CardTitle>
            <Dialog open={rewardDialogOpen} onOpenChange={(open) => {
              setRewardDialogOpen(open)
              if (!open) resetRewardForm()
            }}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-1" />
                  Create Reward
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingReward ? 'Edit Reward' : 'Create New Reward'}</DialogTitle>
                  <DialogDescription>
                    {editingReward ? 'Update the reward details below.' : 'Add a new reward to the catalogue.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="rewardName">Reward Name</Label>
                    <Input
                      id="rewardName"
                      placeholder="e.g. Coffee Gift Card"
                      value={rewardName}
                      onChange={(e) => setRewardName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rewardDescription">Description</Label>
                    <Textarea
                      id="rewardDescription"
                      placeholder="Describe the reward..."
                      value={rewardDescription}
                      onChange={(e) => setRewardDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={rewardCategory} onValueChange={setRewardCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {REWARD_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rewardCost">Kudos Cost</Label>
                    <div className="relative">
                      <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                      <Input
                        id="rewardCost"
                        type="number"
                        min={1}
                        placeholder="Enter cost"
                        value={rewardCost}
                        onChange={(e) => setRewardCost(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Popular</Label>
                      <p className="text-xs text-muted-foreground">Mark this reward as popular</p>
                    </div>
                    <Switch checked={rewardPopular} onCheckedChange={setRewardPopular} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => {
                    setRewardDialogOpen(false)
                    resetRewardForm()
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveReward} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                    {editingReward ? 'Update' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.map((reward) => (
              <Card key={reward.id} className="relative overflow-hidden border-muted hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  {reward.popular && (
                    <Badge className="absolute top-2 right-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
                      <Star className="w-3 h-3 mr-1 fill-amber-500" />
                      Popular
                    </Badge>
                  )}
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground line-clamp-1">{reward.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{reward.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={cn('text-[10px]', getCategoryColor(reward.category))}>
                        {reward.category}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-bold">{reward.cost}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => openEditReward(reward)}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => {
                            setRewardToDelete(reward)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {rewards.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No rewards in catalogue. Create your first reward!</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Reward</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{rewardToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRewardToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReward} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-amber-500/10 flex-shrink-0">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-3xl font-bold text-foreground">{totalKudosBalance.toLocaleString()}</p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">Total in Circulation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-emerald-500/10 flex-shrink-0">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-3xl font-bold text-foreground">{kudosAwardedThisMonth.toLocaleString()}</p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">Awarded This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-purple-500/10 flex-shrink-0">
                <Gift className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xl md:text-3xl font-bold text-foreground">{kudosRedeemedThisMonth.toLocaleString()}</p>
                <p className="text-xs md:text-sm text-muted-foreground truncate">Redeemed This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base md:text-lg">Kudos Balance by Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString(), 'Kudos']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="balance" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
