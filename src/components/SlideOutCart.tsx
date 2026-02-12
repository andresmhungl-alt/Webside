'use client'

import React, { useState, useEffect } from 'react'
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getCart, removeFromCart, updateQuantity, CartItem } from '@/utils/cart'
import { usePathname } from 'next/navigation'

export const dynamic = 'force-dynamic'

export function SlideOutCart() {
    const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [total, setTotal] = useState(0)
    const pathname = usePathname()

    const loadCart = React.useCallback(() => {
        const items = getCart()
        setCartItems(items)
        const newTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        setTotal(newTotal)
    }, [])

    // Listen for custom event to open cart
    useEffect(() => {
        const handleOpenCart = () => {
            setIsOpen(true)
            loadCart()
        }

        const handleCartUpdated = () => {
            loadCart()
        }

        window.addEventListener('open-cart', handleOpenCart)
        window.addEventListener('cart-updated', handleCartUpdated)

        // Initial load
        loadCart()

        return () => {
            window.removeEventListener('open-cart', handleOpenCart)
            window.removeEventListener('cart-updated', handleCartUpdated)
        }
    }, [loadCart])

    // Close on route change
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity < 1) return
        updateQuantity(productId, newQuantity)
        loadCart()
        // Dispatch event detailed for other components
        window.dispatchEvent(new Event('cart-updated'))
    }

    const handleRemoveItem = (productId: string) => {
        removeFromCart(productId)
        loadCart()
        window.dispatchEvent(new Event('cart-updated'))
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <div className="relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <h2 className="text-xl sm:text-2xl font-bold font-outfit text-gray-900 flex items-center gap-2 sm:gap-3">
                        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                        <span className="hidden sm:inline">Tu Carrito</span>
                        <span className="sm:hidden">Carrito</span>
                        <span className="text-xs sm:text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {cartItems.length}
                        </span>
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-50 rounded-full flex items-center justify-center animate-bounce-slow">
                                <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-purple-300" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 font-outfit">Tu carrito está vacío</h3>
                            <p className="text-sm sm:text-base text-gray-500 max-w-xs">
                                ¡Explora las tiendas y encuentra tesoros tejidos únicos!
                            </p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="mt-4 text-sm sm:text-base text-purple-600 font-bold hover:text-purple-800 hover:underline"
                            >
                                Seguir comprando
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.key || item.id} className="flex gap-3 sm:gap-4 group">
                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">
                                    {item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Store className="w-6 h-6 sm:w-8 sm:h-8" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-1 font-outfit">{item.name}</h3>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-gray-300 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500">{item.storeName || 'Tienda'}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 rounded-full p-1 border border-gray-100">
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-600"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="font-bold text-xs sm:text-sm min-w-[1rem] text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-600"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <p className="font-bold text-base sm:text-lg text-purple-700 font-outfit">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Summary */}
                {cartItems.length > 0 && (
                    <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 safe-bottom">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <span className="text-sm sm:text-base text-gray-500 font-medium">Subtotal</span>
                            <span className="text-2xl sm:text-3xl font-black text-gray-900 font-outfit">${total.toFixed(2)}</span>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-400 text-center mb-3 sm:mb-4">
                            Envío e impuestos calculados al finalizar compra.
                        </p>
                        <Link
                            href="/cart" // For now, points to standard checkout page or cart page
                            className="w-full btn-squishy py-3 sm:py-4 bg-gray-900 text-white rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-purple-600 shadow-xl transition-all"
                            onClick={() => setIsOpen(false)}
                        >
                            Proceder al Pago <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
