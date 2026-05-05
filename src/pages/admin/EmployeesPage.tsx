import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import EmployeeDetailModal from '@/components/admin/EmployeeDetailModal'
import StatusBadge from '@/components/shared/StatusBadge'
import { mockEmployees } from '@/data/mockData'
// import { formatTime, cn } from '@/lib/utils'
import type { Employee } from '@/types'
import {
  Search, Filter, Eye, Clock, MapPin, Building2, Users,
  ChevronLeft, ChevronRight, UserCheck, UserX, Briefcase
} from 'lucide-react'

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deptFilter, setDeptFilter] = useState<string>('all')
  const [shiftFilter, setShiftFilter] = useState<string>('all')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const departments = useMemo(() => {
    const depts = new Set(mockEmployees.map(e => e.department))
    return Array.from(depts)
  }, [])

  const filteredEmployees = useMemo(() => {
    return mockEmployees.filter(emp => {
      const matchesSearch =
        emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.cedula.includes(searchQuery) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter
      const matchesDept = deptFilter === 'all' || emp.department === deptFilter
      const matchesShift = shiftFilter === 'all' ||
        (shiftFilter === 'on_shift' && emp.isOnShift) ||
        (shiftFilter === 'off_shift' && !emp.isOnShift)

      return matchesSearch && matchesStatus && matchesDept && matchesShift
    })
  }, [searchQuery, statusFilter, deptFilter, shiftFilter])

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setModalOpen(true)
  }

  const activeCount = mockEmployees.filter(e => e.status === 'active').length
  const onShiftCount = mockEmployees.filter(e => e.isOnShift).length
  const onLeaveCount = mockEmployees.filter(e => e.status === 'on_leave').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Empleados</h1>
        <p className="text-muted-foreground mt-1">
          Gestion y seguimiento del personal
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Empleados Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{onShiftCount}</p>
              <p className="text-sm text-muted-foreground">En Turno Ahora</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <UserX className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{onLeaveCount}</p>
              <p className="text-sm text-muted-foreground">En Permiso</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, cedula o cargo..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="on_leave">En Permiso</SelectItem>
                </SelectContent>
              </Select>

              <Select value={deptFilter} onValueChange={(v) => { setDeptFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[180px]">
                  <Building2 className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={shiftFilter} onValueChange={(v) => { setShiftFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-[160px]">
                  <Clock className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Turno" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="on_shift">En Turno</SelectItem>
                  <SelectItem value="off_shift">Fuera de Turno</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Listado de Empleados
            <Badge variant="secondary" className="ml-2">
              {filteredEmployees.length} resultados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Empleado</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Cedula</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Cargo</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Turno</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Horario</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Estado</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b last:border-0 hover:bg-accent/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {emp.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{emp.fullName}</p>
                          <p className="text-xs text-muted-foreground">{emp.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">{emp.cedula}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-sm">{emp.position}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {emp.isOnShift ? (
                        <div className="flex items-center gap-2">
                          <div className="status-dot status-dot-active" />
                          <span className="text-sm font-medium text-emerald-500">En turno</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="status-dot status-dot-inactive" />
                          <span className="text-sm text-muted-foreground">Fuera de turno</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {emp.isOnShift ? (
                        <div className="text-sm">
                          <span className="font-medium">{emp.shiftStart}</span>
                          <span className="text-muted-foreground"> - </span>
                          <span className="font-medium">{emp.shiftEnd}</span>
                          {emp.location && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {emp.location}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">--:--</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={emp.status} type="status" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewEmployee(emp)}
                        className="gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginatedEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No se encontraron empleados</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} de {filteredEmployees.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Pagina {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={selectedEmployee}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
