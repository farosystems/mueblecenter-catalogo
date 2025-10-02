"use client"

import { useEffect, useState } from "react"
import { useConfiguracion } from "@/hooks/use-configuracion"
import { useZonaContext } from "@/contexts/ZonaContext"
import { Card } from "@/components/ui/card"

export default function BannersSection() {
  const { banners, loading, error } = useConfiguracion()
  const { zonaSeleccionada } = useZonaContext()
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const changeBanner = (newIndex: number) => {
    if (newIndex !== currentBanner && !isAnimating) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentBanner(newIndex)
        setIsAnimating(false)
      }, 500)
    }
  }

  // Función para obtener el número de WhatsApp según la zona
  const getWhatsAppNumber = () => {
    if (!zonaSeleccionada) return '1130938491' // Default: Escobar

    const whatsappMap: Record<string, string> = {
      'Escobar': '1130938491',
      'Maschwitz': '1130938487',
      'Matheu': '1128505547',
      'Garin': '1130938486',
      'Cardales': '1130938483',
      'Capilla del señor': '1130938492'
    }

    return whatsappMap[zonaSeleccionada.nombre || ''] || '1130938491'
  }

  // Función para abrir WhatsApp cuando se hace clic en el banner
  const handleBannerClick = () => {
    const phoneNumber = getWhatsAppNumber()
    const message = encodeURIComponent('Hola, me gustaría obtener más información acerca de los créditos personales')
    window.open(`https://wa.me/549${phoneNumber}?text=${message}`, '_blank')
  }

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        changeBanner((currentBanner + 1) % banners.length)
      }, 5000) // Cambiar banner cada 5 segundos

      return () => clearInterval(interval)
    }
  }, [banners.length, currentBanner])

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </section>
    )
  }

  if (error || banners.length === 0) {
    return null
  }

  return (
    <section className="relative w-full py-16 bg-green-gradient">
      {/* Fondo animado igual que productos destacados */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-float delay-200"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4">
            {/* Banner principal */}
            <div className="relative w-full rounded-xl overflow-hidden shadow-xl">
              <div className="relative flex transition-transform duration-500 ease-in-out"
                   style={{ transform: `translateX(-${currentBanner * 100}%)` }}>
                {banners.map((banner, index) => (
                  <div
                    key={index}
                    className={`w-full flex-shrink-0 bg-white flex items-center justify-center min-h-[200px] ${
                      index === 0 ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''
                    }`}
                    onClick={index === 0 ? handleBannerClick : undefined}
                  >
                    <img
                      src={banner}
                      alt={`Banner ${index + 1}`}
                      className="max-w-full max-h-[80vh] w-auto h-auto object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
              
              {/* Indicadores de banner múltiples */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => changeBanner(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-500 ease-in-out transform ${
                        index === currentBanner
                          ? "bg-white scale-125 shadow-lg animate-pulse"
                          : "bg-gray-400 hover:bg-white hover:scale-110"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Navegación manual para banners múltiples */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={() => changeBanner((currentBanner - 1 + banners.length) % banners.length)}
                  disabled={isAnimating}
                  className={`absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-green-900 rounded-full p-3 shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
                    isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-3xl'
                  }`}
                >
                  <svg className="w-6 h-6 transition-transform duration-300 hover:translate-x-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => changeBanner((currentBanner + 1) % banners.length)}
                  disabled={isAnimating}
                  className={`absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-green-900 rounded-full p-3 shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 ${
                    isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-3xl'
                  }`}
                >
                  <svg className="w-6 h-6 transition-transform duration-300 hover:translate-x-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}