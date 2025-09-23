"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { getLogo } from "@/lib/supabase-config"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [logo, setLogo] = useState<string>('/logo1.png')

  // Cargar logo
  useEffect(() => {
    const loadLogo = async () => {
      try {
//         console.log('Navbar: Intentando cargar logo...')
        const logoUrl = await getLogo()
//         console.log('Navbar: Logo obtenido:', logoUrl)
        // Si hay logo configurado en la BD, usarlo; sino mantener el por defecto
        if (logoUrl) {
//           console.log('Navbar: Actualizando logo a:', logoUrl)
          setLogo(logoUrl)
        } else {
//           console.log('Navbar: No hay logo configurado, manteniendo por defecto')
        }
        // Si logoUrl es null, mantiene '/logo1.png' por defecto
      } catch (error) {
        console.error('Navbar: Error al cargar logo:', error)
      }
    }
    loadLogo()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

//   console.log('Navbar: Renderizando con logo:', logo)

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-blue-900/95 backdrop-blur-md shadow-lg" : "bg-blue-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-shrink-0 w-20">
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity duration-300"
            >
              <img
                src={logo}
                alt="MueblesCenter"
                className="object-contain"
                style={{ height: '24px', width: 'auto', maxWidth: '80px' }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/logo1.png'
                }}
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {["inicio", "productos", "destacados"].map((section, index) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`capitalize hover:text-yellow-400 transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${
                  index === 0 ? "delay-100" : index === 1 ? "delay-200" : "delay-300"
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-400 transition-all duration-300 transform hover:scale-110"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-800/95 backdrop-blur-md rounded-b-lg">
            {["inicio", "productos", "destacados"].map((section, index) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`block px-3 py-2 text-white hover:text-yellow-400 w-full text-left capitalize transition-all duration-300 transform hover:translate-x-2 animate-fade-in-left ${
                  index === 0 ? "delay-100" : index === 1 ? "delay-200" : "delay-300"
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
