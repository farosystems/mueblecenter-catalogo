"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Package } from "lucide-react"
import Link from "next/link"
import { getCategories } from "@/lib/supabase-products"
import { Categoria } from "@/lib/products"

const CATEGORIES_PER_SLIDE = 5

export default function CategoriesCarousel() {
  const [categories, setCategories] = useState<Categoria[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadCategories()
  }, [])

  const totalSlides = Math.ceil(categories.length / CATEGORIES_PER_SLIDE)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const getCurrentCategories = () => {
    const start = currentSlide * CATEGORIES_PER_SLIDE
    return categories.slice(start, start + CATEGORIES_PER_SLIDE)
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Categorías</h2>
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

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nuestras Categorías</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Descubre todos los productos organizados por categorías
          </p>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="relative">
          {/* Carrusel de categorías */}
          <div className={`overflow-hidden transition-all duration-1000 delay-300 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                const slideCategories = categories.slice(
                  slideIndex * CATEGORIES_PER_SLIDE,
                  slideIndex * CATEGORIES_PER_SLIDE + CATEGORIES_PER_SLIDE
                )
                
                return (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                      {slideCategories.map((category, index) => {
                        const slug = category.descripcion?.toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/^-+|-+$/g, '')
                        
                        return (
                          <Link
                            key={category.id}
                            href={`/${slug}`}
                            className="group"
                          >
                            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border-2 border-green-200 hover:border-green-400 transform hover:scale-105 group-hover:bg-green-50">
                              <div className="flex flex-col items-center text-center">
                                {/* Logo de la categoría */}
                                <div className="w-16 h-16 mb-4 flex items-center justify-center">
                                  {category.logo ? (
                                    <img
                                      src={category.logo}
                                      alt={category.descripcion}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.style.display = 'none'
                                        target.nextElementSibling?.classList.remove('hidden')
                                      }}
                                    />
                                  ) : null}
                                  <Package 
                                    className={`w-12 h-12 text-green-600 ${category.logo ? 'hidden' : ''}`} 
                                  />
                                </div>
                                
                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
                                  {category.descripcion}
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

          {/* Botones de navegación */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-green-50 hover:shadow-xl transition-all duration-300 border border-green-200"
              >
                <ChevronLeft className="w-6 h-6 text-green-600" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white shadow-lg rounded-full p-3 hover:bg-green-50 hover:shadow-xl transition-all duration-300 border border-green-200"
              >
                <ChevronRight className="w-6 h-6 text-green-600" />
              </button>
            </>
          )}

          {/* Indicadores de slide */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
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

        {/* Botón ver todas las categorías */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-500 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <Link
            href="/categorias"
            className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Package className="mr-2 w-5 h-5" />
            Ver todas las categorías
          </Link>
        </div>
      </div>
    </section>
  )
}