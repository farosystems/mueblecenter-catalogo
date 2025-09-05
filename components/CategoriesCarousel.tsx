"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"
import Link from "next/link"
import { getPresentaciones } from "@/lib/supabase-products"
import { Presentacion } from "@/lib/products"

const CATEGORIES_PER_SLIDE = 5

export default function CategoriesCarousel() {
  const [presentaciones, setPresentaciones] = useState<Presentacion[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const loadPresentaciones = async () => {
      try {
        const presentacionesData = await getPresentaciones()
        setPresentaciones(presentacionesData)
      } catch (error) {
        console.error('Error loading presentaciones:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadPresentaciones()
  }, [])

  const totalSlides = Math.ceil(presentaciones.length / CATEGORIES_PER_SLIDE)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentPresentaciones = () => {
    const start = currentSlide * CATEGORIES_PER_SLIDE
    return presentaciones.slice(start, start + CATEGORIES_PER_SLIDE)
  }

  // Funciones para el carrusel móvil
  const scrollToMobileIndex = (index: number) => {
    if (mobileScrollRef.current) {
      const scrollLeft = index * mobileScrollRef.current.offsetWidth
      mobileScrollRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      })
      setCurrentMobileIndex(index)
    }
  }

  const handleMobileNext = () => {
    if (currentMobileIndex < presentaciones.length - 1) {
      scrollToMobileIndex(currentMobileIndex + 1)
    }
  }

  const handleMobilePrev = () => {
    if (currentMobileIndex > 0) {
      scrollToMobileIndex(currentMobileIndex - 1)
    }
  }

  const handleMobileScroll = () => {
    if (mobileScrollRef.current) {
      const scrollLeft = mobileScrollRef.current.scrollLeft
      const itemWidth = mobileScrollRef.current.offsetWidth
      const newIndex = Math.round(scrollLeft / itemWidth)
      if (newIndex !== currentMobileIndex && newIndex >= 0 && newIndex < presentaciones.length) {
        setCurrentMobileIndex(newIndex)
      }
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Presentaciones</h2>
            <div className="animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-32 bg-gray-200 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (presentaciones.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Presentaciones</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre todos los productos organizados por presentaciones
          </p>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="relative">
          {/* Contador móvil */}
          <div className="mb-8 text-center md:hidden">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{currentMobileIndex + 1}</span> de{" "}
              <span className="font-semibold text-gray-900">{presentaciones.length}</span> presentaciones
            </p>
          </div>

          {/* Vista Desktop - Grid con carrusel tradicional */}
          <div className={`hidden md:block overflow-hidden transition-all duration-1000 delay-300 p-2 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                const slidePresentaciones = presentaciones.slice(
                  slideIndex * CATEGORIES_PER_SLIDE,
                  slideIndex * CATEGORIES_PER_SLIDE + CATEGORIES_PER_SLIDE
                )
                
                return (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-5 gap-6 p-2">
                      {slidePresentaciones.map((presentacion) => {
                        const slug = presentacion.nombre?.toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-+|-+$/g, '')
                        
                        return (
                          <Link
                            key={presentacion.id}
                            href={`/presentaciones/${slug}`}
                            className="group"
                          >
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border-2 border-green-200 hover:border-green-400 transform hover:scale-105 group-hover:bg-green-50 min-h-[200px]">
                              <div className="flex flex-col items-center text-center h-full justify-between">
                                {/* Imagen de la presentación */}
                                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                                  {presentacion.imagen ? (
                                    <img
                                      src={presentacion.imagen}
                                      alt={presentacion.nombre}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                        target.nextElementSibling?.classList.remove('hidden')
                                      }}
                                    />
                                  ) : null}
                                  <Package 
                                    className={`w-12 h-12 text-green-600 ${presentacion.imagen ? 'hidden' : ''}`} 
                                  />
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-2 min-h-[3rem] flex items-center justify-center text-center leading-tight break-words">
                                  {presentacion.nombre}
                                </h3>
                                
                                <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                                    Ver productos
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Vista Móvil - Carrusel horizontal con swipe */}
          <div className={`md:hidden relative transition-all duration-1000 delay-300 p-2 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            {/* Botones de navegación */}
            <button
              onClick={handleMobilePrev}
              disabled={currentMobileIndex === 0}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shadow-lg"
            >
              <ChevronLeft size={24} className="text-green-600" />
            </button>

            <button
              onClick={handleMobileNext}
              disabled={currentMobileIndex === presentaciones.length - 1}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity shadow-lg"
            >
              <ChevronRight size={24} className="text-green-600" />
            </button>

            {/* Carrusel con scroll horizontal */}
            <div
              ref={mobileScrollRef}
              onScroll={handleMobileScroll}
              className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {presentaciones.map((presentacion) => {
                const slug = presentacion.nombre?.toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-+|-+$/g, '')
                
                return (
                  <div
                    key={presentacion.id}
                    className="min-w-full snap-center px-4"
                  >
                    <Link href={`/presentaciones/${slug}`} className="group block">
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-green-200 hover:border-green-400 group-hover:bg-green-50 min-h-[180px]">
                        <div className="flex flex-col items-center text-center h-full justify-between">
                          {/* Imagen de la presentación */}
                          <div className="w-12 h-12 mb-3 flex items-center justify-center">
                            {presentacion.imagen ? (
                              <img
                                src={presentacion.imagen}
                                alt={presentacion.nombre}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  target.nextElementSibling?.classList.remove('hidden')
                                }}
                              />
                            ) : null}
                            <Package 
                              className={`w-10 h-10 text-green-600 ${presentacion.imagen ? 'hidden' : ''}`} 
                            />
                          </div>
                          
                          <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-2 text-center leading-tight break-words">
                            {presentacion.nombre}
                          </h3>
                          
                          <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                              Ver productos
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* Indicadores de puntos para móvil */}
            <div className="flex justify-center space-x-2 mt-6">
              {presentaciones.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToMobileIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentMobileIndex 
                      ? 'bg-green-600 scale-125' 
                      : 'bg-gray-300 hover:bg-green-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Botones de navegación desktop */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden md:block absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-green-50 hover:shadow-xl transition-all duration-300 border border-green-200"
              >
                <ChevronLeft className="w-6 h-6 text-green-600" />
              </button>
              
              <button
                onClick={nextSlide}
                className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-green-50 hover:shadow-xl transition-all duration-300 border border-green-200"
              >
                <ChevronRight className="w-6 h-6 text-green-600" />
              </button>
            </>
          )}

          {/* Indicadores de slide desktop */}
          {totalSlides > 1 && (
            <div className="hidden md:flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-green-600 scale-125"
                      : "bg-gray-300 hover:bg-green-400"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Botón ver todas las presentaciones */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <Link
            href="/presentaciones"
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Package className="mr-2 w-5 h-5" />
            Ver todas las presentaciones
          </Link>
        </div>
      </div>
    </section>
  )
}