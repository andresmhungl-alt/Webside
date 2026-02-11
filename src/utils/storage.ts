import { createClient } from './supabase/server'

export async function uploadFile(bucket: 'stores' | 'products', file: File, path: string) {
    const supabase = await createClient()

    if (!file || file.size === 0) return null

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file)

    if (uploadError) {
        console.error(`Upload error in bucket ${bucket}:`, uploadError)
        throw new Error(`Error al subir imagen: ${uploadError.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(path)

    return publicUrl
}
