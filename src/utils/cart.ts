'use client'

export interface CartItem {
    id: string
    name: string
    price: number
    image_url: string | null
    description: string | null
    slot: number | null
    quantity: number
}

const CART_STORAGE_KEY = 'pop-up-market-cart'

export const getCart = (): CartItem[] => {
    if (typeof window === 'undefined') return []
    const cart = localStorage.getItem(CART_STORAGE_KEY)
    return cart ? JSON.parse(cart) : []
}

export const saveCart = (cart: CartItem[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    window.dispatchEvent(new CustomEvent('cart-updated'))
}

export const addToCart = (product: any) => {
    const cart = getCart()
    const existingItem = cart.find(item => item.id === product.id)

    // Ensure we handle numerical stock correctly
    const stock = product.slot !== undefined && product.slot !== null ? Number(product.slot) : null;

    if (existingItem) {
        // Sync the latest stock info from the product card
        existingItem.slot = stock;

        // Prevent adding more than stock if stock is known
        if (stock !== null && existingItem.quantity >= stock) {
            alert(`No hay más stock disponible para ${product.name}.`)
            return
        }
        existingItem.quantity += 1
    } else {
        cart.push({ ...product, slot: stock, quantity: 1 })
    }

    saveCart(cart)
}

export const removeFromCart = (productId: string) => {
    const cart = getCart().filter(item => item.id !== productId)
    saveCart(cart)
}

export const updateQuantity = (productId: string, quantity: number) => {
    const cart = getCart()
    const item = cart.find(item => item.id === productId)
    if (item) {
        item.quantity = Math.max(1, quantity)
        saveCart(cart)
    }
}

export const clearCart = () => {
    saveCart([])
}
