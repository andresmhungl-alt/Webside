'use client'

import { useState } from 'react'
import { Plus, Store as StoreIcon, Clock, X, Image as ImageIcon } from 'lucide-react'
import { createStore } from '@/app/actions'

export function CreateStoreForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    if (isSuccess) {
        return (
            <div className="max-w-3xl mx-auto bg-white p-12 rounded-3xl shadow-xl border border-green-100 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <StoreIcon className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">¡Tienda Lanzada! 🚀</h2>
                <p className="text-xl text-gray-600 mb-10 max-w-sm mx-auto">Tu mercado pop-up ya está activo y listo para recibir visitantes.</p>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl"
                    >
                        Ir al Panel de Control
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-purple-50 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

            <div className="mb-10 text-center">
                <div className="mx-auto w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                    <StoreIcon className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Crea tu Tienda</h2>
                <p className="text-gray-500 max-w-md mx-auto">Lanza tu mercado pop-up en segundos. Define la duración y empieza a vender.</p>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px]">Nombre de la Tienda</label>
                        <input name="name" type="text" required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" placeholder="Ej. Tejidos del Sur" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px]">Slug de la URL</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium">aranya.com/</span>
                            <input name="slug" type="text" required className="flex-1 w-full px-5 py-3 rounded-r-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" placeholder="tejidos-sur" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px]">Descripción</label>
                    <textarea name="description" rows={3} className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" placeholder="Cuenta la historia de tu emprendimiento..." />
                </div>



                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 group hover:border-purple-200 transition-colors">
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px] flex items-center gap-2"><Clock className="w-4 h-4 text-purple-500" /> Abre el</label>
                        <input name="start_date" type="datetime-local" required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none bg-white" />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 group hover:border-purple-200 transition-colors">
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px] flex items-center gap-2"><Clock className="w-4 h-4 text-purple-500" /> Cierra el</label>
                        <input name="end_date" type="datetime-local" required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none bg-white" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Lanzando tienda...
                        </>
                    ) : (
                        'Lanzar Tienda'
                    )}
                </button>
            </form>
        </div>
    )
}
