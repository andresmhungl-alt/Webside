'use client'

import { User, ShoppingBag, Plus } from 'lucide-react'
import Link from 'next/link'

interface WelcomeSectionProps {
    userEmail: string | undefined
}

export function WelcomeSection({ userEmail }: WelcomeSectionProps) {
    const userName = userEmail?.split('@')[0] || 'Artesano'

    const scrollToCreateStore = () => {
        document.getElementById('create-store-section')?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className="max-w-3xl mx-auto text-center space-y-6 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex p-6 bg-purple-50 rounded-[2rem] text-purple-600 mb-4 ring-8 ring-purple-50/50 shadow-xl shadow-purple-100">
                <User className="w-10 h-10" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight font-outfit">
                ¡Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">{userName}</span>!
            </h1>
            <p className="text-xl text-gray-500 max-w-xl mx-auto leading-relaxed font-outfit font-medium">
                Bienvenido a tu espacio personal en Aranya. Aquí podrás gestionar tu propia tienda artesanal cuando estés listo.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <Link
                    href="/marketplace"
                    className="w-full sm:w-auto px-8 py-4 bg-white text-gray-600 rounded-2xl font-bold border-2 border-gray-100 hover:border-purple-200 hover:text-purple-600 transition-all shadow-sm hover:shadow-lg flex items-center justify-center gap-2 font-outfit"
                >
                    <ShoppingBag className="w-5 h-5" /> Explorar el Mercado
                </Link>
                <button
                    onClick={scrollToCreateStore}
                    className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-2 font-outfit"
                >
                    <Plus className="w-5 h-5" /> Crear mi Tienda
                </button>
            </div>
        </div>
    )
}
