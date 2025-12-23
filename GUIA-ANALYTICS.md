# Guía de Uso del Sistema de Analytics

Este documento explica cómo usar el sistema de analytics implementado en el catálogo MuebleCenter.

## Índice

1. [Configuración](#configuración)
2. [Funciones Disponibles](#funciones-disponibles)
3. [Ejemplos de Uso](#ejemplos-de-uso)
4. [Tipos de Eventos](#tipos-de-eventos)

## Configuración

El sistema de analytics ya está configurado y listo para usar. Solo necesitas importar las funciones en tus componentes.

## Funciones Disponibles

### Funciones Principales

- `trackEvent()` - Función principal para registrar cualquier evento
- `trackPageView()` - Registrar visita a página
- `trackWhatsAppClick()` - Registrar click en botón de WhatsApp
- `trackShoppingListAdd()` - Registrar agregar a lista de compras
- `trackShoppingListRemove()` - Registrar remover de lista de compras
- `trackProductView()` - Registrar visualización de producto
- `trackSearch()` - Registrar búsqueda
- `trackPlanView()` - Registrar visualización de plan
- `trackCategoryView()` - Registrar visualización de categoría
- `trackBrandView()` - Registrar visualización de marca
- `trackPresentacionView()` - Registrar visualización de presentación
- `trackLineaView()` - Registrar visualización de línea
- `trackTipoView()` - Registrar visualización de tipo

## Tipos de Eventos

```typescript
type EventType =
  | 'page_view'                 // Visita a una página
  | 'whatsapp_click'            // Click en botón de WhatsApp
  | 'shopping_list_add'         // Agregar a lista de compras
  | 'shopping_list_remove'      // Remover de lista de compras
  | 'product_view'              // Visualización de producto
  | 'search'                    // Búsqueda realizada
  | 'plan_view'                 // Visualización de plan
  | 'category_view'             // Visualización de categoría
  | 'brand_view'                // Visualización de marca
  | 'presentacion_view'         // Visualización de presentación
  | 'linea_view'                // Visualización de línea
  | 'tipo_view'                 // Visualización de tipo
```

## Ejemplos de Uso

### 1. Registrar Visita a Página Principal

```typescript
// app/page.tsx
'use client'

import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export default function HomePage() {
  useEffect(() => {
    trackPageView('home')
  }, [])

  return <div>...</div>
}
```

### 2. Registrar Visita a Página de Categoría

```typescript
// app/[categoria]/page.tsx
'use client'

import { useEffect } from 'react'
import { trackPageView, trackCategoryView } from '@/lib/analytics'

export default function CategoryPage({ params }: { params: { categoria: string } }) {
  useEffect(() => {
    // Registrar visita a la página
    trackPageView('category', { categoria: params.categoria })

    // Si tienes el ID y nombre de la categoría, también puedes registrar:
    // trackCategoryView(categoriaId, categoriaNombre)
  }, [params.categoria])

  return <div>...</div>
}
```

### 3. Registrar Click en WhatsApp (en Componente de Producto)

```typescript
// En tu componente ProductCard o ProductDetail
'use client'

import { trackWhatsAppClick } from '@/lib/analytics'

interface Product {
  id: number
  descripcion: string
  // ... otros campos
}

export function ProductCard({ producto }: { producto: Product }) {
  const handleWhatsAppClick = () => {
    // Registrar evento
    trackWhatsAppClick(producto.id, producto.descripcion)

    // Abrir WhatsApp
    const mensaje = `Hola! Me interesa el producto: ${producto.descripcion}`
    const phoneNumber = '5491234567890' // Reemplaza con tu número
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`)
  }

  return (
    <div>
      <h3>{producto.descripcion}</h3>
      <button onClick={handleWhatsAppClick}>
        Consultar por WhatsApp
      </button>
    </div>
  )
}
```

### 4. Registrar Visualización de Producto

```typescript
// app/[categoria]/[id]/page.tsx
'use client'

import { useEffect } from 'react'
import { trackProductView, trackPageView } from '@/lib/analytics'

export default function ProductDetailPage({ params, producto }: any) {
  useEffect(() => {
    if (producto) {
      // Registrar vista de página
      trackPageView('product_detail', {
        producto_id: producto.id,
        categoria: params.categoria
      })

      // Registrar vista de producto
      trackProductView(producto.id, producto.descripcion)
    }
  }, [producto, params.categoria])

  return <div>...</div>
}
```

### 5. Registrar Agregar/Remover de Lista de Compras

```typescript
// En tu componente de lista de compras
'use client'

import { trackShoppingListAdd, trackShoppingListRemove } from '@/lib/analytics'

export function ShoppingListButton({ producto }: { producto: any }) {
  const [isInList, setIsInList] = useState(false)

  const handleToggleList = () => {
    if (isInList) {
      // Remover de la lista
      trackShoppingListRemove(producto.id, producto.descripcion)
      setIsInList(false)
      // Tu lógica para remover de la lista
    } else {
      // Agregar a la lista
      trackShoppingListAdd(producto.id, producto.descripcion)
      setIsInList(true)
      // Tu lógica para agregar a la lista
    }
  }

  return (
    <button onClick={handleToggleList}>
      {isInList ? 'Remover de lista' : 'Agregar a lista'}
    </button>
  )
}
```

### 6. Registrar Búsqueda

```typescript
// En tu componente de búsqueda
'use client'

import { useState } from 'react'
import { trackSearch } from '@/lib/analytics'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async (searchQuery: string) => {
    // Realizar búsqueda (tu lógica)
    const searchResults = await searchProducts(searchQuery)
    setResults(searchResults)

    // Registrar evento de búsqueda
    trackSearch(searchQuery, searchResults.length)
  }

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          handleSearch(e.target.value)
        }}
        placeholder="Buscar productos..."
      />
      {/* Mostrar resultados */}
    </div>
  )
}
```

### 7. Registrar Visualización de Plan de Financiación

```typescript
// En tu componente de planes
'use client'

