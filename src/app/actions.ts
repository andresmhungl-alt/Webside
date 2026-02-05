'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}

export async function createStore(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const slug = formData.get('slug') as string
    const startDate = formData.get('start_date') as string
    const endDate = formData.get('end_date') as string

    if (!name || !slug || !startDate || !endDate) {
        throw new Error('Missing required fields')
    }

    const { error } = await supabase.from('stores').insert({
        user_id: user.id,
        name,
        slug,
        description,
        start_date: startDate,
        end_date: endDate,
    })

    if (error) {
        console.error('Store creation error:', error)
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}

export async function addProduct(storeId: string, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const name = formData.get('name') as string
    const price = formData.get('price') as string
    const description = formData.get('description') as string
    const imageFile = formData.get('image') as File

    let imageUrl = null

    if (imageFile && imageFile.size > 0) {
        const filename = `${storeId}/${Date.now()}-${imageFile.name}`
        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filename, imageFile)

        if (uploadError) {
            return { error: 'Image upload failed: ' + uploadError.message }
        }

        const { data: { publicUrl } } = supabase.storage
            .from('products')
            .getPublicUrl(filename)

        imageUrl = publicUrl
    }

    const { error } = await supabase.from('products').insert({
        store_id: storeId,
        name,
        price: parseFloat(price),
        description,
        image_url: imageUrl,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
}
