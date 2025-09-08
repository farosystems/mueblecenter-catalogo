'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import { Categoria } from '@/lib/products'
import { getCategories } from '@/lib/supabase-products'

interface CategoriesDropdownProps {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}

export default function CategoriesDropdown({ isOpen, onClose, isMobile = false }: CategoriesDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [categories, setCategories] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar categorías de la base de datos
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

  // Cerrar dropdown solo al hacer clic fuera, no al pasar el mouse (solo en desktop)
  useEffect(() => {
    if (isMobile) return // En móvil no cerramos automáticamente

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        // Restaurar scroll del body al cerrar el dropdown
        document.body.style.overflow = 'unset'
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      // Asegurar que el scroll se restaure al desmontar el componente
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, isMobile])

  // Prevenir scroll en el body cuando el modal móvil está abierto
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobile, isOpen])

  if (!isOpen) return null

  // Versión móvil - modal de pantalla completa
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-300">
        <div className="bg-white w-full h-full flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Header del modal */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Categorías</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => {
                  const slug = category.descripcion?.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                  
                  return (
                    <Link 
                      key={category.id}
                      href={`/${slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-4 hover:bg-green-50 rounded-xl transition-colors group border border-gray-200 hover:border-green-300"
                    >
                      <span className="text-gray-900 group-hover:text-green-700 font-medium text-lg">
                        {category.descripcion}
                      </span>
                      <ChevronRight className="text-gray-400 group-hover:text-green-600 size-6 flex-shrink-0" />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Versión desktop - dropdown normal
  return (
    <div 
      ref={dropdownRef}
      className="bg-white rounded-xl shadow-2xl border border-gray-200 z-50 w-full max-w-[min(95vw,1200px)] min-w-[300px]"
      style={{
        maxHeight: '85vh', // Limitar altura máxima al 85% del viewport
        overflowY: 'auto' // Scroll si el contenido es muy alto
      }}
      onMouseEnter={() => {
        // Prevenir scroll del body cuando el mouse está sobre el dropdown
        document.body.style.overflow = 'hidden'
      }}
      onMouseLeave={() => {
        // Restaurar scroll del body cuando el mouse sale del dropdown
        document.body.style.overflow = 'unset'
      }}
      onWheel={(e) => {
        // Prevenir completamente el scroll de la página
        e.preventDefault()
        e.stopPropagation()
        
        // Manejar el scroll manualmente en el contenedor
        const container = e.currentTarget
        const scrollAmount = e.deltaY
        container.scrollTop += scrollAmount
      }}
    >
      <div className="p-4 lg:p-6 h-full flex flex-col">
        <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-4 lg:mb-6 flex-shrink-0">Todas las Categorías</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8 lg:py-12 flex-1">
            <div className="animate-spin rounded-full h-6 w-6 lg:h-8 lg:w-8 border-b-2 border-violet-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-4 overflow-y-auto flex-1 min-h-0">
            {categories.map((category) => {
              const slug = category.descripcion?.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '')
              
              return (
                <Link 
                  key={category.id}
                  href={`/${slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 hover:bg-violet-50 rounded-lg transition-colors group border border-transparent hover:border-violet-200"
                >
                  <span className="text-gray-700 group-hover:text-violet-600 font-medium text-sm">
                    {category.descripcion}
                  </span>
                  <ChevronRight className="text-gray-400 group-hover:text-violet-600 size-4 flex-shrink-0" />
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
