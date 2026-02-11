import Link from 'next/link'
import { ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/actions'
import { MobileNav } from './MobileNav'
import { CartIcon } from './CartIcon'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="fixed w-full z-50 top-4 px-4 pointer-events-none">
            <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto bg-white/90 backdrop-blur-xl border border-white/40 shadow-lg shadow-purple-500/5 rounded-full px-6 py-3 transition-all hover:shadow-purple-500/10 hover:scale-[1.005]">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                        <ShoppingBag className="h-6 w-6 text-purple-700" />
                    </div>
                    <span className="font-outfit font-bold text-2xl tracking-tight bg-gradient-to-r from-purple-900 to-pink-700 bg-clip-text text-transparent">
                        Aranya
                    </span>
                </Link>

                <div className="flex gap-4 items-center">
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-6 items-center">
                        <Link href="/marketplace" className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-700 transition-colors group">
                            <span>Explorar Mercado</span>
                            <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                        </Link>

                        <CartIcon />

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-full hover:bg-purple-100 transition-all border border-purple-100"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span className="hidden sm:inline">Dashboard</span>
                                </Link>

                                <form action={signOut}>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors group"
                                        title="Cerrar Sesión"
                                    >
                                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                        <span className="hidden sm:inline">Salir</span>
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-purple-700 transition-colors">
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/login?next=/dashboard"
                                    className="px-6 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300 animate-pulse-subtle"
                                >
                                    Empezar a Vender
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Navigation */}
                    <MobileNav user={user} signOut={signOut} />
                </div>
            </div>
        </nav>
    )
}
