'use client'

import Link from "next/link"
import { Home, Package, Zap, Phone, Mail, Clock, MapPin, Shield, CreditCard, Truck } from "lucide-react"
import { useZonaContext } from "@/contexts/ZonaContext"

export default function Footer() {
  const { zonaSeleccionada } = useZonaContext()

  const scrollToProducts = () => {
    const productsSection = document.getElementById('productos')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Mapeo de zonas a números de WhatsApp
  const getWhatsAppNumber = () => {
    if (!zonaSeleccionada) return '1130938491' // Default: Escobar

    const whatsappMap: Record<string, string> = {
      'Escobar': '1130938491',
      'Maschwitz': '1130938487',
      'Matheu': '1128505547',
      'Garin': '1130938486',
      'Cardales': '1130938483',
      'Capilla del señor': '1130938492'
    }

    return whatsappMap[zonaSeleccionada.nombre || ''] || '1130938491'
  }

  const handleCentroAyuda = () => {
    const phoneNumber = getWhatsAppNumber()
    const message = encodeURIComponent('Hola, necesito ayuda con...')
    window.open(`https://wa.me/549${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    <footer className="bg-footer-solid text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Contenido principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Columna 1: MUNDOCUOTAS */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/LOGO BLANCO.png"
                alt="MUNDO CUOTAS"
                className="h-12 w-auto"
              />
              <div>
                <h3 className="text-xl font-bold">MueblesCenter</h3>
                <p className="text-green-100 text-sm">Tu tienda de electrodomésticos de confianza</p>
              </div>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Especialistas en electrodomésticos con los mejores planes de financiación. 
              Hacemos que tus sueños sean realidad con cuotas accesibles.
            </p>
          </div>

          {/* Columna 2: Productos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-green-600 pb-2">Productos</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={scrollToProducts}
                  className="text-green-100 hover:text-white transition-colors duration-300 flex items-center"
                >
                  <Package className="mr-2 size-4" />
                  Catálogo completo
                </button>
              </li>
              <li>
                <Link href="/#destacados" className="text-green-100 hover:text-white transition-colors duration-300 flex items-center">
                  <Zap className="mr-2 size-4" />
                  Productos destacados
                </Link>
              </li>
              <li className="text-green-100 flex items-center">
                <Truck className="mr-2 size-4" />
                Envío a domicilio
              </li>
              <li className="text-green-100 flex items-center">
                <CreditCard className="mr-2 size-4" />
                Financiación en cuotas
              </li>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-green-600 pb-2">Soporte</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={handleCentroAyuda}
                  className="text-green-100 hover:text-white transition-colors duration-300"
                >
                  Centro de ayuda
                </button>
              </li>
              <li>
                <Link href="/terminos" className="text-green-100 hover:text-white transition-colors duration-300">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-green-100 hover:text-white transition-colors duration-300">
                  Política de privacidad
                </Link>
              </li>
              <li className="text-green-100 flex items-center">
                <Shield className="mr-2 size-4" />
                Garantía extendida
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold border-b border-green-600 pb-2">NUESTRAS SUCURSALES</h3>
            <div className="space-y-3">
              <div className="space-y-3">
                <div>
                  <p className="text-white font-medium text-sm">Sucursal Escobar</p>
                  <p className="text-green-100 text-xs">E. Tapia de cruz 376 || 1130938491 - 8:30 a 19:30 hs</p>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Sucursal Maschwitz</p>
                  <p className="text-green-100 text-xs">Av. Villanueva 1656 || 1130938487 - 9 a 19 hs</p>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Sucursal Matheu</p>
                  <p className="text-green-100 text-xs">Av. Sarmiento 240 || 1128505547 - 8:30 a 13 y 15:30 a 19:30 hs</p>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Sucursal Garin</p>
                  <p className="text-green-100 text-xs">Belgrano y Suling || 1130938486 - 8:30 a 13 y 15:30 a 19:30 hs</p>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Sucursal Cardales</p>
                  <p className="text-green-100 text-xs">Av. San Martin 144 || 1130938483 - 8:30 a 13 y 15:30 a 19:30 hs</p>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Sucursal Capilla del señor</p>
                  <p className="text-green-100 text-xs">Belgrano y Moreno || 1130938492 - 8:30 a 13 y 15:30 a 19:30 hs</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 pt-2 border-t border-green-600">
                <Mail className="size-4 text-violet-300" />
                <p className="text-green-100">mueblescenterweb@gmail.com.ar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className="border-t border-green-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-green-100 text-sm text-center md:text-left">
              © 2025 MueblesCenter. Todos los derechos reservados. 
              Especialistas en electrodomésticos con financiación.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-green-100 hover:text-white transition-colors duration-300 text-sm">
                Inicio
              </Link>
              <button 
                onClick={scrollToProducts}
                className="text-green-100 hover:text-white transition-colors duration-300 text-sm"
              >
                Productos
              </button>
              <Link href="/#destacados" className="text-green-100 hover:text-white transition-colors duration-300 text-sm">
                Destacados
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 