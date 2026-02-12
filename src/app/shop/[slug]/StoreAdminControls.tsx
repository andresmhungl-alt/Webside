'use client'

import { useState } from 'react'
import { Settings, Plus, Trash2, Edit3, Loader2 } from 'lucide-react'
import { EditStoreModal } from './EditStoreModal'
import { EditProductModal } from './EditProductModal'
import { AddProductForm } from '@/app/dashboard/AddProductForm'
import { deleteProduct } from '@/app/actions'

interface StoreAdminControlsProps {
    store: {
        id: string
        name: string
        slug: string
        description: string | null
        image_url: string | null
        start_date: string
        end_date: string
        user_id: string
        contact_email?: string | null
        whatsapp?: string | null
        telegram?: string | null
        is_chat_enabled?: boolean
        tags?: string[]
    }
    productCount: number
}

import { InboxModal } from './InboxModal'

export function StoreAdminControls({ store, productCount }: StoreAdminControlsProps) {
    const [isEditMode, setIsEditMode] = useState(false)
    const [showEditStore, setShowEditStore] = useState(false)
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [showInbox, setShowInbox] = useState(false)
    const [isDeleting, setIsDeleting] = useState<string | null>(null)

    const limit = process.env.NEXT_PUBLIC_MAX_PRODUCTS
    const maxProducts = limit ? parseInt(limit) : 5
    const finalMax = isNaN(maxProducts) ? 5 : maxProducts

    if (!isEditMode) {
        return (
            <div className="fixed bottom-6 left-6 z-[90] animate-in slide-in-from-bottom duration-500">
                <button
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-5 py-3 sm:px-6 sm:py-3 rounded-full font-bold shadow-2xl hover:bg-black hover:scale-105 active:scale-95 transition-all group border border-purple-500/30"
                >
                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                    <span className="hidden sm:inline">Administrar Tienda</span>
                    <span className="sm:hidden">Admin</span>
                </button>
            </div>
        )
    }

    return (
        <>
            {/* Top Bar when editing - Responsive */}
            <div className="fixed top-0 inset-x-0 z-[90] bg-gray-900/95 backdrop-blur-md text-white border-b border-purple-500/30 shadow-2xl animate-in slide-in-from-top duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <span className="flex-shrink-0 flex items-center gap-2 text-xs sm:text-sm font-bold bg-purple-500/20 px-3 py-1.5 rounded-full border border-purple-500/30 text-purple-200">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                            <span className="truncate">Editando</span>
                        </span>
                        <span className="hidden sm:block text-xs font-medium bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                            {productCount} / {finalMax} Prod.
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                        <button
                            onClick={() => setShowInbox(true)}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-purple-900/20"
                        >
                            <span className="hidden sm:inline">Mensajes</span>
                            <span className="sm:hidden">Chat</span>
                        </button>
                        <button
                            onClick={() => setShowEditStore(true)}
                            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all border border-white/10"
                        >
                            <Edit3 className="w-4 h-4" />
                            <span className="hidden sm:inline">Editar Info</span>
                        </button>
                        <button
                            onClick={() => setIsEditMode(false)}
                            className="bg-white text-gray-900 hover:bg-gray-100 px-3 py-2 sm:px-4 rounded-xl text-xs sm:text-sm font-black transition-all shadow-lg hover:shadow-white/20"
                        >
                            Salir
                        </button>
                    </div>
                </div>

                {/* Mobile Product Count Bar */}
                <div className="sm:hidden bg-gray-800/50 px-4 py-1 flex justify-center border-t border-white/5">
                    <span className="text-[10px] font-medium text-gray-400">
                        Productos: {productCount} / {finalMax}
                    </span>
                </div>
            </div>

            {showEditStore && (
                <EditStoreModal
                    store={store}
                    isOpen={showEditStore}
                    onClose={() => setShowEditStore(false)}
                />
            )}

            {showInbox && (
                <InboxModal
                    storeId={store.id}
                    userId={store.user_id} // Assuming store object has user_id, referencing prop interface below
                    isOpen={showInbox}
                    onClose={() => setShowInbox(false)}
                />
            )}

            {/* "Add Product" form in edit mode */}
            {isEditMode && showAddProduct && productCount < finalMax && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="w-full sm:max-w-md max-h-[90vh] overflow-y-auto bg-white sm:rounded-[2rem] rounded-t-[2rem] shadow-2xl animate-in slide-in-from-bottom duration-500">
                        <div className="sticky top-0 z-10 bg-purple-50 px-6 py-4 border-b border-purple-100 flex justify-between items-center">
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-purple-900 uppercase tracking-widest">Nuevo Producto</span>
                                <span className="text-[10px] text-purple-600 font-medium">Completa los detalles abajo</span>
                            </div>
                            <button onClick={() => setShowAddProduct(false)} className="p-2 bg-white rounded-full text-gray-400 hover:text-gray-900 shadow-sm">
                                <span className="sr-only">Cerrar</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="p-4 sm:p-6 pb-24 sm:pb-6">
                            <AddProductForm storeId={store.id} initialOpen={true} onCancel={() => setShowAddProduct(false)} />
                        </div>
                    </div>
                </div>
            )}

            {/* FAB for adding products */}
            {isEditMode && !showAddProduct && productCount < finalMax && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] animate-in slide-in-from-bottom duration-500 w-auto">
                    <button
                        onClick={() => setShowAddProduct(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 rounded-full font-bold shadow-2xl shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base border-4 border-white/20 backdrop-blur-xl"
                    >
                        <Plus className="w-5 h-5" />
                        Añadir Producto
                    </button>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .product-card-container { position: relative; }
                /* Ensure navbar doesn't block top bar */
                nav { z-index: 40 !important; }
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

// Product interface that matches exactly what EditProductModal expects
import { Product } from '@/types/product'

// Helper component for editing products that will be used in the product grid
export function EditProductButton({ product }: { product: Product }) {
    const [showEdit, setShowEdit] = useState(false)

    return (
        <>
            <button
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setShowEdit(true)
                }}
                className="pointer-events-auto bg-white hover:bg-purple-50 text-purple-600 p-3 rounded-2xl shadow-xl transform transition-all active:scale-95 group/edit flex items-center justify-center min-w-[44px] min-h-[44px] border border-purple-100"
            >
                <Edit3 className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {showEdit && (
                <EditProductModal
                    product={product}
                    onClose={() => setShowEdit(false)}
                />
            )}
        </>
    )
}
