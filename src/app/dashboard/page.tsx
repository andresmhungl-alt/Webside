import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createStore, addProduct, signOut } from '@/app/actions'
import { Calendar, Plus, Package, LogOut } from 'lucide-react'

import { CreateStoreForm } from './CreateStoreForm'
import { AddProductForm } from './AddProductForm'
import { ProductActions } from './ProductActions'
import { ProductCard } from '@/components/ProductCard'
import { WelcomeSection } from './WelcomeSection'
import { StoreHeader } from './StoreHeader'
import { DashboardChat } from '@/components/DashboardChat'
import { getMaxProductsLimit } from '@/utils/constants'
import { AdminStoreList } from './AdminStoreList'
import { isAdmin } from '@/utils/auth'

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

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ storeId?: string, action?: string }> }) {
    const { storeId: selectedStoreId, action } = await searchParams
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const isUserAdmin = isAdmin(user)

    // Admin view: all stores
    let allStores = []
    if (isUserAdmin && !selectedStoreId && action !== 'create') {
        const { data } = await supabase.from('stores').select('*').order('created_at', { ascending: false })
        allStores = data || []
    }

    // Fetch specific store (either user's own or selected by admin)
    let query = supabase.from('stores').select('*')

    if (selectedStoreId && isUserAdmin) {
        query = query.eq('id', selectedStoreId)
    } else {
        query = query.eq('user_id', user.id)
    }

    const { data: stores } = await query.single()

    // If we have a store, fetch products
    let products = []
    if (stores && !action) {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('store_id', stores.id)
        products = data || []
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-12">
                {isUserAdmin && action === 'create' ? (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex justify-start">
                            <Link
                                href="/dashboard"
                                className="text-sm font-bold text-purple-600 hover:text-purple-800 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-purple-100 transition-all font-outfit"
                            >
                                ← Volver al listado global
                            </Link>
                        </div>
                        <div id="create-store-section">
                            <CreateStoreForm isAdmin={isUserAdmin} />
                        </div>
                    </div>
                ) : isUserAdmin && !selectedStoreId ? (
                    <AdminStoreList stores={allStores} />
                ) : !stores ? (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <WelcomeSection userEmail={user.email} />

                        <div id="create-store-section" className="pt-12 border-t border-purple-100">
                            <CreateStoreForm isAdmin={isUserAdmin} />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Store Header */}
                        <StoreHeader store={stores} />

                        {/* Back to Admin List button */}
                        {isUserAdmin && (
                            <div className="flex justify-start">
                                <Link
                                    href="/dashboard"
                                    className="text-sm font-bold text-purple-600 hover:text-purple-800 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-purple-100 transition-all"
                                >
                                    ← Volver al listado global
                                </Link>
                            </div>
                        )}

                        {/* Chat Section */}
                        {stores.is_chat_enabled && (
                            <section>
                                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-outfit mb-6">Mensajes</h2>
                                <DashboardChat storeId={stores.id} userId={user.id} />
                            </section>
                        )}

                        <ProductList storeId={stores.id} products={products} />
                    </div>
                )}
            </main >
        </div >
    )
}
