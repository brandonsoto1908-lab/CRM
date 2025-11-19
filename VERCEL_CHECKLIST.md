# ✅ Checklist para Desplegar en Vercel

## Pre-requisitos
- [ ] Cuenta en Vercel (https://vercel.com)
- [ ] Repositorio en GitHub con los cambios más recientes
- [ ] Cuenta en Supabase con el proyecto configurado

## 1. Verificar Variables de Entorno Locales

Tu archivo `.env.local` debe tener:
```
NEXT_PUBLIC_SUPABASE_URL=https://rbmvltlazuchttyiffjc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
SUPABASE_URL=https://rbmvltlazuchttyiffjc.supabase.co
SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]
```

- [ ] Archivo `.env.local` existe
- [ ] Todas las variables están configuradas
- [ ] Service role key es diferente al anon key

## 2. Verificar Build Local

```bash
npm run build
```

- [ ] Build se completa sin errores
- [ ] No hay warnings críticos

## 3. Verificar Funcionalidad Local

```bash
npm run dev
```

- [ ] Aplicación corre en http://localhost:3000
- [ ] Página de login carga correctamente
- [ ] Puedes hacer login con: admin@ekofusioncr.com / admin123
- [ ] Después del login, puedes ver el dashboard
- [ ] No hay errores 401 en la consola después del login

## 4. Preparar Repositorio

```bash
# Ver estado actual
git status

# Agregar todos los cambios
git add .

# Commitear
git commit -m "Preparar para despliegue en Vercel con Supabase Auth"

# Push a GitHub
git push origin main
```

- [ ] Todos los cambios están commiteados
- [ ] Push a GitHub exitoso
- [ ] `.env.local` NO está en el repositorio (debe estar en .gitignore)

## 5. Obtener Keys de Supabase

Ve a tu proyecto en Supabase: https://app.supabase.com

1. **Project Settings → API**
2. Copia las siguientes keys:

- [ ] `URL` de la sección "Project URL"
- [ ] `anon public` key
- [ ] `service_role` key (mantener secreta)

## 6. Configurar Proyecto en Vercel

### A. Crear Nuevo Proyecto

1. Ve a https://vercel.com/dashboard
2. Click en **"Add New..."** → **"Project"**
3. Selecciona tu repositorio de GitHub
4. Vercel detectará Next.js automáticamente

- [ ] Proyecto importado correctamente
- [ ] Framework detectado: "Next.js"

### B. Configurar Variables de Entorno

**ANTES de hacer deploy**, en la sección "Environment Variables":

Agrega estas 4 variables (selecciona Production, Preview y Development para cada una):

1. **Variable:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** `https://rbmvltlazuchttyiffjc.supabase.co`
   - [ ] Agregada

2. **Variable:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** [tu anon key de Supabase]
   - [ ] Agregada

3. **Variable:** `SUPABASE_URL`
   - **Value:** `https://rbmvltlazuchttyiffjc.supabase.co`
   - [ ] Agregada

4. **Variable:** `SUPABASE_SERVICE_ROLE_KEY`
   - **Value:** [tu service role key de Supabase]
   - [ ] Agregada

## 7. Desplegar

- [ ] Click en **"Deploy"**
- [ ] Esperar a que termine el build (2-5 minutos)
- [ ] Build completado exitosamente

## 8. Verificar Despliegue

Una vez desplegado, Vercel te dará una URL (ej: `https://tu-proyecto.vercel.app`)

- [ ] URL del proyecto copiada
- [ ] Página carga correctamente
- [ ] Página de login se muestra
- [ ] Puedes hacer login con las credenciales de prueba
- [ ] Después del login, puedes navegar por la aplicación
- [ ] No hay errores en la consola del navegador

## 9. Configurar Dominio (Opcional)

Si tienes un dominio personalizado:

1. En Vercel: Settings → Domains
2. Agregar tu dominio
3. Configurar DNS según las instrucciones

- [ ] Dominio configurado (si aplica)

## 10. Post-Despliegue

### A. Actualizar CORS en Supabase

1. Ve a Supabase Dashboard → Project Settings → API
2. En "Additional Allowed Origins", agrega:
   - Tu URL de Vercel: `https://tu-proyecto.vercel.app`
   - Tu dominio personalizado (si lo tienes)

- [ ] URLs agregadas en Supabase

### B. Probar en Producción

- [ ] Login funciona
- [ ] Crear cliente funciona
- [ ] Crear trabajador funciona
- [ ] Crear servicio funciona
- [ ] Generar factura funciona
- [ ] Logout funciona

## 11. Monitoreo

- [ ] Revisar logs en Vercel: Dashboard → Deployments → View Function Logs
- [ ] Configurar notificaciones de error (opcional)
- [ ] Agregar analytics (opcional)

## ⚠️ Problemas Comunes

### Build falla
- Verificar que todas las variables de entorno estén configuradas
- Revisar los logs de build en Vercel

### Error 401 después del login
- Verificar que el service role key sea correcto
- Verificar que las cookies se estén estableciendo (DevTools → Application → Cookies)

### CORS error
- Agregar la URL de Vercel en la configuración de Supabase

## 📞 Soporte

Si algo no funciona:
1. Revisa los logs en Vercel
2. Revisa la consola del navegador (F12)
3. Verifica que todas las variables de entorno estén correctas

## ✅ ¡Listo!

Si todos los checks están marcados, tu aplicación está desplegada y funcionando correctamente en Vercel.

URL de tu aplicación: _______________________________

Usuarios de prueba:
- admin@ekofusioncr.com / admin123
- crm@stonebyric.com / aaa