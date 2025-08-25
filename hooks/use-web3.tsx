"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { toast } from "@/hooks/use-toast"
import { getProvider, switchToShardeum, isMetaMaskInstalled, SHARDEUM_NETWORK } from "@/lib/web3"

interface Web3ContextType {
  account: string | null
  isConnected: boolean
  isConnecting: boolean
  chainId: string | null
  connect: () => Promise<void>
  disconnect: () => void
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [chainId, setChainId] = useState<string | null>(null)

  const isConnected = !!account

  // Check if already connected on mount
  useEffect(() => {
    checkConnection()
  }, [])

  // Listen for account and chain changes
  useEffect(() => {
    if (!isMetaMaskInstalled()) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAccount(null)
        setChainId(null)
      } else {
        setAccount(accounts[0])
      }
    }

    const handleChainChanged = (newChainId: string) => {
      setChainId(newChainId)
      // Reload page on chain change to avoid stale state
      window.location.reload()
    }

    window.ethereum?.on("accountsChanged", handleAccountsChanged)
    window.ethereum?.on("chainChanged", handleChainChanged)

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum?.removeListener("chainChanged", handleChainChanged)
    }
  }, [])

  const checkConnection = async () => {
    if (!isMetaMaskInstalled()) return

    try {
      const provider = getProvider()
      if (!provider) return

      const accounts = await provider.listAccounts()
      if (accounts.length > 0) {
        setAccount(accounts[0].address)
        const network = await provider.getNetwork()
        setChainId(`0x${network.chainId.toString(16)}`)
      }
    } catch (error) {
      console.error("Failed to check connection:", error)
    }
  }

  const connect = async () => {
    if (!isMetaMaskInstalled()) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      })
      return
    }

    setIsConnecting(true)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      setAccount(accounts[0])

      // Check and switch to Shardeum network
      const provider = getProvider()
      if (provider) {
        const network = await provider.getNetwork()
        const currentChainId = `0x${network.chainId.toString(16)}`
        setChainId(currentChainId)

        if (currentChainId !== SHARDEUM_NETWORK.chainId) {
          toast({
            title: "Switching Network",
            description: "Please switch to Shardeum network to continue.",
          })
          await switchToShardeum()
        }
      }

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask.",
      })
    } catch (error: any) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setChainId(null)
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    })
  }

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        isConnecting,
        chainId,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}
