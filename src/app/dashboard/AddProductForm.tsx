'use client'

import { useState } from 'react'
import { Plus, X, Image as ImageIcon } from 'lucide-react'
import { addProduct } from '@/app/actions'

export function AddProductForm({ storeId }: { storeId: string }) {
    const [preview, setPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault()
        setPreview(null)
        const input = document.querySelector('input[name="image"]') as HTMLInputElement
        if (input) input.value = ''
    }

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center p-6 hover:border-purple-300 hover:shadow-xl transition-all group relative overflow-hidden bg-white">
            <form action={async (formData) => {
                setIsSubmitting(true)
                try {
                    await addProduct(storeId, formData)
                    setPreview(null)
                    // Reset inputs manually since it's a client component with state
                    const form = document.getElementById('add-product-form') as HTMLFormElement
                    form?.reset()
                } finally {
                    setIsSubmitting(false)
                }
            }} id="add-product-form" className="w-full space-y-4 relative z-10">
                <div className="text-center mb-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-full shadow-sm flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform text-purple-600">
                        <Plus className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900">Añadir Nuevo Producto</h3>
                </div>

                <div className="space-y-3">
                    <input name="name" placeholder="Nombre del Producto" required className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all" />

                    <div className="grid grid-cols-2 gap-3">
                        <input name="price" type="number" step="0.01" placeholder="Precio" required className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all" />

                        <div className="relative">
                            <label className={`flex items-center justify-center h-full px-4 py-2.5 rounded-lg border text-sm font-medium cursor-pointer transition-all ${preview ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'}`}>
                                <ImageIcon className={`w-4 h-4 mr-2 ${preview ? 'animate-pulse' : ''}`} />
                                {preview ? 'Listo' : 'Imagen'}
                                <input name="image" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                            </label>
                        </div>
                    </div>

                    {preview && (
                        <div className="relative rounded-xl overflow-hidden h-32 border border-purple-100 shadow-inner group/preview animate-in zoom-in-95 duration-300">
                            <img src={preview} alt="Vista previa del producto" className="w-full h-full object-cover" />
                            <button
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover/preview:opacity-100 transition-opacity"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    <textarea name="description" rows={2} placeholder="Descripción del Producto" className="w-full text-sm px-4 py-2.5 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none transition-all"></textarea>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Añadiendo...
                            </>
                        ) : (
                            'Añadir a la Tienda'
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
