import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// import { Progress } from '@/components/ui/progress'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockCandidates } from '@/data/mockData'
import { formatDate, cn } from '@/lib/utils'
import {
  Search, UserPlus, Briefcase, Star, Mail, Phone, Calendar,
  Filter, TrendingUp, Users, CheckCircle2, XCircle, Clock,
  Award, FileText, MessageSquare, Eye
} from 'lucide-react'

export default function RecruitmentPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')

  const positions = useMemo(() => {
    const pos = new Set(mockCandidates.map(c => c.position))
    return Array.from(pos)
  }, [])

  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter(c => {
      const matchesSearch =
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.position.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter
      const matchesPosition = positionFilter === 'all' || c.position === positionFilter
      return matchesSearch && matchesStatus && matchesPosition
    })
  }, [searchQuery, statusFilter, positionFilter])

  const stats = useMemo(() => {
    const total = mockCandidates.length
    const new_ = mockCandidates.filter(c => c.status === 'new').length
    const screening = mockCandidates.filter(c => c.status === 'screening').length
    const interview = mockCandidates.filter(c => c.status === 'interview').length
    const offer = mockCandidates.filter(c => c.status === 'offer').length
    const hired = mockCandidates.filter(c => c.status === 'hired').length
    const rejected = mockCandidates.filter(c => c.status === 'rejected').length
    const avgRating = mockCandidates.reduce((acc, c) => acc + c.rating, 0) / total
    return { total, new_, screening, interview, offer, hired, rejected, avgRating }
  }, [])

  const pipelineStages = [
    { label: 'Nuevo', count: stats.new_, icon: UserPlus, color: 'bg-blue-500' },
    { label: 'Screening', count: stats.screening, icon: Filter, color: 'bg-amber-500' },
    { label: 'Entrevista', count: stats.interview, icon: MessageSquare, color: 'bg-violet-500' },
    { label: 'Oferta', count: stats.offer, icon: Award, color: 'bg-emerald-500' },
    { label: 'Contratado', count: stats.hired, icon: CheckCircle2, color: 'bg-primary' },
    { label: 'Rechazado', count: stats.rejected, icon: XCircle, color: 'bg-red-500' },
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'new': return { label: 'Nuevo', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' }
      case 'screening': return { label: 'Screening', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' }
      case 'interview': return { label: 'Entrevista', color: 'bg-violet-500/10 text-violet-500 border-violet-500/20' }
      case 'offer': return { label: 'Oferta', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' }
      case 'hired': return { label: 'Contratado', color: 'bg-primary/10 text-primary border-primary/20' }
      case 'rejected': return { label: 'Rechazado', color: 'bg-red-500/10 text-red-500 border-red-500/20' }
      default: return { label: status, color: 'bg-muted text-muted-foreground' }
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contratacion</h1>
          <p className="text-muted-foreground mt-1">
            Gestion de candidatos y proceso de seleccion
          </p>
        </div>
        <Button className="gradient-primary gap-2">
          <UserPlus className="w-4 h-4" />
          Nuevo Candidato
        </Button>
      </div>

      {/* Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Pipeline de Contratacion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {pipelineStages.map((stage, index) => {
              const Icon = stage.icon
              const percentage = stats.total > 0 ? (stage.count / stats.total) * 100 : 0
              return (
                <div key={stage.label} className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", stage.color)}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{stage.count}</p>
                      <p className="text-xs text-muted-foreground">{stage.label}</p>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", stage.color)}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {index < pipelineStages.length - 1 && (
                    <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-px bg-border" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Candidatos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.hired}</p>
              <p className="text-sm text-muted-foreground">Contratados</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.interview}</p>
              <p className="text-sm text-muted-foreground">En Entrevista</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Calificacion Promedio</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Candidatos
              <Badge variant="secondary" className="ml-2">{filteredCandidates.length}</Badge>
            </CardTitle>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar candidato..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="new">Nuevo</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="interview">Entrevista</SelectItem>
                  <SelectItem value="offer">Oferta</SelectItem>
                  <SelectItem value="hired">Contratado</SelectItem>
                  <SelectItem value="rejected">Rechazado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="w-[200px]">
                  <Briefcase className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los cargos</SelectItem>
                  {positions.map(pos => (
                    <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredCandidates.map((candidate) => {
            const statusConfig = getStatusConfig(candidate.status)
            return (
              <div
                key={candidate.id}
                className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border bg-card/50 hover:bg-accent/30 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white text-lg font-bold shrink-0">
                  {candidate.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{candidate.fullName}</h3>
                    <Badge variant="outline" className={cn("text-xs", statusConfig.color)}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{candidate.position}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {candidate.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {candidate.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(candidate.appliedDate)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {candidate.experience} exp.
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {candidate.skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  {candidate.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      "{candidate.notes}"
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={cn(
                          "w-4 h-4",
                          star <= candidate.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground"
                        )}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      Ver
                    </Button>
                    {candidate.status !== 'hired' && candidate.status !== 'rejected' && (
                      <Button variant="ghost" size="sm" className="gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        Evaluar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          {filteredCandidates.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No se encontraron candidatos</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
