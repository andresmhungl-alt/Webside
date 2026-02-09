import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingBag, Star, TrendingUp, Clock, Store } from 'lucide-react'
import { getPublicStores } from '@/app/actions'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const featuredStores = await getPublicStores()
  const displayStores = featuredStores.slice(0, 3)

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-purple-200">


      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold tracking-wide border border-purple-100">
              <Star className="w-4 h-4 fill-purple-700" />
              <span>El Mercado de Lana Premier</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] font-outfit">
              Teje tu historia.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-indigo-500 animate-gradient">
                Comparte tu Lana.
              </span>
            </h1>
            <p className="max-w-lg text-lg text-gray-600 leading-relaxed">
              Aranya conecta artesanos con amantes de la lana a través de tiendas pop-up exclusivas por tiempo limitado. Lanza tu colección en segundos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login" className="px-8 py-4 text-lg font-semibold bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 group">
                Crear Tienda <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/marketplace" className="px-8 py-4 text-lg font-semibold bg-white text-gray-900 border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm">
                Explorar Tiendas
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                    User
                  </div>
                ))}
              </div>
              <p>Se han unido más de 1,000 artesanos</p>
            </div>
          </div>

          <div className="relative h-[600px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-100 group">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent z-10 pointer-events-none"></div>
            {/* Local Image: Person knitting/wearing wool, cozy aesthetic */}
            <Image
              src="/images/hero.jpg"
              alt="Cozy wool knitting"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />

            <div className="absolute bottom-8 left-8 right-8 z-20 hidden md:block">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-white font-bold text-lg">Colección Destacada</p>
                  <p className="text-purple-100 text-sm">Serie de Alpaca Tejida a Mano</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" className="w-8 h-8 rounded-full border-2 border-white" alt="Usuario" referrerPolicy="no-referrer" />
                    <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" className="w-8 h-8 rounded-full border-2 border-white" alt="Usuario" referrerPolicy="no-referrer" />
                  </div>
                  <span className="text-white text-xs font-medium">+120 otros viendo</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tiendas Destacadas Section */}
        {displayStores.length > 0 && (
          <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4 font-outfit">Explora el Mercado</h2>
                  <p className="text-gray-600 text-lg max-w-2xl">Descubre las últimas tiendas pop-up abiertas por nuestros artesanos.</p>
                </div>
                <Link href="/marketplace" className="text-purple-600 font-bold flex items-center gap-2 hover:translate-x-1 transition-transform group">
                  Ver todas las tiendas <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {displayStores.map((store) => (
                  <Link
                    key={store.id}
                    href={`/shop/${store.slug}`}
                    className="bg-white rounded-[2.5rem] border border-purple-100 shadow-sm hover:shadow-2xl transition-all transform hover:-translate-y-2 group overflow-hidden flex flex-col h-[400px]"
                  >
                    <div className="h-40 w-full relative overflow-hidden">
                      {store.image_url ? (
                        <Image src={store.image_url} alt="" fill className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" unoptimized />
                      ) : (
                        <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                          <Store className="w-10 h-10 text-purple-200" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent opacity-60"></div>
                    </div>

                    <div className="p-8 pt-4 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-purple-700 transition-colors">{store.name}</h3>
                      <p className="text-gray-600 leading-relaxed line-clamp-2 mb-6 flex-1 text-sm">{store.description}</p>

                      <div className="flex items-center justify-between pt-6 border-t border-purple-50">
                        <div className="flex items-center gap-2 text-purple-600 font-bold text-sm">
                          <Clock className="w-4 h-4" />
                          <span>Ver Colección</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-purple-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegir Aranya?</h2>
              <p className="text-gray-600 text-lg">Diseñado para la simplicidad y la elegancia. Enfócate en tu arte, nosotros manejamos la plataforma.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: TrendingUp, title: 'Configuración Instantánea', desc: 'Del registro a las ventas en minutos. No se requiere configuración compleja.' },
                { icon: Clock, title: 'Mercados Efímeros', desc: 'Crea urgencia con tiendas por tiempo limitado. Perfecto para lanzamientos de temporada.' },
                { icon: ShoppingBag, title: 'Experiencia Curada', desc: 'Un entorno hermoso y libre de distracciones que resalta tus productos.' }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all border border-gray-100 group">
                  <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
            <ShoppingBag className="h-6 w-6 text-purple-600" />
            <span>Aranya</span>
          </div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Aranya Inc. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div >
  )
}
