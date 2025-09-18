'use client'

import Link from "next/link"
import { Home, Package, Zap, Phone, Mail, Clock, MapPin, Shield, CreditCard, Truck } from "lucide-react"

export default function Footer() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById('productos')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
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
                <Link href="/ayuda" className="text-green-100 hover:text-white transition-colors duration-300">
                  Centro de ayuda
                </Link>
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
            <h3 className="text-lg font-bold border-b border-green-600 pb-2">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Phone className="size-4 text-violet-300 mt-1" />
                <div>
                  <p className="text-white font-medium whitespace-nowrap">Central: 11 3093-8491</p>
                  <p className="text-white font-medium whitespace-nowrap">Maschwitz: 11 3093-8487</p>
                  <p className="text-white font-medium whitespace-nowrap">Matheu: 11 2850-5547</p>
                  <p className="text-white font-medium whitespace-nowrap">Garin: 11 3093-8486</p>
                  <p className="text-white font-medium whitespace-nowrap">Cardales: 11 3093-8483</p>
                  <p className="text-white font-medium whitespace-nowrap">Capilla del Señor: 11 3093-8492</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="size-4 text-violet-300" />
                <p className="text-green-100">info@MueblesCenter.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="size-4 text-violet-300" />
                <p className="text-green-100">Lun-Dom 9:00-18:00</p>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="size-4 text-violet-300" />
                <p className="text-green-100">Buenos Aires, Argentina</p>
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