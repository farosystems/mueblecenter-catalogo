# Ejemplos de Implementación de Analytics para MuebleCenter

Este documento muestra ejemplos específicos de cómo implementar el sistema de analytics en las páginas y componentes existentes de tu proyecto.

## Índice

1. [Página Principal (Home)](#página-principal-home)
2. [Página de Producto](#página-de-producto)
3. [Componente WhatsAppButton](#componente-whatsappbutton)
4. [Componente AddToListButton](#componente-addtolistbutton)
5. [Página de Búsqueda](#página-de-búsqueda)
6. [Página de Categoría](#página-de-categoría)
7. [Página de Presentación](#página-de-presentación)

---

## Página Principal (Home)

### Antes (app/page.tsx)

```typescript
import HeroSection from "@/components/HeroSection"
import BannersSection from "@/components/BannersSection"
import CategoriesCarousel from "@/components/CategoriesCarousel"
import FeaturedSection from "@/components/FeaturedSection"
import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"
import { mostrarSeccionBienvenidos } from "@/lib/supabase-config"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const mostrarBienvenida = await mostrarSeccionBienvenidos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <GlobalAppBar />

      <main>
        {mostrarBienvenida && <HeroSection />}
        <BannersSection />
        <CategoriesCarousel />
        <FeaturedSection />
      </main>

      <Footer />
    </div>
  )
}
```

### Después - OPCIÓN 1: Crear un Client Wrapper Component

Crea un nuevo archivo `app/HomePageClient.tsx`:

```typescript
'use client'

import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'
import HeroSection from "@/components/HeroSection"
import BannersSection from "@/components/BannersSection"
import CategoriesCarousel from "@/components/CategoriesCarousel"
import FeaturedSection from "@/components/FeaturedSection"

interface HomePageClientProps {
  mostrarBienvenida: boolean
}

export default function HomePageClient({ mostrarBienvenida }: HomePageClientProps) {
  // Registrar visita a la página principal
  useEffect(() => {
    trackPageView('home')
  }, [])

  return (
    <main>
      {mostrarBienvenida && <HeroSection />}
      <BannersSection />
      <CategoriesCarousel />
      <FeaturedSection />
    </main>
  )
}
```

Y modifica `app/page.tsx`:

```typescript
import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"
import { mostrarSeccionBienvenidos } from "@/lib/supabase-config"
import HomePageClient from "./HomePageClient"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const mostrarBienvenida = await mostrarSeccionBienvenidos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <GlobalAppBar />
      <HomePageClient mostrarBienvenida={mostrarBienvenida} />
      <Footer />
    </div>
  )
}
```

### Después - OPCIÓN 2: Usar el Hook usePageTracking

Si prefieres usar el hook personalizado:

```typescript
'use client'

import { usePageTracking } from '@/hooks/use-analytics'
import HeroSection from "@/components/HeroSection"
import BannersSection from "@/components/BannersSection"
import CategoriesCarousel from "@/components/CategoriesCarousel"
import FeaturedSection from "@/components/FeaturedSection"

interface HomePageClientProps {
  mostrarBienvenida: boolean
}

export default function HomePageClient({ mostrarBienvenida }: HomePageClientProps) {
  // Trackear visita automáticamente
  usePageTracking('home')

  return (
    <main>
      {mostrarBienvenida && <HeroSection />}
      <BannersSection />
      <CategoriesCarousel />
      <FeaturedSection />
    </main>
  )
}
```

---

## Página de Producto

### Modificación en ProductPageClient.tsx

Agrega el tracking al componente existente. Busca la línea donde se carga el producto (alrededor de la línea 81-100):

```typescript
// Al inicio del archivo, agrega el import
import { trackProductView, trackPageView } from '@/lib/analytics'

// ... resto de imports ...

export default function ProductPageClient({
  params,
  productId,
  categorySlug,
  hierarchyType = 'categoria'
}: ProductPageClientProps) {
  // ... código existente ...

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)

        const productData = await getProductById(resolvedParams.id)

        if (!productData) {
          setError('Producto no encontrado')
          return
        }

        // ... código de validación existente ...

        setProduct(productData)

        // ✅ NUEVO: Registrar visita al producto
        trackPageView('product_detail', {
          producto_id: productData.id,
          categoria: resolvedParams.categoria,
          hierarchy_type: hierarchyType
        })

        // ✅ NUEVO: Registrar visualización del producto
        trackProductView(productData.id, productData.descripcion)

      } catch (err) {
        console.error('Error loading product:', err)
        setError('Error al cargar el producto')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [resolvedParams.id, resolvedParams.categoria])

  // ... resto del código ...
}
```

O usa el hook personalizado:

```typescript
// Al inicio del archivo
import { useProductView } from '@/hooks/use-analytics'

// ... en el componente ...

// Trackear automáticamente cuando el producto cambia
useProductView(product?.id, product?.descripcion)
```

---

## Componente WhatsAppButton

Si tienes un componente WhatsAppButton, modifícalo así:

### Antes

```typescript
// components/WhatsAppButton.tsx
'use client'

interface WhatsAppButtonProps {
  producto: {
    id: number
    descripcion: string
  }
}

export default function WhatsAppButton({ producto }: WhatsAppButtonProps) {
  const handleClick = () => {
    const mensaje = `Hola! Me interesa el producto: ${producto.descripcion}`
    const phoneNumber = '5491234567890' // Tu número de WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`)
  }

  return (
    <button onClick={handleClick}>
      Consultar por WhatsApp
    </button>
  )
}
```

### Después

```typescript
// components/WhatsAppButton.tsx
'use client'

import { trackWhatsAppClick } from '@/lib/analytics'

interface WhatsAppButtonProps {
  producto: {
    id: number
    descripcion: string
  }
}

export default function WhatsAppButton({ producto }: WhatsAppButtonProps) {
  const handleClick = () => {
    // ✅ NUEVO: Registrar el click en WhatsApp
    trackWhatsAppClick(producto.id, producto.descripcion)

    const mensaje = `Hola! Me interesa el producto: ${producto.descripcion}`
    const phoneNumber = '5491234567890' // Tu número de WhatsApp
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(mensaje)}`)
  }

  return (
    <button onClick={handleClick}>
      Consultar por WhatsApp
    </button>
  )
}
```

---

## Componente AddToListButton

Modifica tu componente AddToListButton existente:

### Antes (aproximado)

```typescript
// components/AddToListButton.tsx
'use client'

import { useState } from 'react'

interface AddToListButtonProps {
  producto: {
    id: number
    descripcion: string
  }
}

export default function AddToListButton({ producto }: AddToListButtonProps) {
  const [isInList, setIsInList] = useState(false)

  const handleToggle = () => {
    if (isInList) {
      // Remover de la lista
      setIsInList(false)
      // Tu lógica existente para remover
    } else {
      // Agregar a la lista
      setIsInList(true)
      // Tu lógica existente para agregar
    }
  }

  return (
    <button onClick={handleToggle}>
      {isInList ? 'En la lista' : 'Agregar a lista'}
    </button>
  )
}
```

### Después

```typescript
// components/AddToListButton.tsx
'use client'

import { useState } from 'react'
import { trackShoppingListAdd, trackShoppingListRemove } from '@/lib/analytics'

interface AddToListButtonProps {
  producto: {
    id: number
    descripcion: string
  }
}

export default function AddToListButton({ producto }: AddToListButtonProps) {
  const [isInList, setIsInList] = useState(false)

  const handleToggle = () => {
    if (isInList) {
      // ✅ NUEVO: Registrar remoción de la lista
      trackShoppingListRemove(producto.id, producto.descripcion)

      setIsInList(false)
      // Tu lógica existente para remover
    } else {
      // ✅ NUEVO: Registrar agregado a la lista
      trackShoppingListAdd(producto.id, producto.descripcion)

      setIsInList(true)
      // Tu lógica existente para agregar
    }
  }

  return (
    <button onClick={handleToggle}>
      {isInList ? 'En la lista' : 'Agregar a lista'}
    </button>
  )
}
```

---

## Página de Búsqueda

### Antes (app/buscar/page.tsx - aproximado)

```typescript
'use client'

import { useState } from 'react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const handleSearch = async (searchQuery: string) => {
    // Tu lógica de búsqueda
    const searchResults = await fetchSearchResults(searchQuery)
    setResults(searchResults)
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
      />
      {/* Mostrar resultados */}
    </div>
  )
}
```

### Después

```typescript
'use client'

import { useState, useEffect } from 'react'
import { trackSearch, trackPageView } from '@/lib/analytics'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  // ✅ NUEVO: Trackear visita a la página de búsqueda
  useEffect(() => {
    trackPageView('search')
  }, [])

  const handleSearch = async (searchQuery: string) => {
    // Tu lógica de búsqueda
    const searchResults = await fetchSearchResults(searchQuery)
    setResults(searchResults)

    // ✅ NUEVO: Registrar la búsqueda
    if (searchQuery.trim()) {
      trackSearch(searchQuery, searchResults.length)
    }
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
      />
      {/* Mostrar resultados */}
    </div>
  )
}
```

---

## Página de Categoría

### app/[categoria]/page.tsx

Si esta página es Server Component, crea un wrapper client:

```typescript
// app/[categoria]/CategoryPageClient.tsx
'use client'

import { useEffect } from 'react'
import { trackPageView, trackCategoryView } from '@/lib/analytics'

interface CategoryPageClientProps {
  categoria: string
  categoriaId?: number
}

export default function CategoryPageClient({
  categoria,
  categoriaId
}: CategoryPageClientProps) {
  useEffect(() => {
    // Trackear visita a la página de categoría
    trackPageView('category', { categoria })

    // Si tienes el ID de la categoría, también registrar
    if (categoriaId) {
      trackCategoryView(categoriaId, categoria)
    }
  }, [categoria, categoriaId])

  return null // Este componente solo registra eventos
}
```

Y en `app/[categoria]/page.tsx`:

```typescript
import CategoryPageClient from './CategoryPageClient'
// ... otros imports ...

export default async function CategoryPage({ params }) {
  const { categoria } = await params

  // Obtener datos de la categoría...

  return (
    <div>
      {/* ✅ NUEVO: Agregar el tracker */}
      <CategoryPageClient
        categoria={categoria}
        categoriaId={categoriaData?.id}
      />

      {/* Resto del contenido */}
    </div>
  )
}
```

---

## Página de Presentación

### app/presentaciones/[presentacion]/page.tsx

Similar al caso anterior:

```typescript
// app/presentaciones/[presentacion]/PresentacionPageClient.tsx
'use client'

import { useEffect } from 'react'
import { trackPageView, trackPresentacionView } from '@/lib/analytics'

interface PresentacionPageClientProps {
  presentacion: string
}

export default function PresentacionPageClient({
  presentacion
}: PresentacionPageClientProps) {
  useEffect(() => {
    trackPageView('presentacion', { presentacion })
    trackPresentacionView(presentacion)
  }, [presentacion])

  return null
}
```

Y en la página principal:

```typescript
import PresentacionPageClient from './PresentacionPageClient'
// ... otros imports ...

export default async function PresentacionPage({ params }) {
  const { presentacion } = await params

  return (
    <div>
      <PresentacionPageClient presentacion={presentacion} />
      {/* Resto del contenido */}
    </div>
  )
}
```

---

## Componente FinancingPlansLarge

Si tienes un componente que muestra planes de financiación:

```typescript
// components/FinancingPlansLarge.tsx
'use client'

import { trackPlanView } from '@/lib/analytics'

interface Plan {
  id: number
  nombre: string
  // ... otros campos
}

export default function FinancingPlansLarge({ planes }: { planes: Plan[] }) {
  const handlePlanClick = (plan: Plan) => {
    // ✅ NUEVO: Registrar visualización del plan
    trackPlanView(plan.id, plan.nombre)

    // Tu lógica existente (mostrar modal, detalles, etc.)
  }

  return (
    <div>
      {planes.map(plan => (
        <div key={plan.id} onClick={() => handlePlanClick(plan)}>
          <h3>{plan.nombre}</h3>
        </div>
      ))}
    </div>
  )
}
```

---

## Resumen de Archivos a Modificar

Para implementar el sistema de analytics completo, necesitas modificar:

1. ✅ **Crear**: `lib/analytics.ts` (ya creado)
2. ✅ **Crear**: `hooks/use-analytics.ts` (ya creado)
3. **Modificar**: `app/page.tsx` → Crear `app/HomePageClient.tsx`
4. **Modificar**: `app/[categoria]/[id]/ProductPageClient.tsx`
5. **Modificar**: `components/WhatsAppButton.tsx`
6. **Modificar**: `components/AddToListButton.tsx`
7. **Modificar**: `app/buscar/page.tsx`
8. **Modificar**: `app/[categoria]/page.tsx` → Crear `app/[categoria]/CategoryPageClient.tsx`
9. **Modificar**: `app/presentaciones/[presentacion]/page.tsx`
10. **Modificar**: `components/FinancingPlansLarge.tsx` (si existe)

---

## Verificación

Después de implementar, puedes verificar que funciona:

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña "Console"
3. Navega por tu sitio
4. No deberías ver errores de analytics (los errores se registran pero no interrumpen)
5. Ve a Supabase → Tabla `analytics_events` y verifica que se están creando registros

¿Quieres que implemente alguno de estos cambios en específico?
