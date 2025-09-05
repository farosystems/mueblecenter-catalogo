'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronRight, ChevronDown, X } from 'lucide-react'
import Link from 'next/link'
import { Presentacion, Linea, Tipo } from '@/lib/products'
import { getPresentaciones, getLineasByPresentacion, getTiposByLinea } from '@/lib/supabase-products'

interface PresentacionesDropdownProps {
  isOpen: boolean
  onClose: () => void
  isMobile?: boolean
}

export default function PresentacionesDropdown({ isOpen, onClose, isMobile = false }: PresentacionesDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [presentaciones, setPresentaciones] = useState<Presentacion[]>([])
  const [lineas, setLineas] = useState<Record<string, Linea[]>>({})
  const [tipos, setTipos] = useState<Record<string, Tipo[]>>({})
  const [loading, setLoading] = useState(true)
  const [expandedPresentaciones, setExpandedPresentaciones] = useState<Set<string>>(new Set())
  const [expandedLineas, setExpandedLineas] = useState<Set<string>>(new Set())

  // Cargar presentaciones de la base de datos
  useEffect(() => {
    const loadPresentaciones = async () => {
      try {
        const presentacionesData = await getPresentaciones()
        setPresentaciones(presentacionesData)
      } catch (error) {
        console.error('Error loading presentaciones:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPresentaciones()
  }, [])

  // Cargar líneas cuando se expande una presentación
  const loadLineas = async (presentacionId: string) => {
    try {
      const lineasData = await getLineasByPresentacion(presentacionId)
      setLineas(prev => ({ ...prev, [presentacionId]: lineasData }))
    } catch (error) {
      console.error('Error loading líneas:', error)
    }
  }

  // Cargar tipos cuando se expande una línea
  const loadTipos = async (lineaId: string) => {
    try {
      const tiposData = await getTiposByLinea(lineaId)
      setTipos(prev => ({ ...prev, [lineaId]: tiposData }))
    } catch (error) {
      console.error('Error loading tipos:', error)
    }
  }

  // Manejar expansión de presentaciones
  const togglePresentacion = (presentacionId: string) => {
    const newExpanded = new Set(expandedPresentaciones)
    if (newExpanded.has(presentacionId)) {
      newExpanded.delete(presentacionId)
    } else {
      newExpanded.add(presentacionId)
      // Cargar líneas si no están cargadas
      if (!lineas[presentacionId]) {
        loadLineas(presentacionId)
      }
    }
    setExpandedPresentaciones(newExpanded)
  }

  // Manejar expansión de líneas
  const toggleLinea = (lineaId: string) => {
    const newExpanded = new Set(expandedLineas)
    if (newExpanded.has(lineaId)) {
      newExpanded.delete(lineaId)
    } else {
      newExpanded.add(lineaId)
      // Cargar tipos si no están cargados
      if (!tipos[lineaId]) {
        loadTipos(lineaId)
      }
    }
    setExpandedLineas(newExpanded)
  }

  // Cerrar dropdown solo al hacer clic fuera, no al pasar el mouse (solo en desktop)
  useEffect(() => {
    if (isMobile) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
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

  // Crear slug para URLs
  const createSlug = (text: string) => {
    return text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Versión móvil - modal de pantalla completa
  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] animate-in fade-in duration-300">
        <div className="bg-white w-full h-full flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Header del modal */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Catálogo</h2>
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
                {presentaciones.map((presentacion) => (
                  <div key={presentacion.id} className="border border-gray-200 rounded-xl overflow-hidden">
                    {/* Presentación Header */}
                    <div className="bg-green-50 border-b border-green-200">
                      <button
                        onClick={() => togglePresentacion(presentacion.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-green-100 transition-colors"
                      >
                        <span className="text-green-800 font-semibold text-lg">
                          {presentacion.nombre}
                        </span>
                        <ChevronDown 
                          className={`text-green-600 size-5 transition-transform ${
                            expandedPresentaciones.has(presentacion.id) ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      
                      {/* Link directo a presentación */}
                      <div className="px-4 pb-2">
                        <Link
                          href={`/presentaciones/${createSlug(presentacion.nombre)}`}
                          onClick={onClose}
                          className="text-sm text-green-600 hover:text-green-800 underline"
                        >
                          Ver todos los productos de {presentacion.nombre}
                        </Link>
                      </div>
                    </div>

                    {/* Líneas */}
                    {expandedPresentaciones.has(presentacion.id) && (
                      <div className="bg-white">
                        {lineas[presentacion.id]?.map((linea) => (
                          <div key={linea.id} className="border-b border-gray-100 last:border-b-0">
                            {/* Línea Header */}
                            <div className="bg-blue-50">
                              <button
                                onClick={() => toggleLinea(linea.id)}
                                className="w-full flex items-center justify-between p-3 pl-8 hover:bg-blue-100 transition-colors"
                              >
                                <span className="text-blue-800 font-medium">
                                  {linea.nombre}
                                </span>
                                <ChevronDown 
                                  className={`text-blue-600 size-4 transition-transform ${
                                    expandedLineas.has(linea.id) ? 'rotate-180' : ''
                                  }`} 
                                />
                              </button>
                              
                              {/* Link directo a línea */}
                              <div className="px-3 pl-8 pb-2">
                                <Link
                                  href={`/lineas/${createSlug(linea.nombre)}`}
                                  onClick={onClose}
                                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                                >
                                  Ver todos los productos de {linea.nombre}
                                </Link>
                              </div>
                            </div>

                            {/* Tipos */}
                            {expandedLineas.has(linea.id) && (
                              <div className="bg-white pl-12">
                                {tipos[linea.id]?.map((tipo) => (
                                  <Link
                                    key={tipo.id}
                                    href={`/tipos/${createSlug(tipo.nombre)}`}
                                    onClick={onClose}
                                    className="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                                  >
                                    <span className="text-gray-700 font-medium">
                                      {tipo.nombre}
                                    </span>
                                    <ChevronRight className="text-gray-400 size-4" />
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
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
      className="bg-white rounded-xl shadow-2xl border border-gray-200 z-50 min-w-80 max-w-96"
    >
      <div className="p-4">
        <h3 className="text-base font-bold text-gray-900 mb-4">Catálogo de Productos</h3>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div>
            {presentaciones.map((presentacion) => (
              <div key={presentacion.id} className="relative group border-b border-gray-100 last:border-b-0">
                {/* Presentación Item */}
                <div 
                  className="flex items-center justify-between p-3 hover:bg-green-50 transition-colors cursor-pointer"
                  onMouseEnter={() => {
                    if (!lineas[presentacion.id]) {
                      loadLineas(presentacion.id)
                    }
                  }}
                >
                  <div className="flex-1">
                    <Link
                      href={`/presentaciones/${createSlug(presentacion.nombre)}`}
                      onClick={onClose}
                      className="text-green-800 font-semibold text-sm block"
                    >
                      {presentacion.nombre}
                    </Link>
                    {presentacion.descripcion && (
                      <p className="text-xs text-gray-500 mt-1">
                        {presentacion.descripcion}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="text-green-600 size-4 ml-2" />
                </div>

                {/* Dropdown de líneas hacia la derecha */}
                <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 min-w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-2">
                    {lineas[presentacion.id]?.map((linea) => (
                      <div key={linea.id} className="relative group/linea">
                        <div 
                          className="flex items-center justify-between px-2 py-2 hover:bg-blue-50 rounded transition-colors"
                          onMouseEnter={() => {
                            if (!tipos[linea.id]) {
                              loadTipos(linea.id)
                            }
                          }}
                        >
                          <Link
                            href={`/lineas/${createSlug(linea.nombre)}`}
                            onClick={onClose}
                            className="text-blue-700 text-sm font-medium flex-1"
                          >
                            {linea.nombre}
                          </Link>
                          <ChevronRight className="text-blue-600 size-3 ml-2" />
                        </div>

                        {/* Dropdown de tipos hacia la derecha */}
                        <div className="absolute left-full top-0 ml-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 min-w-48 opacity-0 invisible group-hover/linea:opacity-100 group-hover/linea:visible transition-all duration-200">
                          <div className="p-2">
                            {tipos[linea.id]?.map((tipo) => (
                              <Link
                                key={tipo.id}
                                href={`/tipos/${createSlug(tipo.nombre)}`}
                                onClick={onClose}
                                className="block px-2 py-2 text-sm text-purple-700 font-medium"
                              >
                                {tipo.nombre}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}