/**
 * Sistema de Analytics para el Catálogo MuebleCenter
 *
 * Este archivo permite registrar eventos de analytics en Supabase.
 * Registra acciones de usuarios en las tablas analytics_events y analytics_daily_metrics.
 */

import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Tipos de eventos disponibles
 */
export type EventType =
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

/**
 * Interfaz para los parámetros del evento
 */
interface TrackEventParams {
  eventType: EventType
  eventData?: Record<string, any>
  productoId?: number
  zonaId?: number
  userId?: string
}

/**
 * Genera o recupera el ID de sesión del navegador
 */
function getOrCreateSessionId(): string {
  const SESSION_KEY = 'analytics_session_id'

  // Verificar si estamos en el navegador
  if (typeof window === 'undefined') return ''

  let sessionId = localStorage.getItem(SESSION_KEY)

  if (!sessionId) {
    // Generar un ID único de sesión
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem(SESSION_KEY, sessionId)
  }

  return sessionId
}

/**
 * Verifica si ya se registró un evento específico en esta sesión
 */
function hasTrackedInSession(eventKey: string): boolean {
  const TRACKED_KEY = 'analytics_tracked_events'

  if (typeof window === 'undefined') return false

  const tracked = sessionStorage.getItem(TRACKED_KEY)
  const trackedEvents = tracked ? JSON.parse(tracked) : {}

  return trackedEvents[eventKey] === true
}

/**
 * Marca un evento como rastreado en esta sesión
 */
function markAsTrackedInSession(eventKey: string): void {
  const TRACKED_KEY = 'analytics_tracked_events'

  if (typeof window === 'undefined') return

  const tracked = sessionStorage.getItem(TRACKED_KEY)
  const trackedEvents = tracked ? JSON.parse(tracked) : {}

  trackedEvents[eventKey] = true
  sessionStorage.setItem(TRACKED_KEY, JSON.stringify(trackedEvents))
}

/**
 * Función principal para registrar eventos de analytics
 *
 * @param params - Parámetros del evento
 * @returns Promise<void>
 *
 * @example
 * // Registrar una visita a la página
 * trackEvent({
 *   eventType: 'page_view',
 *   eventData: { page: 'home' }
 * })
 *
 * @example
 * // Registrar click en WhatsApp
 * trackEvent({
 *   eventType: 'whatsapp_click',
 *   eventData: { producto_nombre: producto.descripcion },
 *   productoId: producto.id
 * })
 */
export async function trackEvent({
  eventType,
  eventData = {},
  productoId,
  zonaId,
  userId
}: TrackEventParams): Promise<void> {
  try {
    // Obtener o crear session ID
    const sessionId = getOrCreateSessionId()

    // Insertar evento en Supabase
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event_type: eventType,
        event_data: eventData,
        session_id: sessionId,
        user_id: userId,
        fk_id_producto: productoId,
        fk_id_zona: zonaId,
      })

    if (error) {
      console.error('Error tracking event:', error)
    }
  } catch (error) {
    // No lanzar error para no interrumpir la experiencia del usuario
    console.error('Error in trackEvent:', error)
  }
}

/**
 * Funciones helper para eventos comunes
 */

/**
 * Registrar visita a página (solo una vez por sesión)
 */
export function trackPageView(page: string, additionalData?: Record<string, any>) {
  // Crear una clave única para esta página
  const eventKey = `page_view_${page}_${JSON.stringify(additionalData || {})}`

  // Solo registrar si no se ha registrado antes en esta sesión
  if (hasTrackedInSession(eventKey)) {
    return Promise.resolve()
  }

  // Marcar como registrado
  markAsTrackedInSession(eventKey)

  return trackEvent({
    eventType: 'page_view',
    eventData: { page, ...additionalData }
  })
}

/**
 * Registrar click en WhatsApp
 */
export function trackWhatsAppClick(productoId: number, productoNombre: string) {
  return trackEvent({
    eventType: 'whatsapp_click',
    eventData: { producto_nombre: productoNombre },
    productoId
  })
}

/**
 * Registrar agregar a lista de compras
 */
export function trackShoppingListAdd(productoId: number, productoNombre: string) {
  return trackEvent({
    eventType: 'shopping_list_add',
    eventData: { producto_nombre: productoNombre },
    productoId
  })
}

/**
 * Registrar remover de lista de compras
 */
export function trackShoppingListRemove(productoId: number, productoNombre: string) {
  return trackEvent({
    eventType: 'shopping_list_remove',
    eventData: { producto_nombre: productoNombre },
    productoId
  })
}

/**
 * Registrar visualización de producto (solo una vez por sesión)
 */
export function trackProductView(productoId: number, productoNombre: string) {
  // Crear una clave única para este producto
  const eventKey = `product_view_${productoId}`

  // Solo registrar si no se ha registrado antes en esta sesión
  if (hasTrackedInSession(eventKey)) {
    return Promise.resolve()
  }

  // Marcar como registrado
  markAsTrackedInSession(eventKey)

  return trackEvent({
    eventType: 'product_view',
    eventData: { producto_nombre: productoNombre },
    productoId
  })
}

/**
 * Registrar búsqueda
 */
export function trackSearch(query: string, resultsCount: number) {
  return trackEvent({
    eventType: 'search',
    eventData: {
      query,
      results_count: resultsCount,
      timestamp: new Date().toISOString()
    }
  })
}

/**
 * Registrar visualización de plan
 */
export function trackPlanView(planId: number, planNombre: string) {
  return trackEvent({
    eventType: 'plan_view',
    eventData: {
      plan_id: planId,
      plan_nombre: planNombre
    }
  })
}

/**
 * Registrar visualización de categoría
 */
export function trackCategoryView(categoriaId: number, categoriaNombre: string) {
  return trackEvent({
    eventType: 'category_view',
    eventData: {
      categoria_id: categoriaId,
      categoria_nombre: categoriaNombre
    }
  })
}

/**
 * Registrar visualización de marca
 */
export function trackBrandView(marcaId: number, marcaNombre: string) {
  return trackEvent({
    eventType: 'brand_view',
    eventData: {
      marca_id: marcaId,
      marca_nombre: marcaNombre
    }
  })
}

/**
 * Registrar visualización de presentación (solo una vez por sesión)
 */
export function trackPresentacionView(presentacionNombre: string) {
  // Crear una clave única para esta presentación
  const eventKey = `presentacion_view_${presentacionNombre}`

  // Solo registrar si no se ha registrado antes en esta sesión
  if (hasTrackedInSession(eventKey)) {
    return Promise.resolve()
  }

  // Marcar como registrado
  markAsTrackedInSession(eventKey)

  return trackEvent({
    eventType: 'presentacion_view',
    eventData: {
      presentacion_nombre: presentacionNombre
    }
  })
}

/**
 * Registrar visualización de línea
 */
export function trackLineaView(lineaNombre: string, presentacionNombre: string) {
  return trackEvent({
    eventType: 'linea_view',
    eventData: {
      linea_nombre: lineaNombre,
      presentacion_nombre: presentacionNombre
    }
  })
}

/**
 * Registrar visualización de tipo
 */
export function trackTipoView(tipoNombre: string, lineaNombre: string, presentacionNombre: string) {
  return trackEvent({
    eventType: 'tipo_view',
    eventData: {
      tipo_nombre: tipoNombre,
      linea_nombre: lineaNombre,
      presentacion_nombre: presentacionNombre
    }
  })
}
