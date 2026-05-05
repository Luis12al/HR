import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import StatusBadge from '@/components/shared/StatusBadge'
import { formatDate, getInitials, cn } from '@/lib/utils'
import type { Employee } from '@/types'
import {
  Mail, Phone, Building2, Briefcase, Calendar, MapPin,
  FileText, BookOpen, Clock, AlertTriangle, CheckCircle2,
  XCircle, Clock3, DollarSign, Shield
} from 'lucide-react'

interface EmployeeDetailModalProps {
  employee: Employee | null
  open: boolean
  onClose: () => void
}

export default function EmployeeDetailModal({ employee, open, onClose }: EmployeeDetailModalProps) {
  if (!employee) return null

  const validDocs = employee.documents.filter(d => d.status === 'valid').length
  const expiredDocs = employee.documents.filter(d => d.status === 'expired').length
  const missingDocs = employee.documents.filter(d => d.status === 'missing').length
  const docProgress = employee.documents.length > 0
    ? Math.round((validDocs / employee.documents.length) * 100)
    : 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">Detalle del Empleado</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Header Info */}
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-2xl">
                  {getInitials(employee.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <h2 className="text-xl font-bold">{employee.fullName}</h2>
                <p className="text-muted-foreground">{employee.position} &middot; {employee.department}</p>
                <div className="flex items-center gap-2 pt-1">
                  <StatusBadge status={employee.status} type="status" />
                  {employee.isOnShift && (
                    <Badge variant="success" className="animate-pulse-soft">
                      <Clock3 className="w-3 h-3 mr-1" />
                      En Turno
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">Salario</p>
                <p className="text-xl font-bold text-gradient">
                  ${employee.salary.toLocaleString('es-CO')}
                </p>
              </div>
            </div>

            <Separator />

            {/* Contact Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoItem icon={Shield} label="Cedula" value={employee.cedula} />
              <InfoItem icon={Mail} label="Email" value={employee.email} />
              <InfoItem icon={Phone} label="Telefono" value={employee.phone} />
              <InfoItem icon={Calendar} label="Fecha Ingreso" value={formatDate(employee.hireDate)} />
              <InfoItem icon={Building2} label="Departamento" value={employee.department} />
              <InfoItem icon={Briefcase} label="Cargo" value={employee.position} />
              <InfoItem icon={MapPin} label="Ubicacion" value={employee.location || 'No registrada'} />
              <InfoItem icon={DollarSign} label="Salario" value={`$${employee.salary.toLocaleString('es-CO')}`} />
            </div>

            <Separator />

            {/* Tabs */}
            <Tabs defaultValue="documents" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="documents">Documentos</TabsTrigger>
                <TabsTrigger value="attendance">Asistencias</TabsTrigger>
                <TabsTrigger value="courses">Cursos</TabsTrigger>
                <TabsTrigger value="requests">Solicitudes</TabsTrigger>
              </TabsList>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Documentacion Legal</h3>
                    <p className="text-sm text-muted-foreground">
                      {validDocs} vigentes &middot; {expiredDocs} vencidos &middot; {missingDocs} faltantes
                    </p>
                  </div>
                  <div className="w-32">
                    <Progress value={docProgress} />
                    <p className="text-xs text-center mt-1 text-muted-foreground">{docProgress}% completo</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {employee.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          doc.status === 'valid' && "bg-emerald-500/10",
                          doc.status === 'expired' && "bg-red-500/10",
                          doc.status === 'pending' && "bg-amber-500/10",
                          doc.status === 'missing' && "bg-red-500/10"
                        )}>
                          {doc.status === 'valid' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                          {doc.status === 'expired' && <XCircle className="w-5 h-5 text-red-500" />}
                          {doc.status === 'pending' && <Clock className="w-5 h-5 text-amber-500" />}
                          {doc.status === 'missing' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                        </div>
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Emitido: {formatDate(doc.issueDate)}
                            {doc.expiryDate && ` &middot; Vence: ${formatDate(doc.expiryDate)}`}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={doc.status} type="document" />
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance" className="space-y-4">
                <h3 className="font-semibold">Registro de Asistencias</h3>
                <div className="grid gap-3">
                  {employee.attendance.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Sin registros de asistencia</p>
                  ) : (
                    employee.attendance.map((att) => (
                      <div key={att.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            att.isLate ? "bg-red-500/10" : "bg-emerald-500/10"
                          )}>
                            <Clock className={cn("w-5 h-5", att.isLate ? "text-red-500" : "text-emerald-500")} />
                          </div>
                          <div>
                            <p className="font-medium">{formatDate(att.date)}</p>
                            <p className="text-xs text-muted-foreground">
                              Entrada: {att.checkIn}
                              {att.checkOut && ` &middot; Salida: ${att.checkOut}`}
                              {att.location && ` &middot; ${att.location}`}
                            </p>
                          </div>
                        </div>
                        {att.isLate ? <Badge variant="destructive">Tarde</Badge> : <Badge variant="success">A tiempo</Badge>}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-4">
                <h3 className="font-semibold">Cursos Asignados</h3>
                {employee.courses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Sin cursos asignados</p>
                ) : (
                  <div className="grid gap-3">
                    {employee.courses.map((course) => (
                      <div key={course.id} className="p-4 rounded-lg border bg-card/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{course.title}</p>
                              <p className="text-xs text-muted-foreground">{course.instructor}</p>
                            </div>
                          </div>
                          <StatusBadge status={course.status} type="status" />
                        </div>
                        <Progress value={course.progress} />
                        <p className="text-xs text-muted-foreground text-right">{course.progress}% completado</p>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Requests Tab */}
              <TabsContent value="requests" className="space-y-4">
                <h3 className="font-semibold">Solicitudes Realizadas</h3>
                {employee.requests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Sin solicitudes</p>
                ) : (
                  <div className="grid gap-3">
                    {employee.requests.map((req) => (
                      <div key={req.id} className="p-4 rounded-lg border bg-card/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium capitalize">{req.type}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(req.startDate)} - {formatDate(req.endDate)}
                              </p>
                            </div>
                          </div>
                          <StatusBadge status={req.status} type="request" />
                        </div>
                        <p className="text-sm text-muted-foreground">{req.reason}</p>
                        {req.approvedBy && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Aprobado por: {req.approvedBy} &middot; {formatDate(req.approvedAt || '')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
