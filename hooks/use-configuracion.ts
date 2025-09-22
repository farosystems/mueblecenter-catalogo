import { useState, useEffect } from 'react'
import { getTelefono, getBanners, getLogo } from '@/lib/supabase-config'

export function useConfiguracion() {
  const [telefono, setTelefono] = useState<string | null>(null)
  const [banners, setBanners] = useState<string[]>([])
  const [logo, setLogo] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchConfiguracion() {
      try {
        setLoading(true)
        const [telefonoData, bannersData, logoData] = await Promise.all([
          getTelefono(),
          getBanners(),
          getLogo()
        ])
        setTelefono(telefonoData)
        setBanners(bannersData)
        setLogo(logoData)
      } catch (err) {
        setError('Error al cargar la configuración')
        console.error('Error al cargar configuración:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchConfiguracion()
  }, [])

  return { telefono, banners, logo, loading, error }
}
