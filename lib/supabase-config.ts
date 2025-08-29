import { supabase } from './supabase'

export interface Configuracion {
  id: number
  created_at: string
  telefono: string | null
}

export interface ConfiguracionWeb {
  id: number
  created_at: string
  banner: string | null
  banner_2: string | null
  banner_3: string | null
}

export interface Zona {
  id: number
  created_at: string
  nombre: string | null
}

export interface ConfiguracionZona {
  id: number
  created_at: string
  fk_id_zona: number
  telefono: string
  zona?: Zona
}

export async function getConfiguracion(): Promise<Configuracion | null> {
  try {
    const { data, error } = await supabase
      .from('configuracion')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      console.error('Error al obtener configuración:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error al obtener configuración:', error)
    return null
  }
}

export async function getTelefono(): Promise<string | null> {
  const config = await getConfiguracion()
  return config?.telefono || null
}

export async function updateTelefono(telefono: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('configuracion')
      .upsert({ telefono }, { onConflict: 'id' })

    if (error) {
      console.error('Error al actualizar teléfono:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error al actualizar teléfono:', error)
    return false
  }
}

export async function getZonas(): Promise<Zona[]> {
  try {
    const { data, error } = await supabase
      .from('zonas')
      .select('*')
      .order('nombre')

    if (error) {
      console.error('Error al obtener zonas:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error al obtener zonas:', error)
    return []
  }
}

export async function getConfiguracionZonas(): Promise<ConfiguracionZona[]> {
  try {
    const { data, error } = await supabase
      .from('configuracion_zonas')
      .select(`
        *,
        zona:zonas(*)
      `)
      .order('fk_id_zona')

    if (error) {
      console.error('Error al obtener configuración de zonas:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error al obtener configuración de zonas:', error)
    return []
  }
}

export async function getTelefonoPorZona(zonaId: number): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('configuracion_zonas')
      .select('telefono')
      .eq('fk_id_zona', zonaId)
      .single()

    if (error) {
      console.error('Error al obtener teléfono por zona:', error)
      return null
    }

    return data?.telefono || null
  } catch (error) {
    console.error('Error al obtener teléfono por zona:', error)
    return null
  }
}

export async function getConfiguracionWeb(): Promise<ConfiguracionWeb[]> {
  try {
    const { data, error } = await supabase
      .from('configuracion_web')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al obtener configuración web:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error al obtener configuración web:', error)
    return []
  }
}

export async function getBanners(): Promise<string[]> {
  try {
    const configuraciones = await getConfiguracionWeb()
    const banners: string[] = []
    
    configuraciones.forEach(config => {
      // Agregar banner principal si existe
      if (config.banner) {
        banners.push(config.banner)
      }
      // Agregar banner_2 si existe
      if (config.banner_2) {
        banners.push(config.banner_2)
      }
      // Agregar banner_3 si existe
      if (config.banner_3) {
        banners.push(config.banner_3)
      }
    })
    
    return banners
  } catch (error) {
    console.error('Error al obtener banners:', error)
    return []
  }
}
