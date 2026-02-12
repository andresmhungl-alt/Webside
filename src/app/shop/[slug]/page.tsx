import { createClient } from '@/utils/supabase/server'
import { getSession, isAdmin } from '@/utils/auth'
import { notFound } from 'next/navigation'
import { Clock, ArrowLeft, Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { StoreAdminControls, DeleteProductButton, EditProductButton } from './StoreAdminControls'
import { ChatWidget } from '@/components/ChatWidget'
import { StoreContactActions } from './StoreContactActions'

import { ProductCard } from '@/components/ProductCard'

// Force dynamic behavior because we rely on dates/time
export const dynamic = 'force-dynamic'

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    console.log('--- ShopPage Debug ---')
    console.log('Slug from params:', slug)

    const supabase = await createClient()

    const { data: store, error: storeError } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single()

    console.log('Store found:', store ? store.name : 'null')
    if (storeError) console.error('Store error:', storeError)

    if (storeError || !store) {
        console.error('Triggering notFound() for slug:', slug)
        notFound()
    }

    const user = await getSession()
    const isOwner = user ? (user.id === store.user_id || isAdmin(user)) : false
    const isLoggedIn = !!user

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
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-32 sm:pb-48 text-center">
                    <Link href="/marketplace" className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold mb-6 sm:mb-8 transition-colors group">
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white/20 transition-colors">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </div>
                        Volver al Mercado
                    </Link>

                    <div className="animate-fade-in-up">
                        {/* Elegant Countdown */}
                        <div className="inline-flex flex-col items-center gap-2 mb-6 sm:mb-8">
                            <span className="uppercase text-xs tracking-[0.2em] text-green-300 font-bold">Tiempo Restante</span>
                            <div className="flex items-center gap-3 sm:gap-4 text-white font-outfit">
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl sm:text-3xl md:text-4xl font-black tabular-nums leading-none">
                                        {Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))}
                                    </span>
                                    <span className="text-[10px] uppercase opacity-70">Días</span>
                                </div>
                                <span className="text-xl sm:text-2xl font-light opacity-50">:</span>
                                <div className="flex flex-col items-center">
                                    <span className="text-2xl sm:text-3xl md:text-4xl font-black tabular-nums leading-none">
                                        {Math.floor(((endDate.getTime() - now.getTime()) % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))}
                                    </span>
                                    <span className="text-[10px] uppercase opacity-70">Horas</span>
                                </div>
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-9xl font-black mb-4 sm:mb-6 text-white tracking-tighter drop-shadow-2xl font-outfit leading-[0.85] px-4 text-border-white">
                            {store.name}
                        </h1>

                        <p className="text-base sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-outfit font-light leading-relaxed drop-shadow-lg mb-8 sm:mb-10 px-4 text-border-white">
                            {store.description}
                        </p>

                        {/* Social Proof / Scarcity */}
                        <div className="flex flex-col items-center gap-4 sm:gap-6 px-4">
                            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white/80 bg-white/10 backdrop-blur-md py-2 px-3 sm:px-4 rounded-full inline-flex border border-white/10">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="hidden sm:inline">{Math.floor(Math.random() * 15) + 5} personas están viendo esta colección</span>
                                <span className="sm:hidden">{Math.floor(Math.random() * 15) + 5} viendo ahora</span>
                            </div>

                            {/* Store Contact Actions (Email, WhatsApp, Telegram, Live Chat) */}
                            <StoreContactActions
                                contact_email={store.contact_email}
                                whatsapp={store.whatsapp}
                                telegram={store.telegram}
                                is_chat_enabled={store.is_chat_enabled}
                                isOwner={isOwner}
                            />
                        </div>

                        {/* Tags Display */}
                        {store.tags && store.tags.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 animate-fade-in px-4" style={{ animationDelay: '400ms' }}>
                                {store.tags.map((tag: string, i: number) => (
                                    <span
                                        key={i}
                                        className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black/20 backdrop-blur-md border border-white/20 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-black/30 transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Decorative Bottom Wave */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-wooly-cream rounded-t-[4rem] z-20"></div>
            </header>

            {/* Collection Header */}
            <div className="text-center -mt-20 relative z-30 mb-12">
                <span className="bg-white px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest text-purple-900 shadow-xl border border-purple-50 inline-block">
                    Colección Limitada
                </span>
            </div>

            {/* Products Grid */}
            <main className="max-w-7xl mx-auto px-6 pb-32 relative z-30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {products?.map((product: any, index: number) => (
                        <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <ProductCard
                                product={product}
                                isAdmin={isOwner}
                                isGlobalAdmin={user ? isAdmin(user) : false}
                                isLoggedIn={isLoggedIn}
                                aspectRatio="aspect-[4/5]" // Taller, more elegant aspect ratio
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
                        <h3 className="text-3xl font-bold text-gray-900 mb-4 font-outfit">Colección en preparación</h3>
                        <p className="text-xl text-gray-500 font-outfit">
                            El artesano está finalizando los detalles de esta colección exclusiva. <br />Vuelve pronto.
                        </p>
                    </div>
                )}
            </main>

            {/* Chat Widget */}
            {/* Chat Widget - Only for customers */}
            {!isOwner && (
                <ChatWidget
                    storeId={store.id}
                    storeName={store.name}
                    isChatEnabled={store.is_chat_enabled !== false}
                    customerId={user?.id}
                />
            )}

            {isOwner && <StoreAdminControls store={store} productCount={products?.length || 0} />}

            <footer className="bg-white border-t border-purple-50 py-12 text-center">
                <p className="text-gray-400 font-medium">© {new Date().getFullYear()} Aranya Inc. • Apoyando el talento local.</p>
            </footer>
        </div>
    )
}
