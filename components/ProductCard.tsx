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


  if (variant === 'compact') {
    return (
      <div className="relative">
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
            {/* Título del producto */}
            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
              {product.descripcion || product.name || 'Sin descripción'}
            </h3>

            {/* Precio del producto */}
            {productPrice > 0 && (
              <p className="text-lg font-bold text-green-600 mb-1">
                ${productPrice.toLocaleString('es-AR')}
              </p>
            )}

            {/* Planes de Financiación - Versión compacta */}
            <div className="mb-1">
              <FinancingPlans productoId={product.id} precio={productPrice} />
            </div>

            {/* Botones de acción compactos */}
            <div className="space-y-1">
              {/* Botón Ver Detalles */}
              <Link
                href={(() => {
                  // Usar categoría si está disponible
                  if (product.categoria && product.categoria.descripcion && 
                      !product.categoria.descripcion.toLowerCase().includes('categor') &&
                      product.categoria.descripcion.trim() !== '') {
                    return `/${productCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}/${product.id}`
                  }
                  
                  // Último recurso
                  return `/varios/${product.id}`
                })()}
                className="w-full text-white py-1 px-2 rounded-lg font-semibold transition-colors duration-300 block text-center text-xs" style={{backgroundColor: '#8FD527'}} onMouseEnter={(e) => e.target.style.backgroundColor = '#7BC624'} onMouseLeave={(e) => e.target.style.backgroundColor = '#8FD527'}
              >
                Ver Detalles
              </Link>
              
              {/* Botón Agregar a Lista */}
              <AddToListButton product={product} variant="card" />
            </div>
          </div>
        </div>
        
        {/* Imagen de Cucardas - Superpuesta a la card */}
        {product.cucardas && (
          <div className="absolute -top-5 -left-5 w-24 h-24 z-10">
            <img
              src={product.cucardas}
              alt="Cucarda"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
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
          {/* Título del producto */}
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
            {product.descripcion || product.name || 'Sin descripción'}
          </h3>

          {/* Precio del producto */}
          {productPrice > 0 && (
            <p className="text-xl sm:text-2xl font-bold text-green-600 mb-3">
              ${productPrice.toLocaleString('es-AR')}
            </p>
          )}

          {/* Planes de Financiación - Versión simplificada */}
          <FinancingPlans productoId={product.id} precio={productPrice} />

          {/* Botones de acción */}
          <div className="mt-3 space-y-2">
            {/* Botón Ver Detalles */}
            <Link
              href={(() => {
                // Usar categoría si está disponible
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
      
      {/* Imagen de Cucardas - Superpuesta a la card */}
      {product.cucardas && (
        <div className="absolute -top-6 -left-6 w-28 h-28 z-10">
          <img
            src={product.cucardas}
            alt="Cucarda"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
      )}
    </div>
  )
}
