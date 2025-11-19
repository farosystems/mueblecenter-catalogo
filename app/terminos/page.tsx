"use client"

import Link from "next/link"
import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"
import { ZonaGuard } from "@/components/ZonaGuard"
import { FileText, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"

export default function TerminosPage() {
  return (
    <ZonaGuard>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <GlobalAppBar />

        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12" style={{ marginTop: '20px' }}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <FileText className="text-green-custom mr-3" size={48} />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Términos y Condiciones
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Última actualización: Enero 2025
            </p>
          </div>

          {/* Volver */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-green-custom hover:text-green-700 transition-colors duration-300"
            >
              <ArrowLeft className="mr-2" size={20} />
              Volver al inicio
            </Link>
          </div>

          {/* Contenido */}
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">

            {/* Introducción */}
            <section>
              <div className="flex items-start mb-4">
                <CheckCircle className="text-green-custom mr-3 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Bienvenido a MueblesCenter
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    Al acceder y utilizar este sitio web, usted acepta estar sujeto a los siguientes términos y condiciones de uso.
                    Si no está de acuerdo con alguno de estos términos, le recomendamos no utilizar nuestro sitio.
                  </p>
                </div>
              </div>
            </section>

            {/* Uso del Sitio */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Uso del Sitio Web
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Este sitio web es un catálogo digital de productos ofrecidos por MueblesCenter.
                  La información presentada tiene carácter informativo y está sujeta a disponibilidad de stock.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Los precios mostrados son orientativos y pueden variar según la sucursal y zona</li>
                  <li>Las imágenes son ilustrativas y pueden diferir del producto real</li>
                  <li>La disponibilidad de productos está sujeta a stock en cada sucursal</li>
                  <li>Los planes de financiación están sujetos a aprobación crediticia</li>
                </ul>
              </div>
            </section>

            {/* Productos y Precios */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Productos y Precios
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  MueblesCenter se reserva el derecho de modificar precios, especificaciones y disponibilidad
                  de productos sin previo aviso.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Los precios publicados son válidos únicamente para la zona seleccionada</li>
                  <li>Las ofertas y promociones tienen vigencia limitada y están sujetas a términos específicos</li>
                  <li>Los errores tipográficos en precios serán corregidos sin generar obligación de venta</li>
                  <li>Todos los precios incluyen IVA salvo indicación contraria</li>
                </ul>
              </div>
            </section>

            {/* Financiación */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Planes de Financiación
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Los planes de financiación ofrecidos están sujetos a las siguientes condiciones:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Aprobación crediticia por parte de la entidad financiera correspondiente</li>
                  <li>Cumplimiento de requisitos documentales establecidos</li>
                  <li>Las cuotas y plazos pueden variar según el plan seleccionado</li>
                  <li>Tasas de interés sujetas a modificación según regulaciones vigentes</li>
                </ul>
              </div>
            </section>

            {/* Entrega y Garantía */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Entrega y Garantía
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  MueblesCenter ofrece servicios de entrega e instalación según las siguientes condiciones:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>El costo de entrega varía según la zona geográfica</li>
                  <li>Los plazos de entrega son estimados y sujetos a disponibilidad</li>
                  <li>Todos los productos cuentan con garantía oficial del fabricante</li>
                  <li>Garantía extendida disponible como servicio adicional opcional</li>
                </ul>
              </div>
            </section>

            {/* Propiedad Intelectual */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Propiedad Intelectual
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Todo el contenido de este sitio web, incluyendo textos, imágenes, logotipos, diseños y código,
                  es propiedad de MueblesCenter o de sus respectivos proveedores y está protegido por las leyes
                  de propiedad intelectual.
                </p>
                <p className="leading-relaxed">
                  Queda prohibida la reproducción, distribución o modificación del contenido sin autorización expresa.
                </p>
              </div>
            </section>

            {/* Limitación de Responsabilidad */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Limitación de Responsabilidad
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  MueblesCenter no se hace responsable por:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Interrupciones temporales del servicio del sitio web</li>
                  <li>Errores tipográficos o de información que puedan aparecer ocasionalmente</li>
                  <li>Daños indirectos derivados del uso de la información del sitio</li>
                  <li>Disponibilidad de productos mostrados en el catálogo</li>
                </ul>
              </div>
            </section>

            {/* Modificaciones */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Modificaciones
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  MueblesCenter se reserva el derecho de modificar estos términos y condiciones en cualquier momento.
                  Las modificaciones serán efectivas desde su publicación en el sitio web. Le recomendamos revisar
                  periódicamente esta página para estar al tanto de cualquier cambio.
                </p>
              </div>
            </section>

            {/* Contacto */}
            <section className="bg-green-50 rounded-xl p-6">
              <div className="flex items-start">
                <AlertCircle className="text-green-custom mr-3 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Contacto
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Si tiene alguna pregunta sobre estos términos y condiciones, puede contactarnos a través de:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> mueblescenterweb@gmail.com.ar</p>
                    <p><strong>Teléfono:</strong> 11 3093-8491 (Escobar)</p>
                    <p><strong>Horarios:</strong> Lunes a Sábado de 8:30 a 19:30 hs</p>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Botón volver */}
          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center bg-green-gradient-lr bg-green-gradient-hover text-white font-bold py-3 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft className="mr-2" size={20} />
              Volver al Inicio
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    </ZonaGuard>
  )
}
