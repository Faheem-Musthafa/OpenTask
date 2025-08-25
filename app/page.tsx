import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Shield, Zap, ArrowRight, FileText, ThumbsUp } from "lucide-react"
import { WalletButton } from "@/components/wallet-button"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl text-foreground">OpenTask</span>
            </div>
            <WalletButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            Built on Shardeum
          </Badge>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
            Decentralized Task Board with <span className="text-primary">Trustless Escrow</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Post micro-tasks with escrowed rewards, claim work that matches your skills, and get paid automatically when
            approved. No intermediaries, just smart contracts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tasks">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/tasks">
              <Button variant="outline" size="lg">
                View Tasks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to start earning or getting work done
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">1. Post Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Create tasks with detailed descriptions and lock SHM tokens as rewards in smart contract escrow
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">2. Claim & Work</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Browse available tasks, claim ones that match your skills, and submit your completed work
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:border-primary/20 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ThumbsUp className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="font-serif">3. Get Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Task posters review submissions and approve quality work, automatically releasing escrowed funds
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-4">Why Choose OpenTask?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for the decentralized future of work
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-xl mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground leading-relaxed">
                Built on Shardeum's high-performance blockchain for instant transactions and low fees
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-xl mb-4">Trustless Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                Smart contract escrow ensures payments are secure and automatically released upon approval
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-xl mb-4">On-Chain Transparency</h3>
              <p className="text-muted-foreground leading-relaxed">
                All transactions and task history are permanently recorded on the blockchain for full transparency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-foreground mb-6">Ready to Start Earning?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the decentralized workforce and start completing tasks or posting work today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <WalletButton size="lg" />
            <Link href="/tasks">
              <Button variant="outline" size="lg">
                Browse Available Tasks
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl text-foreground">OpenTask</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Built on Shardeum</span>
              <span>•</span>
              <span>Decentralized Task Board</span>
              <span>•</span>
              <span>Trustless Escrow</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
