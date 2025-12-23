# Queries SQL para Analytics de MuebleCenter

Este documento contiene queries SQL útiles para analizar los datos de analytics en Supabase.

## Índice

1. [Queries Básicas](#queries-básicas)
2. [Análisis de Productos](#análisis-de-productos)
3. [Análisis de Búsquedas](#análisis-de-búsquedas)
4. [Análisis de Conversiones](#análisis-de-conversiones)
5. [Análisis de Sesiones](#análisis-de-sesiones)
6. [Análisis Temporal](#análisis-temporal)
7. [Reportes para Dashboard](#reportes-para-dashboard)

---

## Queries Básicas

### Ver todos los eventos recientes

```sql
SELECT
  id,
  created_at,
  event_type,
  event_data,
  session_id,
  fk_id_producto
FROM analytics_events
ORDER BY created_at DESC
LIMIT 100;
```

### Contar eventos por tipo

```sql
SELECT
  event_type,
  COUNT(*) as total_eventos,
  COUNT(DISTINCT session_id) as sesiones_unicas,
  COUNT(DISTINCT DATE(created_at)) as dias_con_eventos
FROM analytics_events
GROUP BY event_type
ORDER BY total_eventos DESC;
```

### Eventos de las últimas 24 horas

```sql
SELECT
  event_type,
  COUNT(*) as total
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '24 hours'
GROUP BY event_type
ORDER BY total DESC;
```

### Eventos de los últimos 7 días

```sql
SELECT
  event_type,
  COUNT(*) as total
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY event_type
ORDER BY total DESC;
```

---

## Análisis de Productos

### Productos más vistos (Top 20)

```sql
SELECT
  fk_id_producto as producto_id,
  event_data->>'producto_nombre' as nombre_producto,
  COUNT(*) as total_vistas,
  COUNT(DISTINCT session_id) as sesiones_unicas,
  COUNT(DISTINCT DATE(created_at)) as dias_con_vistas
FROM analytics_events
WHERE event_type = 'product_view'
  AND fk_id_producto IS NOT NULL
GROUP BY fk_id_producto, event_data->>'producto_nombre'
ORDER BY total_vistas DESC
LIMIT 20;
```

### Productos con más clicks en WhatsApp

```sql
SELECT
  fk_id_producto as producto_id,
  event_data->>'producto_nombre' as nombre_producto,
  COUNT(*) as total_clicks,
  COUNT(DISTINCT session_id) as sesiones_unicas
FROM analytics_events
WHERE event_type = 'whatsapp_click'
  AND fk_id_producto IS NOT NULL
GROUP BY fk_id_producto, event_data->>'producto_nombre'
ORDER BY total_clicks DESC
LIMIT 20;
```

### Productos más agregados a lista de compras

```sql
SELECT
  fk_id_producto as producto_id,
  event_data->>'producto_nombre' as nombre_producto,
  COUNT(*) as total_agregados
FROM analytics_events
WHERE event_type = 'shopping_list_add'
  AND fk_id_producto IS NOT NULL
GROUP BY fk_id_producto, event_data->>'producto_nombre'
ORDER BY total_agregados DESC
LIMIT 20;
```

### Tasa de conversión por producto (vistas → WhatsApp)

```sql
WITH vistas AS (
  SELECT
    fk_id_producto,
    event_data->>'producto_nombre' as nombre,
    COUNT(*) as total_vistas
  FROM analytics_events
  WHERE event_type = 'product_view'
    AND fk_id_producto IS NOT NULL
  GROUP BY fk_id_producto, event_data->>'producto_nombre'
),
whatsapp AS (
  SELECT
    fk_id_producto,
    COUNT(*) as total_whatsapp
  FROM analytics_events
  WHERE event_type = 'whatsapp_click'
    AND fk_id_producto IS NOT NULL
  GROUP BY fk_id_producto
)
SELECT
  v.fk_id_producto as producto_id,
  v.nombre as nombre_producto,
  v.total_vistas,
  COALESCE(w.total_whatsapp, 0) as total_whatsapp,
  ROUND(
    (COALESCE(w.total_whatsapp, 0)::numeric / v.total_vistas * 100),
    2
  ) as tasa_conversion_porcentaje
FROM vistas v
LEFT JOIN whatsapp w ON v.fk_id_producto = w.fk_id_producto
WHERE v.total_vistas > 10  -- Solo productos con al menos 10 vistas
ORDER BY tasa_conversion_porcentaje DESC
LIMIT 20;
```

### Productos con vistas pero sin conversión

```sql
SELECT
  fk_id_producto as producto_id,
  event_data->>'producto_nombre' as nombre_producto,
  COUNT(*) as total_vistas
FROM analytics_events
WHERE event_type = 'product_view'
  AND fk_id_producto IS NOT NULL
  AND fk_id_producto NOT IN (
    SELECT DISTINCT fk_id_producto
    FROM analytics_events
    WHERE event_type = 'whatsapp_click'
      AND fk_id_producto IS NOT NULL
  )
GROUP BY fk_id_producto, event_data->>'producto_nombre'
ORDER BY total_vistas DESC
LIMIT 20;
```

---

## Análisis de Búsquedas

### Términos de búsqueda más populares

```sql
SELECT
  event_data->>'query' as termino_busqueda,
  COUNT(*) as total_busquedas,
  AVG((event_data->>'results_count')::int) as promedio_resultados,
  COUNT(DISTINCT session_id) as sesiones_unicas
FROM analytics_events
WHERE event_type = 'search'
  AND event_data->>'query' IS NOT NULL
  AND event_data->>'query' != ''
GROUP BY event_data->>'query'
ORDER BY total_busquedas DESC
LIMIT 30;
```

### Búsquedas sin resultados

```sql
SELECT
  event_data->>'query' as termino_busqueda,
  COUNT(*) as veces_buscado,
  COUNT(DISTINCT session_id) as sesiones_unicas
FROM analytics_events
WHERE event_type = 'search'
  AND (event_data->>'results_count')::int = 0
GROUP BY event_data->>'query'
ORDER BY veces_buscado DESC
LIMIT 20;
```

### Búsquedas con pocos resultados (menos de 3)

```sql
SELECT
  event_data->>'query' as termino_busqueda,
  AVG((event_data->>'results_count')::int) as promedio_resultados,
  COUNT(*) as veces_buscado
FROM analytics_events
WHERE event_type = 'search'
  AND (event_data->>'results_count')::int > 0
  AND (event_data->>'results_count')::int < 3
GROUP BY event_data->>'query'
ORDER BY veces_buscado DESC
LIMIT 20;
```

---

## Análisis de Conversiones

### Embudo de conversión (Vista → Lista → WhatsApp)

```sql
WITH producto_stats AS (
  SELECT
    fk_id_producto,
    event_data->>'producto_nombre' as nombre,
    SUM(CASE WHEN event_type = 'product_view' THEN 1 ELSE 0 END) as vistas,
    SUM(CASE WHEN event_type = 'shopping_list_add' THEN 1 ELSE 0 END) as agregados_lista,
    SUM(CASE WHEN event_type = 'whatsapp_click' THEN 1 ELSE 0 END) as whatsapp_clicks
  FROM analytics_events
  WHERE fk_id_producto IS NOT NULL
    AND event_type IN ('product_view', 'shopping_list_add', 'whatsapp_click')
  GROUP BY fk_id_producto, event_data->>'producto_nombre'
)
SELECT
  fk_id_producto as producto_id,
  nombre as nombre_producto,
  vistas,
  agregados_lista,
  whatsapp_clicks,
  ROUND((agregados_lista::numeric / NULLIF(vistas, 0) * 100), 2) as tasa_lista_porcentaje,
  ROUND((whatsapp_clicks::numeric / NULLIF(vistas, 0) * 100), 2) as tasa_whatsapp_porcentaje
FROM producto_stats
WHERE vistas > 5  -- Solo productos con al menos 5 vistas
ORDER BY whatsapp_clicks DESC
LIMIT 20;
```

---

## Análisis de Sesiones

### Sesiones más activas

```sql
SELECT
  session_id,
  COUNT(*) as total_eventos,
  COUNT(DISTINCT event_type) as tipos_eventos_diferentes,
  MIN(created_at) as primera_actividad,
  MAX(created_at) as ultima_actividad,
  EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at)))/60 as duracion_minutos
FROM analytics_events
GROUP BY session_id
ORDER BY total_eventos DESC
LIMIT 20;
```

### Promedio de eventos por sesión

```sql
SELECT
  AVG(eventos_por_sesion) as promedio_eventos,
  MAX(eventos_por_sesion) as maximo_eventos,
  MIN(eventos_por_sesion) as minimo_eventos
FROM (
  SELECT
    session_id,
    COUNT(*) as eventos_por_sesion
  FROM analytics_events
  GROUP BY session_id
) as sesiones;
```

### Duración promedio de sesiones

```sql
SELECT
  AVG(duracion_minutos) as promedio_duracion_minutos,
  MAX(duracion_minutos) as maxima_duracion_minutos,
  MIN(duracion_minutos) as minima_duracion_minutos
FROM (
  SELECT
    session_id,
    EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at)))/60 as duracion_minutos
  FROM analytics_events
  GROUP BY session_id
  HAVING COUNT(*) > 1  -- Solo sesiones con más de 1 evento
) as duraciones;
```

---

## Análisis Temporal

### Eventos por día de la semana

```sql
SELECT
  TO_CHAR(created_at, 'Day') as dia_semana,
  EXTRACT(DOW FROM created_at) as numero_dia,
  COUNT(*) as total_eventos,
  COUNT(DISTINCT session_id) as sesiones_unicas
FROM analytics_events
GROUP BY TO_CHAR(created_at, 'Day'), EXTRACT(DOW FROM created_at)
ORDER BY numero_dia;
```

### Eventos por hora del día

```sql
SELECT
  EXTRACT(HOUR FROM created_at) as hora,
  COUNT(*) as total_eventos,
  COUNT(DISTINCT session_id) as sesiones_unicas
FROM analytics_events
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hora;
```

### Eventos por día (últimos 30 días)

```sql
SELECT
  DATE(created_at) as fecha,
  COUNT(*) as total_eventos,
  COUNT(DISTINCT session_id) as sesiones_unicas,
  COUNT(DISTINCT event_type) as tipos_eventos
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY fecha DESC;
```

### Tendencia semanal

```sql
SELECT
  DATE_TRUNC('week', created_at) as semana,
  COUNT(*) as total_eventos,
  COUNT(DISTINCT session_id) as sesiones_unicas,
  COUNT(DISTINCT fk_id_producto) as productos_unicos
FROM analytics_events
WHERE created_at >= NOW() - INTERVAL '3 months'
GROUP BY DATE_TRUNC('week', created_at)
ORDER BY semana DESC;
```

---

## Reportes para Dashboard

### Dashboard de resumen general

```sql
SELECT
  -- Totales generales
  COUNT(*) as total_eventos,
  COUNT(DISTINCT session_id) as total_sesiones,
  COUNT(DISTINCT fk_id_producto) as productos_con_actividad,

  -- Eventos de hoy
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as eventos_hoy,
  COUNT(DISTINCT session_id) FILTER (WHERE created_at >= CURRENT_DATE) as sesiones_hoy,

  -- Eventos de esta semana
  COUNT(*) FILTER (WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) as eventos_semana,
  COUNT(DISTINCT session_id) FILTER (WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) as sesiones_semana,

  -- Por tipo de evento (últimas 24h)
  COUNT(*) FILTER (WHERE event_type = 'product_view' AND created_at >= NOW() - INTERVAL '24 hours') as vistas_24h,
  COUNT(*) FILTER (WHERE event_type = 'whatsapp_click' AND created_at >= NOW() - INTERVAL '24 hours') as whatsapp_24h,
  COUNT(*) FILTER (WHERE event_type = 'search' AND created_at >= NOW() - INTERVAL '24 hours') as busquedas_24h,
  COUNT(*) FILTER (WHERE event_type = 'shopping_list_add' AND created_at >= NOW() - INTERVAL '24 hours') as agregados_lista_24h

FROM analytics_events;
```

### Top páginas visitadas (últimos 7 días)

```sql
SELECT
  event_data->>'page' as pagina,
  COUNT(*) as total_visitas,
  COUNT(DISTINCT session_id) as sesiones_unicas
FROM analytics_events
WHERE event_type = 'page_view'
  AND created_at >= NOW() - INTERVAL '7 days'
  AND event_data->>'page' IS NOT NULL
GROUP BY event_data->>'page'
ORDER BY total_visitas DESC
LIMIT 10;
```

### Categorías más visitadas

```sql
SELECT
  event_data->>'categoria_nombre' as categoria,
  COUNT(*) as total_visitas,
  COUNT(DISTINCT session_id) as sesiones_unicas
FROM analytics_events
WHERE event_type = 'category_view'
  AND event_data->>'categoria_nombre' IS NOT NULL
GROUP BY event_data->>'categoria_nombre'
ORDER BY total_visitas DESC;
```

### Presentaciones más visitadas

```sql
SELECT
  event_data->>'presentacion_nombre' as presentacion,
  COUNT(*) as total_visitas,
  COUNT(DISTINCT session_id) as sesiones_unicas
FROM analytics_events
WHERE event_type = 'presentacion_view'
  AND event_data->>'presentacion_nombre' IS NOT NULL
GROUP BY event_data->>'presentacion_nombre'
ORDER BY total_visitas DESC;
```

---

## Queries de Mantenimiento

### Limpiar eventos antiguos (más de 6 meses)

```sql
-- ⚠️ PRECAUCIÓN: Esto elimina datos permanentemente
-- Solo ejecutar si quieres limpiar datos antiguos

DELETE FROM analytics_events
WHERE created_at < NOW() - INTERVAL '6 months';
```

### Ver tamaño de la tabla

```sql
SELECT
  pg_size_pretty(pg_total_relation_size('analytics_events')) as tamaño_total,
  pg_size_pretty(pg_relation_size('analytics_events')) as tamaño_tabla,
  pg_size_pretty(pg_total_relation_size('analytics_events') - pg_relation_size('analytics_events')) as tamaño_indices;
```

### Estadísticas de la tabla

```sql
SELECT
  schemaname,
  tablename,
  n_live_tup as filas_vivas,
  n_dead_tup as filas_muertas,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables
WHERE tablename = 'analytics_events';
```

---

## Crear Vistas Útiles

### Vista para análisis rápido de productos

```sql
CREATE OR REPLACE VIEW analytics_productos_resumen AS
SELECT
  p.id as producto_id,
  p.descripcion as producto_nombre,
  COUNT(*) FILTER (WHERE ae.event_type = 'product_view') as total_vistas,
  COUNT(*) FILTER (WHERE ae.event_type = 'whatsapp_click') as total_whatsapp,
  COUNT(*) FILTER (WHERE ae.event_type = 'shopping_list_add') as total_lista,
  COUNT(DISTINCT ae.session_id) as sesiones_unicas,
  MAX(ae.created_at) as ultima_interaccion
FROM productos p
LEFT JOIN analytics_events ae ON ae.fk_id_producto = p.id
GROUP BY p.id, p.descripcion
ORDER BY total_vistas DESC;

-- Usar la vista:
SELECT * FROM analytics_productos_resumen LIMIT 20;
```

---

## Exportar Datos

### Exportar eventos a CSV (ejecutar en SQL Editor de Supabase)

```sql
COPY (
  SELECT
    id,
    created_at,
    event_type,
    event_data,
    session_id,
    fk_id_producto,
    fk_id_zona
  FROM analytics_events
  WHERE created_at >= NOW() - INTERVAL '30 days'
  ORDER BY created_at DESC
) TO '/tmp/analytics_eventos.csv' WITH CSV HEADER;
```

**Nota**: Para exportar datos desde Supabase, es mejor usar la interfaz web:
1. Ve a Table Editor
2. Selecciona la tabla `analytics_events`
3. Click en "Download as CSV"

---

## Queries para la Tabla analytics_daily_metrics

### Ver métricas diarias

```sql
SELECT
  date,
  event_type,
  count as total_eventos,
  unique_users as usuarios_unicos,
  unique_sessions as sesiones_unicas,
  event_data
FROM analytics_daily_metrics
ORDER BY date DESC, count DESC
LIMIT 50;
```

### Comparar métricas semana a semana

```sql
WITH weekly_stats AS (
  SELECT
    DATE_TRUNC('week', date) as semana,
    SUM(count) as eventos_totales,
    SUM(unique_sessions) as sesiones_totales
  FROM analytics_daily_metrics
  WHERE date >= NOW() - INTERVAL '8 weeks'
  GROUP BY DATE_TRUNC('week', date)
)
SELECT
  semana,
  eventos_totales,
  sesiones_totales,
  LAG(eventos_totales) OVER (ORDER BY semana) as eventos_semana_anterior,
  ROUND(
    (eventos_totales - LAG(eventos_totales) OVER (ORDER BY semana))::numeric /
    NULLIF(LAG(eventos_totales) OVER (ORDER BY semana), 0) * 100,
    2
  ) as cambio_porcentual
FROM weekly_stats
ORDER BY semana DESC;
```

---

¿Necesitas ayuda con alguna query específica o quieres que cree un dashboard en Supabase?
