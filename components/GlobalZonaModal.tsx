'use client'

import { useZonaContext } from '@/contexts/ZonaContext'
import ZonaSelectorModal from './ZonaSelectorModal'

export default function GlobalZonaModal() {
  const { isZonaSelected } = useZonaContext()

  return <ZonaSelectorModal isOpen={!isZonaSelected} />
}