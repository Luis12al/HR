import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { mockCourses } from '@/data/mockData'
import { formatDate, cn } from '@/lib/utils'
import {
  BookOpen, Clock, Award, GraduationCap, User, Calendar,
  Play, CheckCircle2
} from 'lucide-react'

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredCourses = mockCourses.filter(course => {
    if (activeTab === 'all') return true
    if (activeTab === 'academic') return course.category === 'academic'
    if (activeTab === 'technical') return course.category === 'technical'
    if (activeTab === 'process') return course.category === 'process'
    if (activeTab === 'soft_skills') return course.category === 'soft_skills'
    if (activeTab === 'available') return course.status === 'available'
    if (activeTab === 'in_progress') return course.status === 'in_progress'
    if (activeTab === 'completed') return course.status === 'completed'
    return true
  })

  const stats = {
    total: mockCourses.length,
    available: mockCourses.filter(c => c.status === 'available').length,
    inProgress: mockCourses.filter(c => c.status === 'in_progress').length,
    completed: mockCourses.filter(c => c.status === 'completed').length,
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'academic': return 'Academico'
      case 'technical': return 'Tecnico'
      case 'process': return 'Procesos'
      case 'soft_skills': return 'Habilidades Blandas'
      default: return cat
    }
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'academic': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'technical': return 'bg-violet-500/10 text-violet-500 border-violet-500/20'
      case 'process': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      case 'soft_skills': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cursos</h1>
        <p className="text-muted-foreground mt-1">
          Capacitacion y desarrollo profesional
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Cursos</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Play className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.available}</p>
              <p className="text-sm text-muted-foreground">Disponibles</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inProgress}</p>
              <p className="text-sm text-muted-foreground">En Progreso</p>
            </div>
          </CardContent>
        </Card>
        <Card className="hover-lift">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs & Course List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Catalogo de Cursos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 mb-6">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="available">Disponibles</TabsTrigger>
              <TabsTrigger value="in_progress">En Progreso</TabsTrigger>
              <TabsTrigger value="completed">Completados</TabsTrigger>
              <TabsTrigger value="academic">Academico</TabsTrigger>
              <TabsTrigger value="technical">Tecnico</TabsTrigger>
              <TabsTrigger value="process">Procesos</TabsTrigger>
              <TabsTrigger value="soft_skills">Habilidades</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-xl border bg-card/50 hover:bg-accent/30 transition-all duration-200"
                >
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{course.title}</h3>
                      <Badge variant="outline" className={cn("text-xs", getCategoryColor(course.category))}>
                        {getCategoryLabel(course.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {course.instructor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </span>
                      {course.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(course.startDate)}
                        </span>
                      )}
                    </div>
                    {course.status !== 'available' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Progreso</span>
                          <span className="text-xs font-medium">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {course.status === 'completed' && (
                      <div className="flex items-center gap-1 text-amber-500">
                        <Award className="w-5 h-5" />
                        <span className="text-sm font-medium">Completado</span>
                      </div>
                    )}
                    {course.status === 'in_progress' && (
                      <Badge variant="warning">En Progreso</Badge>
                    )}
                    {course.status === 'available' && (
                      <Button size="sm" className="gradient-primary gap-1">
                        <Play className="w-3.5 h-3.5" />
                        Iniciar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No se encontraron cursos</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
