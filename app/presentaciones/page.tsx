'use client'

import { useState, useEffect } from 'react'
import { Presentacion } from '@/lib/products'
import { getPresentaciones } from '@/lib/supabase-products'
import Link from 'next/link'
import GlobalAppBar from '@/components/GlobalAppBar'
import Footer from '@/components/Footer'
import { ZonaGuard } from '@/components/ZonaGuard'
import { useZonaContext } from '@/contexts/ZonaContext'
import { 
  Home, 
  Package,
  Layers
} from 'lucide-react'

export default function PresentacionesPage() {
  const [presentaciones, setPresentaciones] = useState<Presentacion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPresentaciones = async () => {
      console.log('📦 PresentacionesPage: Iniciando carga de presentaciones...')
      try {
        const presentacionesData = await getPresentaciones()
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

  const createSlug = (text: string) => {
    return text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

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
            <Layers className="text-green-custom mr-3" size={48} />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Presentaciones
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora nuestras diferentes presentaciones de productos organizadas por categoría
          </p>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm text-gray-500">
          <Link href="/" className="transition-colors" style={{'--hover-color': '#1F632A'}} onMouseEnter={(e) => e.target.style.color = '#1F632A'} onMouseLeave={(e) => e.target.style.color = ''}>
            Inicio
          </Link>
          <span className="mx-2">•</span>
          <span className="text-gray-900 font-medium">Presentaciones</span>
        </div>

        {/* Presentaciones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {presentaciones.map((presentacion) => {
            const slug = createSlug(presentacion.nombre)
            
            return (
              <Link 
                key={presentacion.id}
                href={`/presentaciones/${slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-green-300 transform group-hover:scale-105">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-green-gradient-br bg-green-gradient-br-hover rounded-full p-4 mb-4 transition-colors duration-300">
                      <Layers className="text-white" size={32} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-custom transition-colors duration-300">
                      {presentacion.nombre}
                    </h3>
                    
                    {presentacion.descripcion && (
                      <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-300 mb-2">
                        {presentacion.descripcion}
                      </p>
                    )}
                    
                    <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-300">
                      Ver productos
                    </p>
                    
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                        Explorar →
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Back to Home Button */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center bg-green-gradient-lr bg-green-gradient-hover text-white font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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