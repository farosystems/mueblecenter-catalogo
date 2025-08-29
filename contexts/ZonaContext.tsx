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

  // Cargar zona del localStorage al iniciar
  useEffect(() => {
    const zonaGuardada = localStorage.getItem('zona_seleccionada')
    if (zonaGuardada) {
      try {
        const zona = JSON.parse(zonaGuardada)
        setZonaSeleccionadaState(zona)
        setIsZonaSelected(true)
      } catch (error) {
        console.error('Error al cargar zona del localStorage:', error)
        localStorage.removeItem('zona_seleccionada')
      }
    }
  }, [])

  const setZonaSeleccionada = (zona: Zona | null) => {
    setZonaSeleccionadaState(zona)
    setIsZonaSelected(!!zona)
    
    if (zona) {
      localStorage.setItem('zona_seleccionada', JSON.stringify(zona))
    } else {
      localStorage.removeItem('zona_seleccionada')
    }
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