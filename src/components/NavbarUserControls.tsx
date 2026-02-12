'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, LogOut } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { signOut as signOutAction } from '@/app/actions'
import { MobileNav } from './MobileNav'

interface NavbarUserControlsProps {
    initialUser: any
}

export function NavbarUserControls({ initialUser }: NavbarUserControlsProps) {
    const [user, setUser] = useState(initialUser)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Fetch current session immediately to catch any state missed by the server
        const getInitialSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) setUser(session.user)
        }
        getInitialSession()

        // Listen for all auth events
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                setUser(session.user)
            } else {
                setUser(null)
            }

            // If we just signed in/out, refresh the server components smoothly
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
                router.refresh()
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase, router])

    const handleSignOut = async () => {
        // Optimistically clear the user and refresh
        setUser(null)
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <div className="flex gap-4 items-center">
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6 items-center">
                {user ? (
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-50 rounded-full hover:bg-purple-100 transition-all border border-purple-100"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>

                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-500 transition-colors group"
                            title="Cerrar Sesión"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden sm:inline">Salir</span>
                        </button>
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
            <MobileNav user={user} signOut={handleSignOut} />
        </div>
    )
}
