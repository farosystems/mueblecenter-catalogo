'use client'

import { useState, useEffect } from 'react'
import { Presentacion } from '@/lib/products'
import { getPresentacionesConProductos } from '@/lib/supabase-products'
import Link from 'next/link'
import GlobalAppBar from '@/components/GlobalAppBar'
import Footer from '@/components/Footer'
import { ZonaGuard } from '@/components/ZonaGuard'
import { 
  Home, 
  Package,
  ArrowRight
} from 'lucide-react'

export default function PresentacionesPage() {
  const [presentaciones, setPresentaciones] = useState<Presentacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPresentaciones = async () => {
      console.log('📦 PresentacionesPage: Iniciando carga de presentaciones...')
      try {
        const presentacionesData = await getPresentacionesConProductos()
        console.log('📦 PresentacionesPage: Presentaciones recibidas:', presentacionesData.length)
        setPresentaciones(presentacionesData)
      } catch (error) {
        console.error('❌ PresentacionesPage: Error loading presentaciones:', error)
      } finally {
        console.log('📦 PresentacionesPage: Finalizando carga (setLoading(false))')
        setLoading(false)
      }
    }
    
    loadPresentaciones()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-custom mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando presentaciones...</p>
        </div>
      </div>
    )
  }

  return (
    <ZonaGuard>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <GlobalAppBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Package className="text-green-custom mr-3" size={48} />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Nuestras Presentaciones
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora todas nuestras líneas de productos organizadas por presentación
          </p>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-custom transition-colors">
            Inicio
          </Link>
          <span className="mx-2">•</span>
          <span className="text-gray-900 font-medium">Presentaciones</span>
        </div>

        {/* Presentaciones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {presentaciones.map((presentacion) => {
            const slug = presentacion.nombre?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '')
            
            return (
              <Link 
                key={presentacion.id}
                href={`/presentaciones/${slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-green-200 transform group-hover:scale-105">
                  {/* Imagen de la presentación */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={presentacion.imagen || '/placeholder-presentacion.jpg'}
                      alt={presentacion.nombre}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-custom transition-colors duration-300">
                          {presentacion.nombre}
                        </h3>
                        
                        {presentacion.descripcion && (
                          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                            {presentacion.descripcion}
                          </p>
                        )}
                        
                        <div className="flex items-center text-green-600 text-sm font-medium group-hover:text-green-700 transition-colors duration-300">
                          <span>Ver productos</span>
                          <ArrowRight className="ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1" size={16} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {presentaciones.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay presentaciones disponibles</h3>
            <p className="text-gray-500">Las presentaciones se mostrarán cuando estén disponibles</p>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="mr-2" size={20} />
            Volver al Inicio
          </Link>
        </div>
      </div>
        
        <Footer />
      </div>
    </ZonaGuard>
  )
}