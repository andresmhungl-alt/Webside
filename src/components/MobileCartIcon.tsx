'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCart } from '@/utils/cart'

export function MobileCartIcon() {
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
        <Link
            href="/cart"
            onClick={(e) => {
                // Let parent handle closing menu
            }}
            className={`block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium flex items-center justify-between ${isAnimating ? 'animate-cart-bounce' : ''
                }`}
        >
            <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Ver Carrito</span>
            </div>
            {cartCount > 0 && (
                <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-1 rounded-full border border-purple-500 shadow-sm animate-in zoom-in duration-300">
                    {cartCount}
                </span>
            )}
        </Link>
    )
}
