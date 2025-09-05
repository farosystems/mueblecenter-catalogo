"use client"

import { useEffect, useState, useRef } from "react"
import ProductCard from "./ProductCard"
import Pagination from "./Pagination"
import { getFeaturedProductsByZona } from "@/lib/supabase-products"
import { Product } from "@/lib/products"
import { useZonaContext } from "@/contexts/ZonaContext"
import { ChevronLeft, ChevronRight } from "lucide-react"

const FEATURED_PRODUCTS_PER_PAGE = 3

export default function FeaturedSection() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0)
  const { zonaSeleccionada } = useZonaContext()
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  // Cargar productos destacados - se ejecuta cuando cambia la zona
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const products = await getFeaturedProductsByZona(zonaSeleccionada?.id || null)
        setFeaturedProducts(products)
        setCurrentPage(1) // Resetear paginación al cambiar zona
      } catch (err) {
        setError('Error al cargar los productos destacados')
      } finally {
        setLoading(false)
      }
    }

    // Solo cargar productos si hay una zona seleccionada
    if (zonaSeleccionada) {
      loadFeaturedProducts()
    }
  }, [zonaSeleccionada])

  if (loading) {
    return (
      <section className="py-20 bg-featured-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Productos Destacados
            </h2>
            <p className="text-xl text-green-100">Cargando productos destacados...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20 bg-featured-gradient text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Productos Destacados
            </h2>
            <p className="text-xl text-red-300">Error al cargar los productos: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  // Calcular paginación para productos destacados
  const totalPages = Math.ceil(featuredProducts.length / FEATURED_PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * FEATURED_PRODUCTS_PER_PAGE
  const displayProducts = featuredProducts.slice(startIndex, startIndex + FEATURED_PRODUCTS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll suave a la sección de destacados
    document.getElementById("destacados")?.scrollIntoView({ behavior: "smooth" })
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
    if (currentMobileIndex < featuredProducts.length - 1) {
      scrollToMobileIndex(currentMobileIndex + 1)
    }
  }

  const handleMobilePrev = () => {
    if (currentMobileIndex > 0) {
      scrollToMobileIndex(currentMobileIndex - 1)
    }
  }

  // Detectar scroll en el carrusel móvil para actualizar el índice
  const handleMobileScroll = () => {
    if (mobileScrollRef.current) {
      const scrollLeft = mobileScrollRef.current.scrollLeft
      const itemWidth = mobileScrollRef.current.offsetWidth
      const newIndex = Math.round(scrollLeft / itemWidth)
      if (newIndex !== currentMobileIndex) {
        setCurrentMobileIndex(newIndex)
      }
    }
  }

  return (
    <section
      id="destacados"
      className="py-20 bg-featured-gradient text-white relative overflow-hidden"
    >
      {/* Fondo animado */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-float delay-200"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Productos Destacados
          </h2>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Los electrodomésticos más vendidos y preferidos por nuestros clientes
          </p>
          <div className="w-24 h-1 bg-white mx-auto mt-4 rounded-full animate-pulse-glow"></div>
        </div>

        {/* Contador de productos destacados - Solo desktop */}
        <div className="mb-8 text-center hidden md:block">
          <p className="text-green-100">
            Mostrando <span className="font-semibold text-white">{displayProducts.length}</span> de{" "}
            <span className="font-semibold text-white">{featuredProducts.length}</span> productos destacados
          </p>
        </div>

        {/* Contador móvil */}
        <div className="mb-8 text-center md:hidden">
          <p className="text-green-100">
            <span className="font-semibold text-white">{currentMobileIndex + 1}</span> de{" "}
            <span className="font-semibold text-white">{featuredProducts.length}</span> productos destacados
          </p>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="text-center">
            <p className="text-xl text-green-100">No hay productos destacados disponibles</p>
          </div>
        ) : (
          <>
            {/* Vista Desktop - Grid con paginación */}
            <div className="hidden md:block">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayProducts.map((product, index) => (
                  <div
                    key={`${product.id}-${currentPage}`}
                    className={`transition-all duration-700 ${
                      index === 0
                        ? "delay-100 animate-fade-in-up"
                        : index === 1
                          ? "delay-200 animate-fade-in-up"
                          : "delay-300 animate-fade-in-up"
                    }`}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Paginación para productos destacados */}
              {featuredProducts.length > FEATURED_PRODUCTS_PER_PAGE && (
                <div className="mt-12">
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                </div>
              )}
            </div>

            {/* Vista Móvil - Carrusel */}
            <div className="md:hidden relative">
              {/* Botones de navegación */}
              <button
                onClick={handleMobilePrev}
                disabled={currentMobileIndex === 0}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                <ChevronLeft size={24} className="text-white" />
              </button>

              <button
                onClick={handleMobileNext}
                disabled={currentMobileIndex === featuredProducts.length - 1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm rounded-full p-2 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
              >
                <ChevronRight size={24} className="text-white" />
              </button>

              {/* Carrusel con scroll horizontal */}
              <div
                ref={mobileScrollRef}
                onScroll={handleMobileScroll}
                className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {featuredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="min-w-full snap-center px-4"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Indicadores de puntos */}
              <div className="flex justify-center space-x-2 mt-6">
                {featuredProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToMobileIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentMobileIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
