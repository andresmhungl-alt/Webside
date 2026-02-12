import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

export async function getSession() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function requireAuth() {
    const user = await getSession()
    if (!user) {
        redirect('/login')
    }
    return user
}

import { User } from '@supabase/supabase-js'

export function isAdmin(user: User | null | { email?: string }) {
    return user?.email === 'admin@aranya.com'
}
