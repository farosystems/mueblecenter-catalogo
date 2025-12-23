/**
 * Componente PageTracker
 *
 * Componente auxiliar para agregar tracking a páginas sin modificar mucho código.
 * Útil para páginas que son Server Components y no pueden usar hooks directamente.
 *
 * @example
 * // En cualquier página server component
 * import PageTracker from '@/components/PageTracker'
 *
 * export default async function MyPage() {
 *   return (
 *     <div>
 *       <PageTracker pageName="my_page" />
 *       {/* resto del contenido *\/}
 *     </div>
 *   )
 * }
 *
 * @example
 * // Con datos adicionales
 * <PageTracker
 *   pageName="category"
 *   data={{ categoria: 'muebles' }}
 * />
 *
 * @example
 * // Trackear categoría
 * <PageTracker
 *   pageName="category"
 *   trackCategory={{
 *     id: 123,
 *     nombre: 'Muebles de Oficina'
 *   }}
 * />
 *
 * @example
 * // Trackear producto
 * <PageTracker
 *   pageName="product_detail"
 *   trackProduct={{
 *     id: 456,
 *     nombre: 'Silla Ergonómica'
 *   }}
 * />
 */

'use client'

import { useEffect } from 'react'
import {
  trackPageView,
  trackCategoryView,
  trackProductView,
  trackPresentacionView,
  trackLineaView,
  trackTipoView
} from '@/lib/analytics'

interface PageTrackerProps {
  /** Nombre de la página para el tracking */
  pageName: string

  /** Datos adicionales opcionales para el page_view */
  data?: Record<string, any>

  /** Si se proporciona, también registra una vista de categoría */
  trackCategory?: {
    id: number
    nombre: string
  }

  /** Si se proporciona, también registra una vista de producto */
  trackProduct?: {
    id: number
    nombre: string
  }

  /** Si se proporciona, también registra una vista de presentación */
  trackPresentacion?: {
    nombre: string
  }

  /** Si se proporciona, también registra una vista de línea */
  trackLinea?: {
    nombre: string
    presentacion: string
  }

  /** Si se proporciona, también registra una vista de tipo */
  trackTipo?: {
    nombre: string
    linea: string
    presentacion: string
  }
}

export default function PageTracker({
  pageName,
  data,
  trackCategory,
  trackProduct,
  trackPresentacion,
  trackLinea,
  trackTipo
}: PageTrackerProps) {
  useEffect(() => {
    // Siempre trackear la visita a la página
    trackPageView(pageName, data)

    // Trackear categoría si se proporciona
    if (trackCategory) {
      trackCategoryView(trackCategory.id, trackCategory.nombre)
    }

    // Trackear producto si se proporciona
    if (trackProduct) {
      trackProductView(trackProduct.id, trackProduct.nombre)
    }

    // Trackear presentación si se proporciona
    if (trackPresentacion) {
      trackPresentacionView(trackPresentacion.nombre)
    }

    // Trackear línea si se proporciona
    if (trackLinea) {
      trackLineaView(trackLinea.nombre, trackLinea.presentacion)
    }

    // Trackear tipo si se proporciona
    if (trackTipo) {
      trackTipoView(trackTipo.nombre, trackTipo.linea, trackTipo.presentacion)
    }
  }, [pageName, data, trackCategory, trackProduct, trackPresentacion, trackLinea, trackTipo])

  // Este componente no renderiza nada
  return null
}
