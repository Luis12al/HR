import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { mockEmployees, mockCourses } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import {
  Clock, Calendar, BookOpen, FileQuestion, BarChart3
} from 'lucide-react'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const employee = mockEmployees.find(e => e.id === user?.employeeId) || mockEmployees[1]
  const myCourses = mockCourses.slice(0, 3)
  // const completedCourses = myCourses.filter(c => c.status === 'completed').length
  const inProgressCourses = myCourses.filter(c => c.status === 'in_progress').length

  const today = new Date().toISOString().split('T')[0]
  const todayAttendance = employee.attendance.find(a => a.date === today)

  const weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
  const scheduleMap: Record<string, keyof typeof employee.schedule> = {
    'Lunes': 'monday', 'Martes': 'tuesday', 'Miercoles': 'wednesday',
    'Jueves': 'thursday', 'Viernes': 'friday', 'Sabado': 'saturday', 'Domingo': 'sunday'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hola, {employee.fullName.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido a tu portal de empleado
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">{formatDate(new Date())}</p>
          <Badge variant={employee.isOnShift ? 'success' : 'secondary'} className="mt-1">
            {employee.isOnShift ? 'En turno' : 'Fuera de turno'}
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{todayAttendance ? todayAttendance.checkIn : '--:--'}</p>
              <p className="text-sm text-muted-foreground">Entrada Hoy</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employee.attendance.length}</p>
              <p className="text-sm text-muted-foreground">Asistencias Este Mes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProgressCourses}</p>
              <p className="text-sm text-muted-foreground">Cursos en Progreso</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <FileQuestion className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{employee.requests.length}</p>
              <p className="text-sm text-muted-foreground">Solicitudes Activas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Mi Horario Semanal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weekDays.map((day, index) => {
              const scheduleKey = scheduleMap[day]
              const schedule = employee.schedule[scheduleKey]
              const isToday = new Date().getDay() === (index + 1) % 7
              return (
                <div
                  key={day}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-colors",
                    isToday ? "bg-primary/5 border-primary/20" : "bg-card/50 hover:bg-accent/30",
                    !schedule.enabled && "opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                      isToday ? "gradient-primary text-white" : "bg-muted text-muted-foreground"
                    )}>
                      {day.slice(0, 2)}
                    </div>
                    <span className={cn("font-medium", isToday && "text-primary")}>
                      {day}
                      {isToday && <span className="text-xs ml-1 text-primary">(Hoy)</span>}
                    </span>
                  </div>
                  <div className="text-right">
                    {schedule.enabled ? (
                      <span className="text-sm font-medium">
                        {schedule.start} - {schedule.end}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Descanso</span>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* My Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Mis Cursos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myCourses.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl border bg-card/50 hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">{course.instructor}</p>
                  </div>
                  <Badge variant={course.status === 'completed' ? 'success' : course.status === 'in_progress' ? 'warning' : 'secondary'}>
                    {course.status === 'completed' ? 'Completado' : course.status === 'in_progress' ? 'En Progreso' : 'Disponible'}
                  </Badge>
                </div>
                <Progress value={course.progress} className="mb-1" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{course.progress}% completado</span>
                  <span className="text-xs text-muted-foreground">{course.duration}</span>
                </div>
              </div>
            ))}
            {myCourses.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No tienes cursos asignados</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Actividad Reciente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {employee.attendance.slice(0, 3).map((att) => (
            <div key={att.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                att.isLate ? "bg-red-500/10" : "bg-emerald-500/10"
              )}>
                <Clock className={cn("w-5 h-5", att.isLate ? "text-red-500" : "text-emerald-500")} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Registro de asistencia</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(att.date)} - Entrada: {att.checkIn}
                  {att.checkOut && ` - Salida: ${att.checkOut}`}
                </p>
              </div>
              {att.isLate ? (
                <Badge variant="destructive">Tarde</Badge>
              ) : (
                <Badge variant="success">A tiempo</Badge>
              )}
            </div>
          ))}
          {employee.requests.slice(0, 2).map((req) => (
            <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <FileQuestion className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm capitalize">Solicitud de {req.type}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(req.startDate)} - {formatDate(req.endDate)}
                </p>
              </div>
              <Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'destructive' : 'warning'}>
                {req.status === 'approved' ? 'Aprobada' : req.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
              </Badge>
            </div>
          ))}
          {employee.attendance.length === 0 && employee.requests.length === 0 && (
            <p className="text-muted-foreground text-center py-8">Sin actividad reciente</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...inputs: (string | undefined | false)[]) {
  return inputs.filter(Boolean).join(' ')
}
