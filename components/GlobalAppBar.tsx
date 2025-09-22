'use client'

import Link from "next/link"
import { Menu, ShoppingBag, X, Home, Star, MapPin, RefreshCw, ChevronRight } from "lucide-react"
import ProductSearch from "./ProductSearch"
import PresentacionesDropdown from "./PresentacionesDropdown"
import ShoppingListModal from "./ShoppingListModal"
import { useState, useEffect } from "react"
import { useShoppingList } from "@/hooks/use-shopping-list"
import { useZonaContext } from "@/contexts/ZonaContext"
import { getLogo } from "@/lib/supabase-config"

export default function GlobalAppBar() {
  const [isPresentacionesOpen, setIsPresentacionesOpen] = useState(false)
  const [isMobilePresentacionesOpen, setIsMobilePresentacionesOpen] = useState(false)
  const [isShoppingListOpen, setIsShoppingListOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [logo, setLogo] = useState<string>('/logo1.png')
  const { itemCount } = useShoppingList()
  const { zonaSeleccionada, clearZona } = useZonaContext()

  // Cargar logo
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoUrl = await getLogo()
        if (logoUrl) {
          setLogo(logoUrl)
        }
      } catch (error) {
        console.error('Error al cargar logo:', error)
      }
    }
    loadLogo()
  }, [])
  
  // Cerrar menú móvil al cambiar el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const scrollToProducts = () => {
    const productsSection = document.getElementById('productos')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header principal */}
          <div className="flex items-center justify-between py-3 lg:py-4">
            {/* Logo - responsive */}
            <div className="flex-shrink-0 lg:ml-14">
              <Link href="/" className="flex items-center group">
                <div className="relative lg:ml-[-40px]">
                  <img
                    src={logo}
                    alt="MueblesCenter"
                    className="h-16 sm:h-20 lg:h-32 w-auto transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/logo1.png'
                    }}
                  />
                  <div className="absolute inset-0 bg-green-400 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></div>
                </div>
              </Link>
            </div>

            {/* Buscador responsive */}
            <div className="flex-1 max-w-4xl mx-2 lg:mx-4 lg:block">
              <ProductSearch />
            </div>

            {/* Controles de la derecha - desktop */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Zona seleccionada - desktop */}
              {zonaSeleccionada && (
                <div className="flex items-center space-x-2 bg-green-100 rounded-full px-3 py-2 backdrop-blur-sm">
                  <MapPin size={16} className="text-green-700" />
                  <span className="text-green-700 text-sm font-medium">
                    {zonaSeleccionada.nombre || `Zona ${zonaSeleccionada.id}`}
                  </span>
                  <button
                    onClick={clearZona}
                    className="text-green-700 hover:text-green-900 transition-all duration-300 cursor-pointer hover:scale-110 hover:rotate-12 active:scale-95"
                    title="Cambiar zona"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* Controles de la derecha - solo en móvil */}
            <div className="flex items-center space-x-2 sm:space-x-4 lg:hidden">
              {/* Zona seleccionada - móvil */}
              {zonaSeleccionada && (
                <div className="hidden sm:flex items-center space-x-1 bg-green-100 rounded-full px-2 py-1 backdrop-blur-sm">
                  <MapPin size={12} className="text-green-700" />
                  <span className="text-green-700 text-xs font-medium truncate max-w-20">
                    {zonaSeleccionada.nombre || `Zona ${zonaSeleccionada.id}`}
                  </span>
                </div>
              )}
              
              {/* Botón hamburguesa */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-green-700 hover:text-green-900 transition-colors duration-300 p-2 rounded-full bg-green-100"
                aria-label="Abrir menú"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Navegación desktop */}
          <div className="hidden lg:flex items-center justify-between py-3 border-t border-green-200 px-6">
            {/* Catálogo */}
            <div 
              className="relative"
              onMouseEnter={() => setIsPresentacionesOpen(true)}
              onMouseLeave={() => setIsPresentacionesOpen(false)}
            >
              <button className="text-green-700 hover:text-green-900 transition-colors duration-300 font-bold text-lg flex items-center">
                <Menu className="mr-2 size-6" />
                Catálogo
              </button>
              
              <div className="absolute top-full left-0 pt-2">
                <PresentacionesDropdown 
                  isOpen={isPresentacionesOpen}
                  onClose={() => setIsPresentacionesOpen(false)}
                  isMobile={false}
                />
              </div>
            </div>
            
            {/* Navegación central */}
            <nav className="flex items-center space-x-12">
              <Link 
                href="/" 
                className="text-green-700 hover:text-green-900 transition-colors duration-300 font-bold text-lg underline underline-offset-4"
              >
                Inicio
              </Link>
              
              <Link 
                href="/#destacados" 
                className="text-green-700 hover:text-green-900 transition-colors duration-300 font-bold text-lg"
              >
                Destacados
              </Link>
            </nav>
            
            {/* Mi Lista a la derecha - desktop */}
            <div className="flex items-center">
              <button
                onClick={() => setIsShoppingListOpen(true)}
                className="text-green-700 hover:text-green-900 transition-colors duration-300 font-bold text-lg flex items-center gap-2"
                title="Mi Lista de Compra"
              >
                <ShoppingBag size={20} />
                Mi Lista ({itemCount})
              </button>
            </div>
          </div>

        </div>

        {/* Menú móvil */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-green-200">
            <div className="px-4 py-4 space-y-1">
              {/* Navegación principal */}
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium"
              >
                <Home className="mr-3" size={20} />
                Inicio
              </Link>
              
              <Link
                href="/#destacados"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium"
              >
                <Star className="mr-3" size={20} />
                Destacados
              </Link>
              
              {/* Mi Lista móvil */}
              <button
                onClick={() => {
                  setIsShoppingListOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center px-4 py-3 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium"
              >
                <ShoppingBag className="mr-3" size={20} />
                Mi Lista ({itemCount})
              </button>
              
              {/* Zona seleccionada - móvil */}
              {zonaSeleccionada && (
                <button
                  onClick={() => {
                    clearZona()
                    setIsMobileMenuOpen(false)
                  }}
                  className="group flex items-center justify-between px-4 py-3 text-green-700 hover:bg-green-100 rounded-lg transition-all duration-300 font-medium cursor-pointer hover:scale-105 active:scale-95 transform"
                >
                  <div className="flex items-center">
                    <MapPin className="mr-3" size={20} />
                    <div className="text-left">
                      <div className="text-sm">
                        {zonaSeleccionada.nombre || `Zona ${zonaSeleccionada.id}`}
                      </div>
                      <div className="text-xs text-green-600">Cambiar zona</div>
                    </div>
                  </div>
                  <RefreshCw size={16} className="transition-transform duration-300 group-hover:rotate-180" />
                </button>
              )}
              
              {/* Catálogo móvil */}
              <button
                onClick={() => {
                  setIsMobilePresentacionesOpen(true)
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center justify-between w-full px-4 py-3 text-green-700 hover:bg-green-100 rounded-lg transition-colors font-medium"
              >
                <div className="flex items-center">
                  <Menu className="mr-3" size={20} />
                  Catálogo
                </div>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Modal de Mi Lista */}
      <ShoppingListModal 
        isOpen={isShoppingListOpen}
        onClose={() => setIsShoppingListOpen(false)}
      />
      
      {/* Modal de Catálogo móvil */}
      <PresentacionesDropdown 
        isOpen={isMobilePresentacionesOpen}
        onClose={() => setIsMobilePresentacionesOpen(false)}
        isMobile={true}
      />
    </>
  )
} 