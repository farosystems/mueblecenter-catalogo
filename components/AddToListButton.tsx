"use client"

import { useState } from 'react'
import { Plus, Check } from 'lucide-react'
import { useShoppingList } from '@/hooks/use-shopping-list'
import { Product } from '@/lib/products'

interface AddToListButtonProps {
  product: Product
  variant?: 'card' | 'page'
}

export default function AddToListButton({ product, variant = 'card' }: AddToListButtonProps) {
  const { addItem, isInList } = useShoppingList()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToList = () => {
    setIsAdding(true)
    addItem(product)
    
    // Mostrar feedback visual
    setTimeout(() => {
      setIsAdding(false)
    }, 1000)
  }

  const isInShoppingList = isInList(product.id)

  if (variant === 'card') {
    return (
      <button
        onClick={handleAddToList}
        disabled={isAdding || isInShoppingList}
        className={`w-full py-2 px-4 rounded-xl font-semibold transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
          isInShoppingList
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : isAdding
            ? 'bg-red-100 text-red-700 cursor-not-allowed'
            : 'text-white hover:scale-105 shadow-lg hover:shadow-xl'
        }`}
        style={!isInShoppingList && !isAdding ? {backgroundColor: '#FF2F12'} : {}}
        onMouseEnter={(e) => {
          if (!isInShoppingList && !isAdding) {
            e.target.style.backgroundColor = '#E02A10'
          }
        }}
        onMouseLeave={(e) => {
          if (!isInShoppingList && !isAdding) {
            e.target.style.backgroundColor = '#FF2F12'
          }
        }}
        title={isInShoppingList ? 'Ya está en la lista' : 'Agregar a lista de compra'}
      >
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            Agregando...
          </>
        ) : isInShoppingList ? (
          <>
            <Check size={16} />
            En lista
          </>
        ) : (
          <>
            <Plus size={16} />
            Agregar a lista
          </>
        )}
      </button>
    )
  }

  // Variante para página de producto
  return (
    <button
      onClick={handleAddToList}
      disabled={isAdding || isInShoppingList}
      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
        isInShoppingList
          ? 'bg-green-100 text-green-700 cursor-not-allowed'
          : isAdding
          ? 'bg-red-100 text-red-700 cursor-not-allowed'
          : 'text-white hover:scale-105 shadow-lg hover:shadow-xl'
      }`}
      style={!isInShoppingList && !isAdding ? {backgroundColor: '#FF2F12'} : {}}
      onMouseEnter={(e) => {
        if (!isInShoppingList && !isAdding) {
          e.target.style.backgroundColor = '#E02A10'
        }
      }}
      onMouseLeave={(e) => {
        if (!isInShoppingList && !isAdding) {
          e.target.style.backgroundColor = '#FF2F12'
        }
      }}
      title={isInShoppingList ? 'Ya está en la lista' : 'Agregar a lista de compra'}
    >
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
          Agregando...
        </>
      ) : isInShoppingList ? (
        <>
          <Check size={20} />
          Agregado a la lista
        </>
      ) : (
        <>
          <Plus size={20} />
          Agregar a lista de compra
        </>
      )}
    </button>
  )
}
