"use client"

import Link from "next/link"
import GlobalAppBar from "@/components/GlobalAppBar"
import Footer from "@/components/Footer"
import { ZonaGuard } from "@/components/ZonaGuard"
import { Shield, Lock, Eye, Database, UserCheck, ArrowLeft, AlertCircle } from "lucide-react"

export default function PrivacidadPage() {
  return (
    <ZonaGuard>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <GlobalAppBar />

        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 py-12" style={{ marginTop: '20px' }}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Shield className="text-green-custom mr-3" size={48} />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Política de Privacidad
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
                <Lock className="text-green-custom mr-3 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Compromiso con su Privacidad
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    En MueblesCenter valoramos y respetamos su privacidad. Esta política describe cómo recopilamos,
                    usamos y protegemos su información personal cuando utiliza nuestro sitio web y servicios.
                  </p>
                </div>
              </div>
            </section>

            {/* Información que Recopilamos */}
            <section>
              <div className="flex items-start mb-4">
                <Database className="text-green-custom mr-3 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    1. Información que Recopilamos
                  </h2>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Información proporcionada por usted:</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Nombre y apellido</li>
                        <li>Número de teléfono y dirección de correo electrónico</li>
                        <li>Dirección de entrega y facturación</li>
                        <li>Información de consultas y solicitudes de productos</li>
                        <li>Preferencias de zona geográfica</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Información recopilada automáticamente:</h3>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li>Dirección IP y tipo de navegador</li>
                        <li>Páginas visitadas y tiempo de navegación</li>
                        <li>Dispositivo utilizado para acceder al sitio</li>
                        <li>Preferencias de zona seleccionada</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Uso de la Información */}
            <section>
              <div className="flex items-start mb-4">
                <Eye className="text-green-custom mr-3 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    2. Cómo Utilizamos su Información
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p className="leading-relaxed">
                      Utilizamos la información recopilada para los siguientes propósitos:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Procesar consultas y solicitudes de productos</li>
                      <li>Mostrar productos disponibles según su zona geográfica</li>
                      <li>Calcular planes de financiación personalizados</li>
                      <li>Coordinar entregas e instalaciones</li>
                      <li>Enviar información sobre productos, ofertas y promociones (con su consentimiento)</li>
                      <li>Mejorar nuestro sitio web y experiencia de usuario</li>
                      <li>Cumplir con obligaciones legales y regulatorias</li>
                      <li>Prevenir fraudes y garantizar la seguridad del sitio</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Compartir Información */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Compartir su Información
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  MueblesCenter no vende ni alquila su información personal a terceros. Podemos compartir
                  su información únicamente en los siguientes casos:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar el sitio web,
                    procesar pagos y realizar entregas</li>
                  <li><strong>Entidades financieras:</strong> Para procesar solicitudes de financiación
                    (con su consentimiento)</li>
                  <li><strong>Obligaciones legales:</strong> Cuando sea requerido por ley o autoridades competentes</li>
                  <li><strong>Protección de derechos:</strong> Para proteger nuestros derechos, propiedad o seguridad,
                    así como los de nuestros usuarios</li>
                </ul>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Cookies y Tecnologías Similares
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio
                    (ej: selección de zona)</li>
                  <li><strong>Cookies de rendimiento:</strong> Para analizar cómo los usuarios interactúan con el sitio</li>
                  <li><strong>Cookies de funcionalidad:</strong> Para recordar sus preferencias y configuraciones</li>
                </ul>
                <p className="leading-relaxed">
                  Puede configurar su navegador para rechazar cookies, aunque esto puede afectar
                  la funcionalidad del sitio.
                </p>
              </div>
            </section>

            {/* Seguridad */}
            <section>
              <div className="flex items-start mb-4">
                <Lock className="text-green-custom mr-3 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    5. Seguridad de la Información
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p className="leading-relaxed">
                      Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger
                      su información personal contra acceso no autorizado, alteración, divulgación o destrucción:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Encriptación de datos sensibles</li>
                      <li>Acceso restringido a información personal</li>
                      <li>Monitoreo regular de seguridad del sistema</li>
                      <li>Protocolos seguros de transmisión de datos (HTTPS)</li>
                    </ul>
                    <p className="leading-relaxed text-sm italic">
                      Sin embargo, ningún método de transmisión por Internet es 100% seguro. Nos esforzamos
                      por proteger su información, pero no podemos garantizar su seguridad absoluta.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Derechos del Usuario */}
            <section>
              <div className="flex items-start mb-4">
                <UserCheck className="text-green-custom mr-3 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    6. Sus Derechos
                  </h2>
                  <div className="space-y-3 text-gray-700">
                    <p className="leading-relaxed">
                      Conforme a la Ley de Protección de Datos Personales (Ley 25.326), usted tiene derecho a:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li><strong>Acceso:</strong> Solicitar información sobre los datos personales que tenemos sobre usted</li>
                      <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                      <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos personales</li>
                      <li><strong>Oposición:</strong> Oponerse al procesamiento de sus datos para ciertos fines</li>
                      <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
                      <li><strong>Revocación:</strong> Retirar su consentimiento en cualquier momento</li>
                    </ul>
                    <p className="leading-relaxed mt-3">
                      Para ejercer estos derechos, puede contactarnos a través de los medios indicados
                      en la sección de contacto.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Retención de Datos */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                7. Retención de Datos
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Conservamos su información personal solo durante el tiempo necesario para cumplir con
                  los fines descritos en esta política, salvo que la ley requiera o permita un período
                  de retención más prolongado.
                </p>
              </div>
            </section>

            {/* Menores de Edad */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                8. Menores de Edad
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Nuestros servicios no están dirigidos a menores de 18 años. No recopilamos
                  intencionalmente información personal de menores de edad. Si tiene conocimiento
                  de que un menor ha proporcionado información personal, por favor contáctenos
                  para que podamos tomar las medidas apropiadas.
                </p>
              </div>
            </section>

            {/* Enlaces a Terceros */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                9. Enlaces a Sitios de Terceros
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Nuestro sitio puede contener enlaces a sitios web de terceros. No somos responsables
                  de las prácticas de privacidad de estos sitios. Le recomendamos leer las políticas
                  de privacidad de cada sitio que visite.
                </p>
              </div>
            </section>

            {/* Modificaciones */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                10. Modificaciones a esta Política
              </h2>
              <div className="space-y-3 text-gray-700">
                <p className="leading-relaxed">
                  Podemos actualizar esta política de privacidad periódicamente. Los cambios significativos
                  serán notificados a través de nuestro sitio web. Le recomendamos revisar esta página
                  regularmente para estar informado sobre cómo protegemos su información.
                </p>
              </div>
            </section>

            {/* Contacto */}
            <section className="bg-green-50 rounded-xl p-6">
              <div className="flex items-start">
                <AlertCircle className="text-green-custom mr-3 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Contacto - Protección de Datos
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    Si tiene preguntas, inquietudes o desea ejercer sus derechos respecto a sus datos personales,
                    puede contactarnos:
                  </p>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> mueblescenterweb@gmail.com.ar</p>
                    <p><strong>Teléfono:</strong> 11 3093-8491 (Escobar)</p>
                    <p><strong>Horarios de atención:</strong> Lunes a Sábado de 8:30 a 19:30 hs</p>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600">
                      <strong>Agencia de Acceso a la Información Pública (Órgano de Control):</strong>
                      <br />
                      Puede presentar reclamos ante la Agencia de Acceso a la Información Pública en su carácter
                      de Órgano de Control de la Ley N° 25.326.
                      <br />
                      Sitio web: <a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noopener noreferrer" className="text-green-custom hover:underline">www.argentina.gob.ar/aaip</a>
                    </p>
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
