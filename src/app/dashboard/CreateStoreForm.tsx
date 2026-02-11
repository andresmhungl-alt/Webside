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
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
                    <StoreIcon className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight font-outfit">¡Tienda Creada! 🎉</h2>
                <p className="text-xl text-gray-600 mb-10 max-w-sm mx-auto font-outfit">Tu espacio en Aranya ya está listo para recibir tejedores.</p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="btn-squishy w-full py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl"
                    >
                        Ir a mi Tienda
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-4 sm:p-6 md:p-8 lg:p-12 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-purple-500/10 border border-purple-50 relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yarn-magenta via-purple-500 to-deep-indigo"></div>

            <div className="mb-8 sm:mb-10 text-center">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4 sm:mb-6 animate-pulse-subtle">
                    <StoreIcon className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2 sm:mb-3 tracking-tight font-outfit">Crea tu Tienda</h2>
                <p className="text-gray-500 max-w-md mx-auto text-base sm:text-lg font-outfit px-4">Personaliza tu espacio y empieza a vender tus creaciones.</p>
            </div>

            {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake flex items-center gap-3 text-red-600 font-outfit">
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
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2 sm:pl-4">Nombre de tu Marca</label>
                    <input name="name" type="text" required className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-base sm:text-lg font-medium placeholder:text-gray-300 font-outfit" placeholder="Ej. Lanas Mágicas" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2 sm:pl-4">Descripción</label>
                    <textarea name="description" rows={3} className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none text-base sm:text-lg placeholder:text-gray-300 font-outfit" placeholder="¿Qué hace especial a tu tienda?" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2 sm:pl-4">Imagen de Portada</label>
                    <div className="relative group cursor-pointer">
                        <div className={`w-full h-48 sm:h-64 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-dashed border-purple-100 flex flex-col items-center justify-center transition-all bg-purple-50/30 group-hover:border-purple-400 group-hover:bg-purple-50 ${preview ? 'border-none p-0' : ''}`}>
                            {preview ? (
                                <div className="relative w-full h-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-md group-hover:shadow-lg transition-all">
                                    <img src={preview} alt="Vista previa" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full text-white font-bold font-outfit">
                                            Cambiar Imagen
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-purple-400 group-hover:text-purple-600">
                                        <UploadCloud className="w-10 h-10" />
                                    </div>
                                    <p className="text-purple-900 font-bold text-lg font-outfit">Click para subir portada</p>
                                    <p className="text-gray-400 text-sm mt-1 font-outfit">Recomendado: 1200x600px</p>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2 sm:pl-4">Fecha de Apertura</label>
                        <input name="start_date" type="datetime-local" required className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-gray-700 font-medium bg-gray-50/50 font-outfit text-sm sm:text-base" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2 sm:pl-4">Fecha de Cierre</label>
                        <input name="end_date" type="datetime-local" required className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-gray-700 font-medium bg-gray-50/50 font-outfit text-sm sm:text-base" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-squishy w-full py-4 sm:py-5 bg-gray-900 text-white rounded-full font-bold text-lg sm:text-xl hover:bg-yarn-magenta transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 mt-4"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 sm:w-6 sm:h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span className="hidden sm:inline">Tejiendo tienda...</span>
                            <span className="sm:hidden">Creando...</span>
                        </>
                    ) : (
                        <>
                            <span className="hidden sm:inline">Lanzar Tienda Oficialmente</span>
                            <span className="sm:hidden">Crear Tienda</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}
