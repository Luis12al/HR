import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import StatCard from '@/components/shared/StatCard'
import { mockStats, mockEmployees, mockReports } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import StatusBadge from '@/components/shared/StatusBadge'
import {
  Users, UserCheck, Clock, AlertTriangle, FileQuestion,
  FileX, BarChart3, TrendingUp, Activity, Calendar
} from 'lucide-react'

export default function AdminDashboard() {
  const recentReports = mockReports.slice(0, 4)
  const onShiftEmployees = mockEmployees.filter(e => e.isOnShift)
  const recentEmployees = mockEmployees.slice(0, 3)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Resumen general del sistema de recursos humanos
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {formatDate(new Date())}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Empleados"
          value={mockStats.totalEmployees}
          description={`${mockStats.activeEmployees} activos`}
          icon={Users}
          color="blue"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="En Turno"
          value={mockStats.onShiftEmployees}
          description={`${mockStats.lateToday} llegadas tarde hoy`}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Solicitudes Pendientes"
          value={mockStats.pendingRequests}
          description="Requieren aprobacion"
          icon={FileQuestion}
          color="amber"
        />
        <StatCard
          title="Documentos Vencidos"
          value={mockStats.expiredDocuments}
          description="Requieren renovacion"
          icon={FileX}
          color="red"
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Reportes Abiertos"
          value={mockStats.openReports}
          description="En seguimiento"
          icon={AlertTriangle}
          color="purple"
        />
        <StatCard
          title="Nuevas Contrataciones"
          value={mockStats.newHiresThisMonth}
          description="Este mes"
          icon={TrendingUp}
          color="cyan"
        />
        <StatCard
          title="Tasa de Asistencia"
          value="94%"
          description="Promedio mensual"
          icon={Activity}
          color="green"
          trend={{ value: 3, positive: true }}
        />
        <StatCard
          title="Horas Trabajadas"
          value="1,248"
          description="Este mes"
          icon={Clock}
          color="blue"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Reportes Recientes
              </CardTitle>
              <span className="text-xs text-muted-foreground">Ultimos 4 reportes</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card/50 hover:bg-accent/50 transition-colors"
              >
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2 shrink-0",
                  report.severity === 'critical' && "bg-red-500",
                  report.severity === 'high' && "bg-red-400",
                  report.severity === 'medium' && "bg-amber-500",
                  report.severity === 'low' && "bg-blue-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{report.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{report.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {report.employeeName && (
                      <span className="text-xs text-muted-foreground">{report.employeeName}</span>
                    )}
                    <span className="text-xs text-muted-foreground">{formatDate(report.createdAt)}</span>
                  </div>
                </div>
                <StatusBadge status={report.status} type="report" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Employees On Shift */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-500" />
              En Turno Ahora
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {onShiftEmployees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card/50"
              >
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {emp.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{emp.fullName}</p>
                  <p className="text-xs text-muted-foreground">{emp.position}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs text-emerald-500 font-medium">Activo</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{emp.shiftStart} - {emp.shiftEnd}</p>
                </div>
              </div>
            ))}
            {onShiftEmployees.length === 0 && (
              <p className="text-muted-foreground text-center py-4">Nadie en turno</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Hires */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Empleados Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentEmployees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card/50"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {emp.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{emp.fullName}</p>
                  <p className="text-xs text-muted-foreground">{emp.department} - {emp.position}</p>
                </div>
                <div className="text-right">
                  <StatusBadge status={emp.status} type="status" />
                  <p className="text-xs text-muted-foreground mt-1">{formatDate(emp.hireDate)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Acciones Rapidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionButton icon={Users} label="Nuevo Empleado" color="blue" />
              <QuickActionButton icon={FileQuestion} label="Aprobar Solicitud" color="green" />
              <QuickActionButton icon={AlertTriangle} label="Crear Reporte" color="amber" />
              <QuickActionButton icon={BarChart3} label="Ver Reportes" color="purple" />
              <QuickActionButton icon={Clock} label="Ver Asistencias" color="cyan" />
              <QuickActionButton icon={FileX} label="Documentos" color="red" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function QuickActionButton({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'hover:bg-blue-500/10 hover:border-blue-500/30',
    green: 'hover:bg-emerald-500/10 hover:border-emerald-500/30',
    amber: 'hover:bg-amber-500/10 hover:border-amber-500/30',
    purple: 'hover:bg-violet-500/10 hover:border-violet-500/30',
    cyan: 'hover:bg-cyan-500/10 hover:border-cyan-500/30',
    red: 'hover:bg-red-500/10 hover:border-red-500/30',
  }

  return (
    <button className={cn(
      "flex flex-col items-center gap-2 p-4 rounded-xl border bg-card/50 transition-all duration-200",
      colorClasses[color]
    )}>
      <Icon className="w-6 h-6 text-muted-foreground" />
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </button>
  )
}

function cn(...inputs: (string | undefined | false)[]) {
  return inputs.filter(Boolean).join(' ')
}
