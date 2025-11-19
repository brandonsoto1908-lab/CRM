# Stone by Ric CRM

Sistema CRM construido con Next.js 14 y Supabase Auth.

## 🚀 Características

- ✅ Autenticación con Supabase
- ✅ Gestión de clientes, trabajadores, servicios y rutas
- ✅ Generación de facturas en PDF
- ✅ Sistema de finanzas
- ✅ Protección de rutas con sesión

## 📋 Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://rbmvltlazuchttyiffjc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_URL=https://rbmvltlazuchttyiffjc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
```

## 💻 Instalación Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

## 👤 Usuarios de Prueba

- **Email:** admin@ekofusioncr.com | **Password:** admin123
- **Email:** crm@stonebyric.com | **Password:** aaa

## 🌐 Despliegue en Vercel

### Paso 1: Preparar el Repositorio

```bash
# Asegúrate de tener todos los cambios commiteados
git add .
git commit -m "Preparar para despliegue en Vercel"
git push origin main
```

### Paso 2: Configurar Proyecto en Vercel

**Opción A: Dashboard de Vercel (Recomendado)**

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en **"Add New Project"**
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Next.js
5. **NO DESPLIEGUES TODAVÍA** - primero configura las variables de entorno

### Paso 3: Configurar Variables de Entorno

En el dashboard de Vercel, antes de desplegar:

1. Ve a la sección **"Environment Variables"**
2. Agrega las siguientes variables (una por una):

| Variable | Valor | Environments |
|----------|-------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://rbmvltlazuchttyiffjc.supabase.co` | ✅ Production ✅ Preview ✅ Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Tu anon key de Supabase | ✅ Production ✅ Preview ✅ Development |
| `SUPABASE_URL` | `https://rbmvltlazuchttyiffjc.supabase.co` | ✅ Production ✅ Preview ✅ Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Tu service role key de Supabase | ✅ Production ✅ Preview ✅ Development |

**⚠️ IMPORTANTE:** 
- El `SUPABASE_SERVICE_ROLE_KEY` es secreto, nunca lo compartas públicamente
- Obtén las keys desde el dashboard de Supabase: Project Settings → API

### Paso 4: Desplegar

Ahora sí, click en **"Deploy"** y Vercel:
1. Clonará tu repositorio
2. Instalará dependencias (`npm install`)
3. Ejecutará el build (`npm run build`)
4. Desplegará tu aplicación

### Paso 5: Verificar el Despliegue

1. Una vez desplegado, Vercel te dará una URL (ej: `tu-proyecto.vercel.app`)
2. Visita la URL y deberías ver la página de login
3. Usa las credenciales de prueba para verificar que todo funciona

## 🔧 Opción B: Desplegar con Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm i -g vercel

# Login en Vercel
vercel login

# Configurar variables de entorno (ejecutar para cada variable)
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Desplegar a producción
vercel --prod
```

## 📁 Estructura del Proyecto

```
├── components/        # Componentes React (formularios)
├── pages/            # Páginas y API routes
│   ├── api/          # Endpoints de backend
│   │   ├── session.js    # Maneja cookies de sesión
│   │   ├── me.js         # Verifica autenticación
│   │   ├── logout.js     # Cierra sesión
│   │   ├── clients/      # CRUD de clientes
│   │   ├── workers/      # CRUD de trabajadores
│   │   ├── services/     # CRUD de servicios
│   │   ├── routes/       # CRUD de rutas
│   │   └── invoices/     # CRUD y generación de PDFs
│   ├── login.js      # Página de login
│   └── _app.js       # App wrapper con auth check
├── lib/              # Utilidades y clientes
│   ├── supabaseClient.js        # Cliente público (browser)
│   └── supabaseServerClient.js  # Cliente servidor (API routes)
├── scripts/          # Scripts de utilidad
│   ├── create-test-user.js
│   └── create-admin-ekofusion.js
├── styles/           # Estilos globales (Tailwind CSS)
└── vercel.json       # Configuración de Vercel
```

## 🏗️ Arquitectura de Autenticación

1. **Login (Cliente):**
   - Usuario ingresa credenciales en `/login`
   - Se llama a `supabase.auth.signInWithPassword()`
   - Supabase devuelve `access_token` y `refresh_token`

2. **Guardar Sesión (Servidor):**
   - Cliente envía tokens a `/api/session`
   - Servidor valida tokens con Supabase
   - Servidor guarda tokens en cookies HTTP-only seguras

3. **Verificar Sesión:**
   - `_app.js` llama a `/api/me` al cargar cada página
   - `/api/me` lee la cookie y valida con Supabase
   - Si válido: permite acceso
   - Si inválido: redirige a `/login`

## 🛠️ Scripts Útiles

```bash
# Crear usuarios de prueba
node scripts/create-test-user.js
node scripts/create-admin-ekofusion.js

# Ver estructura del proyecto
tree /F
```

## ⚠️ Solución de Problemas

### Error 401 en /api/me después de login
**Causa:** Las cookies no se están guardando correctamente

**Solución:**
1. Verifica que el service role key sea correcto
2. Revisa los logs del servidor (`npm run dev`)
3. Verifica que las cookies se estén estableciendo en el navegador (DevTools → Application → Cookies)

### Error "Invalid login credentials"
**Causa:** El usuario no existe o la contraseña es incorrecta

**Solución:**
1. Verifica que el usuario exista en Supabase Auth (Dashboard → Authentication → Users)
2. Usa los scripts para crear usuarios de prueba
3. Verifica que estés usando el email completo (no solo el username)

### Error de CORS en Supabase
**Causa:** Tu dominio de Vercel no está en la lista de URLs permitidas

**Solución:**
1. Ve al dashboard de Supabase
2. Project Settings → API → URL Configuration
3. Agrega tu dominio de Vercel (ej: `https://tu-proyecto.vercel.app`)

### Build falla en Vercel
**Causa:** Variables de entorno no configuradas o errores de compilación

**Solución:**
1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs de build en Vercel
3. Ejecuta `npm run build` localmente para ver errores

## 📝 Checklist Pre-Despliegue

- [ ] Todos los cambios están commiteados y pusheados
- [ ] `.env.local` tiene todas las variables correctas
- [ ] `npm run build` funciona sin errores localmente
- [ ] Has probado el login localmente
- [ ] Tienes las keys de Supabase (anon y service role)
- [ ] Has creado al menos un usuario de prueba

## 🔐 Seguridad

- ✅ Service role key solo se usa en servidor (API routes)
- ✅ Cookies HTTP-only para tokens
- ✅ Validación de tokens en cada request
- ✅ Variables sensibles no expuestas al cliente
- ✅ CORS configurado correctamente

## 📞 Soporte

Si tienes problemas, verifica:
1. Los logs del servidor (`npm run dev`)
2. La consola del navegador (F12)
3. Los logs de Vercel (Dashboard → Deployments → View Function Logs)

## 🎉 ¡Listo!

Una vez desplegado, tu CRM estará disponible en la URL de Vercel. Comparte la URL con tu equipo y usa las credenciales de prueba para verificar que todo funciona correctamente.