import { trackPlanView } from '@/lib/analytics'

export function PlanCard({ plan }: { plan: any }) {
  const handlePlanClick = () => {
    // Registrar visualización del plan
    trackPlanView(plan.id, plan.nombre)

    // Tu lógica para mostrar detalles del plan
  }

  return (
    <div onClick={handlePlanClick}>
      <h3>{plan.nombre}</h3>
      <p>{plan.descripcion}</p>
    </div>
  )
}
```

### 8. Registrar Visualización de Presentación

```typescript
// app/presentaciones/[presentacion]/page.tsx
'use client'

import { useEffect } from 'react'
import { trackPresentacionView, trackPageView } from '@/lib/analytics'

export default function PresentacionPage({ params }: { params: { presentacion: string } }) {
  useEffect(() => {
    // Registrar vista de página
    trackPageView('presentacion', { presentacion: params.presentacion })

    // Registrar vista de presentación
    trackPresentacionView(params.presentacion)
  }, [params.presentacion])

  return <div>...</div>
}
```

### 9. Registrar Visualización de Línea

```typescript
// app/presentaciones/[presentacion]/lineas/[linea]/page.tsx
'use client'

import { useEffect } from 'react'
import { trackLineaView, trackPageView } from '@/lib/analytics'

export default function LineaPage({ params }: {
  params: { presentacion: string, linea: string }
}) {
  useEffect(() => {
    // Registrar vista de página
    trackPageView('linea', {
      presentacion: params.presentacion,
      linea: params.linea
    })

    // Registrar vista de línea
    trackLineaView(params.linea, params.presentacion)
  }, [params.linea, params.presentacion])

  return <div>...</div>
}
```

### 10. Registrar Visualización de Tipo

```typescript
// app/presentaciones/[presentacion]/lineas/[linea]/tipos/[tipo]/page.tsx
'use client'

import { useEffect } from 'react'
import { trackTipoView, trackPageView } from '@/lib/analytics'

export default function TipoPage({ params }: {
  params: { presentacion: string, linea: string, tipo: string }
}) {
  useEffect(() => {
    // Registrar vista de página
    trackPageView('tipo', {
      presentacion: params.presentacion,
      linea: params.linea,
      tipo: params.tipo
    })

    // Registrar vista de tipo
    trackTipoView(params.tipo, params.linea, params.presentacion)
  }, [params.tipo, params.linea, params.presentacion])

  return <div>...</div>
}
```

### 11. Hook Personalizado para Trackear Páginas Automáticamente

```typescript
// hooks/usePageTracking.ts
import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export function usePageTracking(pageName: string, additionalData?: Record<string, any>) {
  useEffect(() => {
    trackPageView(pageName, additionalData)
  }, [pageName, additionalData])
}

// Uso en componente:
// usePageTracking('about', { section: 'team' })
```

### 12. Registrar Evento Personalizado

Si necesitas registrar un evento que no tiene una función helper específica:

```typescript
import { trackEvent } from '@/lib/analytics'

// Ejemplo de evento personalizado
trackEvent({
  eventType: 'page_view', // o cualquier otro tipo de evento
  eventData: {
    custom_field: 'valor',
    another_field: 123
  },
  productoId: 456, // opcional
  zonaId: 789,     // opcional
  userId: 'user123' // opcional
})
```

## Notas Importantes

1. **No afecta la experiencia del usuario**: Los errores en el tracking se registran en consola pero no interrumpen la aplicación.

2. **Sesiones automáticas**: El sistema genera automáticamente un ID de sesión único para cada usuario que se mantiene en localStorage.

3. **Client Components**: Asegúrate de usar `'use client'` en los componentes donde uses los hooks de tracking.

4. **Privacidad**: El sistema no captura información personal identificable a menos que la proporciones explícitamente.

5. **Performance**: Las llamadas al sistema de analytics son asíncronas y no bloquean la interfaz de usuario.

## Verificación en Supabase

Para verificar que los eventos se están registrando correctamente:

1. Ve a tu proyecto en Supabase
2. Abre la tabla `analytics_events`
3. Verás los eventos registrados con toda la información

```sql
-- Query de ejemplo para ver eventos recientes
SELECT * FROM analytics_events
ORDER BY created_at DESC
LIMIT 100;

-- Ver eventos por tipo
SELECT event_type, COUNT(*) as total
FROM analytics_events
GROUP BY event_type
ORDER BY total DESC;

-- Ver productos más vistos
SELECT
  fk_id_producto,
  event_data->>'producto_nombre' as nombre,
  COUNT(*) as vistas
FROM analytics_events
WHERE event_type = 'product_view'
GROUP BY fk_id_producto, event_data->>'producto_nombre'
ORDER BY vistas DESC
LIMIT 10;
```
