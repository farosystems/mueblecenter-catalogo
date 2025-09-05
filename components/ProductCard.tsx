"use client"

import Link from "next/link"
import { Product } from "@/lib/products"
import FinancingPlans from "./FinancingPlans"
import AddToListButton from "./AddToListButton"

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
}

export default function ProductCard({ product, variant = 'default' }: ProductCardProps) {
  const productCategory = product.categoria?.descripcion || product.category || 'Sin categoría'
  const productBrand = product.marca?.descripcion || product.brand || 'Sin marca'
  const productPrice = product.precio || product.price || 0

  // Nueva información de presentación, línea y tipo
  const presentacion = product.presentacion?.nombre
  const linea = product.linea?.nombre
  const tipo = product.tipo?.nombre

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
        {/* Imagen del producto */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.imagen || product.image || '/placeholder.jpg'}
            alt={product.descripcion || product.name || 'Producto'}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badge Destacado */}
          {product.destacado && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-semibold shadow-lg">
              Destacado
            </div>
          )}
        </div>

        {/* Información del producto */}
        <div className="p-2">
          {/* Nueva jerarquía: Presentación, Línea, Tipo */}
          <div className="flex gap-0.5 mb-1 flex-wrap">
            {presentacion && (
              <span className="text-xs text-white bg-green-500 px-1 py-0.5 rounded-full truncate font-medium">
                {presentacion}
              </span>
            )}
            {linea && (
              <span className="text-xs text-white bg-blue-500 px-1 py-0.5 rounded-full truncate font-medium">
                {linea}
              </span>
            )}
            {tipo && (
              <span className="text-xs text-white bg-purple-500 px-1 py-0.5 rounded-full truncate font-medium">
                {tipo}
              </span>
            )}
          </div>

          {/* Categoría (fallback si no hay nueva jerarquía) */}
          {!presentacion && !linea && !tipo && (
            <div className="flex gap-0.5 mb-1 flex-wrap">
              <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded-full truncate">
                {productCategory}
              </span>
            </div>
          )}


          {/* Título del producto */}
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
            {product.descripcion || product.name || 'Sin descripción'}
          </h3>

          {/* Planes de Financiación - Versión compacta */}
          <div className="mb-1">
            <FinancingPlans productoId={product.id} precio={productPrice} />
          </div>

          {/* Botones de acción compactos */}
          <div className="space-y-1">
            {/* Botón Ver Detalles */}
            <Link
              href={(() => {
                // Priorizar nueva jerarquía
                if (tipo) {
                  return `/tipos/${tipo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}`
                }
                if (linea) {
                  return `/lineas/${linea.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}`
                }
                if (presentacion) {
                  return `/presentaciones/${presentacion.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}`
                }
                
                // Fallback a categoría tradicional
                if (product.categoria && product.categoria.descripcion && 
                    !product.categoria.descripcion.toLowerCase().includes('categor') &&
                    product.categoria.descripcion.trim() !== '') {
                  return `/${productCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}`
                }
                
                // Último recurso
                return `/varios/${product.id}`
              })()
              }
              className="w-full text-white py-1 px-2 rounded-lg font-semibold transition-colors duration-300 block text-center text-xs" style={{backgroundColor: '#8FD527'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#7BC624'} onMouseLeave={(e) => e.target.style.backgroundColor = '#8FD527'}
            >
              Ver Detalles
            </Link>
            
            {/* Botón Agregar a Lista */}
            <AddToListButton product={product} variant="card" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Imagen del producto */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imagen || product.image || '/placeholder.jpg'}
          alt={product.descripcion || product.name || 'Producto'}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge Destacado */}
        {product.destacado && (
          <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
            Destacado
          </div>
        )}
      </div>

      {/* Información del producto */}
      <div className="p-3 sm:p-4">
        {/* Nueva jerarquía: Presentación, Línea, Tipo */}
        <div className="flex gap-1 sm:gap-2 mb-2 flex-wrap">
          {presentacion && (
            <span className="text-xs text-white bg-green-500 px-2 py-1 rounded-full truncate font-medium">
              {presentacion}
            </span>
          )}
          {linea && (
            <span className="text-xs text-white bg-blue-500 px-2 py-1 rounded-full truncate font-medium">
              {linea}
            </span>
          )}
          {tipo && (
            <span className="text-xs text-white bg-purple-500 px-2 py-1 rounded-full truncate font-medium">
              {tipo}
            </span>
          )}
        </div>

        {/* Categoría (fallback si no hay nueva jerarquía) */}
        {!presentacion && !linea && !tipo && (
          <div className="flex gap-1 sm:gap-2 mb-2 flex-wrap">
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full truncate">
              {productCategory}
            </span>
          </div>
        )}


        {/* Título del producto */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
          {product.descripcion || product.name || 'Sin descripción'}
        </h3>

        {/* Planes de Financiación - Versión simplificada */}
        <FinancingPlans productoId={product.id} precio={productPrice} />

        {/* Botones de acción */}
        <div className="mt-3 space-y-2">
          {/* Botón Ver Detalles */}
          <Link
            href={(() => {
              // Priorizar nueva jerarquía
              if (tipo) {
                return `/tipos/${tipo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}`
              }
              if (linea) {
                return `/lineas/${linea.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}`
              }
              if (presentacion) {
                return `/presentaciones/${presentacion.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}`
              }
              
              // Fallback a categoría tradicional
              if (product.categoria && product.categoria.descripcion && 
                  !product.categoria.descripcion.toLowerCase().includes('categor') &&
                  product.categoria.descripcion.trim() !== '') {
                return `/${productCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}`
              }
              
              // Último recurso
              return `/varios/${product.id}`
            })()}
            className="w-full text-white py-2 px-3 sm:px-4 rounded-xl font-semibold transition-colors duration-300 block text-center text-xs sm:text-sm" style={{backgroundColor: '#8FD527'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#7BC624'} onMouseLeave={(e) => e.target.style.backgroundColor = '#8FD527'}
          >
            Ver Detalles
          </Link>
          
          {/* Botón Agregar a Lista */}
          <AddToListButton product={product} variant="card" />
        </div>
      </div>
    </div>
  )
}
