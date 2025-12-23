# Debug de Analytics

## Cambios Realizados

### 1. ✅ Evitar duplicados en la misma sesión
Ahora el sistema usa `sessionStorage` para rastrear qué eventos ya se registraron en la sesión actual:

- **page_view**: Solo se registra la primera vez que visitas una página
- **product_view**: Solo se registra la primera vez que ves un producto
- **presentacion_view**: Solo se registra la primera vez que ves una presentación
- **whatsapp_click**: Se registra CADA vez (porque es una acción importante)

### 2. Diferencia entre localStorage y sessionStorage

- **localStorage**: Persiste incluso cuando cierras el navegador
  - Se usa para: `analytics_session_id` (mantener la misma sesión)

- **sessionStorage**: Se borra cuando cierras la pestaña/navegador
  - Se usa para: `analytics_tracked_events` (eventos registrados)

## Cómo Probar

### Opción 1: Abrir en nueva pestaña (Recomendado)

1. Abre `http://localhost:3000` en una **pestaña nueva**
2. Navega por el sitio
3. Cada página se registrará solo UNA vez

### Opción 2: Limpiar sessionStorage

Si quieres probar en la misma pestaña, limpia el sessionStorage:

1. Abre DevTools (F12)
2. Ve a **Console**
3. Ejecuta este comando:
   ```javascript
   sessionStorage.clear()
   console.log('✅ SessionStorage limpiado')
   ```
4. Recarga la página (F5)
5. Ahora se volverán a registrar los eventos

## Comandos Útiles en la Consola

### Ver qué eventos se han registrado en esta sesión

```javascript
const tracked = sessionStorage.getItem('analytics_tracked_events')
console.log('📊 Eventos registrados:', tracked ? JSON.parse(tracked) : {})
```

### Ver el ID de sesión actual

```javascript
const sessionId = localStorage.getItem('analytics_session_id')
console.log('🔑 Session ID:', sessionId)
```

### Limpiar todo (empezar de cero)

```javascript
sessionStorage.clear()
localStorage.removeItem('analytics_session_id')
console.log('✅ Todo limpiado - recarga la página')
```

### Forzar registro de eventos (para testing)

```javascript
// Limpiar solo los eventos registrados (mantener session_id)
sessionStorage.removeItem('analytics_tracked_events')
console.log('✅ Eventos limpiados - ahora puedes navegar de nuevo')
```

## Verificar en Supabase

### Query para ver eventos de tu sesión actual

```sql
-- Primero, obtén tu session_id desde localStorage
-- Luego reemplázalo aquí:

SELECT
  event_type,
  event_data,
  created_at
FROM analytics_events
WHERE session_id = 'TU_SESSION_ID_AQUI'
ORDER BY created_at DESC;
```

### Query para ver todos los eventos únicos por sesión

```sql
SELECT
  session_id,
  event_type,
  COUNT(*) as total,
  MIN(created_at) as primera_vez,
  MAX(created_at) as ultima_vez
FROM analytics_events
GROUP BY session_id, event_type
ORDER BY session_id, event_type;
```

## Comportamiento Esperado

### ✅ Correcto

**Escenario 1**: Primera visita
1. Abres home → Se registra `page_view` home
2. Vuelves a home → NO se registra (ya existe en sessionStorage)
3. Abres producto 123 → Se registran 2 eventos:
   - `page_view` product_detail
   - `product_view` producto 123
4. Vuelves al mismo producto → NO se registra nada
5. Abres producto 456 → Se registran 2 eventos nuevos
6. Click en WhatsApp del producto 456 → Se registra `whatsapp_click`
7. Click en WhatsApp de nuevo → Se registra OTRA VEZ

**Escenario 2**: Nueva pestaña (nueva sesión)
1. Abres nueva pestaña con Ctrl+N
2. Vas a `http://localhost:3000`
3. El `session_id` es EL MISMO (localStorage)
4. Pero `sessionStorage` está VACÍO
5. Se registran TODOS los eventos de nuevo

### ❌ Incorrecto (lo que queríamos evitar)

- Ir y volver a home registrando múltiples `page_view`
- Ver el mismo producto y registrar múltiples `product_view`

## Solución de Problemas

### Problema: "No veo eventos en Supabase"

**Diagnóstico:**
1. Abre DevTools → Console
2. ¿Ves errores de Supabase?
3. Ejecuta:
   ```javascript
   console.log('Session ID:', localStorage.getItem('analytics_session_id'))
   console.log('Tracked:', sessionStorage.getItem('analytics_tracked_events'))
   ```

**Solución:**
- Si no ves el session_id → El código no se está ejecutando
- Si ves errores → Copia el error y revisa la configuración de Supabase

### Problema: "Los eventos se duplican"

**Diagnóstico:**
1. Verifica que estás usando `sessionStorage.clear()` entre pruebas
2. Verifica que no tengas múltiples pestañas abiertas

**Solución:**
- Cierra todas las pestañas
- Abre UNA sola pestaña nueva
- Navega y prueba

### Problema: "El evento de producto no se registra"

**Diagnóstico:**
1. Abre un producto
2. Mira la consola
3. ¿Ves algún error?

**Posibles causas:**
- El producto no tiene `id` o `descripcion`
- Hay un error antes de llegar al tracking
- El tracking ya se ejecutó antes en esta sesión

**Solución:**
```javascript
// Limpiar y reintentar
sessionStorage.clear()
location.reload()
```

## Testing Completo

### Test 1: Home

1. Limpia sessionStorage: `sessionStorage.clear()`
2. Recarga la página
3. ✅ Deberías ver en Supabase: `page_view` con `page: 'home'`

### Test 2: Producto

1. Limpia sessionStorage: `sessionStorage.clear()`
2. Recarga la página
3. Click en cualquier producto
4. ✅ Deberías ver 2 eventos:
   - `page_view` con `page: 'product_detail'`
   - `product_view` con el producto_id

### Test 3: WhatsApp

1. En la página de producto, click en WhatsApp
2. ✅ Deberías ver: `whatsapp_click` con el producto_id
3. Click en WhatsApp de nuevo
4. ✅ Deberías ver OTRO `whatsapp_click` (no se bloquea)

### Test 4: Presentación

1. Limpia sessionStorage: `sessionStorage.clear()`
2. Navega a una presentación
3. ✅ Deberías ver 2 eventos:
   - `page_view` con `page: 'presentacion'`
   - `presentacion_view` con el nombre

### Test 5: No duplicados

1. Ve a home
2. Ve a productos
3. VUELVE a home
4. ✅ NO deberías ver un nuevo `page_view` home en Supabase

## Resumen

| Evento | Se Bloquea en Sesión? | Cuándo se Registra |
|--------|----------------------|-------------------|
| `page_view` | ✅ Sí | Solo primera visita a cada página |
| `product_view` | ✅ Sí | Solo primera vista de cada producto |
| `presentacion_view` | ✅ Sí | Solo primera vista de cada presentación |
| `whatsapp_click` | ❌ No | Cada click es importante |
| `shopping_list_add` | ❌ No | Cada acción se registra |
| `shopping_list_remove` | ❌ No | Cada acción se registra |
| `search` | ❌ No | Cada búsqueda se registra |

---

¿Necesitas más ayuda? Revisa este documento o pregúntame.
