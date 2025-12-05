import HeroSection from "@/components/HeroSection"
import BannersSection from "@/components/BannersSection"
import CategoriesCarousel from "@/components/CategoriesCarousel"
import FeaturedSection from "@/components/FeaturedSection"
import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"
import { mostrarSeccionBienvenidos } from "@/lib/supabase-config"
// import { ZonaWrapper } from "@/components/ZonaWrapper"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const mostrarBienvenida = await mostrarSeccionBienvenidos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <GlobalAppBar />

      <main>
        {mostrarBienvenida && <HeroSection />}
        <BannersSection />
        <CategoriesCarousel />
        <FeaturedSection />
      </main>

      <Footer />
    </div>
  )
}
