'use client'

import { useState } from 'react'
import { X, Save, Loader2 } from 'lucide-react'
import { updateStore } from '@/app/actions'

interface EditStoreFormProps {
    store: {
        id: string
        name: string
        description: string | null
    }
    onClose: () => void
}

export function EditStoreModal({ store, onClose }: EditStoreFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="bg-purple-600 p-6 flex justify-between items-center text-white">
                    <div>
                        <h2 className="text-xl font-bold">Editar Tienda</h2>
                        <p className="text-purple-100 text-sm">Actualiza la información de tu emprendimiento</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form
                    className="p-8 space-y-6"
                    action={async (formData) => {
                        setIsSubmitting(true)
                        setError(null)
                        try {
                            const result = await updateStore(store.id, formData)
                            if (result?.error) {
                                setError(result.error)
                            } else {
                                onClose()
                            }
                        } catch (e) {
                            setError('Ocurrió un error inesperado')
                        } finally {
                            setIsSubmitting(false)
                        }
                    }}
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nombre de la Tienda</label>
                            <input
                                name="name"
                                defaultValue={store.name}
                                required
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
                                placeholder="Ej. Tejidos con Amor"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción</label>
                            <textarea
                                name="description"
                                defaultValue={store.description || ''}
                                rows={4}
                                className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none"
                                placeholder="Cuéntanos un poco sobre tu tienda..."
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Save className="w-5 h-5" />
                            )}
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
