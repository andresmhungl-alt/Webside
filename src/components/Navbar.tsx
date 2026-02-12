import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { NavbarUserControls } from './NavbarUserControls'
import { CartIcon } from './CartIcon'
import { ShoppingBag } from 'lucide-react'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="fixed w-full z-50 top-2 sm:top-4 px-2 sm:px-4 pointer-events-none">
            <div className="max-w-7xl mx-auto flex justify-between items-center pointer-events-auto bg-white/90 backdrop-blur-xl border border-white/40 shadow-lg shadow-purple-500/5 rounded-full px-3 sm:px-6 py-2 sm:py-3 transition-all hover:shadow-purple-500/10 hover:scale-[1.005]">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                    <div className="p-1.5 sm:p-2.5 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-sm">
                        <ShoppingBag className="h-4 w-4 sm:h-6 sm:w-6 text-purple-700" />
                    </div>
                    <span className="font-outfit font-bold text-lg sm:text-2xl tracking-tight bg-gradient-to-r from-purple-900 to-pink-700 bg-clip-text text-transparent text-border-white">
                        Aranya
                    </span>
                </Link>

                <div className="flex gap-2 sm:gap-4 items-center">
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex gap-6 items-center">
                        <Link href="/marketplace" className="relative px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-700 transition-colors group">
                            <span>Explorar Mercado</span>
                            <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                        </Link>

                        <CartIcon />
                    </div>

                    <NavbarUserControls initialUser={user} />
                </div>
            </div>
        </nav>
    )
}
