'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, X } from 'lucide-react'

export function CartWarning() {
    const [warning, setWarning] = useState<string | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleWarning = (e: any) => {
            setWarning(e.detail.message)
            setIsVisible(true)

            // Auto-hide after 4 seconds
            const timer = setTimeout(() => {
                setIsVisible(false)
            }, 4000)

            return () => clearTimeout(timer)
        }

        window.addEventListener('cart-warning', handleWarning)
        return () => window.removeEventListener('cart-warning', handleWarning)
    }, [])

    if (!warning && !isVisible) return null

    return (
        <div
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
                }`}
        >
            <div className="bg-white/90 backdrop-blur-xl border border-red-100 shadow-2xl shadow-red-500/10 rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[320px] max-w-[90vw]">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-outfit font-bold text-gray-900 leading-tight">
                        {warning}
                    </p>
                </div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
