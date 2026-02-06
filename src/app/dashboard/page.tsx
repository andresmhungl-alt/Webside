import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createStore, addProduct, signOut } from '@/app/actions'
import { Calendar, Plus, Package, Store as StoreIcon, Clock, LogOut } from 'lucide-react'

import { CreateStoreForm } from './CreateStoreForm'
import { AddProductForm } from './AddProductForm'

interface Product {
    id: string
    name: string
    price: number
    image_url: string | null
    description: string | null
}

function ProductList({ storeId, products }: { storeId: string, products: Product[] }) {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Your Products</h2>
                    <p className="text-gray-500 text-sm">You can add up to 5 items to your pop-up.</p>
                </div>
                <div className="text-sm font-medium bg-purple-50 text-purple-700 px-3 py-1 rounded-full border border-purple-100">
                    {products.length} / 5 Slots Used
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
                        <div className="h-56 bg-gray-100 relative overflow-hidden">
                            {product.image_url ? (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                    <Package className="w-8 h-8 opacity-50" />
                                    <span className="text-sm">No Image</span>
                                </div>
                            )}
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                ${product.price}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 text-lg mb-1">{product.name}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2">{product.description || 'No description'}</p>
                        </div>
                    </div>
                ))}

                {/* Add Product Card */}
                {products.length < 5 && (
                    <AddProductForm storeId={storeId} />
                )}
            </div>
        </div>
    )
}

export default async function Dashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: stores } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .single()

    // If we have a store, fetch products
    let products = []
    if (stores) {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', stores.id)
        products = data || []
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white">
                            <StoreIcon className="w-5 h-5" />
                        </div>
                        <span className="font-outfit">Aranya Dashboard</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="font-medium text-gray-700">{user.email}</span>
                        </div>
                        <form action={signOut}>
                            <button className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg" title="Sign Out">
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {!stores ? (
                    <CreateStoreForm />
                ) : (
                    <div className="space-y-12">
                        {/* Store Header */}
                        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 p-8 md:p-10 rounded-3xl shadow-xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-2 opacity-80">
                                        <StoreIcon className="w-5 h-5" />
                                        <span className="text-sm font-bold tracking-wider uppercase">Active Store</span>
                                    </div>
                                    <h1 className="text-4xl font-bold mb-2 text-white">{stores.name}</h1>
                                    <div className="flex items-center gap-6 text-sm text-purple-200">
                                        <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full"><Clock className="w-4 h-4" /> Closes: {new Date(stores.end_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <a href={`/shop/${stores.slug}`} target="_blank" className="px-6 py-3 bg-white text-purple-900 rounded-xl font-bold hover:bg-purple-50 transition-all shadow-lg flex items-center gap-2 group">
                                    Visit Live Store <Calendar className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                            </div>
                        </div>

                        <ProductList storeId={stores.id} products={products} />
                    </div>
                )}
            </main>
        </div>
    )
}
