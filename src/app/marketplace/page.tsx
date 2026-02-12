import { getPublicStores } from '@/app/actions'
import Link from 'next/link'
import { ShoppingBag, Search, Store, ArrowRight, Clock } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function MarketplacePage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q: searchTerm } = await searchParams
    const stores = await getPublicStores(searchTerm)

    return (
        <div className="min-h-screen bg-wooly-cream font-sans selection:bg-purple-200">

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-fade-in-up">
                    <div className="space-y-4">
                        <div className="inline-block px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold tracking-wider uppercase mb-2">
                            Mercado Artesanal
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 font-outfit tracking-tight leading-[0.9]">
                            Explora el <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yarn-magenta to-deep-indigo">Mercado</span>
                        </h1>
                        <p className="text-gray-600 text-xl max-w-xl font-outfit">
                            Descubre colecciones únicas de lana tejida a mano directamente de artesanos locales.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form action="/marketplace" className="relative group w-full md:w-[450px]">
                        <div className="relative overflow-hidden rounded-[2rem] shadow-lg shadow-purple-500/5 group-hover:shadow-purple-500/15 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-white opacity-50"></div>
                            <input
                                type="text"
                                name="q"
                                defaultValue={searchTerm}
                                placeholder="Buscar por nombre o etiqueta..."
                                className="relative w-full pl-14 pr-6 py-5 bg-white/80 backdrop-blur-sm border-2 border-transparent focus:border-purple-200 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all text-lg font-medium text-gray-900 placeholder:text-gray-400"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-purple-400 group-hover:text-purple-600 transition-colors z-10" />
                        </div>
                        <button type="submit" className="hidden">Buscar</button>
                    </form>
                </div>

                {/* Stores Grid */}
                {stores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {stores.map((store, index) => {
                            const endDate = new Date(store.end_date)
                            const now = new Date()
                            const isClosingSoon = (endDate.getTime() - now.getTime()) < (2 * 24 * 60 * 60 * 1000)

                            return (
                                <Link
                                    key={store.id}
                                    href={`/shop/${store.slug}`}
                                    className="group relative flex flex-col h-[500px] bg-white rounded-[2.5rem] border border-purple-50 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Glassmorphism Overlay on Hover */}
                                    <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/5 transition-colors duration-500 z-0 pointer-events-none"></div>

                                    {/* Store Cover Header */}
                                    <div className="h-64 w-full relative overflow-hidden bg-gray-100">
                                        {store.image_url ? (
                                            <Image
                                                src={store.image_url}
                                                alt={store.name}
                                                fill
                                                sizes="(max-width: 1024px) 100vw, 33vw"
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                                unoptimized
                                                loading="eager"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                                                <ShoppingBag className="w-16 h-16 text-purple-200" />
                                            </div>
                                        )}

                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                                        <div className="absolute top-4 right-4 z-10">
                                            <div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-md border border-white/20 shadow-lg ${isClosingSoon ? 'bg-amber-500/90 text-white animate-pulse' : 'bg-white/90 text-green-700'}`}>
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Cierra: {endDate.toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="absolute -bottom-10 left-6 w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-purple-700 shadow-xl border-4 border-white overflow-hidden z-20 group-hover:scale-110 transition-transform duration-300">
                                            <Store className="w-8 h-8" />
                                        </div>
                                    </div>

                                    <div className="p-8 pt-12 flex flex-col flex-1 relative z-10">
                                        <div className="flex-1">
                                            <h3 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-yarn-magenta transition-colors font-outfit leading-tight">
                                                {store.name}
                                            </h3>
                                            <p className="text-gray-500 line-clamp-3 text-base leading-relaxed mb-6 font-outfit">
                                                {store.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-purple-50 mt-auto group/btn">
                                            <span className="text-sm font-bold text-gray-400 group-hover/btn:text-purple-600 transition-colors uppercase tracking-wider">
                                                Visitar Tienda
                                            </span>
                                            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 shadow-sm">
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-purple-50 shadow-sm">
                        <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <Search className="w-10 h-10 text-purple-300" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2 font-outfit">No encontramos tiendas</h3>
                        <p className="text-gray-500 text-lg max-w-md mx-auto">
                            Prueba con otro nombre o vuelve a intentar más tarde.
                        </p>
                        {searchTerm && (
                            <Link href="/marketplace" className="mt-8 inline-block px-8 py-3 bg-purple-100 text-purple-700 rounded-full font-bold hover:bg-purple-200 transition-colors">
                                Limpiar búsqueda
                            </Link>
                        )}
                    </div>
                )
                }
            </main >

            <footer className="footer-bg-white border-t border-purple-50 py-12 text-center text-gray-400 text-sm">
                <p>© {new Date().getFullYear()} Aranya Inc. Hecho con 💜 y 🧶 para la comunidad.</p>
            </footer>
        </div >
    )
}
