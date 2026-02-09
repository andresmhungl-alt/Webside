'use client'

import { useState } from 'react'
import { Store as StoreIcon, X, Image as ImageIcon, UploadCloud } from 'lucide-react'
import { createStore } from '@/app/actions'

export function CreateStoreForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [preview, setPreview] = useState<string | null>(null)

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

    if (isSuccess) {
        return (
            <div className="max-w-xl mx-auto bg-white p-12 rounded-[2.5rem] shadow-xl border border-green-100 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <StoreIcon className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">¡Tienda Creada! 🎉</h2>
                <p className="text-xl text-gray-600 mb-10 max-w-sm mx-auto">Tu espacio en Aranya ya está listo.</p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl"
                    >
                        Ir a mi Tienda
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-purple-50 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

            <div className="mb-10 text-center">
                <div className="mx-auto w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                    <StoreIcon className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Crea tu Tienda</h2>
                <p className="text-gray-500 max-w-md mx-auto text-lg">Personaliza tu espacio y empieza a vender en minutos.</p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake flex items-center gap-3 text-red-600">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                        <X className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-sm">{error}</p>
                </div>
            )}

            <form
                action={async (formData) => {
                    setIsSubmitting(true)
                    setError(null)
                    try {
                        const result = await createStore(formData)
                        if (result?.success) {
                            setIsSuccess(true)
                        } else if (result?.error) {
                            setError(result.error)
                        }
                    } catch (err: any) {
                        setError('Ocurrió un error inesperado. Por favor intenta de nuevo.')
                        console.error('Error creating store:', err)
                    } finally {
                        setIsSubmitting(false)
                    }
                }}
                className="space-y-8"
            >
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Nombre de tu Marca</label>
                    <input name="name" type="text" required className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-lg font-medium placeholder:text-gray-300" placeholder="Ej. Lanas Mágicas" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Descripción</label>
                    <textarea name="description" rows={3} className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none text-lg placeholder:text-gray-300" placeholder="¿Qué hace especial a tu tienda?" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Imagen de Portada</label>
                    <div className="relative group cursor-pointer">
                        <div className={`w-full h-64 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center transition-all bg-gray-50 group-hover:border-purple-400 group-hover:bg-purple-50 ${preview ? 'border-none p-0' : ''}`}>
                            {preview ? (
                                <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-md">
                                    <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">
                                        Cambiar Imagen
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-purple-500">
                                        <UploadCloud className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-500 font-medium">Click para subir imagen</p>
                                    <p className="text-gray-400 text-sm mt-1">Recomendado: 1200x600px</p>
                                </>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Fecha de Apertura</label>
                        <input name="start_date" type="datetime-local" required className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-gray-700 font-medium bg-gray-50" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-1">Fecha de Cierre</label>
                        <input name="end_date" type="datetime-local" required className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-gray-700 font-medium bg-gray-50" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-bold text-xl hover:bg-black transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Creando...
                        </>
                    ) : (
                        'Lanzar Tienda Oficialmente'
                    )}
                </button>
            </form>
        </div>
    )
}
