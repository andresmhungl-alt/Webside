import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingBag, Star, TrendingUp, Clock, Store } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { getPublicStores } from '@/app/actions'

import { getSession } from '@/utils/auth'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const user = await getSession()
  const featuredStores = await getPublicStores()
  const displayStores = (featuredStores || []).slice(0, 3)

  return (
    <main className="min-h-screen bg-wooly-cream text-gray-900 font-sans selection:bg-purple-200 overflow-x-hidden pt-32 pb-20">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center mb-32">

        {/* Text Content */}
        <div className="space-y-8 z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-purple-100 shadow-sm text-purple-700 text-sm font-bold tracking-wide animate-float">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            El Mercado de Lana Premier
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-gray-900 leading-[0.9] font-outfit tracking-tight">
            Teje tu <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-yarn-magenta via-purple-500 to-deep-indigo">
              historia.
              <svg className="absolute w-full h-3 -bottom-2 left-0 text-meadow-teal opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="max-w-xl text-lg sm:text-xl text-gray-600 leading-relaxed font-outfit">
            Descubre colecciones de lana exclusivas, conecta con artesanos apasionados y encuentra la pieza perfecta que le da calidez a tu vida.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {user ? (
              <Link href="/dashboard" className="btn-squishy px-8 py-4 text-lg font-bold bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-xl shadow-purple-900/10 flex items-center justify-center gap-2 group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">Ir a mi Panel <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            ) : (
              <Link href="/login" className="btn-squishy px-8 py-4 text-lg font-bold bg-gray-900 text-white rounded-full hover:bg-gray-800 shadow-xl shadow-purple-900/10 flex items-center justify-center gap-2 group relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">Crear Tienda <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
              </Link>
            )}
            <Link href="/marketplace" className="btn-squishy px-8 py-4 text-lg font-bold bg-white text-gray-900 border-2 border-gray-100 rounded-full hover:border-purple-200 hover:bg-purple-50 transition-all shadow-sm flex items-center justify-center">
              Explorar Tiendas
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-12 h-12 rounded-full border-4 border-wooly-cream bg-gradient-to-br from-purple-${i * 100} to-pink-${i * 100} shadow-md flex items-center justify-center text-xs font-bold text-white`}>
                  {i}
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-1 text-yellow-400 mb-1">
                {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-sm font-bold text-gray-700 font-outfit">Amado por +1,000 artesanos</p>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="relative h-[500px] lg:h-[700px] w-full z-0 perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/50 to-meadow-teal/30 rounded-[3rem] transform rotate-3 scale-95 blur-2xl opacity-60 animate-pulse"></div>

          {/* Main Card */}
          <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-purple-500/20 bg-white border-4 border-white transform hover:rotate-1 transition-transform duration-700 group">
            <Image
              src="/images/hero.jpg"
              alt="Knitting Art"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
              priority
            />

            {/* Floating Elements */}
            <div className="absolute top-10 right-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl animate-float border border-purple-100 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Ventas</p>
                  <p className="text-lg font-bold text-gray-900">+240%</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 left-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl animate-float border border-purple-100 hidden sm:block" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">A</div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Nueva Colección</p>
                  <p className="text-xs text-gray-500">Hace 2 min</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-6 font-outfit tracking-tight">
              Todo lo que necesitas para <span className="text-yarn-magenta">crecer</span>
            </h2>
            <p className="text-xl text-gray-600 font-outfit">
              Herramientas poderosas diseñadas para artesanos modernos. Sin complicaciones técnicas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: 'Lanzamiento Rápido',
                desc: 'Tu tienda lista en menos de lo que tardas en tejer una fila. Plantillas optimizadas para conversión.',
                color: 'from-pink-500 to-rose-500',
                bg: 'bg-pink-50 text-pink-600'
              },
              {
                icon: Clock,
                title: 'Drops Exclusivos',
                desc: 'Genera expectativa con ventas por tiempo limitado. La escasez vende, y nosotros lo hacemos fácil.',
                color: 'from-purple-500 to-indigo-500',
                bg: 'bg-purple-50 text-purple-600'
              },
              {
                icon: ShoppingBag,
                title: 'Diseño Premium',
                desc: 'Tu marca merece brillar. Interfaces limpias que ponen tus productos en el centro de atención.',
                color: 'from-teal-400 to-emerald-500',
                bg: 'bg-teal-50 text-teal-600'
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-gray-50 hover:bg-white border text-center border-gray-100 hover:border-purple-100 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
                <div className={`w-20 h-20 mx-auto rounded-3xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <feature.icon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 font-outfit">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed font-outfit">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stores */}
      {displayStores.length > 0 && (
        <section className="py-32 bg-wooly-cream">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div>
                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 font-outfit tracking-tight">Tiendas de Tendencia 🔥</h2>
                <p className="text-xl text-gray-600 font-outfit">Lo más popular de la semana en Aranya.</p>
              </div>
              <Link href="/marketplace" className="group flex items-center gap-2 px-6 py-3 bg-white rounded-full font-bold text-gray-900 shadow-md hover:shadow-xl transition-all border border-gray-100">
                Ver todas <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-purple-600" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {displayStores.map((store) => (
                <Link
                  key={store.id}
                  href={`/shop/${store.slug}`}
                  className="group bg-white rounded-[2.5rem] p-3 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2 border border-purple-50"
                >
                  <div className="relative h-64 w-full rounded-[2rem] overflow-hidden mb-6">
                    {store.image_url ? (
                      <Image src={store.image_url} alt={store.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-purple-50 flex items-center justify-center">
                        <Store className="w-16 h-16 text-purple-200" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                      Nuevo
                    </div>
                  </div>

                  <div className="px-5 pb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 font-outfit group-hover:text-purple-700 transition-colors">{store.name}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6 h-10">{store.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white"></div>)}
                      </div>
                      <span className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                        <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="bg-white border-t border-purple-50 pb-12 pt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 rounded-xl">
              <ShoppingBag className="h-6 w-6 text-purple-700" />
            </div>
            <span className="font-outfit font-bold text-2xl text-gray-900">Aranya</span>
          </div>
          <p className="text-gray-500 font-medium">Hecho con 💜 y 🧶 para la comunidad.</p>
        </div>
      </footer>
    </main >
  )
}
