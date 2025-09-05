"use client"

import { MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import type { Product } from "@/lib/products"
import { useConfiguracion } from "@/hooks/use-configuracion"
import { useZonaContext } from "@/contexts/ZonaContext"
import { getTelefonoPorZona } from "@/lib/supabase-config"
import { useWhatsAppSuccess } from "@/contexts/WhatsAppSuccessContext"

interface WhatsAppButtonProps {
  product: Product
  onSuccess?: () => void
}

export default function WhatsAppButton({ product, onSuccess }: WhatsAppButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [telefonoZona, setTelefonoZona] = useState<string | null>(null)
  const [loadingTelefono, setLoadingTelefono] = useState(false)
  const { telefono, loading: configLoading, error: configError } = useConfiguracion()
  const { zonaSeleccionada } = useZonaContext()
  const { showSuccess } = useWhatsAppSuccess()
  
  // Cargar teléfono de la zona seleccionada
  useEffect(() => {
    const loadTelefonoZona = async () => {
      if (zonaSeleccionada) {
        setLoadingTelefono(true)
        try {
          const telefono = await getTelefonoPorZona(zonaSeleccionada.id)
          setTelefonoZona(telefono)
        } catch (error) {
          console.error('Error al obtener teléfono de la zona:', error)
          setTelefonoZona(null)
        } finally {
          setLoadingTelefono(false)
        }
      }
    }
    
    loadTelefonoZona()
  }, [zonaSeleccionada])
  
  // Función para generar el mensaje de WhatsApp
  const generateWhatsAppMessage = (product: Product): string => {
    // Debug: verificar qué tipo de producto es
    console.log('🔍 Generando mensaje para producto:', product)
    console.log('🔍 Tiene descripcion_detallada:', !!product.descripcion_detallada)
    console.log('🔍 Descripción incluye "Lista de":', product.descripcion?.includes('Lista de'))
    
    // Verificar si es un producto virtual de lista (tiene descripcion_detallada)
    if (product.descripcion_detallada && product.descripcion?.includes('Lista de')) {
      console.log('🔍 Detectado producto virtual de lista')
      let message = `Hola! 👋 Me interesa consultar sobre los siguientes productos:\n\n`
      
      // Usar la descripción detallada que contiene la lista de productos
      message += product.descripcion_detallada
      
      message += `\n\n¿Podrían brindarme más información sobre estos productos?`
      
      console.log('🔍 Mensaje generado:', message)
      return message
    }
    
    // Mensaje normal para productos individuales
    const productInfo = product.descripcion || product.name || 'este producto'
    
    let message = `Hola! 👋 Me interesa saber más información sobre: ${productInfo}`
    
    // Agregar información de categoría y marca si están disponibles
    if (product.categoria?.descripcion || product.marca?.descripcion) {
      message += '\n\n'
      if (product.categoria?.descripcion) {
        message += `Categoría: ${product.categoria.descripcion}`
      }
      if (product.marca?.descripcion) {
        message += product.categoria?.descripcion ? ` | Marca: ${product.marca.descripcion}` : `Marca: ${product.marca.descripcion}`
      }
    }
    
    message += `\n\n¿Podrían brindarme más detalles sobre este producto?`
    
    return message
  }

  const handleClick = () => {
    // Determinar si viene de la lista de compras
    const fromShoppingList = product.descripcion?.includes('Lista de') || false

    // Ejecutar callback primero (limpiar lista si viene de shopping list)
    if (onSuccess) {
      onSuccess()
    }

    // Mostrar modal de éxito usando el contexto global
    showSuccess(fromShoppingList)

    // Esperar un momento antes de abrir WhatsApp para que el usuario vea el modal
    setTimeout(() => {
      // Usar el teléfono de la zona seleccionada o el teléfono por defecto
      const phoneNumber = telefonoZona || telefono || "5491123365608"
      const message = generateWhatsAppMessage(product)
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      
      // Detectar si es móvil para usar el método correcto
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      
      if (isMobile) {
        // En móviles, usar window.location.href para abrir la app directamente
        window.location.href = whatsappUrl
      } else {
        // En desktop, usar window.open
        window.open(whatsappUrl, '_blank')
      }
    }, 500) // Esperar 500ms para que el usuario vea el modal
  }

  // Si está cargando, mostrar un botón deshabilitado
  if (configLoading || loadingTelefono) {
    return (
      <button
        disabled
        className="relative w-full bg-gray-400 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center transition-all duration-300 text-lg shadow-lg cursor-not-allowed"
      >
        <MessageCircle className="mr-3 animate-pulse" size={24} />
        <span>Cargando...</span>
      </button>
    )
  }

  // Si hay error en la configuración, mostrar el botón con el número por defecto
  if (configError) {
    console.warn('Error al cargar configuración, usando número por defecto:', configError)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="relative w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center transition-all duration-300 text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 overflow-hidden group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Efecto de onda */}
        <div
          className={`absolute inset-0 bg-white/20 transform transition-transform duration-500 ${
            isHovered ? "translate-x-0" : "-translate-x-full"
          }`}
        ></div>

        <MessageCircle className={`mr-3 transition-all duration-300 ${isHovered ? "animate-bounce" : ""}`} size={24} />

        <span className="relative z-10">Consultar Producto por WhatsApp</span>

        {/* Partículas animadas */}
        <div
          className={`absolute top-2 right-4 w-2 h-2 bg-white rounded-full transition-all duration-300 ${
            isHovered ? "animate-ping" : "opacity-0"
          }`}
        ></div>
      </button>
    </>
  )
}
