import Link from 'next/link'
import { ShoppingBag, User, LogOut, LayoutDashboard } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import { signOut } from '@/app/actions'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 text-purple-900 font-bold text-2xl tracking-tight hover:opacity-80 transition-opacity">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <ShoppingBag className="h-6 w-6 text-purple-700" />
                    </div>
                    <span className="font-outfit">Aranya</span>
                </Link>

                <div className="flex gap-4 items-center">
                    <Link href="/marketplace" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-700 transition-colors">
                        Explorar Mercado
                    </Link>

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
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors group"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    <span className="hidden sm:inline">Salir</span>
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-purple-700 transition-colors">
                                Log In
                            </Link>
                            <Link
                                href="/login"
                                className="px-6 py-2.5 text-sm font-medium bg-purple-600 text-white rounded-full hover:bg-purple-700 shadow-lg hover:shadow-purple-200 transition-all transform hover:-translate-y-0.5"
                            >
                                Empezar a Vender
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
