'use client'

import { useState } from 'react'
import { Plus, Store as StoreIcon, Clock, X, Image as ImageIcon } from 'lucide-react'
import { createStore } from '@/app/actions'

export function CreateStoreForm() {
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
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-purple-50 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-indigo-500"></div>

            <div className="mb-10 text-center">
                <div className="mx-auto w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-6">
                    <StoreIcon className="w-10 h-10 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Store</h2>
                <p className="text-gray-500 max-w-md mx-auto">Launch your pop-up market in seconds. Define your duration and start selling.</p>
            </div>

            <form
                action={async (formData) => {
                    setIsSubmitting(true)
                    try {
                        await createStore(formData)
                    } finally {
                        setIsSubmitting(false)
                    }
                }}
                className="space-y-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px]">Store Name</label>
                        <input name="name" type="text" required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" placeholder="e.g. Andean Wool" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px]">URL Slug</label>
                        <div className="flex">
                            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm font-medium">aranya.com/</span>
                            <input name="slug" type="text" required className="flex-1 w-full px-5 py-3 rounded-r-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" placeholder="andean-wool" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px]">Description</label>
                    <textarea name="description" rows={3} className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none" placeholder="Tell the story of your wool..." />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px]">Store Cover Image</label>
                    <div className="relative group">
                        {!preview ? (
                            <label className="mt-1 flex flex-col items-center justify-center px-6 pt-10 pb-10 border-2 border-gray-300 border-dashed rounded-2xl hover:border-purple-400 hover:bg-purple-50/30 transition-all cursor-pointer bg-gray-50/50 group overflow-hidden">
                                <input name="image" type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                                <div className="space-y-3 text-center">
                                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto group-hover:scale-110 transition-transform text-purple-600">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold text-gray-900">Haz clic para subir una imagen</span>
                                        <p className="text-sm text-gray-500">O arrastra y suelta aquí</p>
                                    </div>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">PNG, JPG hasta 10MB</p>
                                </div>
                            </label>
                        ) : (
                            <div className="mt-1 relative rounded-2xl overflow-hidden border-2 border-purple-100 shadow-lg group active:scale-[0.98] transition-all">
                                <img src={preview} alt="Preview" className="w-full h-56 object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <button
                                        onClick={removeImage}
                                        className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transform hover:scale-110 transition-all shadow-xl"
                                        title="Eliminar imagen"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                                    <ImageIcon className="w-4 h-4 text-purple-600" />
                                    <span className="text-xs font-bold text-gray-900">Imagen seleccionada</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 group hover:border-purple-200 transition-colors">
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px] flex items-center gap-2"><Clock className="w-4 h-4 text-purple-500" /> Opens On</label>
                        <input name="start_date" type="datetime-local" required className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none bg-white" />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 group hover:border-purple-200 transition-colors">
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide text-[10px] flex items-center gap-2"><Clock className="w-4 h-4 text-purple-500" /> Closes On</label>
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
                        'Launch Store'
                    )}
                </button>
            </form>
        </div>
    )
}
