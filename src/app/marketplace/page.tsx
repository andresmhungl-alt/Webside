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
        <div className="min-h-screen bg-[#faf9fe]">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2 text-purple-900 font-bold text-2xl tracking-tight">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <ShoppingBag className="h-6 w-6 text-purple-700" />
                        </div>
                        <span className="font-outfit">Aranya</span>
                    </Link>
                    <div className="flex gap-4 items-center">
                        <Link href="/login" className="px-6 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg hover:shadow-purple-200 transition-all transform hover:-translate-y-0.5">
                            Start Selling
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 font-outfit">
                            Explora el <span className="text-purple-600">Mercado</span>
                        </h1>
                        <p className="text-gray-600 text-lg max-w-xl">
                            Descubre colecciones únicas de lana tejida a mano directamente de artesanos locales.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <form action="/marketplace" className="relative group w-full md:w-96">
                        <input
                            type="text"
                            name="q"
                            defaultValue={searchTerm}
                            placeholder="Buscar tienda por nombre..."
                            className="w-full pl-12 pr-4 py-4 bg-white border border-purple-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all group-hover:shadow-md"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400 group-hover:text-purple-600 transition-colors" />
                        <button type="submit" className="hidden">Buscar</button>
                    </form>
                </div>

                {/* Stores Grid */}
                {stores.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stores.map((store) => {
                            const endDate = new Date(store.end_date)
                            const now = new Date()
                            const isClosingSoon = (endDate.getTime() - now.getTime()) < (2 * 24 * 60 * 60 * 1000)

                            return (
                                <Link
                                    key={store.id}
                                    href={`/shop/${store.slug}`}
                                    className="bg-white rounded-[2rem] border border-purple-100 shadow-sm hover:shadow-2xl transition-all transform hover:-translate-y-2 group relative overflow-hidden flex flex-col h-[450px]"
                                >
                                        {store.image_url ? (
                                            <Image
                                                src={store.image_url}
                                                alt=""
                                                fill
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingBag className="w-12 h-12 text-purple-200" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                            <span className="text-white font-semibold text-sm flex items-center gap-2">
                                                Visitar Tienda <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-1 relative bg-white">
                                        <div className="absolute -top-10 left-8 w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-purple-700 shadow-xl border-4 border-white overflow-hidden z-20">
                                            {store.image_url ? (
                                                <Image
                                                    src={store.image_url}
                                                    alt=""
                                                    fill
                                                    className="w-full h-full object-cover"
                                                    unoptimized
                                                />
                                            ) : (
                                                <Store className="w-8 h-8" />
                                            )}
                                        </div>

                                        <div className="pt-8 flex-1">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors">
                                                {store.name}
                                            </h3>
                                            <p className="text-gray-500 line-clamp-3 text-sm leading-relaxed mb-6">
                                                {store.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 pt-6 border-t border-purple-50 mt-auto">
                                            <div className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 ${isClosingSoon ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                                                }`}>
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>Cierra: {endDate.toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                )
                        })}
        </div>
    ) : (
        <div className="text-center py-32 bg-white rounded-[3rem] border border-purple-50 shadow-sm">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-purple-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No encontramos tiendas</h3>
            <p className="text-gray-500">
                Prueba con otro nombre o vuelve a intentar más tarde.
            </p>
            {searchTerm && (
                <Link href="/marketplace" className="mt-6 inline-block text-purple-600 font-semibold hover:underline">
                    Limpiar búsqueda
                </Link>
            )}
        </div>
    )
}
            </main >

    <footer className="footer-bg-white border-t border-purple-50 py-12 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} Aranya Inc. Hecho con ❤️ para artesanos.</p>
    </footer>
        </div >
    )
}
