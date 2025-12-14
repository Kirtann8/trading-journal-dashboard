import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
      </div>

      <div className="z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        {/* Hero Section */}
        <div className="animate-fade-in space-y-8 py-20">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm mb-4">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Trading Intelligence Redefined
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
            Master Your <br />
            <span className="text-gradient animate-glow">Crypto Journey</span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The professional grade journal for serious traders. Track, analyze, and optimize your trading performance with AI-driven insights.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/dashboard" 
              className="btn-primary text-lg px-8 py-6 rounded-full w-full sm:w-auto group relative overflow-hidden"
            >
              <span className="relative z-10">Get Started Now</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            <Link 
              href="/login" 
              className="btn-outline text-lg px-8 py-6 rounded-full w-full sm:w-auto backdrop-blur-sm hover:bg-white/5"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-20 mb-20 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {[
            {
              title: "Smart Logging",
              description: "Effortlessly record trades with automated price fetching and PnL calculations.",
              icon: (
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              )
            },
            {
              title: "Portfolio Analytics",
              description: "Deep dive into your performance with win-rate, profit factor, and drawdown analysis.",
              icon: (
                <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
              )
            },
            {
              title: "Risk Management",
              description: "Visualize your risk per trade and maintain discipline with built-in calculators.",
              icon: (
                <svg className="w-6 h-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )
            },
            {
              title: "Strategy Tester",
              description: "Tag trades by strategy and identify your most profitable setups over time.",
              icon: (
                <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              )
            }
          ].map((feature, index) => (
            <div key={index} className="glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
              <div className="h-12 w-12 rounded-lg bg-background/50 flex items-center justify-center mb-4 border border-border/50">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}