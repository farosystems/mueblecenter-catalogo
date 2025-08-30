'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Zona } from '@/lib/supabase-config'

interface ZonaContextType {
  zonaSeleccionada: Zona | null
  setZonaSeleccionada: (zona: Zona | null) => void
  isZonaSelected: boolean
  clearZona: () => void
}

const ZonaContext = createContext<ZonaContextType | undefined>(undefined)

interface ZonaProviderProps {
  children: ReactNode
}

export function ZonaProvider({ children }: ZonaProviderProps) {
  const [zonaSeleccionada, setZonaSeleccionadaState] = useState<Zona | null>(null)
  const [isZonaSelected, setIsZonaSelected] = useState(false)

  // No cargar zona del localStorage - siempre pedir selección
  useEffect(() => {
    // Limpiar cualquier zona guardada previamente
    localStorage.removeItem('zona_seleccionada')
  }, [])

  const setZonaSeleccionada = (zona: Zona | null) => {
    setZonaSeleccionadaState(zona)
    setIsZonaSelected(!!zona)
    
    // No guardar en localStorage - la zona solo durará la sesión actual
    // if (zona) {
    //   localStorage.setItem('zona_seleccionada', JSON.stringify(zona))
    // } else {
    //   localStorage.removeItem('zona_seleccionada')
    // }
  }

  const clearZona = () => {
    setZonaSeleccionada(null)
  }

  return (
    <ZonaContext.Provider 
      value={{ 
        zonaSeleccionada, 
        setZonaSeleccionada, 
        isZonaSelected,
        clearZona
      }}
    >
      {children}
    </ZonaContext.Provider>
  )
}

export function useZonaContext() {
  const context = useContext(ZonaContext)
  if (context === undefined) {
    throw new Error('useZonaContext must be used within a ZonaProvider')
  }
  return context
}