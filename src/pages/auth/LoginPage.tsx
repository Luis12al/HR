import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, UserCog, User, Eye, EyeOff, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'admin' | 'employee' | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !email || !password) return

    setIsLoading(true)
    setTimeout(() => {
      login(email, password, selectedRole)
      navigate(selectedRole === 'admin' ? '/admin/dashboard' : '/employee/dashboard')
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4 shadow-lg shadow-primary/25">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">HR Pro</h1>
          <p className="text-muted-foreground mt-1">Sistema de Gestion de Recursos Humanos</p>
        </div>

        <Card className="glass-card border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Iniciar Sesion</CardTitle>
            <CardDescription className="text-center">
              Selecciona tu rol e ingresa tus credenciales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  selectedRole === 'admin'
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  selectedRole === 'admin' ? "gradient-primary" : "bg-muted"
                )}>
                  <UserCog className="w-6 h-6 text-white" />
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  selectedRole === 'admin' ? "text-primary" : "text-muted-foreground"
                )}>
                  Administrador
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('employee')}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                  selectedRole === 'employee'
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 hover:bg-accent"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  selectedRole === 'employee' ? "gradient-primary" : "bg-muted"
                )}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  selectedRole === 'employee' ? "text-primary" : "text-muted-foreground"
                )}>
                  Empleado
                </span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electronico</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contrasena</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary"
                size="lg"
                disabled={!selectedRole || isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Ingresar al Sistema'
                )}
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground">
              <p>Demo: Cualquier correo y contrasena funcionan</p>
              <p>Selecciona Admin o Empleado para ver ambas vistas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
