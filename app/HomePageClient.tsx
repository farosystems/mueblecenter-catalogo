'use client'

import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'
import HeroSection from "@/components/HeroSection"
import BannersSection from "@/components/BannersSection"
import CategoriesCarousel from "@/components/CategoriesCarousel"
import FeaturedSection from "@/components/FeaturedSection"

interface HomePageClientProps {
  mostrarBienvenida: boolean
}

export default function HomePageClient({ mostrarBienvenida }: HomePageClientProps) {
  useEffect(() => {
    console.log('🔥 Registrando visita a la página principal...')
    trackPageView('home')
      .then(() => console.log('✅ Evento registrado correctamente'))
      .catch((error) => console.error('❌ Error al registrar evento:', error))
  }, [])

  return (
    <main>
      {mostrarBienvenida && <HeroSection />}
      <BannersSection />
      <CategoriesCarousel />
      <FeaturedSection />
    </main>
  )
}
