import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Clock } from 'lucide-react'

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
            {/* Store Header */}
            <header className="bg-purple-900 text-white py-16 px-6 text-center relative overflow-hidden">
                <div className="bg-gradient-to-r from-purple-800 to-indigo-900 absolute inset-0 opacity-50"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white/90 text-sm font-medium mb-6">
                        <Clock className="w-4 h-4" />
                        <span>Open until {endDate.toLocaleDateString()}</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">{store.name}</h1>
                    <p className="text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
                        {store.description}
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
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
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
