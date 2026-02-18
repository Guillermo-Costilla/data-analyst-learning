# Plataforma de Aprendizaje SQL Interactiva 🚀

Una aplicación Full Stack diseñada para aprender SQL Server orientado al análisis de datos, con teoría, ejercicios prácticos y retroalimentación inteligente impulsada por IA.

## principales características

- 📚 **9 Módulos Completos**: Desde DDL/DML hasta Modelado de Datos (Estrella) y Window Functions.
- ✍️ **Editor SQL Interactivo**: Basado en Monaco Editor (VS Code) con resaltado de sintaxis.
- 🤖 **Feedback con IA**: Análisis instantáneo de consultas usando GPT-4o-mini.
- 📝 **Pruebas Técnicas**: Evaluaciones de opción múltiple al final de cada módulo.
- 📊 **Enfoque en Análisis**: Ejercicios basados en casos reales de análisis de datos.
- 🎨 **Diseño Premium**: Interfaz moderna con modo oscuro, animaciones (Framer Motion) y estética limpia.

## Tecnologías Utilizadas

### Frontend
- **React 19** + **TypeScript**
- **Vite** (Build tool)
- **Tailwind CSS 4** (Styling)
- **Framer Motion** (Animaciones)
- **Lucide React** (Iconos)
- **Monaco Editor**

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **OpenAI API** (Análisis de SQL)
- **SQLite (Turso)** (Base de datos local/remota)
- **JWT** (Autenticación)

## Estructura del Proyecto

```
├── api/             # Punto de entrada para Vercel Functions
├── client/          # Aplicación Frontend (React)
├── server/          # Servidor Backend (Express)
├── vercel.json      # Configuración de despliegue en Vercel
└── package.json     # Gestión de monorepo
```

## Configuración Local

1. **Clonar el repositorio**:
   ```bash
   git clone <URL_DEL_REPO>
   cd data-analyst-learning
   ```

2. **Instalar dependencias**:
   ```bash
   npm run install-all
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env` en la carpeta `server/` con:
   ```env
   TURSO_DATABASE_URL=file:./local.db
   OPENAI_API_KEY=tu_clave_aqui
   JWT_SECRET=una_frase_secreta_larga
   PORT=3000
   ```

4. **Ejecutar en desarrollo**:
   - En una terminal: `cd client && npm run dev`
   - En otra terminal: `cd server && npm run dev`

## Despliegue en Vercel

El proyecto está configurado para despliegue automático en Vercel mediante el archivo `vercel.json`. Solo asegúrate de configurar las variables de entorno en el dashboard de Vercel.

---
Desarrollado para aprendizaje interactivo de SQL.
