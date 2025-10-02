'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Package } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/products'
import { getProductsByZona, getPlanesProducto, calcularCuota, searchProductsByZona } from '@/lib/supabase-products'
import { formatearPrecio } from '@/lib/supabase-products'
import { useZonaContext } from '@/contexts/ZonaContext'

interface ProductSearchProps {
  className?: string
}

export default function ProductSearch({ className = '' }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { zonaSeleccionada } = useZonaContext()
  const router = useRouter()

  // Cargar productos al montar el componente y cuando cambie la zona
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)
      try {
        //console.log('🔍 ProductSearch: Cargando productos para zona:', zonaSeleccionada?.id, zonaSeleccionada?.nombre)
        const productsData = await getProductsByZona(zonaSeleccionada?.id || null)
        //console.log('🔍 ProductSearch: Productos cargados:', productsData.length)

        setProducts(productsData)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [zonaSeleccionada])

  // Buscar productos cuando cambie el término de búsqueda (usando búsqueda directa en DB)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts([])
      setIsSearchOpen(false)
      return
    }

    let timeoutId: NodeJS.Timeout

    const searchProducts = async () => {
      setLoading(true)
      try {
        //console.log('🔍 ProductSearch: Realizando búsqueda directa para:', searchTerm)
        const results = await searchProductsByZona(searchTerm, zonaSeleccionada?.id || null)
        //console.log('🔍 ProductSearch: Resultados de búsqueda:', results.length)

        setFilteredProducts(results.slice(0, 12)) // Limitar a 12 resultados
        setIsSearchOpen(results.length > 0)
      } catch (error) {
        console.error('Error en búsqueda:', error)
        setFilteredProducts([])
        setIsSearchOpen(false)
      } finally {
        setLoading(false)
      }
    }

    // Debounce la búsqueda para evitar demasiadas consultas
    timeoutId = setTimeout(searchProducts, 300)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [searchTerm, zonaSeleccionada])

  // Cerrar búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Función para resaltar el texto buscado
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">{part}</span>
      ) : part
    )
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      // Usar router de Next.js en lugar de window.location para mantener el estado
      router.push(`/buscar?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Barra de búsqueda */}
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            className="w-full pl-12 pr-12 py-3 bg-white/90 backdrop-blur-sm border border-violet-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
            style={{}}
            onFocus={(e) => {
              e.target.style.borderColor = '#FF2F12'
              e.target.style.boxShadow = '0 0 0 2px rgba(255, 47, 18, 0.2)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = ''
              e.target.style.boxShadow = ''
            }}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setIsSearchOpen(false)
                inputRef.current?.focus()
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="size-5" />
            </button>
          )}
        </div>
      </form>

      {/* Resultados de búsqueda */}
      {isSearchOpen && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-[400px] sm:max-h-[500px] lg:max-h-[600px] overflow-y-auto z-50">
          {/* Sugerencias de búsqueda */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Sugerencias</h3>
            <div className="space-y-1">
              {filteredProducts.slice(0, 3).map((product) => (
                <button
                  key={`suggestion-${product.id}`}
                  onClick={() => setSearchTerm(product.descripcion || '')}
                  className="flex items-center w-full p-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Search className="size-4 mr-3 text-gray-400" />
                  <span>{highlightText(product.descripcion || '', searchTerm)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Productos encontrados */}
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Productos ({filteredProducts.length})</h3>
            <div className="space-y-3">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={product.categoria && product.categoria.descripcion && 
                        !product.categoria.descripcion.toLowerCase().includes('categor') &&
                        product.categoria.descripcion.trim() !== '' ? 
                    `/${product.categoria?.descripcion?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}` :
                    `/varios/${product.id}`
                  }
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  {/* Imagen del producto */}
                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 mr-3 sm:mr-4">
                    <img
                      src={product.imagen || '/placeholder.jpg'}
                      alt={product.descripcion}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-medium text-gray-900 group-hover:text-violet-600 transition-colors line-clamp-2">
                      {highlightText(product.descripcion || '', searchTerm)}
                    </h4>
                    <div className="flex items-center mt-1 space-x-1 sm:space-x-2">
                      <span className="text-xs text-gray-500 truncate">
                        {product.categoria?.descripcion}
                      </span>
                      <span className="text-xs text-gray-300 hidden sm:inline">•</span>
                      <span className="text-xs text-gray-500 truncate hidden sm:inline">
                        {product.marca?.descripcion}
                      </span>
                    </div>
                  </div>

                  {/* Precios financiados - oculto en móvil */}
                  <div className="flex-shrink-0 text-right hidden sm:block">
                    <ProductFinancingPrices product={product} />
                  </div>
                </Link>
              ))}
            </div>

            {/* Ver todos los resultados */}
            {filteredProducts.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <Link
                  href={`/buscar?q=${encodeURIComponent(searchTerm)}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center justify-center w-full py-2 px-4 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <Package className="size-4 mr-2" />
                  Ver todos los resultados
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para mostrar precios financiados en los resultados de búsqueda
function ProductFinancingPrices({ product }: { product: Product }) {
  const [planes, setPlanes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlanes = async () => {
      try {
        const planesData = await getPlanesProducto(product.id)
        setPlanes(planesData)
      } catch (error) {
        console.error('Error loading financing plans:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPlanes()
  }, [product.id])

  if (loading || planes.length === 0) {
    return null
  }

  // Tomar el primer plan disponible
  const primerPlan = planes[0]
  const calculo = calcularCuota(product.precio || 0, primerPlan)

  if (!calculo) {
    return null
  }

  // Buscar el plan de 3 cuotas sin interés
  const planTresCuotas = planes.find(p => p.cuotas === 3)
  const calculoTresCuotas = planTresCuotas ? calcularCuota(product.precio || 0, planTresCuotas) : null

  return (
    <div>
      <div className="text-xs text-gray-500">
        Contado: ${formatearPrecio(product.precio || 0)}
      </div>
      {calculoTresCuotas && (
        <div className="text-xs font-semibold text-green-600">
          3 cuotas: ${formatearPrecio(calculoTresCuotas.cuota_mensual)}
        </div>
      )}
      <div className="text-sm font-bold text-blue-600">
        ${formatearPrecio(calculo.cuota_mensual)} × {primerPlan.cuotas}
      </div>
    </div>
  )
}
