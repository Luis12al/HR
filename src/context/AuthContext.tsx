import { createContext, useContext, useState, type ReactNode } from 'react'
import type { User } from '@/types'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: 'admin' | 'employee') => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, _password: string, role: 'admin' | 'employee') => {
    const mockUser: User = {
      id: role === 'admin' ? 'admin-001' : 'emp-002',
      email,
      role,
      name: role === 'admin' ? 'Administrador del Sistema' : 'Carlos Andrés Rodríguez Martínez',
      employeeId: role === 'employee' ? 'emp-002' : undefined,
    }
    setUser(mockUser)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}
