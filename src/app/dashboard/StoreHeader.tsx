'use client'

import { useState } from 'react'
import { Store as StoreIcon, Clock, Calendar, Pencil } from 'lucide-react'
import { Store } from '@/types/store'
import { EditStoreModal } from './EditStoreModal'

interface StoreHeaderProps {
    store: Store
}

export function StoreHeader({ store }: StoreHeaderProps) {
    const [isEditing, setIsEditing] = useState(false)

    // Helper to determine store status
    const getStoreStatus = () => {
        const now = new Date()
        const start = new Date(store.start_date)
        const end = new Date(store.end_date)

        if (now > end) {
            return {
                label: 'Tienda Cerrada',
                color: 'red',
                iconColor: 'bg-red-400',
                borderColor: 'border-red-500/20',
                bgColor: 'bg-red-500/20',
                textColor: 'text-red-100'
            }
        } else if (now < start) {
            return {
                label: 'Próximamente',
                color: 'yellow',
                iconColor: 'bg-yellow-400',
                borderColor: 'border-yellow-500/20',
                bgColor: 'bg-yellow-500/20',
                textColor: 'text-yellow-100'
            }
        } else {
            return {
                label: 'Tienda Activa',
                color: 'emerald',
                iconColor: 'bg-emerald-400',
                borderColor: 'border-emerald-500/20',
                bgColor: 'bg-emerald-500/20',
                textColor: 'text-emerald-100'
            }
        }
    }

    const status = getStoreStatus()

    return (
        <>
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-indigo-900 z-10 transition-opacity duration-500"></div>

                {/* Background Image with Parallax-like effect */}
                {store.image_url && (
                    <div className="absolute inset-0 z-0">
                        <img
                            src={store.image_url}
                            alt=""
                            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 via-purple-900/40 to-indigo-900/20 mix-blend-multiply"></div>
                    </div>
                )}

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 p-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 z-10"></div>
                <div className="absolute bottom-0 left-0 p-32 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 z-10"></div>

                <div className="relative z-20 p-6 sm:p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8">
                    <div className="space-y-3 sm:space-y-4 max-w-2xl">
                        <div className="flex items-center gap-2 text-white/80">
                            <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                                <StoreIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                            </div>
                            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase font-outfit">Panel de Control</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight font-outfit tracking-tight text-border-white">
                            {store.name}
                        </h1>

                        {/* Tags Display */}
                        {store.tags && store.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {store.tags.map((tag: string, i: number) => (
                                    <span
                                        key={i}
                                        className="px-2.5 sm:px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-purple-100 font-medium pt-2">
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-white/10 shadow-lg hover:bg-white/20 transition-colors">
                                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="font-outfit text-[10px] sm:text-sm">
                                    {new Date() > new Date(store.end_date)
                                        ? `Cerró el ${new Date(store.end_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`
                                        : `Cierra el ${new Date(store.end_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`
                                    }
                                </span>
                            </span>

                            <span className={`flex items-center gap-2 ${status.bgColor} backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border ${status.borderColor} shadow-lg ${status.textColor}`}>
                                <div className={`w-2 h-2 rounded-full ${status.iconColor} ${status.color !== 'red' ? 'animate-pulse' : ''}`}></div>
                                <span className="font-outfit text-[10px] sm:text-sm">{status.label}</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="group/btn relative px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold font-outfit shadow-xl hover:shadow-2xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 sm:gap-3 overflow-hidden text-sm sm:text-base"
                        >
                            <span className="relative z-10">Editar Tienda</span>
                            <Pencil className="w-4 h-4 relative z-10 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>

                        <a
                            href={`/shop/${store.slug}`}
                            target="_blank"
                            className="group/btn relative px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-900 rounded-2xl font-bold font-outfit shadow-xl hover:shadow-2xl hover:bg-purple-50 transition-all flex items-center justify-center gap-2 sm:gap-3 overflow-hidden text-sm sm:text-base"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-indigo-50 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                            <span className="relative z-10">Ver Tienda</span>
                            <Calendar className="w-4 h-4 relative z-10 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>

            {isEditing && (
                <EditStoreModal
                    store={store}
                    onClose={() => setIsEditing(false)}
                />
            )}
        </>
    )
}
