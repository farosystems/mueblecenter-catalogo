'use client'

import { useState, useEffect } from 'react'
import { PlanFinanciacion } from '@/lib/products'
import { getPlanesProducto, calcularCuota, formatearPrecio, formatearCuota, getTipoPlanesProducto, calcularAnticipo } from '@/lib/supabase-products'

interface FinancingPlansProps {
  productoId: string
  precio: number
  showDebug?: boolean
  simplified?: boolean
  onPrecioPromoChange?: (precioPromo: number | null) => void
}

export default function FinancingPlans({ productoId, precio, showDebug = false, simplified = false, onPrecioPromoChange }: FinancingPlansProps) {
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

  // Mostrar todos los planes disponibles para este producto
  const colores = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-purple-100 text-purple-800', 'bg-orange-100 text-orange-800']

  // Ordenar planes: 3 cuotas primero, luego el resto
  const planesOrdenados = [...planes].sort((a, b) => {
    if (a.cuotas === 3) return -1
    if (b.cuotas === 3) return 1
    return a.cuotas - b.cuotas
  })

  // Usar precio_promo si existe, sino usar el precio normal
  const precioParaCalcular = precioPromo || precio

  return (
    <div className="mt-3 space-y-2">
      {/* Información de debug */}
      {showDebug && (
        <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-100 rounded">
          <strong>Tipo de planes:</strong> {getTipoPlanesText(tipoPlanes)} | <strong>Total:</strong> {planes.length} planes
          {precioPromo && <> | <strong>Precio Promo:</strong> ${formatearPrecio(precioPromo)}</>}
        </div>
      )}

      {planesOrdenados.map((plan, index) => {
        const calculo = calcularCuota(precioParaCalcular, plan)
        const anticipo = calcularAnticipo(precioParaCalcular, plan)
        if (!calculo) return null

        return (
          <div
            key={plan.id}
            className={`p-2 rounded-lg text-center font-bold ${
              plan.cuotas === 3 ? 'bg-yellow-200 text-yellow-900 ring-2 ring-yellow-400' : colores[index % colores.length]
            }`}
            style={{fontSize: simplified ? '16px' : '14px'}}
          >
            <div className="mb-1">
              {simplified ?
                plan.cuotas === 3 ?
                  `${plan.cuotas} cuotas sin interés de $${formatearCuota(calculo.cuota_mensual)}` :
                  `${plan.cuotas} cuotas fijas de $${formatearCuota(calculo.cuota_mensual)}` :
                plan.cuotas === 3 ?
                  `${plan.cuotas} cuotas sin interés de $${formatearCuota(calculo.cuota_mensual)}` :
                  `${plan.cuotas} cuotas fijas de $${formatearCuota(calculo.cuota_mensual)}`
              }
            </div>
            {anticipo > 0 && (
              <div className="font-normal opacity-90" style={{fontSize: '12px'}}>
                Anticipo: ${formatearPrecio(anticipo)}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
} 