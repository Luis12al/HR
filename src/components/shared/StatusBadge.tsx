import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  type?: 'status' | 'document' | 'request' | 'report' | 'candidate'
}

const statusConfig: Record<string, Record<string, { variant: string; label: string }>> = {
  status: {
    active: { variant: 'success', label: 'Activo' },
    inactive: { variant: 'destructive', label: 'Inactivo' },
    on_leave: { variant: 'warning', label: 'En Permiso' },
  },
  document: {
    valid: { variant: 'success', label: 'Vigente' },
    expired: { variant: 'destructive', label: 'Vencido' },
    pending: { variant: 'warning', label: 'Pendiente' },
    missing: { variant: 'destructive', label: 'Faltante' },
  },
  request: {
    pending: { variant: 'warning', label: 'Pendiente' },
    approved: { variant: 'success', label: 'Aprobado' },
    rejected: { variant: 'destructive', label: 'Rechazado' },
  },
  report: {
    open: { variant: 'destructive', label: 'Abierto' },
    in_progress: { variant: 'warning', label: 'En Proceso' },
    resolved: { variant: 'success', label: 'Resuelto' },
  },
  candidate: {
    new: { variant: 'info', label: 'Nuevo' },
    screening: { variant: 'warning', label: 'Screening' },
    interview: { variant: 'info', label: 'Entrevista' },
    offer: { variant: 'success', label: 'Oferta' },
    hired: { variant: 'success', label: 'Contratado' },
    rejected: { variant: 'destructive', label: 'Rechazado' },
  },
}

export default function StatusBadge({ status, type = 'status' }: StatusBadgeProps) {
  const config = statusConfig[type]?.[status] || { variant: 'default', label: status }

  return (
    <Badge variant={config.variant as any} className={cn(
      "capitalize",
      status === 'active' && "animate-pulse-soft"
    )}>
      {config.label}
    </Badge>
  )
}
