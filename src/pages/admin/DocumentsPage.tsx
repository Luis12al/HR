import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import EmployeeDetailModal from '@/components/admin/EmployeeDetailModal'
import StatusBadge from '@/components/shared/StatusBadge'
import { mockEmployees } from '@/data/mockData'
import { cn } from '@/lib/utils'
import type { Employee } from '@/types'
import {
  Search, FileText, AlertTriangle, CheckCircle2, XCircle, Clock,
  Eye, Shield, Filter
} from 'lucide-react'

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [docStatusFilter, setDocStatusFilter] = useState<string>('all')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const allDocuments = useMemo(() => {
    const docs: { employee: Employee; doc: Employee['documents'][0] }[] = []
    mockEmployees.forEach(emp => {
      emp.documents.forEach(doc => {
        docs.push({ employee: emp, doc })
      })
    })
    return docs
  }, [])

  const filteredDocs = useMemo(() => {
    return allDocuments.filter(({ employee, doc }) => {
      const matchesSearch =
        employee.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = docStatusFilter === 'all' || doc.status === docStatusFilter
      return matchesSearch && matchesStatus
    })
  }, [allDocuments, searchQuery, docStatusFilter])

  const employeeDocStats = useMemo(() => {
    return mockEmployees.map(emp => {
      const total = emp.documents.length
      const valid = emp.documents.filter(d => d.status === 'valid').length
      const expired = emp.documents.filter(d => d.status === 'expired').length
      const missing = emp.documents.filter(d => d.status === 'missing').length
      const pending = emp.documents.filter(d => d.status === 'pending').length
      const progress = total > 0 ? Math.round((valid / total) * 100) : 0
      return { employee: emp, total, valid, expired, missing, pending, progress }
    })
  }, [])

  const totalDocs = allDocuments.length
  const validDocs = allDocuments.filter(d => d.doc.status === 'valid').length
  const expiredDocs = allDocuments.filter(d => d.doc.status === 'expired').length
  const missingDocs = allDocuments.filter(d => d.doc.status === 'missing').length

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentacion Legal</h1>
        <p className="text-muted-foreground mt-1">
          Gestion de documentos y certificados del personal
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalDocs}</p>
              <p className="text-sm text-muted-foreground">Total Documentos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{validDocs}</p>
              <p className="text-sm text-muted-foreground">Vigentes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{expiredDocs}</p>
              <p className="text-sm text-muted-foreground">Vencidos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{missingDocs}</p>
              <p className="text-sm text-muted-foreground">Faltantes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Document Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Estado de Documentacion por Empleado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {employeeDocStats.map(({ employee, valid, expired, missing, pending, progress }) => (
            <div
              key={employee.id}
              className="flex items-center gap-4 p-4 rounded-lg border bg-card/50 hover:bg-accent/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                {employee.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{employee.fullName}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-xs">{valid}</span>
                    </div>
                    {expired > 0 && (
                      <div className="flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-xs">{expired}</span>
                      </div>
                    )}
                    {missing > 0 && (
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                        <span className="text-xs">{missing}</span>
                      </div>
                    )}
                    {pending > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs">{pending}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={progress} className="flex-1" />
                  <span className="text-xs font-medium w-10 text-right">{progress}%</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewEmployee(employee)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Document List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Todos los Documentos
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar documento..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={docStatusFilter} onValueChange={setDocStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="valid">Vigente</SelectItem>
                  <SelectItem value="expired">Vencido</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="missing">Faltante</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Documento</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Empleado</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Tipo</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Emision</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Vencimiento</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(({ employee, doc }) => (
                  <tr key={doc.id} className="border-b last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center",
                          doc.status === 'valid' && "bg-emerald-500/10",
                          doc.status === 'expired' && "bg-red-500/10",
                          doc.status === 'pending' && "bg-amber-500/10",
                          doc.status === 'missing' && "bg-red-500/10"
                        )}>
                          <FileText className={cn(
                            "w-4 h-4",
                            doc.status === 'valid' && "text-emerald-500",
                            doc.status === 'expired' && "text-red-500",
                            doc.status === 'pending' && "text-amber-500",
                            doc.status === 'missing' && "text-red-500"
                          )} />
                        </div>
                        <span className="font-medium text-sm">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{employee.fullName}</td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="capitalize">{doc.type}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{doc.issueDate}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {doc.expiryDate || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={doc.status} type="document" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <EmployeeDetailModal
        employee={selectedEmployee}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
