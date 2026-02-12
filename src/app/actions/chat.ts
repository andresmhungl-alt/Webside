'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { isAdmin } from '@/utils/auth'

export async function sendMessage(storeId: string, content: string, conversationId?: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Debes iniciar sesión' }

    try {
        let conversation;

        if (conversationId) {
            // Reply to specific conversation
            const { data, error: fetchError } = await supabase
                .from('conversations')
                .select('id, is_blocked')
                .eq('id', conversationId)
                .single()

            if (fetchError || !data) throw new Error('Conversation not found')
            if (data.is_blocked) return { error: 'Este chat ha sido bloqueado' }

            conversation = data
        } else {
            // Find or create conversation for customer
            const { data: existing } = await supabase
                .from('conversations')
                .select('id, is_blocked')
                .eq('store_id', storeId)
                .eq('customer_id', user.id)
                .maybeSingle()

            if (existing?.is_blocked) return { error: 'Este chat ha sido bloqueado' }

            conversation = existing

            if (!conversation) {
                const { data: newConv, error: createError } = await supabase
                    .from('conversations')
                    .insert({
                        store_id: storeId,
                        customer_id: user.id
                    })
                    .select()
                    .single()

                if (createError) throw createError
                conversation = newConv
            }
        }

        if (!conversation) throw new Error('Conversation not found')

        // Send message
        const { error: msgError } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversation.id,
                sender_id: user.id,
                content
            })

        if (msgError) throw msgError

        // Update last_message_at
        await supabase
            .from('conversations')
            .update({ last_message_at: new Date().toISOString() })
            .eq('id', conversation.id)

        return { success: true, conversationId: conversation.id }
    } catch (error: any) {
        console.error('Error sending message:', error)
        return { error: 'Error al enviar mensaje' }
    }
}

export async function getConversation(storeId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    const { data: conversation } = await supabase
        .from('conversations')
        .select('*')
        .eq('store_id', storeId)
        .eq('customer_id', user.id)
        .single()

    return { conversation }
}

export async function getMessages(conversationId: string) {
    const supabase = await createClient()

    const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })

    return messages
}

export async function getConversations(storeId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Unauthorized' }

    // Verify store ownership
    const { data: store } = await supabase
        .from('stores')
        .select('user_id')
        .eq('id', storeId)
        .single()

    if (!store) return { error: 'Tienda no encontrada' }

    if (!isAdmin(user) && store.user_id !== user.id) {
        return { error: 'Unauthorized' }
    }

    const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
            *,
            messages:messages(content, created_at, sender_id)
        `)
        .eq('store_id', storeId)
        .order('last_message_at', { ascending: false })

    if (error) {
        console.error('Error fetching conversations:', error)
        return { error: error.message }
    }

    if (!conversations || conversations.length === 0) return []

    // Fetch profiles for all unique customers in these conversations
    const customerIds = Array.from(new Set(conversations.map(c => c.customer_id)))

    const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', customerIds)

    const profileMap = (profiles || []).reduce((acc, p) => {
        acc[p.id] = p.full_name
        return acc
    }, {} as Record<string, string>)

    // Process conversations to get a preview and name
    return conversations.map(conv => ({
        ...conv,
        customer_name: profileMap[conv.customer_id] || 'Cliente',
        unread_count: conv.messages?.filter((m: any) => !m.is_read && m.sender_id === conv.customer_id).length || 0,
        preview: conv.messages && conv.messages.length > 0
            ? conv.messages[conv.messages.length - 1].content
            : 'Nueva conversación'
    }))
}

export async function markAsRead(conversationId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id) // Only mark those NOT sent by me
        .eq('is_read', false)

    if (error) {
        console.error('Error marking as read:', error)
        return { error: error.message }
    }
    return { success: true }
}

export async function toggleBlockChat(conversationId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check if participant
    const { data: conv } = await supabase
        .from('conversations')
        .select('*, stores(user_id)')
        .eq('id', conversationId)
        .single()

    if (!conv) return { error: 'Chat no encontrado' }

    const isOwner = conv.stores?.user_id === user.id
    const isCustomer = conv.customer_id === user.id

    if (!isOwner && !isCustomer && !isAdmin(user)) {
        return { error: 'No tienes permiso' }
    }

    const { error } = await supabase
        .from('conversations')
        .update({ is_blocked: !conv.is_blocked })
        .eq('id', conversationId)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    return { success: true, isBlocked: !conv.is_blocked }
}

export async function deleteChat(conversationId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Check if participant
    const { data: conv } = await supabase
        .from('conversations')
        .select('*, stores(user_id)')
        .eq('id', conversationId)
        .single()

    if (!conv) return { error: 'Chat no encontrado' }

    const isOwner = conv.stores?.user_id === user.id
    const isCustomer = conv.customer_id === user.id

    if (!isOwner && !isCustomer && !isAdmin(user)) {
        return { error: 'No tienes permiso' }
    }

    const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId)

    if (error) return { error: error.message }

    revalidatePath('/dashboard')
    return { success: true }
}
