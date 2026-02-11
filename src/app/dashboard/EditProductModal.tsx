'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, Save, UploadCloud } from 'lucide-react'
import { updateProduct } from '@/app/actions'

interface Product {
    id: string
    name: string
    price: number
    description: string | null
    image_url: string | null
    slot: number | null | undefined
}

interface EditProductModalProps {
    product: Product
    onClose: () => void
}

export function EditProductModal({ product, onClose }: EditProductModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [preview, setPreview] = useState<string | null>(product.image_url)
    const [error, setError] = useState<string | null>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true)
        setError(null)

        try {
            formData.append('current_image_url', product.image_url || '')

            const result = await updateProduct(product.id, formData)

            if (result?.error) {
                setError(result.error)
                setIsSubmitting(false)
            } else {
                onClose()
            }
        } catch (e) {
            setError('Error al actualizar el producto')
            setIsSubmitting(false)
        }
    }

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    if (!mounted) return null

    return createPortal(
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300" onClick={onClose}>
            <div
                className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-purple-100 animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-purple-600 to-deep-indigo p-4 sm:p-6 flex justify-between items-center text-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg sm:text-xl font-black font-outfit">Editar Producto</h2>
                        <p className="text-purple-100 text-xs sm:text-sm font-outfit">Actualiza los detalles de tu artículo</p>
                    </div>
                    <button
                        onClick={onClose}
                        type="button"
                        className="p-2 hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <form
                    className="p-4 sm:p-6 md:p-8 space-y-6"
                    action={handleSubmit}
                >
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2 sm:pl-4">
                            Nombre del Producto
                        </label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={product.name}
                            required
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-outfit text-sm sm:text-base"
                            placeholder="Ej. Amigurumi Conejo"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2 sm:pl-4">
                                Precio ($)
                            </label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={product.price}
                                required
                                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-outfit text-sm sm:text-base"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2 sm:pl-4">
                                Stock Disponible
                            </label>
                            <input
                                name="slot"
                                type="number"
                                min="0"
                                defaultValue={product.slot || 0}
                                className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none font-outfit text-sm sm:text-base"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2 sm:pl-4">
                            Descripción
                        </label>
                        <textarea
                            name="description"
                            defaultValue={product.description || ''}
                            rows={3}
                            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none font-outfit text-sm sm:text-base"
                            placeholder="Cuéntanos sobre este producto..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2 sm:pl-4">
                            Imagen del Producto
                        </label>
                        <div className="relative group cursor-pointer">
                            <div className={`w-full h-40 sm:h-48 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-dashed border-purple-100 flex flex-col items-center justify-center transition-all bg-purple-50/30 group-hover:border-purple-400 group-hover:bg-purple-50 ${preview ? 'border-none p-0' : ''}`}>
                                {preview ? (
                                    <div className="relative w-full h-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-lg transition-all">
                                        <img
                                            src={preview}
                                            alt="Vista previa"
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 sm:px-6 py-2 rounded-full text-white font-bold font-outfit text-xs sm:text-sm">
                                                Cambiar Imagen
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <UploadCloud className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                                        <p className="text-purple-400 text-xs font-medium font-outfit">Subir Imagen</p>
                                    </div>
                                )}
                                <input
                                    name="image"
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 sm:py-4 border border-gray-200 text-gray-600 rounded-full font-bold hover:bg-gray-50 transition-all text-base font-outfit"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 sm:py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-yarn-magenta transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base font-outfit"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="hidden sm:inline">Guardando...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Guardar
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    )
}
