import { ethers } from "ethers"

// Shardeum network configuration
export const SHARDEUM_NETWORK = {
  chainId: "0x1F91", // 8081 in hex
  chainName: "Shardeum Unstablenet",
  nativeCurrency: {
    name: "SHM",
    symbol: "SHM",
    decimals: 18,
  },
  rpcUrls: [process.env.NEXT_PUBLIC_SHARDEUM_RPC || "https://dapps.shardeum.org/"],
  blockExplorerUrls: ["https://explorer-dapps.shardeum.org/"],
}

// Contract configuration
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""

// Task status enum
export enum TaskStatus {
  Open = 0,
  Claimed = 1,
  Completed = 2,
  Approved = 3,
}

// Task interface
export interface Task {
  id: bigint
  title: string
  description: string
  reward: bigint
  poster: string
  worker: string
  status: TaskStatus
  createdAt: bigint
}

// Utility functions
export const formatAddress = (address: string): string => {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const formatSHM = (wei: bigint): string => {
  return ethers.formatEther(wei)
}

export const parseSHM = (shm: string): bigint => {
  return ethers.parseEther(shm)
}

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined"
}

// Add Shardeum network to MetaMask
export const addShardeumNetwork = async (): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed")
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [SHARDEUM_NETWORK],
    })
  } catch (error) {
    console.error("Failed to add Shardeum network:", error)
    throw error
  }
}

// Switch to Shardeum network
export const switchToShardeum = async (): Promise<void> => {
  if (!isMetaMaskInstalled()) {
    throw new Error("MetaMask is not installed")
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SHARDEUM_NETWORK.chainId }],
    })
  } catch (error: any) {
    // If network doesn't exist, add it
    if (error.code === 4902) {
      await addShardeumNetwork()
    } else {
      console.error("Failed to switch to Shardeum network:", error)
      throw error
    }
  }
}

// Get provider and signer
export const getProvider = (): ethers.BrowserProvider | null => {
  if (!isMetaMaskInstalled()) return null
  return new ethers.BrowserProvider(window.ethereum)
}

export const getSigner = async (): Promise<ethers.JsonRpcSigner | null> => {
  const provider = getProvider()
  if (!provider) return null
  return await provider.getSigner()
}

// Global ethereum interface
declare global {
  interface Window {
    ethereum?: any
  }
}
