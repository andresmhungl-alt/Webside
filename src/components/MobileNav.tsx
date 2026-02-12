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
                    className="fixed inset-0 bg-black/50 z-[60] md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}
					}`}
            >
                <div className="p-6 space-y-6 h-full bg-white">
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
                            className="block px-4 py-3 bg-white border border-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium shadow-sm flex items-center gap-2"
                        >
                            <ShoppingBag className="w-5 h-5 text-purple-600" />
                            Explorar Mercado
                        </Link>

                        <div
                            onClick={() => setIsOpen(false)}
                            className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
                        >
                            <MobileCartIcon />
                        </div>

                        {user ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 bg-purple-50 border border-purple-100 text-purple-700 rounded-xl transition-all font-medium flex items-center gap-2 shadow-sm"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    Dashboard
                                </Link>

                                <button
                                    onClick={() => {
                                        setIsOpen(false)
                                        signOut()
                                    }}
                                    className="w-full text-left px-4 py-3 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 rounded-xl transition-all font-medium flex items-center gap-2 shadow-sm"
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
                                    className="block px-4 py-3 bg-white border border-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium shadow-sm"
                                >
                                    Iniciar Sesión
                                </Link>

                                <Link
                                    href="/login?next=/dashboard"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-3 bg-purple-600 text-white rounded-xl transition-all font-medium text-center hover:bg-purple-700 shadow-lg shadow-purple-500/20"
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
