'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Package, ShoppingCart, Info } from 'lucide-react'
import { addToCart } from '@/utils/cart'

interface Product {
    id: string
    name: string
    price: number
    image_url: string | null
    description: string | null
    slot?: number | null
}

interface ProductCardProps {
    product: Product
    isAdmin?: boolean
    children?: React.ReactNode // For action buttons overlay
    aspectRatio?: string
}

export function ProductCard({ product, isAdmin = false, children, aspectRatio = 'h-56' }: ProductCardProps) {
    const [imageError, setImageError] = useState(false)
    const isFixedH = aspectRatio.startsWith('h-')

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-purple-50 overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 relative flex flex-col h-full transform hover:-translate-y-2">
            {/* Admin Actions Overlay */}
            {isAdmin && children && (
                <div className="absolute top-4 left-4 z-40">
                    {children}
                </div>
            )}

            {/* Image Container */}
            <div className={`${isFixedH ? aspectRatio : 'aspect-' + aspectRatio.replace('aspect-', '')} relative overflow-hidden flex-shrink-0 bg-gray-100`}>
                {product.image_url && !imageError ? (
                    <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        unoptimized
                        loading="eager"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-purple-200 bg-purple-50/50 gap-4">
                        <Package className="w-16 h-16 opacity-50" />
                        <span className="text-xs uppercase tracking-widest font-black opacity-60">Sin Imagen</span>
                    </div>
                )}

                {/* Price Tag */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full text-lg font-black text-gray-900 shadow-xl border border-white/50 z-20 group-hover:scale-110 transition-transform duration-300">
                    ${product.price}
                </div>

                {/* Overlay & Add to Cart Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px] z-10">
                    {!isAdmin && (
                        <button
                            onClick={() => addToCart(product)}
                            disabled={Number(product.slot ?? 0) <= 0}
                            className="transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300 px-8 py-3 bg-white text-gray-900 rounded-full font-bold uppercase tracking-wider hover:bg-yarn-magenta hover:text-white shadow-2xl flex items-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {Number(product.slot ?? 0) > 0 ? 'Añadir' : 'Agotado'}
                        </button>
                    )}
                </div>
            </div>

            {/* Content Container */}
            <div className="p-6 sm:p-8 flex-1 flex flex-col relative z-20 bg-white">
                {/* Title - Fixed height */}
                <div className="h-8 mb-3 flex items-start">
                    <h3 className="font-outfit font-bold text-gray-900 text-xl sm:text-2xl group-hover:text-yarn-magenta transition-colors line-clamp-1 leading-tight">
                        {product.name}
                    </h3>
                </div>

                {/* Description - Fixed height */}
                <div className="h-12 mb-6">
                    <p className="text-gray-500 text-sm sm:text-base line-clamp-2 leading-relaxed font-outfit">
                        {product.description || 'Una hermosa creación hecha a mano.'}
                    </p>
                </div>

                {/* Stock Information */}
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-purple-50">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stock Disponible</span>
                    <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full ${Number(product.slot ?? 0) > 0 ? 'text-green-700 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        <div className={`w-2 h-2 rounded-full ${Number(product.slot ?? 0) > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span>{Number(product.slot ?? 0) > 0 ? `${product.slot} unid.` : 'Agotado'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
