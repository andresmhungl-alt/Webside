'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function CartIcon() {
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        const handleCartUpdate = () => {
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 600)
        }

        window.addEventListener('cart-updated', handleCartUpdate)
        return () => window.removeEventListener('cart-updated', handleCartUpdate)
    }, [])

    return (
        <Link
            href="/cart"
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-full transition-all relative group/cart-nav hover:rotate-2 ${isAnimating ? 'animate-cart-bounce' : ''
                }`}
            title="Ver Carrito"
        >
            <ShoppingBag className="w-5 h-5" />
            <span>Carrito de compra</span>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white opacity-0 group-hover/cart-nav:opacity-100 transition-opacity animate-bounce"></span>
        </Link>
    )
}
