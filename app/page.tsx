import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"
import { mostrarSeccionBienvenidos } from "@/lib/supabase-config"
import HomePageClient from "./HomePageClient"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Home() {
  const mostrarBienvenida = await mostrarSeccionBienvenidos()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <GlobalAppBar />
      <HomePageClient mostrarBienvenida={mostrarBienvenida} />
      <Footer />
    </div>
  )
}
