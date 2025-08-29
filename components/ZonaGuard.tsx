'use client'

import { ReactNode } from 'react'
import { useZonaContext } from '@/contexts/ZonaContext'
import ZonaSelectorModal from './ZonaSelectorModal'

interface ZonaGuardProps {
  children: ReactNode
}

export function ZonaGuard({ children }: ZonaGuardProps) {
  const { isZonaSelected } = useZonaContext()

  return (
    <>
      {children}
      <ZonaSelectorModal isOpen={!isZonaSelected} />
    </>
  )
}

export default ZonaGuard