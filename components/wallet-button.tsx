"use client"

import { Button } from "@/components/ui/button"
import { Wallet, LogOut } from "lucide-react"
import { useWeb3 } from "@/hooks/use-web3"
import { formatAddress } from "@/lib/web3"

interface WalletButtonProps {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function WalletButton({ variant = "outline", size = "default", className }: WalletButtonProps) {
  const { account, isConnected, isConnecting, connect, disconnect } = useWeb3()

  if (isConnected && account) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size={size} className={className}>
          <Wallet className="w-4 h-4 mr-2" />
          {formatAddress(account)}
        </Button>
        <Button variant="ghost" size="sm" onClick={disconnect}>
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <Button variant={variant} size={size} className={className} onClick={connect} disabled={isConnecting}>
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
