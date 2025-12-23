# Sistema de Analytics - MuebleCenter

## Resumen

Se ha implementado un sistema completo de analytics para el catálogo de MuebleCenter que registra las acciones de los usuarios en Supabase.

## Archivos Creados

### 1. `lib/analytics.ts`
Sistema principal de analytics con todas las funciones para registrar eventos.

**Funciones disponibles:**
- `trackEvent()` - Función principal genérica
- `trackPageView()` - Registrar visitas a páginas
- `trackWhatsAppClick()` - Registrar clicks en WhatsApp
- `trackShoppingListAdd()` - Registrar agregados a lista de compras
- `trackShoppingListRemove()` - Registrar eliminados de lista
- `trackProductView()` - Registrar visualización de productos
- `trackSearch()` - Registrar búsquedas
- `trackPlanView()` - Registrar visualización de planes
- `trackCategoryView()` - Registrar visualización de categorías
- `trackBrandView()` - Registrar visualización de marcas
- `trackPresentacionView()` - Registrar visualización de presentaciones
- `trackLineaView()` - Registrar visualización de líneas
- `trackTipoView()` - Registrar visualización de tipos

### 2. `hooks/use-analytics.ts`
Hooks personalizados de React para facilitar el uso del sistema.

**Hooks disponibles:**
- `usePageTracking()` - Auto-track de páginas
- `useTrackEvent()` - Hook para eventos personalizados
- `useProductView()` - Auto-track de visualización de productos
- `useCategoryView()` - Auto-track de visualización de categorías

### 3. Documentación

- `GUIA-ANALYTICS.md` - Guía completa de uso con ejemplos
- `EJEMPLOS-IMPLEMENTACION-ANALYTICS.md` - Ejemplos específicos para implementar en tu proyecto
- `QUERIES-ANALYTICS.md` - Queries SQL para analizar los datos
- `README-ANALYTICS.md` - Este archivo (resumen general)

## Tipos de Eventos

El sistema registra los siguientes tipos de eventos:

| Tipo de Evento | Descripción | Ejemplo de Uso |
|----------------|-------------|----------------|
| `page_view` | Visita a una página | Inicio, categoría, búsqueda |
| `product_view` | Visualización de producto | Página de detalle del producto |
| `whatsapp_click` | Click en botón de WhatsApp | Consulta sobre un producto |
| `shopping_list_add` | Agregar a lista de compras | Usuario guarda producto |
| `shopping_list_remove` | Remover de lista | Usuario quita producto |
| `search` | Búsqueda realizada | Usuario busca algo |
| `plan_view` | Visualización de plan | Usuario ve plan de financiación |
| `category_view` | Visualización de categoría | Usuario navega categoría |
| `brand_view` | Visualización de marca | Usuario filtra por marca |
| `presentacion_view` | Visualización de presentación | Navegación por presentación |
| `linea_view` | Visualización de línea | Navegación por línea |
| `tipo_view` | Visualización de tipo | Navegación por tipo |

## Estructura de Datos

### Tabla: analytics_events

Registra cada evento individual que ocurre en el sitio.

```sql
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  fk_id_producto BIGINT,
  fk_id_zona BIGINT
);
```

**Campos:**
- `id`: ID único del evento
- `created_at`: Fecha y hora del evento
- `event_type`: Tipo de evento (page_view, product_view, etc.)
- `event_data`: Datos adicionales en formato JSON
- `session_id`: ID único de la sesión del usuario
- `user_id`: ID del usuario (opcional)
- `fk_id_producto`: ID del producto relacionado (si aplica)
- `fk_id_zona`: ID de la zona relacionada (si aplica)

### Tabla: analytics_daily_metrics

Almacena métricas agregadas por día.

```sql
CREATE TABLE analytics_daily_metrics (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  event_type VARCHAR(100) NOT NULL,
  count BIGINT DEFAULT 0,
  unique_users BIGINT DEFAULT 0,
  unique_sessions BIGINT DEFAULT 0,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(date, event_type)
);
```

## Implementación Rápida

### Ejemplo 1: Trackear visita a página

```typescript
'use client'
import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export default function MyPage() {
  useEffect(() => {
    trackPageView('my_page')
  }, [])

  return <div>Contenido</div>
}
```

### Ejemplo 2: Trackear visualización de producto

```typescript
'use client'
import { useProductView } from '@/hooks/use-analytics'

export default function ProductDetail({ producto }) {
  // Auto-tracking
  useProductView(producto.id, producto.descripcion)

  return <div>{producto.descripcion}</div>
}
```

### Ejemplo 3: Trackear click en WhatsApp

```typescript
'use client'
import { trackWhatsAppClick } from '@/lib/analytics'

export default function WhatsAppButton({ producto }) {
  const handleClick = () => {
    trackWhatsAppClick(producto.id, producto.descripcion)
    // ... abrir WhatsApp
  }

  return <button onClick={handleClick}>WhatsApp</button>
}
```

## Características

