'use client'

import { useState } from 'react'
import { Pencil, Trash2, X, AlertCircle } from 'lucide-react'
import { deleteProduct } from '@/app/actions'
import { EditProductModal } from './EditProductModal'

import { Product } from '@/types/product'

export function ProductActions({ product }: { product: Product }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return

        setIsDeleting(true)
        setError(null)
        try {
            const result = await deleteProduct(product.id)
            if (result?.error) {
                setError(result.error)
            }
        } catch (err: any) {
            setError('Error al eliminar el producto')
        } finally {
            setIsDeleting(false)
        }
    }

    if (isEditing) {
        return (
            <EditProductModal
                product={product}
                onClose={() => setIsEditing(false)}
            />
        )
    }

    return (
        <div className="absolute top-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
                onClick={() => setIsEditing(true)}
                className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110"
                title="Editar producto"
            >
                <Pencil className="w-4 h-4" />
            </button>
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all transform hover:scale-110 disabled:opacity-50"
                title="Eliminar producto"
            >
                {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </button>
            {error && (
                <div className="absolute top-full mt-2 left-0 bg-red-50 text-red-600 text-xs py-1 px-2 rounded border border-red-100 flex items-center gap-1 shadow-sm whitespace-nowrap">
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </div>
            )}
        </div>
    )
}
