import { createClient } from '@/utils/supabase/server'
import { getSession, isAdmin } from '@/utils/auth'
import { notFound } from 'next/navigation'
import { Clock, ArrowLeft, Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { StoreAdminControls, DeleteProductButton, EditProductButton } from './StoreAdminControls'

import { ProductCard } from '@/components/ProductCard'

// Force dynamic behavior because we rely on dates/time
export const dynamic = 'force-dynamic'

export default async function ShopPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()
    const { slug } = (await params)

    const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single()

    const user = await getSession()
    const isOwner = user ? (user.id === store?.user_id || isAdmin(user)) : false

    if (!store) {
        notFound()
    }

    const now = new Date()
    const startDate = new Date(store.start_date)
    const endDate = new Date(store.end_date)
    const isExpired = now > endDate
    const isNotStarted = now < startDate

    if (isExpired || isNotStarted) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-wooly-cream text-center text-gray-800">
                <Link href="/marketplace" className="absolute top-8 left-8 flex items-center gap-2 text-purple-600 font-bold hover:text-purple-800 transition-colors bg-white px-6 py-3 rounded-full shadow-md hover:shadow-lg border border-purple-100 group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Explora mercado
                </Link>
                <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-8 animate-pulse-subtle">
                    <Clock className="w-16 h-16 text-purple-400" />
                </div>
                <h1 className="text-5xl font-black mb-6 font-outfit text-gray-900 leading-tight">
                    {store.name} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">está Cerrada</span>
                </h1>
                <p className="max-w-xl text-2xl text-gray-600 font-outfit mb-8">
                    {isNotStarted
                        ? `Prepara tus agujas. Este mercado pop-up abre sus puertas el ${startDate.toLocaleDateString()}.`
                        : "¡Gracias por tejer con nosotros! Este mercado pop-up ha finalizado."}
                </p>
                <Link href="/marketplace" className="btn-squishy px-8 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-purple-600 transition-colors shadow-xl">
                    Ver otras tiendas activas
                </Link>
            </div>
        )
    }

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)

    return (
        <div className="min-h-screen bg-wooly-cream font-sans">
            {/* Store Header */}
            <header className="relative min-h-[500px] flex items-center justify-center overflow-hidden">
                {/* Background Image / Pattern */}
                <div className="absolute inset-0 z-0">
                    {store.image_url ? (
                        <Image
                            src={store.image_url}
                            alt={store.name}
                            fill
                            sizes="100vw"
                            className="w-full h-full object-cover blur-sm scale-105 opacity-80"
                            unoptimized
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-yarn-magenta via-purple-600 to-deep-indigo" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-purple-900/60 to-wooly-cream/90 backdrop-blur-[2px]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-20 text-center">
                    <Link href="/marketplace" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold mb-8 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        Volver al Mercado
                    </Link>

                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-sm font-bold tracking-wide shadow-lg mb-6 hover:bg-white/30 transition-colors cursor-default">
                            <Clock className="w-4 h-4 text-green-300" />
                            <span className="uppercase text-xs tracking-wider">Abierto hasta el {endDate.toLocaleDateString()}</span>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black mb-6 text-white tracking-tight drop-shadow-xl font-outfit leading-[0.9]">
                            {store.name}
                        </h1>

                        <p className="text-xl md:text-3xl text-white/90 max-w-3xl mx-auto font-outfit font-light leading-relaxed drop-shadow-md">
                            {store.description}
                        </p>
                    </div>
                </div>

                {/* Decorative Bottom Wave */}
                <div className="absolute bottom-0 left-0 w-full h-24 bg-wooly-cream rounded-t-[3rem] z-20"></div>
            </header>

            {/* Products Grid */}
            <main className="max-w-7xl mx-auto px-6 pb-32 -mt-10 relative z-30">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {products?.map((product, index) => (
                        <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <ProductCard
                                product={product}
                                isAdmin={isOwner}
                                aspectRatio="aspect-[3/4]"
                            >
                                <div className="flex flex-col gap-3">
                                    <div className="bg-white/90 backdrop-blur rounded-2xl p-2 shadow-lg hover:scale-105 transition-transform">
                                        <EditProductButton product={product} />
                                    </div>
                                    <div className="bg-white/90 backdrop-blur rounded-2xl p-2 shadow-lg hover:scale-105 transition-transform">
                                        <DeleteProductButton productId={product.id} />
                                    </div>
                                </div>
                            </ProductCard>
                        </div>
                    ))}
                </div>

                {(!products || products.length === 0) && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-purple-50 shadow-sm mx-auto max-w-2xl">
                        <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8">
                            <Store className="w-10 h-10 text-purple-300" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4 font-outfit">Tienda en preparación</h3>
                        <p className="text-xl text-gray-500 font-outfit">
                            El artesano está colocando sus productos en los estantes. <br />Vuelve pronto.
                        </p>
                    </div>
                )}
            </main>

            {isOwner && <StoreAdminControls store={store} productCount={products?.length || 0} />}

            <footer className="bg-white border-t border-purple-50 py-12 text-center">
                <p className="text-gray-400 font-medium">© {new Date().getFullYear()} Aranya Inc. • Apoyando el talento local.</p>
            </footer>
        </div>
    )
}
