'use client'

import { useState, useEffect } from 'react'
import { PlanFinanciacion } from '@/lib/products'
import { getPlanesProducto, calcularCuota, formatearPrecio, formatearCuota, getTipoPlanesProducto, calcularAnticipo } from '@/lib/supabase-products'

interface FinancingPlansLargeProps {
  productoId: string
  precio: number
  showDebug?: boolean
  onPrecioPromoChange?: (precioPromo: number | null) => void
}

export default function FinancingPlansLarge({ productoId, precio, showDebug = false, onPrecioPromoChange }: FinancingPlansLargeProps) {
  const [planes, setPlanes] = useState<PlanFinanciacion[]>([])
  const [precioPromo, setPrecioPromo] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [tipoPlanes, setTipoPlanes] = useState<'especiales' | 'default' | 'todos' | 'ninguno'>('ninguno')

  useEffect(() => {
    async function loadPlanes() {
      try {
        setLoading(true)
        const [planesResult, tipoData] = await Promise.all([
          getPlanesProducto(productoId),
          getTipoPlanesProducto(productoId)
        ])
        //console.log('Planes cargados para producto', productoId, ':', planesResult)
        //console.log('Tipo de planes para producto', productoId, ':', tipoData)

        setPlanes(planesResult.planes)
        setPrecioPromo(planesResult.precio_promo)
        setTipoPlanes(tipoData)

        // Notificar al padre si hay callback
        if (onPrecioPromoChange) {
          onPrecioPromoChange(planesResult.precio_promo)
        }
      } catch (error) {
        console.error('Error loading financing plans:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPlanes()
  }, [productoId, onPrecioPromoChange])

  if (loading) {
    return (
      <div className="mt-3 p-2 bg-gray-50 rounded">
        <div className="animate-pulse h-4 bg-gray-200 rounded"></div>
      </div>
    )
  }

  if (planes.length === 0) {
    return null
  }

  // Función para obtener el texto descriptivo del tipo de planes
  const getTipoPlanesText = (tipo: string) => {
    switch (tipo) {
      case 'especiales':
        return 'Planes Especiales'
      case 'default':
        return 'Planes por Defecto'
      case 'todos':
        return 'Todos los Planes'
      default:
        return 'Sin Planes'
    }
  }

  // Mostrar todos los planes disponibles para este producto con diferentes colores
  const colores = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800',
    'bg-red-100 text-red-800',
    'bg-indigo-100 text-indigo-800'
  ]

  // Ordenar planes: 3 cuotas primero, luego el resto
  const planesOrdenados = [...planes].sort((a, b) => {
    if (a.cuotas === 3) return -1
    if (b.cuotas === 3) return 1
    return a.cuotas - b.cuotas
  })

  // Usar precio_promo si existe, sino usar el precio normal
  const precioParaCalcular = precioPromo || precio

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-3">Planes de Financiación</h3>

      {/* Logos de tarjetas */}
      <div className="mb-4 text-center">
        <p className="text-sm font-semibold text-gray-700 mb-2">¡Con todas las tarjetas!</p>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <img src="/tarjetas_logos/visa-logo-visa-icon-transparent-free-png.webp" alt="Visa" className="h-16 w-auto" />
          <img src="/tarjetas_logos/free-tarjeta-mastercard-logo-icon-svg-download-png-2944982.webp" alt="Mastercard" className="h-16 w-auto" />
          <img src="/tarjetas_logos/enterprise_Payment_Methods_partner_logo_amex.png" alt="American Express" className="h-16 w-auto" />
          <img src="/tarjetas_logos/Cabal_logo-removebg-preview.png" alt="Cabal" className="h-16 w-auto" />
        </div>
      </div>

      {/* Información de debug */}
      {showDebug && (
        <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-100 rounded">
          <strong>Tipo de planes:</strong> {getTipoPlanesText(tipoPlanes)} | <strong>Total:</strong> {planes.length} planes
          {precioPromo && <> | <strong>Precio Promo:</strong> ${formatearPrecio(precioPromo)}</>}
        </div>
      )}

      <div className="space-y-2">
        {planesOrdenados.map((plan, index) => {
          const calculo = calcularCuota(precioParaCalcular, plan)
          const anticipo = calcularAnticipo(precioParaCalcular, plan)
          if (!calculo) return null

          return (
            <div
              key={plan.id}
              className={`p-3 rounded-lg text-center font-bold text-base ${
                plan.cuotas === 3 ? 'bg-yellow-200 text-yellow-900 ring-2 ring-yellow-400' : colores[index % colores.length]
              }`}
            >
              <div className="mb-1">
                <div className="text-xl mb-1">
                  {plan.cuotas === 3 ?
                    `${plan.cuotas} cuotas sin interés de $${formatearCuota(calculo.cuota_mensual)}` :
                    `${plan.cuotas} cuotas fijas de $${formatearCuota(calculo.cuota_mensual)}`
                  }
                </div>
              </div>
              {anticipo > 0 && (
                <div className="text-sm font-semibold opacity-90 border-t pt-1 mt-1">
                  Anticipo: ${formatearPrecio(anticipo)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
