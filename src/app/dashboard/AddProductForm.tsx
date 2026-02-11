'use client'

import { useState } from 'react'
import { Plus, X, Image as ImageIcon, UploadCloud } from 'lucide-react'
import { addProduct } from '@/app/actions'

export function AddProductForm({ storeId, initialOpen = false, onCancel }: { storeId: string, initialOpen?: boolean, onCancel?: () => void }) {
    const [isOpen, setIsOpen] = useState(initialOpen)
    const [preview, setPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
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

    const removeImage = (e: React.MouseEvent) => {
        e.preventDefault()
        setPreview(null)
        const input = document.querySelector('input[name="image"]') as HTMLInputElement
        if (input) input.value = ''
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="group relative h-full min-h-[320px] w-full rounded-[2.5rem] border-2 border-dashed border-purple-100 bg-white/50 hover:bg-white hover:border-purple-300 transition-all duration-500 overflow-hidden flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-xl hover:shadow-purple-100/50"
            >
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-100 transition-all duration-500">
                    <Plus className="w-8 h-8 text-purple-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <div className="text-center">
                    <h3 className="font-bold text-lg text-purple-900 font-outfit">Añadir Producto</h3>
                    <p className="text-sm text-purple-400 font-medium mt-1 font-outfit">Crea un nuevo artículo</p>
                </div>
            </button>
        )
    }

    return (
        <div className="relative h-full min-h-[320px] w-full rounded-[2.5rem] bg-white p-6 sm:p-8 shadow-2xl shadow-purple-100/50 border border-purple-50 animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-black text-gray-900 font-outfit">Nuevo Producto</h3>
                    <p className="text-xs text-purple-400 font-bold uppercase tracking-wider font-outfit">Detalles del artículo</p>
                </div>
                <button
                    onClick={() => {
                        if (onCancel) onCancel();
                        setIsOpen(false);
                        setPreview(null);
                        setError(null);
                    }}
                    className="p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-full transition-all"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            <form action={async (formData) => {
                setIsSubmitting(true)
                setError(null)
                try {
                    const result = await addProduct(storeId, formData)
                    if (result?.error) {
                        setError(result.error)
                    } else {
                        setPreview(null)
                        const form = document.getElementById('add-product-form') as HTMLFormElement
                        form?.reset()
                        setIsOpen(false)
                        if (onCancel) onCancel()
                    }
                } catch (e) {
                    setError('Error inesperado al añadir producto')
                } finally {
                    setIsSubmitting(false)
                }
            }} id="add-product-form" className="space-y-6">

                {/* Nombre */}
                <div className="space-y-2">
                    <input
                        name="name"
                        placeholder="Nombre del Producto"
                        required
                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 outline-none transition-all font-outfit font-bold text-gray-800 placeholder:text-gray-400"
                    />
                </div>

                {/* Precio y Stock */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            required
                            className="w-full pl-8 pr-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 outline-none transition-all font-outfit font-bold text-gray-800 placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <input
                            name="slot"
                            type="number"
                            min="0"
                            placeholder="Stock"
                            required
                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 outline-none transition-all font-outfit font-bold text-gray-800 placeholder:text-gray-400"
                        />
                    </div>
                </div>

                {/* Imagen */}
                <div className="relative group cursor-pointer">
                    <div className={`w-full h-32 rounded-2xl border-2 border-dashed border-purple-100 flex flex-col items-center justify-center transition-all bg-purple-50/30 group-hover:border-purple-400 group-hover:bg-purple-50 ${preview ? 'border-none p-0' : ''}`}>
                        {preview ? (
                            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-all">
                                <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
                                <button
                                    onClick={removeImage}
                                    className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-red-500 rounded-full text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <UploadCloud className="w-6 h-6 text-purple-300 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                                <p className="text-purple-400 text-xs font-bold font-outfit">Subir Foto</p>
                                <input name="image" type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Descripción */}
                <textarea
                    name="description"
                    rows={2}
                    placeholder="Descripción breve..."
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100 outline-none resize-none transition-all font-outfit text-sm font-medium text-gray-600 placeholder:text-gray-400"
                ></textarea>

                {error && (
                    <div className="text-xs text-red-500 font-bold px-2">{error}</div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold font-outfit shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Guardando...</span>
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            <span>Añadir Producto</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
