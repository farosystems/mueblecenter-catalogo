"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { use } from "react"
import { ArrowLeft, Package, CheckCircle, Star, Truck, Shield, CreditCard, Headphones, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"
import ProductImageGallery from "@/components/ProductImageGallery"
import FinancingPlansLarge from "@/components/FinancingPlansLarge"
import ProductCard from "@/components/ProductCard"
import WhatsAppButton from "@/components/WhatsAppButton"
import AddToListButton from "@/components/AddToListButton"
import FormattedProductDescription from "@/components/FormattedProductDescription"
import { useProducts } from "@/hooks/use-products"
import { getProductById } from "@/lib/supabase-products"

interface ProductVariosPageClientProps {
  params: Promise<{
    id: string
  }>
}

export default function ProductVariosPageClient({ params }: ProductVariosPageClientProps) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0)
  const mobileScrollRef = useRef<HTMLDivElement>(null)

  const { products } = useProducts()

  // Productos relacionados (sin filtro de categoría)
  const relatedProducts = useMemo(() => {
    if (!product) return []
    
    return products
      .filter(p => p.id !== product.id)
      .slice(0, 6) // Mostrar máximo 6 productos relacionados
  }, [products, product])

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        //console.log('🔍 Cargando producto con ID:', resolvedParams.id)
        const productData = await getProductById(resolvedParams.id)
        
        //console.log('🔍 Producto cargado:', productData)
        
        if (!productData) {
          setError('Producto no encontrado')
          return
        }

        setProduct(productData)
      } catch (err) {
        setError('Error al cargar el producto')
        console.error('Error loading product:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [resolvedParams.id])

  const handleBackToHome = () => {
    // Siempre redirigir a presentaciones con la presentación del artículo
    if (product?.presentacion?.nombre) {
      const presentacionSlug = product.presentacion.nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      router.push(`/presentaciones/${presentacionSlug}`)
    } else {
      // Fallback al home si no hay presentación
      router.push('/')
    }
  }

  // Funciones para el carrusel móvil de productos relacionados
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
    if (currentMobileIndex < relatedProducts.length - 1) {
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
      if (newIndex !== currentMobileIndex && newIndex >= 0 && newIndex < relatedProducts.length) {
        setCurrentMobileIndex(newIndex)
      }
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <GlobalAppBar />
        <div className="flex items-center justify-center py-20" style={{ marginTop: '140px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900">Cargando producto...</h2>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <GlobalAppBar />
        <div className="flex items-center justify-center py-20" style={{ marginTop: '140px' }}>
          <div className="text-center">
            <Package size={64} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
            <p className="text-xl text-gray-600 mb-6">{error || 'El producto no existe'}</p>
            <button
              onClick={handleBackToHome}
              className="px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const productDescription = product.descripcion_detallada || product.description || 'Sin descripción disponible'

  // Debug: Log para verificar las imágenes del producto
  // console.log('🔍 Producto completo:', product)
  // console.log('🔍 product.imagenes:', product.imagenes)
  // console.log('🔍 product.imagen:', product.imagen)
  // console.log('🔍 Array de imágenes que se pasa al componente:', product.imagenes || [product.imagen] || [])

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <GlobalAppBar />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-4" style={{ marginTop: '30px' }}>
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Inicio
          </button>
        </div>

        {/* Producto Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Galería de imágenes */}
          <div>
            <ProductImageGallery 
              images={product.imagenes || [product.imagen] || []}
              productName={product.descripcion || 'Producto'}
              isFeatured={product.destacado || false}
              brand={product.marca}
            />
          </div>

          {/* Información del producto */}
          <div>
            {/* Nueva jerarquía: Presentación, Línea, Tipo */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {product.presentacion && (
                <span className="text-xs text-white bg-green-500 px-3 py-1 rounded-full uppercase font-medium">
                  {product.presentacion.nombre}
                </span>
              )}
              {product.linea && (
                <span className="text-xs text-white bg-blue-500 px-3 py-1 rounded-full uppercase font-medium">
                  {product.linea.nombre}
                </span>
              )}
              {product.tipo && (
                <span className="text-xs text-white bg-purple-500 px-3 py-1 rounded-full uppercase font-medium">
                  {product.tipo.nombre}
                </span>
              )}
              
              {/* Mostrar categoría y marca solo si no hay nueva jerarquía */}
              {!product.presentacion && !product.linea && !product.tipo && (
                <>
                  {product.categoria && (
                    <span className="text-xs text-violet-600 bg-violet-100 px-3 py-1 rounded-full uppercase font-medium">
                      {product.categoria.descripcion}
                    </span>
                  )}
                  {product.marca && (
                    <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full uppercase font-medium">
                      {product.marca.descripcion}
                    </span>
                  )}
                </>
              )}

              {/* Marca siempre visible si hay nueva jerarquía */}
              {(product.presentacion || product.linea || product.tipo) && product.marca && (
                <span className="text-xs text-gray-600 bg-gray-100 px-3 py-1 rounded-full uppercase font-medium">
                  {product.marca.descripcion}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4 uppercase">
              {product.descripcion}
            </h1>

            {/* Precio Principal */}
            {(product.precio || 0) > 0 && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                  <div className="text-center">
                    <p className="text-sm font-medium opacity-90 mb-1">Precio de Lista</p>
                    <p className="text-4xl font-bold">
                      ${(product.precio || 0).toLocaleString('es-AR')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Precios */}
            <div className="mb-8">
              <FinancingPlansLarge 
                productoId={product.id.toString()}
                precio={product.precio || 0}
              />
            </div>

            {/* Botones de acción */}
            <div className="mb-8 space-y-4">
              <WhatsAppButton product={product} />
              <AddToListButton product={product} variant="page" />
            </div>

            {/* Características adicionales */}
            {product.caracteristicas && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Características</h2>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.caracteristicas}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Descripción del Producto (sección separada) */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Descripción del Producto</h2>
          <div className="bg-white rounded-lg p-8 shadow-sm max-w-4xl mx-auto">
            <FormattedProductDescription description={productDescription} />
          </div>
        </div>

        {/* Sección "Por qué elegirnos" */}
        <div className="mb-16 bg-gray-50 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir MueblesCenter?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Garantía oficial */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Garantía Oficial</h3>
              <p className="text-gray-600">
                Todos nuestros productos incluyen garantía de fábrica
              </p>
            </div>

            {/* Financiación flexible */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow">
              <div className="bg-violet-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Financiación Flexible</h3>
              <p className="text-gray-600">
                Planes de pago adaptados a tu presupuesto
              </p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Productos relacionados - Full Width */}
      <section className="bg-featured-gradient py-16 text-white">|        
        {relatedProducts.length > 0 ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Productos que te pueden interesar
              </h2>
              <p className="text-lg text-green-100">
                Descubre más productos que podrían ser perfectos para ti
              </p>
            </div>

            {/* Contador móvil */}
            <div className="mb-8 text-center md:hidden">
              <p className="text-green-100">
                <span className="font-semibold text-white">{currentMobileIndex + 1}</span> de{" "}
                <span className="font-semibold text-white">{relatedProducts.length}</span> productos relacionados
              </p>
            </div>

            {/* Vista Desktop - Grid */}
            <div className="hidden md:block">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.slice(0, 3).map((relatedProduct) => (
                  <div key={relatedProduct.id} className="animate-fade-in-up">
                    <ProductCard product={relatedProduct} />
                  </div>
                ))}
              </div>
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
                disabled={currentMobileIndex === relatedProducts.length - 1}
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
                {relatedProducts.map((relatedProduct, index) => (
                  <div
                    key={relatedProduct.id}
                    className="min-w-full snap-center px-4"
                  >
                    <ProductCard product={relatedProduct} />
                  </div>
                ))}
              </div>

              {/* Indicadores de puntos */}
              <div className="flex justify-center space-x-2 mt-6">
                {relatedProducts.map((_, index) => (
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

            {/* Botón ver más */}
            <div className="text-center mt-8">
              <button
                onClick={handleBackToHome}
                className="inline-flex items-center px-8 py-4 bg-white text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Ver más productos
                <ArrowLeft className="ml-2 w-5 h-5 rotate-180" />
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Productos que te pueden interesar
            </h2>
            <p className="text-lg text-green-100">
              No hay productos relacionados disponibles en este momento
            </p>
          </div>
        )}
      </section>
      
      <Footer />
    </div>
  )
}