### 1. Gestión Automática de Sesiones
- Genera automáticamente un ID único de sesión
- Almacena en localStorage del navegador
- Permite rastrear el comportamiento del usuario durante su visita

### 2. No Invasivo
- Los errores se registran en consola pero no interrumpen la aplicación
- Las llamadas son asíncronas y no bloquean la UI
- Funciona tanto en server como client components

### 3. Privacidad
- No captura información personal por defecto
- Puedes pasar un `userId` opcional si el usuario está autenticado
- No captura IP ni user agent (campos disponibles para implementación futura)

### 4. Flexible
- Sistema de event_data JSON permite registrar cualquier información adicional
- Fácil de extender con nuevos tipos de eventos
- Compatible con cualquier fuente de datos

## Análisis de Datos

### Queries Básicas

Ver eventos recientes:
```sql
SELECT * FROM analytics_events
ORDER BY created_at DESC LIMIT 100;
```

Productos más vistos:
```sql
SELECT
  fk_id_producto,
  event_data->>'producto_nombre' as nombre,
  COUNT(*) as vistas
FROM analytics_events
WHERE event_type = 'product_view'
GROUP BY fk_id_producto, nombre
ORDER BY vistas DESC LIMIT 10;
```

Tasa de conversión (vista → WhatsApp):
```sql
WITH vistas AS (
  SELECT fk_id_producto, COUNT(*) as total
  FROM analytics_events
  WHERE event_type = 'product_view'
  GROUP BY fk_id_producto
),
whatsapp AS (
  SELECT fk_id_producto, COUNT(*) as total
  FROM analytics_events
  WHERE event_type = 'whatsapp_click'
  GROUP BY fk_id_producto
)
SELECT
  v.fk_id_producto,
  v.total as vistas,
  COALESCE(w.total, 0) as whatsapp_clicks,
  ROUND((COALESCE(w.total, 0)::numeric / v.total * 100), 2) as tasa_conversion
FROM vistas v
LEFT JOIN whatsapp w ON v.fk_id_producto = w.fk_id_producto
ORDER BY tasa_conversion DESC;
```

Ver archivo `QUERIES-ANALYTICS.md` para más ejemplos.

## Métricas Útiles

Con este sistema puedes obtener:

### Métricas de Producto
- Productos más vistos
- Productos con más clicks en WhatsApp
- Productos más agregados a lista
- Tasa de conversión por producto
- Productos con alto interés pero sin conversión

### Métricas de Navegación
- Páginas más visitadas
- Categorías más populares
- Presentaciones más vistas
- Flujo de navegación de usuarios

### Métricas de Búsqueda
- Términos más buscados
- Búsquedas sin resultados
- Búsquedas con pocos resultados

### Métricas de Sesión
- Duración promedio de sesión
- Eventos por sesión
- Sesiones más activas

### Métricas Temporales
- Actividad por día de la semana
- Actividad por hora del día
- Tendencias semanales/mensuales

## Próximos Pasos

Para implementar el sistema completo:

1. **Revisar la documentación**
   - Lee `GUIA-ANALYTICS.md` para entender todas las funciones
   - Revisa `EJEMPLOS-IMPLEMENTACION-ANALYTICS.md` para ver casos específicos

2. **Implementar en componentes clave**
   - Página principal (home)
   - Página de producto
   - Botón de WhatsApp
   - Botón de lista de compras
   - Barra de búsqueda

3. **Verificar funcionamiento**
   - Navega por tu sitio
   - Revisa en Supabase que se estén creando registros
   - Usa las queries para analizar datos

4. **Crear dashboard de métricas**
   - Usa las queries del archivo `QUERIES-ANALYTICS.md`
   - Crea vistas personalizadas en Supabase
   - Considera herramientas como Metabase o Grafana

## Mantenimiento

### Limpieza de Datos Antiguos

Si quieres eliminar datos antiguos:

```sql
-- Eliminar eventos de más de 6 meses
DELETE FROM analytics_events
WHERE created_at < NOW() - INTERVAL '6 months';
```

### Optimización

Si la tabla crece mucho:

1. Crea índices adicionales según tus queries más frecuentes
2. Considera particionar la tabla por fecha
3. Agrega métricas diarias en `analytics_daily_metrics`

### Backup

Exporta los datos regularmente desde Supabase:
- Table Editor → analytics_events → Download as CSV

## Recursos

- Documentación de Supabase: https://supabase.com/docs
- Queries SQL: Ver `QUERIES-ANALYTICS.md`
- Ejemplos de implementación: Ver `EJEMPLOS-IMPLEMENTACION-ANALYTICS.md`

## Soporte

Para preguntas o problemas:
1. Revisa la documentación incluida
2. Verifica la consola del navegador para errores
3. Revisa la tabla analytics_events en Supabase

## Licencia

Este sistema fue creado específicamente para el catálogo de MuebleCenter.

---

**Versión**: 1.0
**Fecha**: Diciembre 2025
**Autor**: Sistema de Analytics para MuebleCenter
