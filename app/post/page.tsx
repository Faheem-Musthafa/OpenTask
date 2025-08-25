"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { WalletButton } from "@/components/wallet-button"
import { useWeb3 } from "@/hooks/use-web3"
import { useContract } from "@/hooks/use-contract"
import { FileText, ArrowLeft, Coins, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface FormData {
  title: string
  description: string
  rewardShm: string
}

interface FormErrors {
  title?: string
  description?: string
  rewardShm?: string
}

export default function PostTaskPage() {
  const router = useRouter()
  const { isConnected } = useWeb3()
  const { createTask } = useContract()

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    rewardShm: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Title validation: 4-120 chars
    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.trim().length < 4) {
      newErrors.title = "Title must be at least 4 characters"
    } else if (formData.title.trim().length > 120) {
      newErrors.title = "Title must be less than 120 characters"
    }

    // Description validation: 10-2000 chars
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters"
    } else if (formData.description.trim().length > 2000) {
      newErrors.description = "Description must be less than 2000 characters"
    }

    // Reward validation: > 0
    if (!formData.rewardShm.trim()) {
      newErrors.rewardShm = "Reward amount is required"
    } else {
      const reward = Number.parseFloat(formData.rewardShm)
      if (isNaN(reward) || reward <= 0) {
        newErrors.rewardShm = "Reward must be greater than 0"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isConnected) {
      return
    }

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      await createTask(formData.title.trim(), formData.description.trim(), formData.rewardShm)

      // Reset form and redirect to tasks page
      setFormData({ title: "", description: "", rewardShm: "" })
      router.push("/tasks")
    } catch (error) {
      console.error("Failed to create task:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCharacterCount = (text: string, max: number) => {
    const count = text.length
    const isOverLimit = count > max
    return (
      <span className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
        {count}/{max}
      </span>
    )
  }

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
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Tasks
                </Button>
              </Link>
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">Post a New Task</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create a task with escrowed rewards and find skilled workers to complete it
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {!isConnected ? (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-serif">Connect Your Wallet</CardTitle>
                <CardDescription>You need to connect your wallet to post tasks and escrow rewards</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <WalletButton size="lg" />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Task Details</CardTitle>
                <CardDescription>
                  Provide clear details about your task. The reward will be locked in escrow until completion.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="title">Task Title</Label>
                      {getCharacterCount(formData.title, 120)}
                    </div>
                    <Input
                      id="title"
                      placeholder="e.g., Design a logo for my startup"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className={errors.title ? "border-destructive" : ""}
                      maxLength={120}
                    />
                    {errors.title && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Description Field */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="description">Task Description</Label>
                      {getCharacterCount(formData.description, 2000)}
                    </div>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed requirements, deliverables, and any specific instructions..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className={`min-h-32 ${errors.description ? "border-destructive" : ""}`}
                      maxLength={2000}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Reward Field */}
                  <div className="space-y-2">
                    <Label htmlFor="reward">Reward Amount (SHM)</Label>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="reward"
                        type="number"
                        step="0.001"
                        min="0"
                        placeholder="0.1"
                        value={formData.rewardShm}
                        onChange={(e) => handleInputChange("rewardShm", e.target.value)}
                        className={`pl-10 ${errors.rewardShm ? "border-destructive" : ""}`}
                      />
                    </div>
                    {errors.rewardShm && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.rewardShm}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      This amount will be locked in escrow and released when you approve the completed work.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button type="submit" disabled={loading} className="w-full gap-2" size="lg">
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Task...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Create Task & Escrow Reward
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>1. Your reward is locked in smart contract escrow</p>
                <p>2. Workers can claim and complete your task</p>
                <p>3. Review submitted work and approve to release payment</p>
                <p>4. Funds are automatically transferred to the worker</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg flex items-center gap-2">
                  <Coins className="w-5 h-5 text-primary" />
                  Escrow Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Your funds are secured by smart contracts</p>
                <p>• No payment until you approve the work</p>
                <p>• Transparent and trustless process</p>
                <p>• Built on Shardeum blockchain</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
