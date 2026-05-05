# HR Pro - Sistema de Gestion de Recursos Humanos

Un dashboard moderno y completo para la gestion de recursos humanos, construido con React + Vite + TypeScript + Tailwind CSS.

## Caracteristicas

### Vista Administrador
- **Dashboard**: Estadisticas generales, empleados en turno, reportes recientes
- **Empleados**: Listado completo con filtros (nombre, cedula, cargo, estado, departamento, turno), modal detallado con documentos, asistencias, cursos y solicitudes
- **Documentacion**: Seguimiento de documentos legales por empleado, estado de vigencia
- **Reportes**: Incidencias, faltas, documentos vencidos, reuniones, solicitudes
- **Contratacion**: Pipeline de candidatos, gestion de proceso de seleccion

### Vista Empleado
- **Mi Dashboard**: Resumen personal, horario semanal, cursos, actividad reciente
- **Asistencia**: Registro de entrada/salida con geolocalizacion, historial, agenda semanal
- **Cursos**: Catalogo de capacitacion por categoria (academico, tecnico, procesos, habilidades blandas)
- **Solicitudes**: Vacaciones, incapacidades, permisos con formulario de creacion

### Tecnologias
- React 19 + Vite 6 + TypeScript
- Tailwind CSS + shadcn/ui components
- Radix UI primitives
- React Router DOM
- Lucide React icons
- Recharts (listo para graficos)
- Zustand (listo para state management)

## Instalacion

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en navegador
# http://localhost:5173
```

## Uso

1. En la pantalla de login, selecciona **Administrador** o **Empleado**
2. Ingresa cualquier correo y contrasena (es demo)
3. Explora ambas vistas cambiando de rol

## Estructura del Proyecto

```
src/
  components/
    ui/           # Componentes base (Button, Card, Dialog, etc.)
    admin/        # Componentes especificos de admin
    employee/     # Componentes especificos de empleado
    shared/       # Sidebar, Layout, StatCard, StatusBadge
  pages/
    auth/         # Login
    admin/        # Dashboard, Empleados, Documentos, Reportes, Contratacion
    employee/     # Dashboard, Asistencia, Cursos, Solicitudes
  context/        # AuthContext
  data/           # Datos mock
  types/          # TypeScript interfaces
  lib/            # Utilidades
```

## Credenciales Demo

- **Admin**: Cualquier email + contrasena, seleccionar "Administrador"
- **Empleado**: Cualquier email + contrasena, seleccionar "Empleado"

## Scripts

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de produccion
- `npm run preview` - Preview de produccion
- `npm run lint` - Linter

## Licencia

MIT
