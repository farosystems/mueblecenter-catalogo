"use client"

import { useState, useEffect, useMemo } from "react"
import { use } from "react"
import { Search, Package } from "lucide-react"
import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import Pagination from "@/components/Pagination"
import { useZonaContext } from "@/contexts/ZonaContext"
import { ZonaGuard } from "@/components/ZonaGuard"
import { Tipo, Linea, Presentacion } from "@/lib/products"
import { getAllTipos, getAllLineas, getPresentaciones, getProductsByHierarchy } from "@/lib/supabase-products"
import { Product } from "@/lib/products"

const PRODUCTS_PER_PAGE = 6

interface TipoPageProps {
  params: Promise<{
    presentacion: string
    linea: string
    tipo: string
  }>
}

export default function TipoPage({ params }: TipoPageProps) {
  const resolvedParams = use(params)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [animateProducts, setAnimateProducts] = useState(false)
  const [tipos, setTipos] = useState<Tipo[]>([])
  const [lineas, setLineas] = useState<Linea[]>([])
  const [presentaciones, setPresentaciones] = useState<Presentacion[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { zonaSeleccionada } = useZonaContext()

  // Cargar tipos, líneas, presentaciones y productos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [tiposData, lineasData, presentacionesData] = await Promise.all([
          getAllTipos(),
          getAllLineas(),
          getPresentaciones()
        ])

        setTipos(tiposData)
        setLineas(lineasData)
        setPresentaciones(presentacionesData)

        // Encontrar la presentación por slug
        const presentacion = presentacionesData.find(p => {
          const slug = p.nombre.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
          return slug === resolvedParams.presentacion
        })

        // Encontrar la línea por slug
        const linea = lineasData.find(l => {
          const slug = l.nombre.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
          return slug === resolvedParams.linea
        })

        // Encontrar el tipo por slug
        const tipo = tiposData.find(t => {
          const slug = t.nombre.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
          return slug === resolvedParams.tipo
        })

        if (presentacion && linea && tipo) {
          const productsData = await getProductsByHierarchy(
            presentacion.id,
            linea.id,
            tipo.id,
            zonaSeleccionada?.id || null
          )
          setProducts(productsData)
        }
      } catch (err) {
        console.error('Error loading data:', err)
        setError('Error al cargar los productos')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [resolvedParams.presentacion, resolvedParams.linea, resolvedParams.tipo, zonaSeleccionada?.id])

  // Obtener parámetros de la URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchParam = urlParams.get('search')

    if (searchParam) {
      setSearchTerm(searchParam)
    }
  }, [])

  // Encontrar la presentación, línea y tipo por slug
  const presentacion = useMemo(() => {
    return presentaciones.find(p => {
      const slug = p.nombre.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      return slug === resolvedParams.presentacion
    })
  }, [presentaciones, resolvedParams.presentacion])

  const linea = useMemo(() => {
    return lineas.find(l => {
      const slug = l.nombre.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      return slug === resolvedParams.linea
    })
  }, [lineas, resolvedParams.linea])

  const tipo = useMemo(() => {
    return tipos.find(t => {
      const slug = t.nombre.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      return slug === resolvedParams.tipo
    })
  }, [tipos, resolvedParams.tipo])

  // Filtrar productos por búsqueda
  const filteredProducts = useMemo(() => {
    if (!products.length) return []

    let filtered = products

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter((product) => {
        const productName = product.descripcion || product.name || ''
        const productDescription = product.descripcion_detallada || product.description || ''

        return productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
               productDescription.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    return filtered
  }, [products, searchTerm])

  // Calcular paginación
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1)
    setAnimateProducts(true)
    const timer = setTimeout(() => setAnimateProducts(false), 100)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const handleClearFilters = () => {
    setSearchTerm("")
    setCurrentPage(1)
  }

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
        <div className="bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
          <GlobalAppBar />
          <div className="flex items-center justify-center py-20" style={{ marginTop: '140px' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
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
        <div className="bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
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

  if (!presentacion || !linea || !tipo) {
    return (
      <ZonaGuard>
        <div className="bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
          <GlobalAppBar />
          <div className="flex items-center justify-center py-20" style={{ marginTop: '140px' }}>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {!presentacion ? 'Presentación no encontrada' : !linea ? 'Línea no encontrada' : 'Tipo no encontrado'}
              </h2>
              <p className="text-xl text-gray-600">
                {!presentacion
                  ? `La presentación "${resolvedParams.presentacion}" no existe`
                  : !linea
                  ? `La línea "${resolvedParams.linea}" no existe`
                  : `El tipo "${resolvedParams.tipo}" no existe`
                }
              </p>
            </div>
          </div>
          <Footer />
        </div>
      </ZonaGuard>
    )
  }

  return (
    <ZonaGuard>
      <div className="bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
        <GlobalAppBar />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-4" style={{ marginTop: '20px' }}>

        {/* Header de la página */}
        <div className="mb-8">
          <div className="text-center">
            <p className="text-green-600 font-medium text-sm">
              {presentacion.nombre}
            </p>
            <p className="text-blue-600 font-medium mb-2">
              {linea.nombre}
            </p>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {tipo.nombre}
            </h1>
            {tipo.descripcion && (
              <p className="text-gray-600 mb-2">
                {tipo.descripcion}
              </p>
            )}
            <p className="text-gray-600 text-lg">
              {filteredProducts.length} productos encontrados
            </p>
          </div>
        </div>

        {/* Grid de Productos */}
        <div id="productos-grid" className="mb-12">
          {filteredProducts.length > 0 ? (
            <div className={`grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 transition-all duration-300 ${
              animateProducts ? 'opacity-50' : 'opacity-100'
            }`}>
              {paginatedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} variant="compact" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Package size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? `No hay productos que coincidan con "${searchTerm}" en ${tipo.nombre}`
                  : `No hay productos disponibles en ${tipo.nombre}`
                }
              </p>
              {searchTerm && (
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
        <Footer />
      </div>
    </ZonaGuard>
  )
}
