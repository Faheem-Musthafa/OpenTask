"use client"

import { useCallback } from "react"
import { ethers } from "ethers"
import { toast } from "@/hooks/use-toast"
import { useWeb3 } from "@/hooks/use-web3"
import { getSigner, CONTRACT_ADDRESS, parseSHM, type Task } from "@/lib/web3"
import OpenTaskABI from "@/app/abi/OpenTask.json"

export function useContract() {
  const { account, isConnected } = useWeb3()

  const getContract = useCallback(
    async (needsSigner = false) => {
      if (!CONTRACT_ADDRESS) {
        throw new Error("Contract address not configured")
      }

      if (needsSigner) {
        if (!isConnected || !account) {
          throw new Error("Wallet not connected")
        }
        const signer = await getSigner()
        if (!signer) {
          throw new Error("Failed to get signer")
        }
        return new ethers.Contract(CONTRACT_ADDRESS, OpenTaskABI.abi, signer)
      } else {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_SHARDEUM_RPC)
        return new ethers.Contract(CONTRACT_ADDRESS, OpenTaskABI.abi, provider)
      }
    },
    [isConnected, account],
  )

  const createTask = useCallback(
    async (title: string, description: string, rewardSHM: string) => {
      try {
        const contract = await getContract(true)
        const rewardWei = parseSHM(rewardSHM)

        toast({
          title: "Creating Task",
          description: "Please confirm the transaction in MetaMask.",
        })

        const tx = await contract.createTask(title, description, {
          value: rewardWei,
        })

        toast({
          title: "Transaction Submitted",
          description: "Waiting for confirmation...",
        })

        await tx.wait()

        toast({
          title: "Task Created",
          description: "Your task has been created successfully!",
        })

        return tx
      } catch (error: any) {
        console.error("Failed to create task:", error)
        toast({
          title: "Transaction Failed",
          description: error.message || "Failed to create task.",
          variant: "destructive",
        })
        throw error
      }
    },
    [getContract],
  )

  const claimTask = useCallback(
    async (taskId: number) => {
      try {
        const contract = await getContract(true)

        toast({
          title: "Claiming Task",
          description: "Please confirm the transaction in MetaMask.",
        })

        const tx = await contract.claimTask(taskId)

        toast({
          title: "Transaction Submitted",
          description: "Waiting for confirmation...",
        })

        await tx.wait()

        toast({
          title: "Task Claimed",
          description: "You have successfully claimed this task!",
        })

        return tx
      } catch (error: any) {
        console.error("Failed to claim task:", error)
        toast({
          title: "Transaction Failed",
          description: error.message || "Failed to claim task.",
          variant: "destructive",
        })
        throw error
      }
    },
    [getContract],
  )

  const submitWork = useCallback(
    async (taskId: number) => {
      try {
        const contract = await getContract(true)

        toast({
          title: "Submitting Work",
          description: "Please confirm the transaction in MetaMask.",
        })

        const tx = await contract.submitWork(taskId)

        toast({
          title: "Transaction Submitted",
          description: "Waiting for confirmation...",
        })

        await tx.wait()

        toast({
          title: "Work Submitted",
          description: "Your work has been submitted for review!",
        })

        return tx
      } catch (error: any) {
        console.error("Failed to submit work:", error)
        toast({
          title: "Transaction Failed",
          description: error.message || "Failed to submit work.",
          variant: "destructive",
        })
        throw error
      }
    },
    [getContract],
  )

  const approveTask = useCallback(
    async (taskId: number) => {
      try {
        const contract = await getContract(true)

        toast({
          title: "Approving Task",
          description: "Please confirm the transaction in MetaMask.",
        })

        const tx = await contract.approveTask(taskId)

        toast({
          title: "Transaction Submitted",
          description: "Waiting for confirmation...",
        })

        await tx.wait()

        toast({
          title: "Task Approved",
          description: "Payment has been released to the worker!",
        })

        return tx
      } catch (error: any) {
        console.error("Failed to approve task:", error)
        toast({
          title: "Transaction Failed",
          description: error.message || "Failed to approve task.",
          variant: "destructive",
        })
        throw error
      }
    },
    [getContract],
  )

  const getAllTasks = useCallback(async (): Promise<Task[]> => {
    try {
      const contract = await getContract(false)
      const tasks = await contract.getAllTasks()
      return tasks
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
      throw error
    }
  }, [getContract])

  const getUserTasks = useCallback(
    async (userAddress: string): Promise<{ posted: Task[]; claimed: Task[] }> => {
      try {
        const contract = await getContract(false)
        const [posted, claimed] = await contract.getUserTasks(userAddress)
        return { posted, claimed }
      } catch (error) {
        console.error("Failed to fetch user tasks:", error)
        throw error
      }
    },
    [getContract],
  )

  return {
    createTask,
    claimTask,
    submitWork,
    approveTask,
    getAllTasks,
    getUserTasks,
  }
}
