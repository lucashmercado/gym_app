# Gym Management System

Sistema completo de gestión de gimnasios con roles, permisos, y administración.

## 🚀 Deploy en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TU_USUARIO/gym_system)

## 📋 Requisitos

- Node.js 18+
- PostgreSQL (Supabase recomendado)

## 🔧 Configuración

1. Clona el repositorio
2. Instala dependencias: `npm install`
3. Configura variables de entorno (ver `.env.example`)
4. Ejecuta migraciones: `npx prisma migrate deploy`
5. Crea usuario admin: `node scripts/create-admin.js`
6. Inicia el servidor: `npm run dev`

## 🔐 Credenciales por Defecto

**Usuario Administrador:**
- Email: `admin@gym.com`
- Contraseña: `admin123`

> ⚠️ Cambia la contraseña después del primer inicio de sesión.

## 🌐 Variables de Entorno

```env
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_APP_URL="https://tu-dominio.vercel.app"
```

## 📱 Características

- 🔐 Sistema de autenticación y roles
- 👥 Gestión de usuarios y estudiantes
- 🏋️ Planes de entrenamiento personalizados
- 💳 Control de pagos y membresías
- 📊 Dashboard con estadísticas
- 📤 Exportación a Excel
- 💬 Sistema de mensajes
- 🔔 Notificaciones

## 🛠️ Tecnologías

- Next.js 15
- TypeScript
- Prisma ORM
- PostgreSQL
- Bootstrap 5

## 📄 Licencia

MIT
