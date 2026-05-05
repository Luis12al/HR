import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import Layout from '@/components/shared/Layout'
import LoginPage from '@/pages/auth/LoginPage'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import EmployeesPage from '@/pages/admin/EmployeesPage'
import DocumentsPage from '@/pages/admin/DocumentsPage'
import ReportsPage from '@/pages/admin/ReportsPage'
import RecruitmentPage from '@/pages/admin/RecruitmentPage'
import EmployeeDashboard from '@/pages/employee/EmployeeDashboard'
import AttendancePage from '@/pages/employee/AttendancePage'
import CoursesPage from '@/pages/employee/CoursesPage'
import RequestsPage from '@/pages/employee/RequestsPage'

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole?: 'admin' | 'employee' }) {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace /> : <LoginPage />
      } />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRole="admin">
          <Layout>
            <Routes>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="recruitment" element={<RecruitmentPage />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Employee Routes */}
      <Route path="/employee/*" element={
        <ProtectedRoute allowedRole="employee">
          <Layout>
            <Routes>
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="attendance" element={<AttendancePage />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="requests" element={<RequestsPage />} />
              <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
            </Routes>
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
