"use client"

import { use } from "react"
import ProductPageClient from "@/app/[categoria]/[id]/ProductPageClient"

interface TipoProductPageProps {
  params: Promise<{
    tipo: string
    id: string
  }>
}

export default function TipoProductPage({ params }: TipoProductPageProps) {
  const resolvedParams = use(params)
  
  return (
    <ProductPageClient 
      productId={resolvedParams.id} 
      categorySlug={resolvedParams.tipo}
      hierarchyType="tipo"
    />
  )
}