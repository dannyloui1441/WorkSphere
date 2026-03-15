'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Share2, TrendingUp, TrendingDown, Clock, Coins } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { weeklyHoursData, taskCompletionData, earningsByTypeData, monthlyTrendData } from '@/lib/mockData'
import { cn } from '@/lib/utils'

const chartConfig = {
  hours: { label: 'Hours', color: 'var(--color-primary)' },
  coins: { label: 'Coins', color: 'var(--color-warning)' },
  completed: { label: 'Completed', color: 'var(--color-success)' },
  inProgress: { label: 'In Progress', color: 'var(--color-primary)' },
  pending: { label: 'Pending', color: 'var(--color-warning)' }
}

export function StatsPage() {
  const [period, setPeriod] = useState('week')

  return (
    <div className="pb-36 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Statistics</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      {/* Period Toggle */}
      <ToggleGroup 
        type="single" 
        value={period} 
        onValueChange={(value) => value && setPeriod(value)}
        className="justify-start mb-4"
      >
        <ToggleGroupItem value="week" className="text-xs">Week</ToggleGroupItem>
        <ToggleGroupItem value="month" className="text-xs">Month</ToggleGroupItem>
        <ToggleGroupItem value="year" className="text-xs">Year</ToggleGroupItem>
      </ToggleGroup>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Total Hours</span>
              </div>
              <p className="text-2xl font-bold">38.5h</p>
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <TrendingUp className="w-3 h-3" />
                <span>+5% vs last {period}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-muted-foreground">Coins Earned</span>
              </div>
              <p className="text-2xl font-bold">325</p>
              <div className="flex items-center gap-1 text-xs text-red-500">
                <TrendingDown className="w-3 h-3" />
                <span>-3% vs last {period}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="hours" className="text-xs">Hours</TabsTrigger>
          <TabsTrigger value="earnings" className="text-xs">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Weekly Activity */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <BarChart data={weeklyHoursData}>
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="hours" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Task Completion */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <PieChart>
                  <Pie
                    data={taskCompletionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {taskCompletionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours" className="space-y-4">
          {/* Hours Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Hours Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <LineChart data={monthlyTrendData}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="hours" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: 'var(--color-primary)' }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Daily Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <BarChart data={weeklyHoursData}>
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="hours" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          {/* Earnings Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Earnings Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <LineChart data={monthlyTrendData}>
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="coins" stroke="var(--color-warning)" strokeWidth={2} dot={{ fill: 'var(--color-warning)' }} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Earnings by Task Type */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Earnings by Task Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <PieChart>
                  <Pie
                    data={earningsByTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {earningsByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
