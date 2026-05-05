import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: { value: number; positive: boolean }
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'cyan'
}

const colorMap = {
  blue: 'from-blue-500/20 to-blue-600/10 text-blue-500',
  green: 'from-emerald-500/20 to-emerald-600/10 text-emerald-500',
  amber: 'from-amber-500/20 to-amber-600/10 text-amber-500',
  red: 'from-red-500/20 to-red-600/10 text-red-500',
  purple: 'from-violet-500/20 to-violet-600/10 text-violet-500',
  cyan: 'from-cyan-500/20 to-cyan-600/10 text-cyan-500',
}

export default function StatCard({ title, value, description, icon: Icon, trend, color }: StatCardProps) {
  return (
    <Card className="hover-lift overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && (
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-xs font-medium",
                  trend.positive ? "text-emerald-500" : "text-red-500"
                )}>
                  {trend.positive ? '+' : ''}{trend.value}%
                </span>
                <span className="text-xs text-muted-foreground">vs mes anterior</span>
              </div>
            )}
          </div>
          <div className={cn(
            "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
            colorMap[color]
          )}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
