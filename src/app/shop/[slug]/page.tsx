import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Clock, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Force dynamic behavior because we rely on dates/time
export const dynamic = 'force-dynamic'

export default async function ShopPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()
    const { slug } = await params

    const { data: store } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug)
        .single()

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
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-purple-50 text-center text-gray-800">
                <Link href="/marketplace" className="absolute top-8 left-8 flex items-center gap-2 text-purple-600 font-bold hover:text-purple-800 transition-colors bg-white px-4 py-2 rounded-full shadow-sm">
                    <ArrowLeft className="w-5 h-5" /> Explora mercado
                </Link>
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                    <Clock className="w-10 h-10 text-gray-500" />
                </div>
                <h1 className="text-4xl font-bold mb-4">{store.name} is Closed</h1>
                <p className="max-w-md text-xl text-gray-600">
                    {isNotStarted
                        ? `This pop-up market hasn't opened yet. Come back on ${startDate.toLocaleDateString()}.`
                        : "This pop-up market has ended. Thank you for visiting."}
                </p>
            </div>
        )
    }

    const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', store.id)

    return (
        <div className="min-h-screen bg-white">
            {/* Sticky Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/marketplace" className="flex items-center gap-2 text-purple-600 font-bold hover:text-purple-800 transition-all group">
                        <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm uppercase tracking-widest">Explora mercado</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tienda Activa</span>
                    </div>
                </div>
            </nav>

            {/* Store Header */}
            <header className="bg-purple-900 text-white py-24 px-6 text-center relative overflow-hidden min-h-[400px] flex items-center justify-center">
                {store.image_url && (
                    <Image
                        src={store.image_url}
                        alt=""
                        fill
                        className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 blur-sm"
                        unoptimized
                    />
                )}
                <div className="bg-gradient-to-b from-purple-950/80 via-purple-900/70 to-purple-950/80 absolute inset-0"></div>

                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-sm font-semibold mb-8 animate-fade-in">
                        <Clock className="w-4 h-4 text-purple-300" />
                        <span>Abierto hasta {endDate.toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter drop-shadow-2xl font-outfit uppercase">
                        {store.name}
                    </h1>
                    <p className="text-xl md:text-3xl text-purple-100 max-w-3xl mx-auto leading-relaxed font-light italic">
                        &quot;{store.description}&quot;
                    </p>
                </div>
            </header>

            {/* Products Grid */}
            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products?.map((product) => (
                        <div key={product.id} className="group">
                            <div className="aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden mb-4 relative shadow-sm group-hover:shadow-xl transition-all">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-300 bg-gray-50">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                                    {product.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>}
                                </div>
                                <span className="text-lg font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-lg">
                                    ${product.price}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {(!products || products.length === 0) && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-gray-500">This store hasn&apos;t opened yet or has already closed.</p>
                    </div>
                )}
            </main>

            <footer className="bg-gray-50 text-center py-10 border-t border-gray-100 mt-20">
                <p className="text-gray-400 text-sm">Powered by Aranya</p>
            </footer>
        </div>
    )
}
