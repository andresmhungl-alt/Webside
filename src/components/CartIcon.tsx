'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCart } from '@/utils/cart'

export function CartIcon() {
    const [isAnimating, setIsAnimating] = useState(false)
    const [cartCount, setCartCount] = useState(0)

    useEffect(() => {
        const updateCount = () => {
            const cart = getCart()
            const total = cart.reduce((acc, item) => acc + item.quantity, 0)
            setCartCount(total)
        }

        updateCount()

        const handleCartUpdate = () => {
            updateCount()
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 600)
        }

        window.addEventListener('cart-updated', handleCartUpdate)
        return () => window.removeEventListener('cart-updated', handleCartUpdate)
    }, [])

    return (
        <button
            onClick={() => window.dispatchEvent(new Event('open-cart'))}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-all relative group/cart-nav hover:rotate-2 ${isAnimating ? 'animate-cart-bounce' : ''
                }`}
            title="Ver Carrito"
        >
            <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-black rounded-full border-2 border-white shadow-sm px-1 animate-in zoom-in duration-300">
                        {cartCount}
                    </span>
                )}
            </div>
            <span>Carrito de compra</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white opacity-0 group-hover/cart-nav:opacity-100 transition-opacity animate-bounce"></span>
        </button>
    )
}
