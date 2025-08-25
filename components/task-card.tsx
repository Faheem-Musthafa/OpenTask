"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWeb3 } from "@/hooks/use-web3"
import { useContract } from "@/hooks/use-contract"
import { TaskStatus, formatAddress, formatSHM, type Task } from "@/lib/web3"
import { Clock, User, Coins, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useState } from "react"

interface TaskCardProps {
  task: Task
  onUpdate: () => void
}

export function TaskCard({ task, onUpdate }: TaskCardProps) {
  const { account, isConnected } = useWeb3()
  const { claimTask, submitWork, approveTask } = useContract()
  const [loading, setLoading] = useState(false)

  const isPoster = account?.toLowerCase() === task.poster.toLowerCase()
  const isWorker = account?.toLowerCase() === task.worker.toLowerCase()

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Open:
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Open
          </Badge>
        )
      case TaskStatus.Claimed:
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Claimed
          </Badge>
        )
      case TaskStatus.Completed:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Completed
          </Badge>
        )
      case TaskStatus.Approved:
        return (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
            Approved
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getActionButton = () => {
    if (!isConnected) {
      return null
    }

    // Accept button: status=Open && !isPoster
    if (task.status === TaskStatus.Open && !isPoster) {
      return (
        <Button onClick={handleClaimTask} disabled={loading} className="w-full gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          Accept Task
        </Button>
      )
    }

    // Submit Work button: status=Claimed && isWorker
    if (task.status === TaskStatus.Claimed && isWorker) {
      return (
        <Button onClick={handleSubmitWork} disabled={loading} className="w-full gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <AlertCircle className="w-4 h-4" />}
          Submit Work
        </Button>
      )
    }

    // Approve & Pay button: status=Completed && isPoster
    if (task.status === TaskStatus.Completed && isPoster) {
      return (
        <Button onClick={handleApproveTask} disabled={loading} className="w-full gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
          Approve & Pay
        </Button>
      )
    }

    return null
  }

  const handleClaimTask = async () => {
    try {
      setLoading(true)
      await claimTask(Number(task.id))
      onUpdate()
    } catch (error) {
      console.error("Failed to claim task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitWork = async () => {
    try {
      setLoading(true)
      await submitWork(Number(task.id))
      onUpdate()
    } catch (error) {
      console.error("Failed to submit work:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveTask = async () => {
    try {
      setLoading(true)
      await approveTask(Number(task.id))
      onUpdate()
    } catch (error) {
      console.error("Failed to approve task:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString()
  }

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <CardTitle className="font-serif text-lg leading-tight">{task.title}</CardTitle>
          {getStatusBadge(task.status)}
        </div>
        <CardDescription className="line-clamp-3">{task.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Coins className="w-4 h-4" />
              <span>Reward</span>
            </div>
            <span className="font-semibold text-primary">{formatSHM(task.reward)} SHM</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Poster</span>
            </div>
            <span className="font-mono text-xs">{formatAddress(task.poster)}</span>
          </div>

          {task.worker !== "0x0000000000000000000000000000000000000000" && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" />
                <span>Worker</span>
              </div>
              <span className="font-mono text-xs">{formatAddress(task.worker)}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Created</span>
            </div>
            <span className="text-xs">{formatDate(task.createdAt)}</span>
          </div>
        </div>

        {getActionButton()}
      </CardContent>
    </Card>
  )
}
