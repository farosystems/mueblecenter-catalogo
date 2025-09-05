'use client'

import { useState, useEffect } from 'react'
import { Tipo } from '@/lib/products'
import { getAllTipos } from '@/lib/supabase-products'
import Link from 'next/link'
import GlobalAppBar from '@/components/GlobalAppBar'
import Footer from '@/components/Footer'
import { ZonaGuard } from '@/components/ZonaGuard'
import { useZonaContext } from '@/contexts/ZonaContext'
import { 
  Home, 
  Package,
  Tag
} from 'lucide-react'

export default function TiposPage() {
  const [tipos, setTipos] = useState<Tipo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTipos = async () => {
      console.log('📦 TiposPage: Iniciando carga de tipos...')
      try {
        const tiposData = await getAllTipos()
        console.log('📦 TiposPage: Tipos recibidos:', tiposData.length)
        setTipos(tiposData)
      } catch (error) {
        console.error('❌ TiposPage: Error loading tipos:', error)
      } finally {
        console.log('📦 TiposPage: Finalizando carga (setLoading(false))')
        setLoading(false)
      }
    }
    
    loadTipos()
  }, [])

  const createSlug = (text: string) => {
    return text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando tipos...</p>
        </div>
      </div>
    )
  }

  return (
    <ZonaGuard>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100">
        <GlobalAppBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Tag className="text-purple-600 mr-3" size={48} />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Tipos de Productos
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explora nuestros diferentes tipos de productos organizados por línea
          </p>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm text-gray-500">
          <Link href="/" className="transition-colors" style={{'--hover-color': '#9333ea'}} onMouseEnter={(e) => e.target.style.color = '#9333ea'} onMouseLeave={(e) => e.target.style.color = ''}>
            Inicio
          </Link>
          <span className="mx-2">•</span>
          <span className="text-gray-900 font-medium">Tipos</span>
        </div>

        {/* Tipos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tipos.map((tipo) => {
            const slug = createSlug(tipo.nombre)
            
            return (
              <Link 
                key={tipo.id}
                href={`/tipos/${slug}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 group-hover:border-purple-300 transform group-hover:scale-105">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-full p-4 mb-4 transition-colors duration-300">
                      <Tag className="text-white" size={32} />
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                      {tipo.nombre}
                    </h3>
                    
                    {tipo.descripcion && (
                      <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-300 mb-2">
                        {tipo.descripcion}
                      </p>
                    )}

                    {tipo.linea && (
                      <div className="mb-2">
                        <p className="text-purple-600 text-xs font-medium">
                          {tipo.linea.nombre}
                        </p>
                        {tipo.linea.presentacion && (
                          <p className="text-purple-500 text-xs">
                            {tipo.linea.presentacion.nombre}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors duration-300">
                      Ver productos
                    </p>
                    
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
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
            className="inline-flex items-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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