import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/shared/StatusBadge'
import { mockReports } from '@/data/mockData'
import { formatDate, cn } from '@/lib/utils'
import {
  Search, AlertTriangle, FileText, Calendar, User, Flag,
  Clock, CheckCircle2, BarChart3, TrendingUp,
  AlertOctagon, MessageSquare, UserCheck, FileQuestion, Filter
} from 'lucide-react'

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredReports = useMemo(() => {
    return mockReports.filter(report => {
      const matchesSearch =
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (report.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesType = typeFilter === 'all' || report.type === typeFilter
      const matchesSeverity = severityFilter === 'all' || report.severity === severityFilter
      const matchesStatus = statusFilter === 'all' || report.status === statusFilter
      return matchesSearch && matchesType && matchesSeverity && matchesStatus
    })
  }, [searchQuery, typeFilter, severityFilter, statusFilter])

  const reportStats = useMemo(() => {
    const open = mockReports.filter(r => r.status === 'open').length
    const inProgress = mockReports.filter(r => r.status === 'in_progress').length
    const resolved = mockReports.filter(r => r.status === 'resolved').length
    const critical = mockReports.filter(r => r.severity === 'critical' || r.severity === 'high').length
    return { open, inProgress, resolved, critical, total: mockReports.length }
  }, [])

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'document_missing': return FileText
      case 'document_expired': return AlertTriangle
      case 'violation': return Flag
      case 'meeting': return Calendar
      case 'request': return FileQuestion
      case 'attendance': return Clock
      default: return MessageSquare
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10'
      case 'high': return 'text-red-400 bg-red-400/10'
      case 'medium': return 'text-amber-500 bg-amber-500/10'
      case 'low': return 'text-blue-500 bg-blue-500/10'
      default: return 'text-muted-foreground bg-muted'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground mt-1">
          Seguimiento de incidencias, faltas, documentos y solicitudes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{reportStats.total}</p>
              <p className="text-xs text-muted-foreground">Total Reportes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{reportStats.open}</p>
              <p className="text-xs text-muted-foreground">Abiertos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{reportStats.inProgress}</p>
              <p className="text-xs text-muted-foreground">En Proceso</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{reportStats.resolved}</p>
              <p className="text-xs text-muted-foreground">Resueltos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xl font-bold">{reportStats.critical}</p>
              <p className="text-xs text-muted-foreground">Criticos/Altos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar reporte..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="document_missing">Documento Faltante</SelectItem>
                  <SelectItem value="document_expired">Documento Vencido</SelectItem>
                  <SelectItem value="violation">Falta a Normas</SelectItem>
                  <SelectItem value="meeting">Reunion</SelectItem>
                  <SelectItem value="request">Solicitud</SelectItem>
                  <SelectItem value="attendance">Asistencia</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[160px]">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Severidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="critical">Critica</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="low">Baja</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Flag className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="open">Abierto</SelectItem>
                  <SelectItem value="in_progress">En Proceso</SelectItem>
                  <SelectItem value="resolved">Resuelto</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Listado de Reportes
            <Badge variant="secondary" className="ml-2">{filteredReports.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredReports.map((report) => {
            const ReportIcon = getReportIcon(report.type)
            return (
              <div
                key={report.id}
                className="flex items-start gap-4 p-4 rounded-xl border bg-card/50 hover:bg-accent/30 transition-all duration-200"
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  getSeverityColor(report.severity)
                )}>
                  <ReportIcon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{report.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <StatusBadge status={report.status} type="report" />
                      <Badge variant="outline" className="capitalize text-xs">
                        {report.severity}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    {report.employeeName && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {report.employeeName}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(report.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      {report.createdBy}
                    </span>
                    {report.resolvedAt && (
                      <span className="flex items-center gap-1 text-emerald-500">
                        <CheckCircle2 className="w-3 h-3" />
                        Resuelto: {formatDate(report.resolvedAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  {report.status !== 'resolved' && (
                    <Button variant="outline" size="sm" className="h-8">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Resolver
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-8">
                    Ver Detalle
                  </Button>
                </div>
              </div>
            )
          })}
          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No se encontraron reportes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
