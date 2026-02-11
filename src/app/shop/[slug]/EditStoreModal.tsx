'use client'

import { useState } from 'react'
import { X, Save, Loader2, Image as ImageIcon, UploadCloud, Trash2, AlertTriangle } from 'lucide-react'
import { updateStore, deleteStore } from '@/app/actions'
import { useRouter } from 'next/navigation'

interface EditStoreModalProps {
    store: {
        id: string
        name: string
        description: string | null
        image_url: string | null
        start_date: string
        end_date: string
    }
    isOpen: boolean
    onClose: () => void
}

export function EditStoreModal({ store, isOpen, onClose }: EditStoreModalProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [preview, setPreview] = useState<string | null>(store.image_url)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

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

    // Helper to format date for datetime-local input (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString)
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
        return date.toISOString().slice(0, 16)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300 border border-purple-100">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-outfit">Editar Tienda</h2>
                        <p className="text-gray-400 font-medium text-xs sm:text-sm">Actualiza los detalles de tu espacio.</p>
                    </div>

                    <button onClick={onClose} className="p-2 sm:p-3 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors flex-shrink-0">
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-2 border border-red-100">
                        <X className="w-5 h-5 flex-shrink-0" />
                        <span className="font-bold text-sm">{error}</span>
                    </div>
                )}

                <form
                    action={async (formData) => {
                        setIsSubmitting(true)
                        setError(null)
                        try {
                            const result = await updateStore(store.id, formData)
                            if (result?.success) {
                                onClose()
                                window.location.reload()
                            } else if (result?.error) {
                                setError(result.error)
                            }
                        } catch (err: any) {
                            console.error('Update error:', err)
                            setError(err.message || 'Error al actualizar la tienda')
                        } finally {
                            setIsSubmitting(false)
                        }
                    }}
                    className="space-y-6"
                >
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-4">Nombre</label>
                        <input
                            name="name"
                            defaultValue={store.name}
                            type="text"
                            required
                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none text-lg font-medium font-outfit"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-4">Descripción</label>
                        <textarea
                            name="description"
                            defaultValue={store.description || ''}
                            rows={3}
                            className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none resize-none text-lg font-outfit"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-2 sm:pl-4">Imagen de Portada</label>
                        <div className="relative group cursor-pointer">
                            <div className={`w-full h-40 sm:h-48 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-dashed border-purple-100 flex flex-col items-center justify-center transition-all bg-purple-50/30 group-hover:border-purple-400 group-hover:bg-purple-50 ${preview ? 'border-none p-0' : ''}`}>
                                {preview ? (
                                    <div className="relative w-full h-full rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-lg transition-all">
                                        <img src={preview} alt="Vista previa" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full text-white font-bold font-outfit">
                                                Cambiar Imagen
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center">
                                        <UploadCloud className="w-8 h-8 mb-2" />
                                        <span className="font-bold">Subir nueva imagen</span>
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

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                {error}
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-2">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-4">Fecha de Apertura</label>
                            <input
                                name="start_date"
                                type="datetime-local"
                                required
                                defaultValue={formatDateForInput(store.start_date)}
                                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 transition-all outline-none text-gray-700 font-medium bg-gray-50/50 font-outfit text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 pl-4">Fecha de Cierre</label>
                            <input
                                name="end_date"
                                type="datetime-local"
                                required
                                defaultValue={formatDateForInput(store.end_date)}
                                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-purple-500 transition-all outline-none text-gray-700 font-medium bg-gray-50/50 font-outfit text-sm"
                            />
                        </div>
                    </div>

                    <input type="hidden" name="current_image_url" value={store.image_url || ''} />

                    <div className="border-t border-red-100 pt-6 mt-6">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-red-900 mb-1">Zona de Peligro</h3>
                                    <p className="text-xs text-red-700 mb-3">Eliminar tu tienda es permanente y borrará todos los productos asociados.</p>
                                    {!showDeleteConfirm ? (
                                        <button
                                            type="button"
                                            onClick={() => setShowDeleteConfirm(true)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-all flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Eliminar Tienda
                                        </button>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-red-900">¿Estás completamente seguro?</p>
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowDeleteConfirm(false)}
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 transition-all"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isDeleting}
                                                    onClick={async () => {
                                                        setIsDeleting(true)
                                                        setError(null)
                                                        try {
                                                            const result = await deleteStore(store.id)
                                                            if (result?.error) {
                                                                setError(result.error)
                                                                setIsDeleting(false)
                                                            } else {
                                                                router.push('/marketplace')
                                                                router.refresh()
                                                            }
                                                        } catch (e) {
                                                            setError('Error inesperado al eliminar')
                                                            setIsDeleting(false)
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                                    Sí, Eliminar Permanentemente
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 sm:py-4 border border-gray-200 text-gray-600 rounded-full font-bold hover:bg-gray-50 transition-all text-base"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 sm:py-4 bg-gray-900 text-white rounded-full font-bold hover:bg-yarn-magenta transition-all shadow-lg hover:shadow-purple-500/20 disabled:opacity-50 flex items-center justify-center gap-2 text-base"
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
        </div>
    )
}
