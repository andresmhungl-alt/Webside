export interface Store {
    id: string
    user_id: string
    name: string
    description: string
    slug: string
    image_url: string | null
    start_date: string
    end_date: string
    tags?: string[]
    contact_email?: string | null
    whatsapp?: string | null
    telegram?: string | null
    is_chat_enabled?: boolean
    created_at?: string
}
