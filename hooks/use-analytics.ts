/**
 * Hook personalizado para facilitar el uso del sistema de analytics
 */

import { useEffect } from 'react'
import { trackPageView, trackEvent, EventType } from '@/lib/analytics'

/**
 * Hook para registrar automáticamente la visita a una página
 *
 * @param pageName - Nombre de la página
 * @param additionalData - Datos adicionales opcionales
 *
 * @example
 * // En cualquier componente de página
 * function HomePage() {
 *   usePageTracking('home')
 *   return <div>...</div>
 * }
 *
 * @example
 * // Con datos adicionales
 * function CategoryPage({ params }) {
 *   usePageTracking('category', { categoria: params.categoria })
 *   return <div>...</div>
 * }
 */
export function usePageTracking(pageName: string, additionalData?: Record<string, any>) {
  useEffect(() => {
    trackPageView(pageName, additionalData)
  }, [pageName, JSON.stringify(additionalData)])
}

/**
 * Hook para registrar eventos personalizados
 *
 * @returns Función para registrar eventos
 *
 * @example
 * function MyComponent() {
 *   const trackAnalytics = useTrackEvent()
 *
 *   const handleClick = () => {
 *     trackAnalytics({
 *       eventType: 'whatsapp_click',
 *       eventData: { producto_nombre: 'Silla ergonómica' },
 *       productoId: 123
 *     })
 *   }
 *
 *   return <button onClick={handleClick}>Click</button>
 * }
 */
export function useTrackEvent() {
  return trackEvent
}

/**
 * Hook para registrar visualización de productos
 * Se ejecuta automáticamente cuando cambia el ID del producto
 *
 * @param productoId - ID del producto
 * @param productoNombre - Nombre del producto
 *
 * @example
 * function ProductDetail({ producto }) {
 *   useProductView(producto.id, producto.descripcion)
 *   return <div>...</div>
 * }
 */
export function useProductView(productoId: number | undefined, productoNombre: string | undefined) {
  useEffect(() => {
    if (productoId && productoNombre) {
      trackEvent({
        eventType: 'product_view',
        eventData: { producto_nombre: productoNombre },
        productoId
      })
    }
  }, [productoId, productoNombre])
}

/**
 * Hook para registrar visualización de categorías
 *
 * @param categoriaId - ID de la categoría
 * @param categoriaNombre - Nombre de la categoría
 *
 * @example
 * function CategoryPage({ categoria }) {
 *   useCategoryView(categoria.id, categoria.nombre)
 *   return <div>...</div>
 * }
 */
export function useCategoryView(categoriaId: number | undefined, categoriaNombre: string | undefined) {
  useEffect(() => {
    if (categoriaId && categoriaNombre) {
      trackEvent({
        eventType: 'category_view',
        eventData: {
          categoria_id: categoriaId,
          categoria_nombre: categoriaNombre
        }
      })
    }
  }, [categoriaId, categoriaNombre])
}
