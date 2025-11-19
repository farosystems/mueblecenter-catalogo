"use client"

import { useState, useEffect } from "react"
import { Package, Filter } from "lucide-react"
import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import Pagination from "@/components/Pagination"
import { useProducts } from "@/hooks/use-products"
import { useZonaContext } from "@/contexts/ZonaContext"
import { ZonaGuard } from "@/components/ZonaGuard"

const PRODUCTS_PER_PAGE = 12

export default function ProductosPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [animateProducts, setAnimateProducts] = useState(false)
  const { zonaSeleccionada } = useZonaContext()

  const {
    products,
    loading,
    error
  } = useProducts({ zonaId: zonaSeleccionada?.id || null })

  // Calcular paginación
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setAnimateProducts(true)
    const timer = setTimeout(() => setAnimateProducts(false), 100)

    // Scroll suave al inicio de los productos
    document.getElementById("productos-grid")?.scrollIntoView({ behavior: "smooth" })

    return () => clearTimeout(timer)
  }

  if (loading) {
    return (
      <ZonaGuard>
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
          <GlobalAppBar />
          <div className="flex items-center justify-center py-20" style={{ marginTop: '10px' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-custom mx-auto mb-4"></div>
              <h2 className="text-2xl font-bold text-gray-900">Cargando productos...</h2>
            </div>
          </div>
          <Footer />
        </div>
      </ZonaGuard>
    )
  }

  if (error) {
    return (
      <ZonaGuard>
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
          <GlobalAppBar />
          <div className="flex items-center justify-center py-20" style={{ marginTop: '140px' }}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error al cargar productos</h2>
              <p className="text-xl text-red-600">{error}</p>
            </div>
          </div>
          <Footer />
        </div>
      </ZonaGuard>
    )
  }

  return (
    <ZonaGuard>
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <GlobalAppBar />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-8" style={{ marginTop: '20px' }}>
          {/* Header */}
          <div className="mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Package className="text-green-custom mr-3" size={48} />
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Catálogo Completo
                </h1>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explora todos nuestros productos disponibles en {zonaSeleccionada?.nombre || 'tu zona'}
              </p>
              <div className="mt-4">
                <p className="text-lg font-semibold text-green-custom">
                  {products.length} productos disponibles
                </p>
              </div>
            </div>
          </div>

          {/* Grid de Productos */}
          {products.length > 0 ? (
            <>
              <div id="productos-grid" className="mb-12">
                <div className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8 transition-all duration-300 ${
                  animateProducts ? 'opacity-50' : 'opacity-100'
                }`}>
                  {paginatedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} variant="compact" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Package size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No hay productos disponibles
              </h3>
              <p className="text-gray-500">
                No se encontraron productos para mostrar en este momento
              </p>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </ZonaGuard>
  )
}
