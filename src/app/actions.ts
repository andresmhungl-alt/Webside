'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { requireAuth, isAdmin } from '@/utils/auth'
import { uploadFile } from '@/utils/storage'
import { revalidateAll } from '@/utils/revalidate'
import { getMaxProductsLimit } from '@/utils/constants'

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}

export async function createStore(formData: FormData) {
    const user = await requireAuth()
    const supabase = await createClient()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File
    const startDate = formData.get('start_date') as string
    const endDate = formData.get('end_date') as string
    const tagsInput = formData.get('tags') as string
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []

    if (!name || !startDate || !endDate) return { error: 'Por favor completa todos los campos obligatorios.' }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Math.random().toString(36).substring(2, 7)}`

    try {
        const imageUrl = await uploadFile('stores', imageFile, `${user.id}/${Date.now()}-${imageFile?.name}`)

        const { error } = await supabase.from('stores').insert({
            user_id: user.id,
            name,
            slug,
            description,
            start_date: startDate,
            end_date: endDate,
            image_url: imageUrl,
            tags
        })

        if (error) throw error
    } catch (err: any) {
        return { error: err.message || 'Error al crear la tienda' }
    }

    revalidateAll()
    return { success: true }
}

export async function addProduct(storeId: string, formData: FormData) {
    const user = await requireAuth()
    const supabase = await createClient()

    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const description = formData.get('description') as string
    const slot = formData.get('slot') as string
    const imageFile = formData.get('image') as File

    const limitChecked = getMaxProductsLimit()
    const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('store_id', storeId)

    if (countError) return { error: 'Error al verificar límite: ' + countError.message }
    if (count !== null && count >= limitChecked) return { error: `Límite de ${limitChecked} productos alcanzado.` }

    try {
        const imageUrl = await uploadFile('products', imageFile, `${storeId}/${Date.now()}-${imageFile?.name}`)

        const { error } = await supabase.from('products').insert({
            store_id: storeId,
            name,
            price: parseFloat(price),
            description,
            slot: parseInt(slot) || 0,
            image_url: imageUrl,
        })

        if (error) throw error
    } catch (err: any) {
        return { error: err.message }
    }

    revalidateAll()
    return { success: true }
}

export async function updateProduct(productId: string, formData: FormData) {
    const user = await requireAuth()
    const supabase = await createClient()

    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const description = formData.get('description') as string
    const slot = formData.get('slot') as string
    const imageFile = formData.get('image') as File
    const currentImageUrl = formData.get('current_image_url') as string

    let imageUrl = currentImageUrl

    try {
        if (imageFile && imageFile.size > 0) {
            const { data: product } = await supabase.from('products').select('store_id').eq('id', productId).single()
            if (product) {
                imageUrl = await uploadFile('products', imageFile, `${product.store_id}/${Date.now()}-${imageFile.name}`) || currentImageUrl
            }
        }

        const { error } = await supabase.from('products').update({
            name,
            price: parseFloat(price),
            description,
            slot: parseInt(slot) || 0,
            image_url: imageUrl,
        }).eq('id', productId)

        if (error) throw error
    } catch (err: any) {
        return { error: err.message }
    }

    revalidateAll()
    return { success: true }
}

export async function updateStore(storeId: string, formData: FormData) {
    const user = await requireAuth()
    const supabase = await createClient()

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File
    const currentImageUrl = formData.get('current_image_url') as string
    const start_date = formData.get('start_date') as string
    const end_date = formData.get('end_date') as string
    const tagsInput = formData.get('tags') as string
    const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : []

    // Contact fields
    const contact_email = formData.get('contact_email') as string
    const whatsapp = formData.get('whatsapp') as string
    const telegram = formData.get('telegram') as string
    const is_chat_enabled = formData.get('is_chat_enabled') === 'on'

    if (!name) return { error: 'El nombre es obligatorio.' }

    try {
        const imageUrl = imageFile && imageFile.size > 0
            ? await uploadFile('stores', imageFile, `${user.id}/store-${Date.now()}-${imageFile.name}`)
            : currentImageUrl

        const updateData: any = {
            name,
            description,
            image_url: imageUrl,
            tags,
            contact_email,
            whatsapp,
            telegram,
            is_chat_enabled
        }
        if (start_date) updateData.start_date = start_date
        if (end_date) updateData.end_date = end_date

        const query = supabase
            .from('stores')
            .update(updateData)
            .eq('id', storeId)

        if (!isAdmin(user)) {
            query.eq('user_id', user.id)
        }

        const { error } = await query

        if (error) throw error
    } catch (err: any) {
        console.error('Error updating store:', err)
        return { error: err.message || 'Error al actualizar la tienda' }
    }

    revalidateAll()
    return { success: true }
}

export async function deleteProduct(productId: string) {
    const user = await requireAuth()
    const supabase = await createClient()

    let query = supabase
        .from('products')
        .select('id, stores!inner(user_id)')
        .eq('id', productId)

    if (!isAdmin(user)) {
        query.eq('stores.user_id', user.id)
    }

    const { data: productCheck, error: checkError } = await query.single()

    if (checkError || !productCheck) return { error: 'Sin permisos o error al verificar.' }

    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (error) return { error: error.message }

    revalidateAll()
    return { success: true }
}

export async function getPublicStores(searchTerm?: string) {
    const supabase = await createClient()
    const now = new Date().toISOString()

    let query = supabase
        .from('stores')
        .select('*')
        .lte('start_date', now)
        .gte('end_date', now)
        .order('end_date', { ascending: true }) // Show stores closing soonest first

    if (searchTerm) {
        // Search by name (partial match) or tags (exact match in array)
        query = query.or(`name.ilike.%${searchTerm}%,tags.cs.{"${searchTerm}"}`)
    }
    const { data, error } = await query
    return error ? [] : (data || [])
}

export async function processCheckout(cartItems: { id: string, quantity: number }[]) {
    const supabase = await createClient()

    try {
        const { error } = await supabase.rpc('process_checkout_stock', {
            p_items: cartItems
        })

        if (error) throw error

        revalidateAll()
        return { success: true }
    } catch (err: any) {
        console.error('Checkout error:', err)
        return { error: err.message || 'Error al procesar la compra' }
    }
}

export async function deleteStore(storeId: string) {
    const user = await requireAuth()
    const supabase = await createClient()

    try {
        let query = supabase
            .from('stores')
            .select('id, user_id')
            .eq('id', storeId)

        if (!isAdmin(user)) {
            query.eq('user_id', user.id)
        }

        const { data: store, error: checkError } = await query.single()
        if (checkError || !store) return { error: 'No tienes permiso para eliminar esta tienda.' }

        // Manual delete of products to ensure cleanup
        const { error: productsError } = await supabase.from('products').delete().eq('store_id', storeId)
        if (productsError) throw productsError

        const { error: storeError } = await supabase.from('stores').delete().eq('id', storeId)
        if (storeError) throw storeError

        revalidateAll()
        return { success: true }
    } catch (err: any) {
        console.error('Delete store error:', err)
        return { error: err.message || 'Error al eliminar la tienda' }
    }
}
