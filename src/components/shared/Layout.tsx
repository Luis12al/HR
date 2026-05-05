import { useAuth } from '@/context/AuthContext'
import Sidebar from './Sidebar'
import { cn } from '@/lib/utils'

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return <>{children}</>

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        "ml-64"
      )}>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
