"use client"

import { useEffect } from "react"
import { CheckCircle, X, MessageCircle } from "lucide-react"

interface WhatsAppSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  fromShoppingList?: boolean
}

export default function WhatsAppSuccessModal({ isOpen, onClose, fromShoppingList = false }: WhatsAppSuccessModalProps) {
  useEffect(() => {
    if (isOpen) {
      // Auto cerrar después de 6 segundos (más tiempo para que el usuario vea el modal)
      const timer = setTimeout(() => {
        onClose()
      }, 6000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              ¡Consulta Enviada!
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-green-600 animate-bounce" />
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Serás atendido en breve
            </h3>
            
            <p className="text-gray-600 mb-4 leading-relaxed">
              {fromShoppingList 
                ? "Tu lista de productos ha sido enviada correctamente. Nuestro equipo se pondrá en contacto contigo para brindarte toda la información que necesitas."
                : "Tu consulta ha sido enviada correctamente. Nuestro equipo se pondrá en contacto contigo para brindarte toda la información que necesitas."
              }
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium text-sm">
                ¡Gracias por confiar en nosotros!
              </p>
              <p className="text-green-700 text-xs mt-1">
                Te responderemos por WhatsApp lo antes posible.
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
              <div className="bg-green-600 h-1 rounded-full animate-[progress_6s_linear_forwards]"></div>
            </div>
            <p className="text-xs text-gray-500">
              Este mensaje se cerrará automáticamente
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300"
          >
            Entendido
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0% }
          to { width: 100% }
        }
      `}</style>
    </div>
  )
}