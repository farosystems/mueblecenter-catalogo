'use client'

import { useState, useEffect } from 'react'
import { Linea } from '@/lib/products'
import { getAllLineas } from '@/lib/supabase-products'
import Link from 'next/link'
import GlobalAppBar from '@/components/GlobalAppBar'
import Footer from '@/components/Footer'
import { ZonaGuard } from '@/components/ZonaGuard'
import { useZonaContext } from '@/contexts/ZonaContext'
import { 
  Home, 
  Package,
  List
} from 'lucide-react'

export default function LineasPage() {
  const [lineas, setLineas] = useState<Linea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLineas = async () => {
      console.log('📦 LineasPage: Iniciando carga de líneas...')
      try {
        const lineasData = await getAllLineas()
        console.log('📦 LineasPage: Líneas recibidas:', lineasData.length)
        setLineas(lineasData)
      } catch (error) {
        console.error('❌ LineasPage: Error loading líneas:', error)
      } finally {
        console.log('📦 LineasPage: Finalizando carga (setLoading(false))')
        setLoading(false)
      }
    }
    
    loadLineas()
  }, [])

  const createSlug = (text: string) => {
    return text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando líneas...</p>
        </div>
      </div>
    )
  }

  return (
    <ZonaGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <GlobalAppBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <List className="text-blue-600 mr-3" size={48} />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Líneas de Productos
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora nuestras diferentes líneas de productos organizadas por presentación
          </p>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm text-gray-500">
          <Link href="/" className="transition-colors" style={{'--hover-color': '#2563eb'}} onMouseEnter={(e) => e.target.style.color = '#2563eb'} onMouseLeave={(e) => e.target.style.color = ''}>
            Inicio
          </Link>
          <span className="mx-2">•</span>
          <span className="text-gray-900 font-medium">Líneas</span>
        </div>

        {/* Líneas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {lineas.map((linea) => {
            const slug = createSlug(linea.nombre)
            
            return (
              <Link 
                key={linea.id}
                href={`/lineas/${slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-blue-300 transform group-hover:scale-105">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full p-4 mb-4 transition-colors duration-300">
                      <List className="text-white" size={32} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {linea.nombre}
                    </h3>
                    
                    {linea.descripcion && (
                      <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-300 mb-2">
                        {linea.descripcion}
                      </p>
                    )}

                    {linea.presentacion && (
                      <p className="text-blue-600 text-xs font-medium mb-2">
                        {linea.presentacion.nombre}
                      </p>
                    )}
                    
                    <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-300">
                      Ver productos
                    </p>
                    
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
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
            className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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