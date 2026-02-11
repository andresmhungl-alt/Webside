import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createStore, addProduct, signOut } from '@/app/actions'
import { Calendar, Plus, Package, Store as StoreIcon, Clock, LogOut } from 'lucide-react'

import { CreateStoreForm } from './CreateStoreForm'
import { AddProductForm } from './AddProductForm'
import { ProductActions } from './ProductActions'
import { ProductCard } from '@/components/ProductCard'
import { WelcomeSection } from './WelcomeSection'
import { getMaxProductsLimit } from '@/utils/constants'

import { Product } from '@/types/product'

function ProductList({ storeId, products }: { storeId: string, products: Product[] }) {
    const finalMax = getMaxProductsLimit()

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-outfit mb-2">Tus Productos</h2>
                    <p className="text-gray-500 text-sm font-outfit">Gestiona el inventario de tu tienda pop-up.</p>
                </div>
                <div className="self-start sm:self-auto text-xs sm:text-sm font-bold bg-purple-50 text-purple-700 px-4 py-2 rounded-full border border-purple-100 flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                    </span>
                    {products.length} / {finalMax} Espacios Usados
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {products.map((product, index) => (
                    <div key={product.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                        <ProductCard product={product} isAdmin={true}>
                            <ProductActions product={product} />
                        </ProductCard>
                    </div>
                ))}

                {/* Add Product Card */}
                {products.length < finalMax && (
                    <div className="h-full min-h-[400px] animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${products.length * 100}ms` }}>
                        <AddProductForm storeId={storeId} />
                    </div>
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


            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12">
                {!stores ? (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <WelcomeSection userEmail={user.email} />

                        <div id="create-store-section" className="pt-12 border-t border-purple-100">
                            <CreateStoreForm />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Store Header */}
                        <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 z-10 transition-opacity duration-500"></div>

                            {/* Background Image with Parallax-like effect */}
                            {stores.image_url && (
                                <div className="absolute inset-0 z-0">
                                    <img
                                        src={stores.image_url}
                                        alt=""
                                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-900/40 to-indigo-900/20 mix-blend-multiply"></div>
                                </div>
                            )}

                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 p-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-10"></div>
                            <div className="absolute bottom-0 left-0 p-32 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 z-10"></div>

                            <div className="relative z-20 p-8 sm:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                                <div className="space-y-4 max-w-2xl">
                                    <div className="flex items-center gap-2 text-white/80">
                                        <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                                            <StoreIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-xs font-bold tracking-[0.2em] uppercase font-outfit">Panel de Control</span>
                                    </div>

                                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight font-outfit tracking-tight">
                                        {stores.name}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-purple-100 font-medium pt-2">
                                        <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg hover:bg-white/20 transition-colors">
                                            <Clock className="w-4 h-4" />
                                            <span className="font-outfit">Cierra el {new Date(stores.end_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>
                                        </span>
                                        <span className="flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/20 shadow-lg text-emerald-100">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                            <span className="font-outfit">Tienda Activa</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                    <a
                                        href={`/shop/${stores.slug}`}
                                        target="_blank"
                                        className="group/btn relative px-8 py-4 bg-white text-purple-900 rounded-2xl font-bold font-outfit shadow-xl hover:shadow-2xl hover:bg-purple-50 transition-all flex items-center justify-center gap-3 overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-50 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                        <span className="relative z-10">Ver Tienda</span>
                                        <Calendar className="w-4 h-4 relative z-10 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        <ProductList storeId={stores.id} products={products} />
                    </div>
                )}
            </main>
        </div>
    )
}
