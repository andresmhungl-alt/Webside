'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { getCart, removeFromCart, updateQuantity, CartItem, clearCart } from '@/utils/cart'
import { processCheckout } from '@/app/actions'
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Package, CreditCard, CheckCircle2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [isCheckingOut, setIsCheckingOut] = useState(false)
    const [checkoutSuccess, setCheckoutSuccess] = useState(false)

    const syncStock = useCallback(async (currentCart: CartItem[]) => {
        if (currentCart.length === 0) return

        const supabase = createClient()
        const { data: freshProducts, error } = await supabase
            .from('products')
            .select('id, slot')
            .in('id', currentCart.map(i => i.id))

        if (error || !freshProducts) return

        const updatedCart = currentCart.map(item => {
            const fresh = freshProducts.find(fp => fp.id === item.id)
            if (fresh && fresh.slot !== item.slot) {
                return { ...item, slot: fresh.slot }
            }
            return item
        })

        // Check if anything changed to avoid infinite loop or unnecessary renders
        const changed = JSON.stringify(updatedCart) !== JSON.stringify(currentCart)
        if (changed) {
            setCart(updatedCart)
            // Optional: update localStorage to persist fresh stock
            if (typeof window !== 'undefined') {
                localStorage.setItem('pop-up-market-cart', JSON.stringify(updatedCart))
            }
        }
    }, [])

    useEffect(() => {
        const initialCart = getCart()
        setCart(initialCart)
        setIsLoaded(true)
        syncStock(initialCart)

        const handleUpdate = () => {
            const newCart = getCart()
            setCart(newCart)
            syncStock(newCart)
        }
        window.addEventListener('cart-updated', handleUpdate)
        return () => window.removeEventListener('cart-updated', handleUpdate)
    }, [syncStock])

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)

    const handleCheckout = async () => {
        setIsCheckingOut(true)
        try {
            const result = await processCheckout(cart.map(i => ({ id: i.id, quantity: i.quantity })))
            if (result.success) {
                clearCart()
                setCheckoutSuccess(true)
            } else {
                alert(result.error)
            }
        } catch (e) {
            alert('Stock insuficiente o error al procesar la compra.')
        } finally {
            setIsCheckingOut(false)
        }
    }

    if (!isLoaded) return null

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-6 px-6 sticky top-0 z-40 backdrop-blur-md bg-white/80">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Link href="/marketplace" className="flex items-center gap-2 text-purple-600 font-bold hover:text-purple-800 transition-colors">
                        <ArrowLeft className="w-5 h-5" /> Regresar
                    </Link>
                    <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                        <ShoppingBag className="w-6 h-6 text-purple-600" /> Mi Carrito
                    </h1>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full p-4 sm:p-6 md:p-10">
                {(cart.length === 0 || checkoutSuccess) ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 animate-in fade-in zoom-in duration-500">
                        {checkoutSuccess ? (
                            <>
                                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-4 font-playfair">¡Compra Finalizada!</h2>
                                <p className="text-gray-500 mb-10 max-w-md mx-auto">Tu pedido ha sido procesado con éxito y el stock ha sido actualizado. ¡Gracias por confiar en el mercado!</p>
                            </>
                        ) : (
                            <>
                                <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-200">
                                    <ShoppingBag className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-4 font-playfair">Tu carrito está vacío</h2>
                                <p className="text-gray-500 mb-10 max-w-md mx-auto">Parece que aún no tienes productos seleccionados. ¡Explora el mercado y encuentra algo especial!</p>
                            </>
                        )}
                        <Link href="/marketplace" className="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-purple-700 transition-all shadow-xl hover:shadow-purple-100 active:scale-95">
                            Ir al Mercado
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex gap-6 hover:shadow-md transition-all group animate-in slide-in-from-bottom-5 duration-500"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-gray-50 rounded-2xl overflow-hidden relative flex-shrink-0 border border-gray-100">
                                        {item.image_url ? (
                                            <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-300">
                                                <Package className="w-10 h-10" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col pt-1">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 mb-2">
                                            <div>
                                                <h3 className="font-playfair font-black text-xl text-gray-900 leading-tight group-hover:text-purple-700 transition-colors uppercase tracking-tight">{item.name}</h3>
                                                {item.slot !== undefined && item.slot !== null && (
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border inline-block mt-1 ${Number(item.slot) > 0 ? 'text-purple-600 bg-purple-50 border-purple-100' : 'text-red-600 bg-red-50 border-red-100'}`}>
                                                        Stock: {item.slot}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-black text-xl sm:text-2xl text-purple-950">${item.price * item.quantity}</span>
                                        </div>

                                        <p className="text-gray-500 text-sm line-clamp-2 italic mb-4 flex-1">{item.description || 'Sin descripción.'}</p>

                                        <div className="flex items-center justify-between mt-auto">
                                            <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-white rounded-lg transition-all active:scale-90"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-10 text-center font-black text-gray-900 text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => {
                                                        const currentStock = Number(item.slot ?? 99);
                                                        if (item.quantity < currentStock) {
                                                            updateQuantity(item.id, item.quantity + 1)
                                                        } else {
                                                            alert(`Solo quedan ${currentStock} unidades disponibles.`)
                                                        }
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-purple-600 hover:bg-white rounded-lg transition-all active:scale-90"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-300 hover:text-red-500 p-2 transition-colors active:scale-90"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 flex flex-col lg:sticky lg:top-32 animate-in slide-in-from-right-10 duration-700">
                                <h2 className="text-2xl font-black text-gray-900 mb-8 font-playfair flex items-center gap-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <CreditCard className="w-4 h-4 text-purple-600" />
                                    </div>
                                    Resumen
                                </h2>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-500 text-sm font-medium">
                                        <span>Subtotal</span>
                                        <span className="text-gray-900">${subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500 text-sm font-medium pb-4 border-b border-gray-100">
                                        <span>Envío</span>
                                        <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">¡Gratis!</span>
                                    </div>
                                    <div className="flex justify-between items-end pt-2">
                                        <span className="text-gray-900 font-black text-lg">Total</span>
                                        <span className="text-4xl font-black text-purple-900 leading-none">${subtotal}</span>
                                    </div>
                                </div>

                                <button
                                    className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm hover:bg-purple-900 transition-all shadow-xl hover:shadow-purple-200 active:scale-95 mb-4 group disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    onClick={handleCheckout}
                                    disabled={isCheckingOut || cart.length === 0}
                                >
                                    {isCheckingOut ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Procesando...
                                        </>
                                    ) : (
                                        'Finalizar Compra'
                                    )}
                                </button>

                                <button
                                    onClick={() => clearCart()}
                                    className="text-gray-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors py-2"
                                >
                                    Vaciar mi Carrito
                                </button>

                                <div className="mt-10 p-6 bg-purple-50 rounded-3xl border border-purple-100 flex items-start gap-4">
                                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm border border-purple-100">
                                        <Package className="w-5 h-5 text-purple-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1">Aranya Wool</p>
                                        <p className="text-xs text-gray-600 leading-relaxed italic">Cada pieza es única, tejida a mano con el mejor cuidado y cariño para ti.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
