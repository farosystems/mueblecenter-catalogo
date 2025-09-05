"use client"

import { use } from "react"
import ProductPageClient from "@/app/[categoria]/[id]/ProductPageClient"

interface PresentacionProductPageProps {
  params: Promise<{
    presentacion: string
    id: string
  }>
}

export default function PresentacionProductPage({ params }: PresentacionProductPageProps) {
  const resolvedParams = use(params)
  
  return (
    <ProductPageClient 
      productId={resolvedParams.id} 
      categorySlug={resolvedParams.presentacion}
      hierarchyType="presentacion"
    />
  )
}