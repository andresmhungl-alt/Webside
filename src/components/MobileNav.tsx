'use client'

import Link from 'next/link'
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { MobileCartIcon } from './MobileCartIcon'

interface MobileNavProps {
    user: any
    signOut: () => void
}

export function MobileNav({ user, signOut }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            {/* Hamburger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all"
                aria-label="Toggle menu"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-6 space-y-6">
                    {/* Close Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-4">
                        <Link
                            href="/marketplace"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium"
                        >
                            Explorar Mercado
                        </Link>

                        <div onClick={() => setIsOpen(false)}>
                            <MobileCartIcon />
                        </div>

                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 bg-purple-50 text-purple-700 rounded-xl transition-all font-medium flex items-center gap-2"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    Dashboard
                                </Link>

                                <button
                                    onClick={() => {
                                        setIsOpen(false)
                                        signOut()
                                    }}
                                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium flex items-center gap-2"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium"
                                >
                                    Iniciar Sesión
                                </Link>

                                <Link
                                    href="/login?next=/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 bg-purple-600 text-white rounded-xl transition-all font-medium text-center hover:bg-purple-700"
                                >
                                    Empezar a Vender
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </>
    )
}
