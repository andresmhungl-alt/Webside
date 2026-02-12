'use client'

import { X } from 'lucide-react'
import { DashboardChat } from '@/components/DashboardChat'

interface InboxModalProps {
    storeId: string
    userId: string
    isOpen: boolean
    onClose: () => void
}

export function InboxModal({ storeId, userId, isOpen, onClose }: InboxModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-4xl h-[80vh] shadow-2xl animate-in zoom-in-95 duration-300 border border-purple-100 flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 font-outfit">Mensajes</h2>
                        <p className="text-gray-400 font-medium text-sm">Gestiona tus conversaciones con clientes.</p>
                    </div>

                    <button onClick={onClose} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden p-0">
                    <DashboardChat storeId={storeId} userId={userId} />
                </div>
            </div>
        </div>
    )
}
