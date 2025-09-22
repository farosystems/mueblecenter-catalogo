"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import TypewriterText from "./TypewriterText"
import { getBannerPrincipal } from "@/lib/supabase-config"

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [bannerPrincipal, setBannerPrincipal] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    loadBannerPrincipal()
  }, [])

  const loadBannerPrincipal = async () => {
    try {
      const banner = await getBannerPrincipal()
      setBannerPrincipal(banner)
    } catch (error) {
      console.error('Error al cargar banner principal:', error)
    } finally {
      setImageLoading(false)
    }
  }

  return (
    <section
      id="inicio"
      className="relative text-white pt-20 overflow-hidden min-h-screen flex items-center"
    >
      {/* Imagen de fondo */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: bannerPrincipal 
            ? `url('${bannerPrincipal}')` 
            : "none",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundColor: bannerPrincipal ? 'transparent' : '#1F632A'
        }}
      >
        {/* Overlay mejorado para mayor calidad visual */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/40 to-blue-900/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
      </div>

      {/* Fondo animado con partículas */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-blue-300 rounded-full animate-float delay-200"></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-float delay-500"></div>
        <div className="absolute bottom-40 right-1/3 w-5 h-5 bg-purple-400 rounded-full animate-float delay-700"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`text-center transition-all duration-1000 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            Bienvenidos a{" "}
            <span className="inline-block min-w-[200px] sm:min-w-[300px] md:min-w-[600px] lg:min-w-[800px]">
              <TypewriterText />
            </span>
          </h1>
          <p
            className={`text-lg sm:text-xl md:text-2xl mb-8 max-w-3xl mx-auto px-2 transition-all duration-1000 delay-500 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
          >
            Tu tienda de electrodomésticos de confianza con los mejores planes de financiación
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12 items-center mt-16 max-w-4xl mx-auto px-4">
          <div className={`transition-all duration-1000 delay-700 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}>
            <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 w-full max-w-xs sm:max-w-sm mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6" style={{color: '#FF2F12'}}>¿Quiénes Somos?</h2>
              <p className="text-sm sm:text-base md:text-lg mb-3 sm:mb-4 leading-relaxed text-gray-800">
                En MueblesCenter somos una empresa especializada en la venta de electrodomésticos con más de 50 años de
                experiencia en el mercado. Nos dedicamos a brindar soluciones accesibles para tu hogar.
              </p>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-800">
                Ofrecemos productos de las mejores marcas con planes de financiación flexibles que se adaptan a tu
                presupuesto.
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-1000 ${isVisible ? "animate-fade-in-right" : "opacity-0"}`}
          >
            <div className="bg-white/95 backdrop-blur-xl p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-white/30 hover:shadow-3xl transition-all duration-300 w-full max-w-xs sm:max-w-sm mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6" style={{color: '#FF2F12'}}>¿Qué Hacemos?</h2>
              <ul className="text-sm sm:text-base md:text-lg space-y-3 sm:space-y-4">
                {[
                  "Venta de electrodomésticos de primera calidad",
                  "Planes de financiación en 3, 6 y 12 cuotas",
                  "Asesoramiento personalizado",
                  "Entrega a domicilio",
                  "Garantía oficial en todos nuestros productos",
                ].map((item, index) => (
                  <li
                    key={index}
                    className={`flex items-center transition-all duration-500 text-gray-800 ${
                      index === 0
                        ? "delay-1000"
                        : index === 1
                          ? "delay-1100"
                          : index === 2
                            ? "delay-1200"
                            : index === 3
                              ? "delay-1300"
                              : "delay-1500"
                    } ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}
                  >
                    <span className="mr-3 text-xl" style={{color: '#FF2F12'}}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Botón CTA animado */}
        <div
          className={`text-center mt-16 transition-all duration-1000 delay-1000 ${isVisible ? "animate-scale-in" : "opacity-0"}`}
        >
          <Link
            href="/presentaciones"
            className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-5 px-10 rounded-full text-xl hover:from-yellow-300 hover:to-yellow-400 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-3xl animate-pulse-glow border-2 border-yellow-300/50"
          >
            Ver Presentaciones
          </Link>
        </div>
      </div>
    </section>
  )
}
