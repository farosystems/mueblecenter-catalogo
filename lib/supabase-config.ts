import { supabase } from './supabase'

export interface Configuracion {
  id: number
  created_at: string
  telefono: string | null
  logo: string | null
}

export interface ConfiguracionWeb {
  id: number
  created_at: string
  banner: string | null
  banner_2: string | null
  banner_3: string | null
  banner_principal: string | null
  seccion_bienvenidos: boolean | null
  banner_link: string | null
  banner_2_link: string | null
  banner_3_link: string | null
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

export interface BannerConLink {
  imagen: string
  link: string | null
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

export async function getBannersConLinks(): Promise<BannerConLink[]> {
  try {
    const configuraciones = await getConfiguracionWeb()
    const banners: BannerConLink[] = []

    configuraciones.forEach(config => {
      // Agregar banner principal si existe
      if (config.banner) {
        banners.push({
          imagen: config.banner,
          link: config.banner_link
        })
      }
      // Agregar banner_2 si existe
      if (config.banner_2) {
        banners.push({
          imagen: config.banner_2,
          link: config.banner_2_link
        })
      }
      // Agregar banner_3 si existe
      if (config.banner_3) {
        banners.push({
          imagen: config.banner_3,
          link: config.banner_3_link
        })
      }
    })

    return banners
  } catch (error) {
    console.error('Error al obtener banners con links:', error)
    return []
  }
}

// Función para obtener el banner principal del home
export async function getBannerPrincipal(): Promise<string | null> {
  try {
    const configuraciones = await getConfiguracionWeb()
    
    // Obtener el banner_principal de la configuración más reciente
    const config = configuraciones[0]
    return config?.banner_principal || null
  } catch (error) {
    console.error('Error al obtener banner principal:', error)
    return null
  }
}

// Interfaces para stock por sucursales
export interface StockSucursal {
  id: number
  fk_id_producto: number
  fk_id_zona: number
  stock: number
  stock_minimo: number
  activo: boolean
  created_at: string
  updated_at: string
}

// Función para obtener el stock de productos por zona
export async function getStockPorZona(zonaId: number): Promise<StockSucursal[]> {
  try {
    const { data, error } = await supabase
      .from('stock_sucursales')
      .select('*')
      .eq('fk_id_zona', zonaId)
      .eq('activo', true)
      .gte('stock', 0) // Stock mayor o igual a 0

    if (error) {
      console.error('Error al obtener stock por zona:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error al obtener stock por zona:', error)
    return []
  }
}

// Función para obtener productos con stock disponible en una zona
export async function getProductosConStockEnZona(zonaId: number): Promise<number[]> {
  try {
    //console.log('🔍 getProductosConStockEnZona: Consultando zona:', zonaId)

    // Obtener TODOS los registros usando paginación
    let allData: any[] = []
    let from = 0
    const pageSize = 1000
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase
        .from('stock_sucursales')
        .select('fk_id_producto, stock, stock_minimo')
        .eq('fk_id_zona', zonaId)
        .eq('activo', true)
        .gt('stock', 0)
        .range(from, from + pageSize - 1)

      if (error) {
        console.error('Error al obtener productos con stock en zona:', error)
        break
      }

      if (data && data.length > 0) {
        allData = allData.concat(data)
        from += pageSize
        hasMore = data.length === pageSize
      } else {
        hasMore = false
      }
    }

    const productosConStock = allData

    console.log('🔍 getProductosConStockEnZona: Productos con stock > 0:', productosConStock.length)

    // Debug: mostrar algunos ejemplos
    if (productosConStock.length > 0) {
      console.log('🔍 getProductosConStockEnZona: Ejemplos de stock:', productosConStock.slice(0, 5).map(item => ({
        id: item.fk_id_producto,
        stock: item.stock,
        stock_minimo: item.stock_minimo
      })))
    }

    const productIds = productosConStock.map(item => item.fk_id_producto)

    // DEBUG: Verificar si incluye IDs de electrodomésticos (7538, 7397, etc)
    const electroIds = [7538, 7397, 7485, 7530, 20462]
    const found = electroIds.filter(id => productIds.includes(id))
    console.log('🔍 getProductosConStockEnZona: IDs electrodomésticos encontrados en stock:', found)

    return productIds
  } catch (error) {
    console.error('Error al obtener productos con stock en zona:', error)
    return []
  }
}

// Función para obtener stock específico de un producto en una zona
export async function getStockProductoEnZona(productoId: number, zonaId: number): Promise<StockSucursal | null> {
  try {
    const { data, error } = await supabase
      .from('stock_sucursales')
      .select('*')
      .eq('fk_id_producto', productoId)
      .eq('fk_id_zona', zonaId)
      .eq('activo', true)
      .order('stock', { ascending: false })
      .limit(1)

    if (error) {
      console.error('Error al obtener stock del producto en zona:', error)
      return null
    }

    return data && data.length > 0 ? data[0] : null
  } catch (error) {
    console.error('Error al obtener stock del producto en zona:', error)
    return null
  }
}

// Función para obtener el logo de la empresa
export async function getLogo(): Promise<string | null> {
  try {
    const config = await getConfiguracion()
    return config?.logo || null // Retorna el logo de la BD o null si no hay
  } catch (error) {
    console.error('Error al obtener logo:', error)
    return null // Retorna null en caso de error
  }
}

// Función para verificar si se debe mostrar la sección de bienvenida
export async function mostrarSeccionBienvenidos(): Promise<boolean> {
  try {
    const configuraciones = await getConfiguracionWeb()
    const config = configuraciones[0]
    // Por defecto retorna true si no está definido
    return config?.seccion_bienvenidos ?? true
  } catch (error) {
    console.error('Error al obtener configuración de sección bienvenidos:', error)
    return true // Por defecto muestra la sección en caso de error
  }
}
