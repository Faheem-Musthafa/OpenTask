"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletButton } from "@/components/wallet-button"
import { TaskCard } from "@/components/task-card"
import { useWeb3 } from "@/hooks/use-web3"
import { useContract } from "@/hooks/use-contract"
import { TaskStatus, type Task } from "@/lib/web3"
import { FileText, Plus, Loader2 } from "lucide-react"
import Link from "next/link"

export default function TasksPage() {
  const { account, isConnected } = useWeb3()
  const { getAllTasks } = useContract()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      setLoading(true)
      const allTasks = await getAllTasks()
      setTasks(allTasks)
    } catch (error) {
      console.error("Failed to load tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = (status?: TaskStatus) => {
    if (!status && activeTab === "all") return tasks
    return tasks.filter((task) => task.status === status)
  }

  const getTaskCounts = () => {
    return {
      all: tasks.length,
      open: tasks.filter((t) => t.status === TaskStatus.Open).length,
      claimed: tasks.filter((t) => t.status === TaskStatus.Claimed).length,
      completed: tasks.filter((t) => t.status === TaskStatus.Completed).length,
      approved: tasks.filter((t) => t.status === TaskStatus.Approved).length,
    }
  }

  const counts = getTaskCounts()

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
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-2">Task Board</h1>
              <p className="text-lg text-muted-foreground">Browse available tasks and start earning SHM tokens</p>
            </div>
            <div className="flex items-center gap-4">
              {isConnected && (
                <Link href="/me">
                  <Button variant="outline">My Dashboard</Button>
                </Link>
              )}
              <Link href="/post">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Post New Task
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Task Filters */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all" className="gap-2">
                All Tasks
                <Badge variant="secondary" className="ml-1">
                  {counts.all}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="open" className="gap-2">
                Open
                <Badge variant="secondary" className="ml-1">
                  {counts.open}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="claimed" className="gap-2">
                Claimed
                <Badge variant="secondary" className="ml-1">
                  {counts.claimed}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2">
                Completed
                <Badge variant="secondary" className="ml-1">
                  {counts.completed}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="approved" className="gap-2">
                Approved
                <Badge variant="secondary" className="ml-1">
                  {counts.approved}
                </Badge>
              </TabsTrigger>
            </TabsList>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading tasks...</span>
              </div>
            ) : (
              <>
                <TabsContent value="all">
                  <TaskGrid tasks={filterTasks()} onTaskUpdate={loadTasks} />
                </TabsContent>
                <TabsContent value="open">
                  <TaskGrid tasks={filterTasks(TaskStatus.Open)} onTaskUpdate={loadTasks} />
                </TabsContent>
                <TabsContent value="claimed">
                  <TaskGrid tasks={filterTasks(TaskStatus.Claimed)} onTaskUpdate={loadTasks} />
                </TabsContent>
                <TabsContent value="completed">
                  <TaskGrid tasks={filterTasks(TaskStatus.Completed)} onTaskUpdate={loadTasks} />
                </TabsContent>
                <TabsContent value="approved">
                  <TaskGrid tasks={filterTasks(TaskStatus.Approved)} onTaskUpdate={loadTasks} />
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </section>
    </div>
  )
}

function TaskGrid({ tasks, onTaskUpdate }: { tasks: Task[]; onTaskUpdate: () => void }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-serif font-semibold text-lg mb-2">No tasks found</h3>
        <p className="text-muted-foreground mb-6">Be the first to post a task or check back later.</p>
        <Link href="/post">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Post First Task
          </Button>
        </Link>
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
