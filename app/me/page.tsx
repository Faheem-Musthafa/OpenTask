"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletButton } from "@/components/wallet-button"
import { TaskCard } from "@/components/task-card"
import { useWeb3 } from "@/hooks/use-web3"
import { useContract } from "@/hooks/use-contract"
import { TaskStatus, formatSHM, type Task } from "@/lib/web3"
import { FileText, User, Coins, Plus, AlertCircle, Loader2, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

export default function PersonalDashboardPage() {
  const { account, isConnected } = useWeb3()
  const { getUserTasks } = useContract()
  const [postedTasks, setPostedTasks] = useState<Task[]>([])
  const [claimedTasks, setClaimedTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isConnected && account) {
      loadUserTasks()
    }
  }, [isConnected, account])

  const loadUserTasks = async () => {
    if (!account) return

    try {
      setLoading(true)
      const { posted, claimed } = await getUserTasks(account)
      setPostedTasks(posted)
      setClaimedTasks(claimed)
    } catch (error) {
      console.error("Failed to load user tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTaskStats = (tasks: Task[]) => {
    const stats = {
      total: tasks.length,
      open: tasks.filter((t) => t.status === TaskStatus.Open).length,
      claimed: tasks.filter((t) => t.status === TaskStatus.Claimed).length,
      completed: tasks.filter((t) => t.status === TaskStatus.Completed).length,
      approved: tasks.filter((t) => t.status === TaskStatus.Approved).length,
    }

    return stats
  }

  const getTotalRewards = (tasks: Task[]) => {
    return tasks.reduce((total, task) => total + task.reward, BigInt(0))
  }

  const postedStats = getTaskStats(postedTasks)
  const claimedStats = getTaskStats(claimedTasks)

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl text-foreground">OpenTask</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/tasks">
                <Button variant="outline">Browse Tasks</Button>
              </Link>
              <Link href="/post">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Post Task
                </Button>
              </Link>
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-2">My Dashboard</h1>
              <p className="text-lg text-muted-foreground">Manage your posted tasks and track your claimed work</p>
            </div>
            {isConnected && account && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="font-mono">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {!isConnected ? (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-serif">Connect Your Wallet</CardTitle>
                <CardDescription>You need to connect your wallet to view your personal dashboard</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <WalletButton size="lg" />
              </CardContent>
            </Card>
          </div>
        </section>
      ) : loading ? (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading your tasks...</span>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Stats Cards */}
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Posted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{postedStats.total}</div>
                    <p className="text-xs text-muted-foreground">{postedStats.approved} completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Claimed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{claimedStats.total}</div>
                    <p className="text-xs text-muted-foreground">{claimedStats.approved} completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Rewards Posted</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      <Coins className="w-5 h-5 text-primary" />
                      {formatSHM(getTotalRewards(postedTasks))}
                    </div>
                    <p className="text-xs text-muted-foreground">SHM tokens</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold flex items-center gap-1">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      {formatSHM(getTotalRewards(claimedTasks.filter((t) => t.status === TaskStatus.Approved)))}
                    </div>
                    <p className="text-xs text-muted-foreground">SHM tokens</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Task Tabs */}
          <section className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <Tabs defaultValue="posted" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="posted" className="gap-2">
                    Tasks I Posted
                    <Badge variant="secondary" className="ml-1">
                      {postedStats.total}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="claimed" className="gap-2">
                    Tasks I Claimed
                    <Badge variant="secondary" className="ml-1">
                      {claimedStats.total}
                    </Badge>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posted">
                  <div className="mb-6">
                    <h3 className="font-serif font-semibold text-xl mb-2">Tasks You Posted</h3>
                    <p className="text-muted-foreground">Manage tasks you've created and review submitted work</p>
                  </div>
                  <TaskGrid
                    tasks={postedTasks}
                    onTaskUpdate={loadUserTasks}
                    emptyMessage="You haven't posted any tasks yet"
                  />
                </TabsContent>

                <TabsContent value="claimed">
                  <div className="mb-6">
                    <h3 className="font-serif font-semibold text-xl mb-2">Tasks You Claimed</h3>
                    <p className="text-muted-foreground">
                      Track your progress on claimed tasks and submit completed work
                    </p>
                  </div>
                  <TaskGrid
                    tasks={claimedTasks}
                    onTaskUpdate={loadUserTasks}
                    emptyMessage="You haven't claimed any tasks yet"
                  />
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function TaskGrid({
  tasks,
  onTaskUpdate,
  emptyMessage,
}: {
  tasks: Task[]
  onTaskUpdate: () => void
  emptyMessage: string
}) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-serif font-semibold text-lg mb-2">No Tasks Found</h3>
        <p className="text-muted-foreground mb-6">{emptyMessage}</p>
        <div className="flex gap-4 justify-center">
          <Link href="/tasks">
            <Button variant="outline">Browse Tasks</Button>
          </Link>
          <Link href="/post">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Post a Task
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id.toString()} task={task} onUpdate={onTaskUpdate} />
      ))}
    </div>
  )
}
