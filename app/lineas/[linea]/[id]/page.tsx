"use client"

import { use } from "react"
import ProductPageClient from "@/app/[categoria]/[id]/ProductPageClient"

interface LineaProductPageProps {
  params: Promise<{
    linea: string
    id: string
  }>
}

export default function LineaProductPage({ params }: LineaProductPageProps) {
  const resolvedParams = use(params)
  
  return (
    <ProductPageClient 
      productId={resolvedParams.id} 
      categorySlug={resolvedParams.linea}
      hierarchyType="linea"
    />
  )
}