import { useState, useEffect } from 'react'
import { getTelefono, getBanners } from '@/lib/supabase-config'

export function useConfiguracion() {
  const [telefono, setTelefono] = useState<string | null>(null)
  const [banners, setBanners] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchConfiguracion() {
      try {
        setLoading(true)
        const [telefonoData, bannersData] = await Promise.all([
          getTelefono(),
          getBanners()
        ])
        setTelefono(telefonoData)
        setBanners(bannersData)
      } catch (err) {
        setError('Error al cargar la configuración')
        console.error('Error al cargar configuración:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConfiguracion()
  }, [])

  return { telefono, banners, loading, error }
}
