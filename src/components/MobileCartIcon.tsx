'use client'

import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export function MobileCartIcon() {
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
            onClick={(e) => {
                // Let parent handle closing menu
            }}
            className={`block px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all font-medium flex items-center gap-2 ${isAnimating ? 'animate-cart-bounce' : ''
                }`}
        >
            <ShoppingBag className="w-5 h-5" />
            Ver Carrito
        </Link>
    )
}
