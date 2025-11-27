# 🏋️ Sistema de Gestión de Gimnasio

Sistema completo de gestión para gimnasios desarrollado con Next.js, TypeScript, Prisma y SQLite. Incluye gestión de estudiantes, planes de entrenamiento, plantillas de ejercicios y seguimiento de progreso.

## ✨ Características

### 👨‍🏫 Dashboard del Profesor
- ✅ Gestión completa de estudiantes
- ✅ Creación y asignación de planes de entrenamiento personalizados
- ✅ Sistema de plantillas reutilizables de ejercicios
- ✅ **100+ ejercicios precargados** organizados por grupos musculares
- ✅ Búsqueda de ejercicios con autocompletado
- ✅ Seguimiento de pagos y membresías
- ✅ Visualización del progreso de estudiantes

### 👨‍🎓 Dashboard del Estudiante
- ✅ Visualización del plan de entrenamiento del día
- ✅ Seguimiento de ejercicios completados
- ✅ Registro de progreso diario
- ✅ Visualización de información de ejercicios
- ✅ Estado de membresía y pagos

### 💪 Base de Datos de Ejercicios
El sistema incluye **100+ ejercicios** precargados extraídos de fuentes profesionales, organizados en 8 grupos musculares:

- **Pectorales** (12 ejercicios)
- **Espalda** (23 ejercicios)
- **Hombros** (19 ejercicios)
- **Bíceps** (14 ejercicios)
- **Tríceps** (13 ejercicios)
- **Abdominales** (9 ejercicios)
- **Piernas** (30 ejercicios)
- **Gemelos** (2 ejercicios)

Cada ejercicio incluye:
- Nombre descriptivo
- Descripción detallada
- Grupo muscular
- Equipo necesario
- Nivel de dificultad (Principiante/Intermedio/Avanzado)

## 🚀 Tecnologías

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Base de datos**: SQLite con Prisma ORM
- **Autenticación**: NextAuth.js
- **Estilos**: Bootstrap 5
- **Validación**: Zod

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/lucashmercado/gym_app.git
cd gym_app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="tu-secret-super-seguro-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

> **Nota**: Para generar un `NEXTAUTH_SECRET` seguro, puedes usar:
> ```bash
> openssl rand -base64 32
> ```

### 4. Configurar la base de datos

```bash
# Ejecutar migraciones
npx prisma migrate dev

# Cargar los 100+ ejercicios en la base de datos
npx tsx prisma/seed-exercises.ts
```

### 5. Ejecutar el proyecto

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:3000`

## 📁 Estructura del Proyecto

```
gym_system/
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Autenticación
│   │   ├── professor/            # Endpoints del profesor
│   │   └── student/              # Endpoints del estudiante
│   ├── dashboard/                # Dashboards
│   │   ├── professor/            # Dashboard del profesor
│   │   └── student/              # Dashboard del estudiante
│   └── page.tsx                  # Página de inicio
├── components/                   # Componentes reutilizables
├── prisma/                       # Configuración de Prisma
│   ├── schema.prisma             # Esquema de la base de datos
│   └── seed-exercises.ts         # Script para cargar ejercicios
├── public/                       # Archivos estáticos
└── lib/                          # Utilidades y configuración
```

## 🗄️ Modelo de Datos

### Entidades Principales

- **User**: Usuarios del sistema (profesores y estudiantes)
- **Student**: Información extendida de estudiantes
- **Exercise**: Catálogo de ejercicios
- **Template**: Plantillas de entrenamiento reutilizables
- **Plan**: Planes de entrenamiento asignados a estudiantes
- **Payment**: Registro de pagos de membresías
- **Progress**: Seguimiento del progreso de estudiantes

## 🎯 Uso

### Crear un Usuario Profesor

1. Registrarse en la aplicación
2. El primer usuario será asignado como profesor automáticamente
3. Acceder al dashboard del profesor

### Crear un Estudiante

1. Desde el dashboard del profesor, ir a "Estudiantes"
2. Click en "Nuevo Estudiante"
3. Completar el formulario con los datos del estudiante
4. Asignar una membresía

### Crear una Plantilla de Entrenamiento

1. Ir a "Plantillas" en el dashboard del profesor
2. Click en "Nueva Plantilla"
3. Agregar ejercicios usando el buscador con autocompletado
4. Configurar series, repeticiones, peso y tiempo de descanso
5. Guardar la plantilla

### Asignar un Plan de Entrenamiento

1. Ir a "Planes" en el dashboard del profesor
2. Click en "Nuevo Plan"
3. Seleccionar el estudiante
4. Elegir una plantilla o crear ejercicios personalizados
5. Asignar el plan

### Seguimiento del Progreso

Los estudiantes pueden:
- Ver su plan del día en el dashboard
- Marcar ejercicios como completados
- Ver su historial de progreso

Los profesores pueden:
- Ver el progreso de todos sus estudiantes
- Modificar planes según el avance
- Gestionar pagos y membresías

## 🔐 Autenticación

El sistema utiliza NextAuth.js con autenticación por credenciales. Los roles disponibles son:

- **PROFESSOR**: Acceso completo al sistema de gestión
- **STUDENT**: Acceso al dashboard de estudiante y seguimiento de progreso

## 🎨 Personalización

### Agregar Nuevos Ejercicios

Puedes agregar ejercicios de dos formas:

1. **Desde la interfaz**: Dashboard del profesor → Ejercicios → Nuevo Ejercicio
2. **Mediante seed**: Editar `prisma/seed-exercises.ts` y ejecutar el script

### Modificar Grupos Musculares

Los grupos musculares están definidos en el modelo de datos. Para agregar nuevos grupos:

1. Actualizar el modelo en `prisma/schema.prisma`
2. Ejecutar `npx prisma migrate dev`
3. Actualizar los ejercicios según sea necesario

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno
3. Cambiar la base de datos a PostgreSQL o MySQL para producción
4. Desplegar

### Variables de Entorno para Producción

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NEXTAUTH_SECRET="secret-super-seguro-para-produccion"
NEXTAUTH_URL="https://tu-dominio.com"
```

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Ejecutar en producción
npm start

# Linting
npm run lint

# Prisma Studio (visualizar base de datos)
npx prisma studio

# Cargar ejercicios
npx tsx prisma/seed-exercises.ts
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

**Lucas Mercado**
- GitHub: [@lucashmercado](https://github.com/lucashmercado)

## 🙏 Agradecimientos

- Ejercicios extraídos y adaptados de [Simply Fitness](https://www.simplyfitness.com)
- Comunidad de Next.js y Prisma

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
