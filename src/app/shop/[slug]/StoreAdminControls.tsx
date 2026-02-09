'use client'

import { useState } from 'react'
import { Settings, Plus, Trash2, Edit3, Loader2 } from 'lucide-react'
import { EditStoreModal } from './EditStoreModal'
import { AddProductForm } from '@/app/dashboard/AddProductForm'
import { deleteProduct } from '@/app/actions'

interface StoreAdminControlsProps {
    store: {
        id: string
        name: string
        slug: string
        description: string | null
    }
}

export function StoreAdminControls({ store }: StoreAdminControlsProps) {
    const [isEditMode, setIsEditMode] = useState(false)
    const [showEditStore, setShowEditStore] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    if (!isEditMode) {
        return (
            <div className="fixed bottom-8 right-8 z-[60]">
                <button
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-full font-bold shadow-2xl hover:bg-purple-700 hover:scale-105 active:scale-95 transition-all group"
                >
                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    Administrar Tienda
                </button>
            </div>
        )
    }

    return (
        <>
            {/* Top Bar when editing */}
            <div className="fixed top-0 inset-x-0 z-[60] bg-purple-900/95 backdrop-blur-md text-white py-3 px-6 flex justify-between items-center shadow-xl animate-in slide-in-from-top duration-500">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2 text-sm font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Modo Edición Activo
                    </span>
                    <h2 className="hidden md:block text-sm font-medium opacity-80">{store.name}</h2>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowEditStore(true)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-bold transition-all"
                    >
                        <Edit3 className="w-4 h-4" /> Editar Info
                    </button>
                    <button
                        onClick={() => setIsEditMode(false)}
                        className="bg-white text-purple-900 hover:bg-purple-50 px-4 py-2 rounded-xl text-sm font-black transition-all shadow-lg"
                    >
                        Salir
                    </button>
                </div>
            </div>

            {/* Floatings for deleting products are handled by CSS selection or by inserting buttons into the products grid */}
            {/* Since we are in the same parent as the page content (mostly), we can use portal or just global styles */}
            {/* But a better way is to pass isEditMode to the product cards. We'll do that in page.tsx */}

            {showEditStore && (
                <EditStoreModal
                    store={store}
                    onClose={() => setShowEditStore(false)}
                />
            )}

            {/* Styled overlay for the "Add Product" form in edit mode */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] w-full max-w-md px-4 animate-in slide-in-from-bottom duration-500">
                <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden">
                    <div className="bg-purple-50 px-6 py-3 border-b border-purple-100 flex justify-between items-center">
                        <span className="text-xs font-black text-purple-900 uppercase tracking-widest">Nuevo Producto</span>
                    </div>
                    <div className="p-4 bg-white">
                        <AddProductForm storeId={store.id} />
                    </div>
                </div>
            </div>

            {/* Injection points for Delete buttons using a CSS approach */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .product-card-container {
                    position: relative;
                }
                .delete-overlay {
                    display: ${isEditMode ? 'flex !important' : 'none !important'};
                }
            `}} />
        </>
    )
}

// Helper component for deleting products that will be used in the product grid
export function DeleteProductButton({ productId }: { productId: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    return (
        <button
            onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation() // Prevent card click
                if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                    setIsDeleting(true)
                    try {
                        await deleteProduct(productId)
                    } catch (err) {
                        alert('Error al eliminar producto')
                    } finally {
                        setIsDeleting(false)
                    }
                }
            }}
            disabled={isDeleting}
            className="pointer-events-auto bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl shadow-xl transform transition-all active:scale-95 group/del flex items-center justify-center min-w-[44px] min-h-[44px]"
        >
            {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            )}
        </button>
    )
}
