import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { mockEmployees } from '@/data/mockData'
import { useAuth } from '@/context/AuthContext'
import { formatDate, formatTime, cn } from '@/lib/utils'
import {
  Clock, MapPin, Calendar, CheckCircle2, AlertTriangle,
  LogIn, LogOut, History, Sun, Moon
} from 'lucide-react'

export default function AttendancePage() {
  const { user } = useAuth()
  const [employee, setEmployee] = useState(mockEmployees.find(e => e.id === user?.employeeId) || mockEmployees[1])
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every second
  useState(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  })

  const today = new Date().toISOString().split('T')[0]
  const todayAttendance = employee.attendance.find(a => a.date === today)
  const isOnShift = employee.isOnShift

  const handleCheckIn = () => {
    setIsCheckingIn(true)
    setTimeout(() => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
      const isLate = timeStr > '09:05'

      const newAttendance = {
        id: `att-${Date.now()}`,
        date: today,
        checkIn: timeStr,
        location: 'Oficina Principal - Piso 2',
        isLate,
      }

      setEmployee(prev => ({
        ...prev,
        isOnShift: true,
        shiftStart: timeStr,
        shiftEnd: '18:00',
        location: 'Oficina Principal - Piso 2',
        attendance: [newAttendance, ...prev.attendance]
      }))
      setIsCheckingIn(false)
    }, 1500)
  }

  const handleCheckOut = () => {
    setIsCheckingIn(true)
    setTimeout(() => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })

      setEmployee(prev => ({
        ...prev,
        isOnShift: false,
        shiftEnd: timeStr,
        attendance: prev.attendance.map(a =>
          a.date === today ? { ...a, checkOut: timeStr } : a
        )
      }))
      setIsCheckingIn(false)
    }, 1500)
  }

  const weekDays = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']
  const scheduleMap: Record<string, keyof typeof employee.schedule> = {
    'Lunes': 'monday', 'Martes': 'tuesday', 'Miercoles': 'wednesday',
    'Jueves': 'thursday', 'Viernes': 'friday', 'Sabado': 'saturday', 'Domingo': 'sunday'
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Registro de Asistencia</h1>
        <p className="text-muted-foreground mt-1">
          Controla tu entrada y salida del turno
        </p>
      </div>

      {/* Main Clock Card */}
      <Card className="overflow-hidden">
        <div className="gradient-primary p-8 text-center text-white">
          <p className="text-sm opacity-80 mb-2">{formatDate(currentTime)}</p>
          <p className="text-6xl font-bold tracking-tight font-mono">
            {formatTime(currentTime)}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {currentTime.getHours() >= 6 && currentTime.getHours() < 18 ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            <span className="text-sm opacity-80">
              {currentTime.getHours() >= 6 && currentTime.getHours() < 12
                ? 'Buenos dias'
                : currentTime.getHours() >= 12 && currentTime.getHours() < 18
                ? 'Buenas tardes'
                : 'Buenas noches'}
              , {employee.fullName.split(' ')[0]}
            </span>
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center",
                isOnShift ? "bg-emerald-500/10" : "bg-muted"
              )}>
                <Clock className={cn("w-8 h-8", isOnShift ? "text-emerald-500" : "text-muted-foreground")} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Estado Actual</p>
                <p className={cn(
                  "text-2xl font-bold",
                  isOnShift ? "text-emerald-500" : "text-muted-foreground"
                )}>
                  {isOnShift ? 'En Turno' : 'Fuera de Turno'}
                </p>
                {isOnShift && employee.shiftStart && (
                  <p className="text-sm text-muted-foreground">
                    Desde: {employee.shiftStart}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isOnShift ? (
                <Button
                  size="lg"
                  className="gradient-success gap-2 h-14 px-8 text-lg"
                  onClick={handleCheckIn}
                  disabled={isCheckingIn}
                >
                  {isCheckingIn ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <LogIn className="w-5 h-5" />
                  )}
                  Registrar Entrada
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="destructive"
                  className="gap-2 h-14 px-8 text-lg"
                  onClick={handleCheckOut}
                  disabled={isCheckingIn}
                >
                  {isCheckingIn ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <LogOut className="w-5 h-5" />
                  )}
                  Registrar Salida
                </Button>
              )}
            </div>
          </div>

          {todayAttendance && (
            <div className="mt-6 p-4 rounded-xl bg-muted/50 border">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <History className="w-4 h-4" />
                Registro de Hoy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoItem icon={Clock} label="Hora de Entrada" value={todayAttendance.checkIn} />
                <InfoItem icon={MapPin} label="Ubicacion" value={todayAttendance.location || 'No registrada'} />
                <InfoItem icon={Calendar} label="Fecha" value={formatDate(todayAttendance.date)} />
                {todayAttendance.checkOut && (
                  <InfoItem icon={Clock} label="Hora de Salida" value={todayAttendance.checkOut} />
                )}
              </div>
              {todayAttendance.isLate && (
                <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-500">Llegada tarde registrada</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Mi Agenda Semanal
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
                  "flex items-center justify-between p-4 rounded-xl border transition-all",
                  isToday ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-card/50 hover:bg-accent/30",
                  !schedule.enabled && "opacity-50"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold",
                    isToday ? "gradient-primary text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {day.slice(0, 2)}
                  </div>
                  <div>
                    <p className={cn("font-medium", isToday && "text-primary")}>
                      {day}
                      {isToday && <Badge variant="outline" className="ml-2 text-xs">Hoy</Badge>}
                    </p>
                    {schedule.enabled && (
                      <p className="text-xs text-muted-foreground">
                        Horario: {schedule.start} - {schedule.end}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  {schedule.enabled ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm font-medium text-emerald-500">Laborable</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Descanso</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Historial de Asistencias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {employee.attendance.map((att) => (
            <div
              key={att.id}
              className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  att.isLate ? "bg-red-500/10" : "bg-emerald-500/10"
                )}>
                  <Clock className={cn("w-5 h-5", att.isLate ? "text-red-500" : "text-emerald-500")} />
                </div>
                <div>
                  <p className="font-medium text-sm">{formatDate(att.date)}</p>
                  <p className="text-xs text-muted-foreground">
                    Entrada: {att.checkIn}
                    {att.checkOut && ` - Salida: ${att.checkOut}`}
                    {att.location && ` - ${att.location}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {att.isLate ? (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Tarde
                  </Badge>
                ) : (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    A tiempo
                  </Badge>
                )}
              </div>
            </div>
          ))}
          {employee.attendance.length === 0 && (
            <p className="text-muted-foreground text-center py-8">Sin registros de asistencia</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}
