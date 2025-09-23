"use client"

import { useState, useEffect } from "react"
import { MapPin, Building2, CheckCircle } from "lucide-react"
import { useZonas } from "@/hooks/use-zonas"
import { useZonaContext } from "@/contexts/ZonaContext"
import { getLogo } from "@/lib/supabase-config"
import type { Zona } from "@/lib/supabase-config"

interface ZonaSelectorModalProps {
  isOpen: boolean
  onClose?: () => void
}

export default function ZonaSelectorModal({ isOpen, onClose }: ZonaSelectorModalProps) {
  const { zonas, loading, error } = useZonas()
  const { setZonaSeleccionada } = useZonaContext()
  const [selectedZona, setSelectedZona] = useState<Zona | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [logo, setLogo] = useState<string>('')
  const [logoLoading, setLogoLoading] = useState(true)

  // Cargar logo cuando el modal se abra
  useEffect(() => {
    if (isOpen) {
      const loadLogo = async () => {
        try {
          setLogoLoading(true)
          const logoUrl = await getLogo()
          if (logoUrl) {
            setLogo(logoUrl)
          } else {
            setLogo('/logo.png')
          }
        } catch (error) {
          console.error('Error al cargar logo:', error)
          setLogo('/logo.png')
        } finally {
          setLogoLoading(false)
        }
      }
      loadLogo()
    }
  }, [isOpen])

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY

      // Aplicar estilos para bloquear el scroll del body
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      // Prevenir scroll pero permitir dentro del modal
      const preventScroll = (e: Event) => {
        const target = e.target as Element
        const modalContainer = document.querySelector('[data-modal-scroll-container]')

        // Si el evento proviene del contenedor del modal o sus hijos, permitirlo
        if (modalContainer && (modalContainer.contains(target) || target === modalContainer)) {
          return
        }

        // Sino, prevenir el scroll
        e.preventDefault()
        return false
      }

      // Agregar listeners para diferentes tipos de eventos de scroll
      document.addEventListener('wheel', preventScroll, { passive: false })
      document.addEventListener('touchmove', preventScroll, { passive: false })

      // Cleanup
      return () => {
        // Restaurar el scroll
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''

        // Restaurar la posición del scroll
        window.scrollTo(0, scrollY)

        // Remover listeners
        document.removeEventListener('wheel', preventScroll)
        document.removeEventListener('touchmove', preventScroll)
      }
    }
  }, [isOpen])

  // Prevenir propagación del scroll cuando se alcanza el límite del contenedor
  const handleScrollContainer = (e: React.WheelEvent) => {
    const container = e.currentTarget
    const { scrollTop, scrollHeight, clientHeight } = container

    // Si estamos en el tope y scrolleando hacia arriba, o en el fondo y scrolleando hacia abajo
    if ((scrollTop === 0 && e.deltaY < 0) || (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0)) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  // Manejar eventos táctiles para mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    const container = e.currentTarget
    const { scrollTop, scrollHeight, clientHeight } = container

    // Permitir scroll solo dentro del contenedor
    if (scrollTop === 0 || scrollTop + clientHeight >= scrollHeight) {
      e.preventDefault()
    }
  }

  const handleZonaSelect = async (zona: Zona) => {
    setSelectedZona(zona)
    setIsSelecting(true)
    
    // Pequeña animación/delay para mejor UX
    setTimeout(() => {
      setZonaSeleccionada(zona)
      setIsSelecting(false)
      if (onClose) {
        onClose()
      }
    }, 800)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300 ease-out flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white p-6 sm:p-8 relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              {logoLoading ? (
                <div className="w-32 h-32 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative mx-auto w-12 h-12 mb-2">
                      <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
                      <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-white/80 text-xs">Cargando...</p>
                  </div>
                </div>
              ) : (
                <img
                  src={logo}
                  alt="Logo"
                  className="w-32 h-32 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/logo.png'
                  }}
                />
              )}
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">¡Bienvenido!</h2>
            <p className="text-green-100 text-center text-sm leading-relaxed">
              Selecciona tu zona para ver los productos disponibles en tu área
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="relative mx-auto w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cargando zonas...</h3>
              <p className="text-gray-600 text-sm">Estamos preparando las opciones disponibles</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar zonas</h3>
              <p className="text-red-600 text-sm mb-6">{error}</p>
            </div>
          ) : zonas.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay zonas disponibles</h3>
              <p className="text-gray-600 text-sm">Contacta al administrador para configurar las zonas</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Zonas disponibles</h3>
                <p className="text-gray-600 text-sm">Elige la zona más cercana a tu ubicación</p>
              </div>
              
              <div
                data-modal-scroll-container
                className="space-y-3 max-h-60 sm:max-h-80 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-green-300 scrollbar-thumb-rounded-full"
                onWheel={handleScrollContainer}
                onTouchMove={handleTouchMove}
              >
                {zonas.map((zona) => (
                  <button
                    key={zona.id}
                    onClick={() => handleZonaSelect(zona)}
                    disabled={isSelecting}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center group-hover:from-green-200 group-hover:to-green-300 transition-colors">
                          <MapPin size={24} className="text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors text-lg">
                            {zona.nombre || `Zona ${zona.id}`}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Ver productos disponibles
                          </p>
                        </div>
                      </div>
                      
                      {isSelecting && selectedZona?.id === zona.id ? (
                        <div className="flex items-center space-x-2">
                          <CheckCircle size={24} className="text-green-500" />
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full group-hover:border-green-400 transition-colors"></div>
                      )}
                    </div>
                    
                    {/* Efecto hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 via-green-600/5 to-green-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t flex-shrink-0">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <MapPin size={14} />
            <span>La zona seleccionada determinará los productos disponibles</span>
          </div>
        </div>
      </div>
    </div>
  )
}