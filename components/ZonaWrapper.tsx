'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useZonaContext } from '@/contexts/ZonaContext'
import ZonaSelectorModal from './ZonaSelectorModal'

interface ZonaWrapperProps {
  children: ReactNode
}

export function ZonaWrapper({ children }: ZonaWrapperProps) {
  const { isZonaSelected } = useZonaContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>{children}</div>
  }

  return (
    <>
      {children}
      <ZonaSelectorModal isOpen={!isZonaSelected} />
    </>
  )
}

export default ZonaWrapper