'use client'

import { useState, useEffect } from 'react'
import { Product, Categoria, Marca } from '@/lib/products'
import { 
  getProductsByZona, 
  getFeaturedProductsByZona, 
  getProductsByCategoryAndZona, 
  getProductsByBrandAndZona,
  getCategories,
  getBrands
} from '@/lib/supabase-products'

interface UseProductsProps {
  zonaId?: number | null
}

export function useProducts({ zonaId = null }: UseProductsProps = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Categoria[]>([])
  const [brands, setBrands] = useState<Marca[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInitialData()
  }, [zonaId])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)

      const featuredData = await getFeaturedProductsByZona(zonaId)
      const productsData = await getProductsByZona(zonaId)
      const categoriesData = await getCategories()
      const brandsData = await getBrands()

      //console.log('🔍 useProducts - Datos cargados:', {
        //featured: featuredData.length,
       // products: productsData.length,
        //categories: categoriesData.length,
        //brands: brandsData.length
      //})

      // Debug detallado de productos
      //console.log('🔍 useProducts - Primeros 5 productos:', productsData.slice(0, 5).map(p => ({
        //id: p.id,
        //descripcion: p.descripcion,
        //precio: p.precio,
        //categoria: p.categoria?.descripcion,
        //marca: p.marca?.descripcion
      //})))

      // Verificar productos con precio > 0
      const productosConPrecio = productsData.filter(p => (p.precio || 0) > 0)
      //console.log('🔍 useProducts - Productos con precio > 0:', productosConPrecio.length)

      setProducts(productsData)
      setFeaturedProducts(featuredData)
      setCategories(categoriesData)
      setBrands(brandsData)
      
    } catch (err) {
      setError('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  const filterByCategory = async (categoryId: number | null) => {
    if (categoryId === null) {
      await loadInitialData()
      return
    }

    try {
      setLoading(true)
      const filteredProducts = await getProductsByCategoryAndZona(categoryId, zonaId)
      setProducts(filteredProducts)
    } catch (err) {
      setError('Error al filtrar por categoría')
    } finally {
      setLoading(false)
    }
  }

  const filterByBrand = async (brandId: number | null) => {
    if (brandId === null) {
      await loadInitialData()
      return
    }

    try {
      setLoading(true)
      const filteredProducts = await getProductsByBrandAndZona(brandId, zonaId)
      setProducts(filteredProducts)
    } catch (err) {
      setError('Error al filtrar por marca')
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    loadInitialData()
  }

  return {
    products,
    featuredProducts,
    categories,
    brands,
    loading,
    error,
    filterByCategory,
    filterByBrand,
    clearFilters,
    refresh: loadInitialData
  }
} 