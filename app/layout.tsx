import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ShoppingListProvider } from "@/hooks/use-shopping-list"
import { ZonaProvider } from "@/contexts/ZonaContext"
import { WhatsAppSuccessProvider } from "@/contexts/WhatsAppSuccessContext"
import GlobalZonaModal from "@/components/GlobalZonaModal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mueblecenter-catalogo",
  description:
    "Tu tienda de electrodomésticos de confianza con los mejores planes de financiación. Heladeras, lavarropas, aires acondicionados y más.",
  keywords: "electrodomésticos, cuotas, financiación, heladeras, lavarropas, aires acondicionados",
  generator: 'v0.dev',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://catalogo-mundocuotas.vercel.app',
    siteName: 'MueblesCenter',
    title: 'MueblesCenter - Electrodomésticos en Cuotas',
    description: 'Tu tienda de electrodomésticos de confianza con los mejores planes de financiación. Heladeras, lavarropas, aires acondicionados y más.',
    images: [
      {
        url: '/logo.svg',
        width: 1200,
        height: 630,
        alt: 'MueblesCenter',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MueblesCenter',
    description: 'Tu tienda de electrodomésticos de confianza con los mejores planes de financiación. Heladeras, lavarropas, aires acondicionados y más.',
    images: ['/logo.svg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ZonaProvider>
          <ShoppingListProvider>
            <WhatsAppSuccessProvider>
              {children}
              <GlobalZonaModal />
            </WhatsAppSuccessProvider>
          </ShoppingListProvider>
        </ZonaProvider>
      </body>
    </html>
  )
}
