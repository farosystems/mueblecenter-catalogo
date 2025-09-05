"use client"

import { createContext, useContext, useState, ReactNode } from 'react'
import WhatsAppSuccessModal from '@/components/WhatsAppSuccessModal'

interface WhatsAppSuccessContextType {
  showSuccess: (fromShoppingList?: boolean) => void
}

const WhatsAppSuccessContext = createContext<WhatsAppSuccessContextType | undefined>(undefined)

export function WhatsAppSuccessProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [fromShoppingList, setFromShoppingList] = useState(false)

  const showSuccess = (fromList: boolean = false) => {
    setFromShoppingList(fromList)
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
    setFromShoppingList(false)
  }

  return (
    <WhatsAppSuccessContext.Provider value={{ showSuccess }}>
      {children}
      <WhatsAppSuccessModal 
        isOpen={isOpen}
        onClose={handleClose}
        fromShoppingList={fromShoppingList}
      />
    </WhatsAppSuccessContext.Provider>
  )
}

export function useWhatsAppSuccess() {
  const context = useContext(WhatsAppSuccessContext)
  if (context === undefined) {
    throw new Error('useWhatsAppSuccess must be used within a WhatsAppSuccessProvider')
  }
  return context
}