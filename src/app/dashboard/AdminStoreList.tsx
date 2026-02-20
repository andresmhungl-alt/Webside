'use client'

import { Store, ExternalLink, Settings, Trash2, Eye, Plus } from 'lucide-react'
import Link from 'next/link'

interface StoreSummary {
    id: string
    name: string
    slug: string
    user_id: string
    image_url: string | null
    created_at: string
}

interface AdminStoreListProps {
    stores: StoreSummary[]
}

export function AdminStoreList({ stores }: AdminStoreListProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 font-outfit mb-2">Gestión Global</h2>
                    <p className="text-gray-500 text-sm font-outfit font-medium">Administrador: Tienes control sobre todas las tiendas de la plataforma.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Link
                        href="/dashboard?action=create"
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-full font-bold text-sm hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-500/20"
                    >
                        <Plus className="w-4 h-4" /> Nueva Tienda
                    </Link>
                    <div className="text-sm font-bold bg-purple-50 text-purple-700 px-4 py-2 rounded-full border border-purple-100 flex items-center gap-2">
                        {stores.length} Tiendas Registradas
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stores.map((store) => (
                    <div key={store.id} className="bg-white rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center overflow-hidden border border-purple-100">
                                {store.image_url ? (
                                    <img src={store.image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <Store className="w-8 h-8 text-purple-400" />
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/shop/${store.slug}`}
                                    target="_blank"
                                    className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                                    title="Ver Tienda"
                                >
                                    <Eye className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-xl font-black text-gray-900 font-outfit mb-1">{store.name}</h3>
                            <p className="text-xs text-gray-400 font-medium font-outfit truncate">ID: {store.id}</p>
                            <p className="text-xs text-gray-400 font-medium font-outfit">Sustituto: {store.user_id.slice(0, 8)}...</p>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-50 flex gap-2">
                            <Link
                                href={`/dashboard?storeId=${store.id}`}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-purple-600 transition-all shadow-lg hover:shadow-purple-500/20"
                            >
                                <Settings className="w-4 h-4" /> Gestionar
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
