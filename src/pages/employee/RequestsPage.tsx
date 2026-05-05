import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { mockEmployees } from '@/data/mockData'
import { useAuth } from '@/context/AuthContext'
import { formatDate, cn } from '@/lib/utils'
import type { Request } from '@/types'
import {
  FileQuestion, Plus, Calendar, Clock, CheckCircle2, XCircle, Clock3,
  FileText, AlertTriangle, Send, Ban
} from 'lucide-react'

export default function RequestsPage() {
  const { user } = useAuth()
  const [employee, setEmployee] = useState(mockEmployees.find(e => e.id === user?.employeeId) || mockEmployees[1])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newRequest, setNewRequest] = useState({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: ''
  })

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    const request: Request = {
      id: `req-${Date.now()}`,
      type: newRequest.type as Request['type'],
      status: 'pending',
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      reason: newRequest.reason,
      createdAt: new Date().toISOString(),
    }
    setEmployee(prev => ({ ...prev, requests: [request, ...prev.requests] }))
    setDialogOpen(false)
    setNewRequest({ type: 'vacation', startDate: '', endDate: '', reason: '' })
  }

  const getRequestIcon = (type: string) => {
    switch (type) {
      case 'vacation': return Calendar
      case 'incapacity': return AlertTriangle
      case 'permission': return Clock3
      default: return FileText
    }
  }

  const getRequestLabel = (type: string) => {
    switch (type) {
      case 'vacation': return 'Vacaciones'
      case 'incapacity': return 'Incapacidad'
      case 'permission': return 'Permiso'
      default: return 'Otro'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solicitudes</h1>
          <p className="text-muted-foreground mt-1">
            Gestion de vacaciones, incapacidades y permisos
          </p>
        </div>
        <Button className="gradient-primary gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="w-4 h-4" />
          Nueva Solicitud
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FileQuestion className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employee.requests.length}</p>
              <p className="text-sm text-muted-foreground">Total Solicitudes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employee.requests.filter(r => r.status === 'pending').length}</p>
              <p className="text-sm text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employee.requests.filter(r => r.status === 'approved').length}</p>
              <p className="text-sm text-muted-foreground">Aprobadas</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employee.requests.filter(r => r.status === 'rejected').length}</p>
              <p className="text-sm text-muted-foreground">Rechazadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-primary" />
            Mis Solicitudes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {employee.requests.map((req) => {
            const Icon = getRequestIcon(req.type)
            return (
              <div
                key={req.id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-xl border bg-card/50 hover:bg-accent/30 transition-all duration-200"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  req.status === 'approved' ? "bg-emerald-500/10" :
                  req.status === 'rejected' ? "bg-red-500/10" :
                  "bg-amber-500/10"
                )}>
                  <Icon className={cn("w-6 h-6",
                    req.status === 'approved' ? "text-emerald-500" :
                    req.status === 'rejected' ? "text-red-500" :
                    "text-amber-500"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{getRequestLabel(req.type)}</h3>
                    <Badge variant={
                      req.status === 'approved' ? 'success' :
                      req.status === 'rejected' ? 'destructive' :
                      'warning'
                    }>
                      {req.status === 'approved' ? 'Aprobada' :
                       req.status === 'rejected' ? 'Rechazada' :
                       'Pendiente'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{req.reason}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Desde: {formatDate(req.startDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Hasta: {formatDate(req.endDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Solicitado: {formatDate(req.createdAt)}
                    </span>
                  </div>
                  {req.approvedBy && (
                    <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Aprobado por: {req.approvedBy} el {formatDate(req.approvedAt || '')}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {req.status === 'pending' && (
                    <Button variant="outline" size="sm" className="gap-1">
                      <Ban className="w-3.5 h-3.5" />
                      Cancelar
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    Ver Detalle
                  </Button>
                </div>
              </div>
            )
          })}
          {employee.requests.length === 0 && (
            <div className="text-center py-12">
              <FileQuestion className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No tienes solicitudes registradas</p>
              <Button variant="outline" className="mt-4 gap-1" onClick={() => setDialogOpen(true)}>
                <Plus className="w-4 h-4" />
                Crear Solicitud
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Request Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Nueva Solicitud
            </DialogTitle>
            <DialogDescription>
              Completa el formulario para enviar tu solicitud
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRequest} className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Solicitud</Label>
              <Select
                value={newRequest.type}
                onValueChange={(v) => setNewRequest(prev => ({ ...prev, type: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacaciones</SelectItem>
                  <SelectItem value="incapacity">Incapacidad</SelectItem>
                  <SelectItem value="permission">Permiso</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha de Inicio</Label>
                <Input
                  type="date"
                  value={newRequest.startDate}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Fecha de Fin</Label>
                <Input
                  type="date"
                  value={newRequest.endDate}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Motivo</Label>
              <Input
                placeholder="Describe el motivo de tu solicitud..."
                value={newRequest.reason}
                onChange={(e) => setNewRequest(prev => ({ ...prev, reason: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="gradient-primary gap-2">
                <Send className="w-4 h-4" />
                Enviar Solicitud
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
